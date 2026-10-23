package com.dyslexiquest.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * In-app updater for sideloaded (non-Play) builds.
 *
 * Flow:  JS calls checkForUpdate() -> we fetch latest.json from the public releases repo
 *        -> window.__onUpdateCheck(result)
 *        JS calls downloadAndInstall() -> download APK with progress -> verify SHA-256
 *        -> ensure "install unknown apps" is allowed -> launch the system installer.
 *
 * Android itself refuses the update unless it is signed with the same key as the
 * installed app, so a tampered APK cannot replace the game.
 *
 * Exposed to JS as window.AndroidUpdater. Results are delivered via:
 *   window.__onUpdateCheck({ ok, updateAvailable, current, latest, error })
 *   window.__onUpdateProgress({ state, percent, error })
 *     state: "downloading" | "verifying" | "needs-permission" | "installing" | "error"
 */
public class AppUpdater {

    private static final String TAG = "DyslexiQuestUpdater";
    // Allowed download locations: local Play Store portal, raw GitHub, or GitHub release assets
    private static final String[] ALLOWED_APK_PREFIXES = {
            "http://192.168.1.221:8089/",
            "http://10.0.2.2:8089/",
            "https://github.com/ianconnell128-hue/DyslexiQuest/",
            "https://raw.githubusercontent.com/ianconnell128-hue/DyslexiQuest/",
            "https://objects.githubusercontent.com/",
            "https://github.com/thundergeek/dyslexiquest-releases/",
    };
    private static final int MAX_MANIFEST_BYTES = 64 * 1024;

    private final Activity activity;
    private final WebView webView;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService io = Executors.newSingleThreadExecutor();

    private volatile boolean busy = false;
    private JSONObject lastManifest = null;
    private File pendingApk = null;

    public AppUpdater(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
    }

    // ------------------------------------------------------------------ JS API

    @JavascriptInterface
    public String getVersionInfo() {
        try {
            JSONObject o = new JSONObject();
            o.put("versionCode", BuildConfig.VERSION_CODE);
            o.put("versionName", BuildConfig.VERSION_NAME);
            o.put("buildType", BuildConfig.BUILD_TYPE);
            o.put("canInstall", canInstallPackages());
            return o.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    @JavascriptInterface
    public void checkForUpdate() {
        io.execute(() -> {
            JSONObject result = new JSONObject();
            try {
                result.put("current", BuildConfig.VERSION_CODE);
                String body = null;
                // Try local playstore portal first, then fallback to configured buildConfig URL
                String[] candidateUrls = {
                    "http://192.168.1.221:8089/latest.json",
                    "https://raw.githubusercontent.com/ianconnell128-hue/DyslexiQuest/android-app/dist/latest.json",
                    BuildConfig.UPDATE_MANIFEST_URL
                };
                Exception lastEx = null;
                for (String u : candidateUrls) {
                    try {
                        body = httpGetString(u);
                        if (body != null && body.trim().startsWith("{")) break;
                    } catch (Exception ex) {
                        lastEx = ex;
                    }
                }
                if (body == null) {
                    throw (lastEx != null) ? lastEx : new Exception("Unable to reach update server");
                }
                JSONObject m = new JSONObject(body);
                int latest = m.getInt("versionCode");
                lastManifest = m;
                result.put("ok", true);
                result.put("latest", m);
                result.put("updateAvailable", latest > BuildConfig.VERSION_CODE);
                Log.i(TAG, "Update check: current=" + BuildConfig.VERSION_CODE + " latest=" + latest);
            } catch (Exception e) {
                Log.w(TAG, "Update check failed", e);
                try {
                    result.put("ok", false);
                    result.put("error", String.valueOf(e.getMessage()));
                } catch (Exception ignored) {}
            }
            emit("__onUpdateCheck", result);
        });
    }

    /** Downloads the APK from the most recent successful check and launches the installer. */
    @JavascriptInterface
    public void downloadAndInstall() {
        if (busy) return;
        final JSONObject m = lastManifest;
        if (m == null) {
            progress("error", 0, "Check for updates first");
            return;
        }
        busy = true;
        io.execute(() -> {
            try {
                String apkUrl = m.getString("apkUrl");
                String expectedSha = m.optString("sha256", "").toLowerCase();
                if (!isAllowedUrl(apkUrl)) throw new SecurityException("Untrusted APK URL: " + apkUrl);
                if (expectedSha.length() != 64) throw new SecurityException("Release is missing a SHA-256 checksum");

                File dir = new File(activity.getCacheDir(), "updates");
                //noinspection ResultOfMethodCallIgnored
                dir.mkdirs();
                File[] old = dir.listFiles();
                if (old != null) for (File f : old) //noinspection ResultOfMethodCallIgnored
                    f.delete();
                File apk = new File(dir, "dyslexiquest-" + m.getInt("versionCode") + ".apk");

                String actualSha = download(apkUrl, apk);
                progress("verifying", 100, null);
                if (!expectedSha.equals(actualSha)) {
                    //noinspection ResultOfMethodCallIgnored
                    apk.delete();
                    throw new SecurityException("Checksum mismatch - download corrupted, please try again");
                }
                pendingApk = apk;
                main.post(this::installPending);
            } catch (Exception e) {
                Log.e(TAG, "Update download failed", e);
                progress("error", 0, String.valueOf(e.getMessage()));
                busy = false;
            }
        });
    }

    /** Called by JS (e.g. after the user granted "install unknown apps") to retry the install step. */
    @JavascriptInterface
    public void resumeInstall() {
        main.post(this::installPending);
    }

    @JavascriptInterface
    public boolean canInstall() {
        return canInstallPackages();
    }

    // ------------------------------------------------------------------ internals

    private void installPending() {
        File apk = pendingApk;
        if (apk == null || !apk.exists()) {
            busy = false;
            return;
        }
        if (!canInstallPackages()) {
            progress("needs-permission", 100, null);
            try {
                Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:" + activity.getPackageName()));
                activity.startActivity(i);
            } catch (Exception e) {
                Log.w(TAG, "Could not open unknown-sources settings", e);
            }
            // Leave pendingApk set; MainActivity.onResume() calls resumeIfPermitted().
            return;
        }
        try {
            Uri uri = FileProvider.getUriForFile(activity, activity.getPackageName() + ".fileprovider", apk);
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setDataAndType(uri, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            progress("installing", 100, null);
            activity.startActivity(i);
        } catch (Exception e) {
            Log.e(TAG, "Failed to launch installer", e);
            progress("error", 0, String.valueOf(e.getMessage()));
        } finally {
            pendingApk = null;
            busy = false;
        }
    }

    /** Called from MainActivity.onResume so the install continues after granting permission. */
    void resumeIfPermitted() {
        if (pendingApk != null && canInstallPackages()) installPending();
    }

    private boolean canInstallPackages() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return true;
        return activity.getPackageManager().canRequestPackageInstalls();
    }

    private static boolean isAllowedUrl(String url) {
        for (String p : ALLOWED_APK_PREFIXES) if (url != null && url.startsWith(p)) return true;
        return false;
    }

    private static HttpURLConnection open(String url) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setInstanceFollowRedirects(true); // GitHub release assets redirect to their CDN (https->https)
        c.setConnectTimeout(15000);
        c.setReadTimeout(30000);
        c.setRequestProperty("Cache-Control", "no-cache");
        c.setRequestProperty("User-Agent", "DyslexiQuest/" + BuildConfig.VERSION_NAME);
        int code = c.getResponseCode();
        if (code != 200) throw new Exception("HTTP " + code + " for " + url);
        return c;
    }

    private static String httpGetString(String url) throws Exception {
        HttpURLConnection c = open(url);
        try (InputStream in = new BufferedInputStream(c.getInputStream())) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) {
                out.write(buf, 0, n);
                if (out.size() > MAX_MANIFEST_BYTES) throw new Exception("Manifest too large");
            }
            return out.toString("UTF-8");
        } finally {
            c.disconnect();
        }
    }

    /** Streams url -> dest while reporting progress; returns lowercase hex SHA-256. */
    private String download(String url, File dest) throws Exception {
        HttpURLConnection c = open(url);
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        long total = c.getContentLengthLong();
        long done = 0;
        int lastPct = -1;
        try (InputStream in = new BufferedInputStream(c.getInputStream());
             FileOutputStream out = new FileOutputStream(dest)) {
            byte[] buf = new byte[32 * 1024];
            int n;
            while ((n = in.read(buf)) > 0) {
                out.write(buf, 0, n);
                sha.update(buf, 0, n);
                done += n;
                int pct = total > 0 ? (int) (done * 100 / total) : -1;
                if (pct != lastPct) {
                    lastPct = pct;
                    progress("downloading", pct, null);
                }
            }
        } finally {
            c.disconnect();
        }
        StringBuilder hex = new StringBuilder();
        for (byte b : sha.digest()) hex.append(String.format("%02x", b));
        return hex.toString();
    }

    private void progress(String state, int percent, String error) {
        try {
            JSONObject o = new JSONObject();
            o.put("state", state);
            o.put("percent", percent);
            if (error != null) o.put("error", error);
            emit("__onUpdateProgress", o);
        } catch (Exception ignored) {}
    }

    private void emit(String fn, JSONObject payload) {
        // JSONObject.toString() produces a valid JS object literal - no manual escaping needed.
        final String js = "window." + fn + " && window." + fn + "(" + payload.toString() + ");";
        main.post(() -> webView.evaluateJavascript(js, null));
    }
}
