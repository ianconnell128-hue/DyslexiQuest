package com.dyslexiquest.app;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebView;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import com.getcapacitor.BridgeWebViewClient;
import android.webkit.WebResourceRequest;
import android.net.Uri;
import java.net.URISyntaxException;
import android.provider.Settings;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.util.Log;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Set;

public class MainActivity extends BridgeActivity {

    private static final int PERMISSION_REQ_CODE = 2001;
    private static final String TAG = "DyslexiQuestSpeech";
    private SpeechRecognizer speechRecognizer;
    private boolean isListening = false;
    private String currentTargetLang = "en-US";
    private boolean isRetryAttempt = false;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private TextToSpeech textToSpeech;
    private boolean ttsReady = false;
    private String ttsEngineName = null;
    private String pendingText = null;
    private String pendingLang = null;
    private float pendingRate = 0.85f;
    private float pendingPitch = 1.0f;

    private AppUpdater appUpdater;
    private ArrayList<String> currentHints = new ArrayList<>();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Android TextToSpeech engine
        initTextToSpeech();

        // Pre-request RECORD_AUDIO and CAMERA permissions if needed
        checkAndRequestAppPermissions();

        // Inject SpeechInterface into the Capacitor WebView
        if (bridge != null && bridge.getWebView() != null) {
            setupBridge(bridge.getWebView());
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        if (bridge != null && bridge.getWebView() != null) {
            setupBridge(bridge.getWebView());
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // Continue an update install after the user granted "install unknown apps".
        if (appUpdater != null) appUpdater.resumeIfPermitted();
    }

    private void checkAndRequestAppPermissions() {
        ArrayList<String> permsNeeded = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            permsNeeded.add(Manifest.permission.RECORD_AUDIO);
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            permsNeeded.add(Manifest.permission.CAMERA);
        }
        if (!permsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(this, permsNeeded.toArray(new String[0]), PERMISSION_REQ_CODE);
        }
    }

    private void setupBridge(WebView webView) {
        webView.addJavascriptInterface(new SpeechInterface(), "AndroidSpeechBridge");

        // In-app updater (sideloaded builds): window.AndroidUpdater
        if (appUpdater == null) appUpdater = new AppUpdater(this, webView);
        webView.addJavascriptInterface(appUpdater, "AndroidUpdater");

        // Custom WebChromeClient to grant WebRTC / getUserMedia camera & audio capture
        webView.setWebChromeClient(new BridgeWebChromeClient(bridge) {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    boolean audioOk = ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
                    boolean cameraOk = ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
                    if (audioOk && cameraOk) {
                        request.grant(request.getResources());
                    } else {
                        checkAndRequestAppPermissions();
                        request.grant(request.getResources());
                    }
                });
            }
        });

        // Custom BridgeWebViewClient to intercept intent:// and SceneViewer AR URLs
        bridge.setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (url != null) {
                    String urlStr = url.toString();
                    if (urlStr.startsWith("intent://") || urlStr.startsWith("intent:")) {
                        try {
                            Intent intent = Intent.parseUri(urlStr, Intent.URI_INTENT_SCHEME);
                            if (intent != null) {
                                if (getPackageManager().resolveActivity(intent, 0) != null) {
                                    startActivity(intent);
                                    return true;
                                }
                                // Fallback to browser fallback url if present
                                String fallback = intent.getStringExtra("browser_fallback_url");
                                if (fallback != null) {
                                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fallback)));
                                    return true;
                                }
                            }
                        } catch (URISyntaxException e) {
                            Log.e(TAG, "Failed to parse AR intent: " + urlStr, e);
                        }
                    }
                }
                return super.shouldOverrideUrlLoading(view, request);
            }
        });
    }

    public class SpeechInterface {

        @JavascriptInterface
        public boolean isAvailable() {
            return SpeechRecognizer.isRecognitionAvailable(MainActivity.this);
        }

        @JavascriptInterface
        public void requestPermission() {
            runOnUiThread(() -> checkAndRequestAppPermissions());
        }

        @JavascriptInterface
        public void startListening(final String lang) {
            startListeningWithHints(lang, null);
        }

        @JavascriptInterface
        public void startListeningWithHints(final String lang, final String hintsJson) {
            mainHandler.post(() -> {
                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    checkAndRequestAppPermissions();
                    sendJsEvent("error", "not-allowed");
                    return;
                }

                ArrayList<String> list = new ArrayList<>();
                if (hintsJson != null && !hintsJson.trim().isEmpty()) {
                    try {
                        org.json.JSONArray arr = new org.json.JSONArray(hintsJson);
                        for (int i = 0; i < arr.length(); i++) {
                            String item = arr.optString(i, "").trim();
                            if (!item.isEmpty()) list.add(item);
                        }
                    } catch (Exception ignored) {}
                }
                currentHints = list;
                startListeningInternal(lang, false);
            });
        }

        @JavascriptInterface
        public void stopListening() {
            mainHandler.post(() -> {
                if (speechRecognizer != null && isListening) {
                    try {
                        speechRecognizer.stopListening();
                    } catch (Exception ignored) {}
                }
            });
        }

        @JavascriptInterface
        public void abort() {
            mainHandler.post(() -> {
                if (speechRecognizer != null) {
                    try {
                        speechRecognizer.cancel();
                    } catch (Exception ignored) {}
                    isListening = false;
                    sendJsEvent("end", "");
                }
            });
        }

        @JavascriptInterface
        public void speakText(final String text, final String lang, final float rate, final float pitch) {
            mainHandler.post(() -> speakTextInternal(text, lang, rate, pitch));
        }

        @JavascriptInterface
        public void stopSpeaking() {
            mainHandler.post(() -> {
                pendingText = null;
                if (textToSpeech != null) {
                    try {
                        textToSpeech.stop();
                    } catch (Exception ignored) {}
                }
            });
        }

        @JavascriptInterface
        public boolean isTtsReady() {
            return ttsReady;
        }

        @JavascriptInterface
        public void hapticFeedback() {
            mainHandler.post(() -> {
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().performHapticFeedback(android.view.HapticFeedbackConstants.VIRTUAL_KEY);
                }
            });
        }

        @JavascriptInterface
        public void downloadLanguagePack(final String lang) {
            mainHandler.post(() -> {
                String target = (lang != null && !lang.trim().isEmpty()) ? lang.trim() : "fr-FR";
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                    try {
                        if (speechRecognizer == null) {
                            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(MainActivity.this);
                        }
                        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, target);
                        intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
                        speechRecognizer.triggerModelDownload(intent);
                        Log.i(TAG, "Triggered triggerModelDownload for " + target);
                    } catch (Exception e) {
                        Log.e(TAG, "triggerModelDownload failed", e);
                    }
                }
                openVoiceSettings();
            });
        }

        @JavascriptInterface
        public void openVoiceSettings() {
            mainHandler.post(() -> {
                boolean opened = false;
                try {
                    Intent intent = new Intent(android.provider.Settings.ACTION_VOICE_INPUT_SETTINGS);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    opened = true;
                } catch (Exception ignored) {}

                if (!opened) {
                    try {
                        Intent intent = new Intent("com.google.android.googlequicksearchbox.action.SPEECH_SETTINGS");
                        intent.setPackage("com.google.android.googlequicksearchbox");
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        opened = true;
                    } catch (Exception ignored) {}
                }

                if (!opened) {
                    try {
                        Intent intent = new Intent(android.provider.Settings.ACTION_LOCALE_SETTINGS);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        opened = true;
                    } catch (Exception ignored) {}
                }

                if (!opened) {
                    try {
                        Intent intent = new Intent(android.provider.Settings.ACTION_SETTINGS);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception ignored) {}
                }
            });
        }

        @JavascriptInterface
        public void openTtsSettings() {
            mainHandler.post(() -> {
                boolean opened = false;
                try {
                    Intent intent = new Intent("com.android.settings.TTS_SETTINGS");
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    opened = true;
                } catch (Exception ignored) {}

                if (!opened) {
                    try {
                        Intent intent = new Intent(Settings.ACTION_VOICE_INPUT_SETTINGS);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        opened = true;
                    } catch (Exception ignored) {}
                }

                if (!opened) {
                    try {
                        Intent intent = new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception ignored) {}
                }
            });
        }
    }

    private void initTextToSpeech() {
        try {
            // Samsung devices default to com.samsung.SMT, which often lacks French voice data
            // out of the box or sounds robotic. Prefer Google TTS (com.google.android.tts) when available.
            String preferredEngine = null;
            try {
                getPackageManager().getPackageInfo("com.google.android.tts", 0);
                preferredEngine = "com.google.android.tts";
                Log.i(TAG, "Preferred TTS engine found: com.google.android.tts");
            } catch (PackageManager.NameNotFoundException ignored) {
                Log.i(TAG, "Google TTS not installed; will use system default TTS engine");
            }

            final String engineToUse = preferredEngine;
            TextToSpeech.OnInitListener listener = status -> {
                if (status == TextToSpeech.SUCCESS) {
                    ttsReady = true;
                    try {
                        ttsEngineName = textToSpeech.getDefaultEngine();
                    } catch (Exception ignored) {
                        ttsEngineName = (engineToUse != null) ? engineToUse : "system-default";
                    }
                    Log.i(TAG, "TextToSpeech initialized successfully with engine: " + ttsEngineName);

                    // Pre-warm French Canadian / French
                    try {
                        Locale frCa = new Locale("fr", "CA");
                        int avail = textToSpeech.isLanguageAvailable(frCa);
                        Log.i(TAG, "French (fr-CA) availability on engine " + ttsEngineName + ": " + avail);
                    } catch (Exception ignored) {}

                    if (pendingText != null) {
                        String txt = pendingText;
                        String lng = pendingLang;
                        float r = pendingRate;
                        float p = pendingPitch;
                        pendingText = null;
                        pendingLang = null;
                        speakTextInternal(txt, lng, r, p);
                    }
                } else {
                    Log.e(TAG, "TextToSpeech init failed (status: " + status + ") with engine: " + engineToUse);
                    ttsReady = false;
                    // Fallback to default engine if preferred failed
                    if (engineToUse != null) {
                        mainHandler.post(() -> {
                            try {
                                textToSpeech = new TextToSpeech(MainActivity.this, s -> {
                                    if (s == TextToSpeech.SUCCESS) {
                                        ttsReady = true;
                                        try {
                                            ttsEngineName = textToSpeech.getDefaultEngine();
                                        } catch (Exception ignored) {}
                                    }
                                });
                            } catch (Exception ignored) {}
                        });
                    }
                }
            };

            if (preferredEngine != null) {
                textToSpeech = new TextToSpeech(this, listener, preferredEngine);
            } else {
                textToSpeech = new TextToSpeech(this, listener);
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception in initTextToSpeech", e);
        }
    }

    private void speakTextInternal(final String text, final String lang, final float rate, final float pitch) {
        if (text == null || text.trim().isEmpty()) return;
        if (!ttsReady || textToSpeech == null) {
            pendingText = text;
            pendingLang = lang;
            pendingRate = rate;
            pendingPitch = pitch;
            return;
        }
        try {
            boolean isFrench = false;
            if (lang != null) {
                String l = lang.toLowerCase();
                isFrench = l.startsWith("fr") || l.contains("french");
            }

            Locale targetLocale = Locale.US;
            String voiceUsed = "default";
            int langResult = -999;

            if (isFrench) {
                // Try Canadian French first (primary educational curriculum), fallback to France French, then generic French
                Locale frCa = new Locale("fr", "CA");
                int availCa = textToSpeech.isLanguageAvailable(frCa);
                if (availCa >= TextToSpeech.LANG_AVAILABLE) {
                    targetLocale = frCa;
                    langResult = textToSpeech.setLanguage(frCa);
                } else {
                    Locale frFr = Locale.FRANCE;
                    int availFr = textToSpeech.isLanguageAvailable(frFr);
                    if (availFr >= TextToSpeech.LANG_AVAILABLE) {
                        targetLocale = frFr;
                        langResult = textToSpeech.setLanguage(frFr);
                    } else {
                        targetLocale = Locale.FRENCH;
                        langResult = textToSpeech.setLanguage(Locale.FRENCH);
                    }
                }

                // If voices are available, pick highest quality French voice matching locale
                try {
                    Set<Voice> voices = textToSpeech.getVoices();
                    if (voices != null && !voices.isEmpty()) {
                        Voice bestVoice = null;
                        for (Voice v : voices) {
                            if (v.getLocale() != null && "fr".equalsIgnoreCase(v.getLocale().getLanguage())) {
                                boolean isCa = "CA".equalsIgnoreCase(v.getLocale().getCountry());
                                if (bestVoice == null) {
                                    bestVoice = v;
                                } else if (isCa && !"CA".equalsIgnoreCase(bestVoice.getLocale().getCountry())) {
                                    // Prioritize Canadian French voice over European French
                                    bestVoice = v;
                                } else if (isCa == "CA".equalsIgnoreCase(bestVoice.getLocale().getCountry()) && v.getQuality() > bestVoice.getQuality()) {
                                    bestVoice = v;
                                }
                            }
                        }
                        if (bestVoice != null) {
                            textToSpeech.setVoice(bestVoice);
                            voiceUsed = bestVoice.getName();
                        }
                    }
                } catch (Exception ignored) {}
            } else {
                targetLocale = Locale.US;
                langResult = textToSpeech.setLanguage(Locale.US);
            }

            // Clean, unwarped vocal parameters:
            // High pitches (>1.0) artificially shift formant frequencies and severely distort French nasal vowels (e.g. "mon" sounding like "me").
            float finalPitch = isFrench ? 1.0f : ((pitch > 0 && pitch >= 0.8f && pitch <= 1.2f) ? pitch : 1.0f);
            float finalRate = (rate > 0) ? rate : 0.85f;
            if (isFrench && finalRate < 0.8f) finalRate = 0.85f;

            textToSpeech.setSpeechRate(finalRate);
            textToSpeech.setPitch(finalPitch);

            final String diagLang = targetLocale.toLanguageTag();
            final String diagVoice = voiceUsed;
            final int diagStatus = langResult;
            final String diagEngine = (ttsEngineName != null) ? ttsEngineName : "unknown";

            sendTtsLog(text, diagLang, diagEngine, diagVoice, diagStatus);

            textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "dq_tts_" + System.currentTimeMillis());
        } catch (Exception e) {
            Log.e(TAG, "Exception in speakTextInternal", e);
        }
    }

    private void sendTtsLog(String text, String lang, String engine, String voice, int status) {
        mainHandler.post(() -> {
            if (bridge != null && bridge.getWebView() != null) {
                try {
                    org.json.JSONObject obj = new org.json.JSONObject();
                    obj.put("text", text);
                    obj.put("lang", lang);
                    obj.put("engine", engine);
                    obj.put("voice", voice);
                    obj.put("status", status); // >=0 OK, <0 missing data or unsupported
                    String json = obj.toString().replace("'", "\\'");
                    String js = "window.DevLog && window.DevLog.log('TTS_SPEAK', " + json + ");";
                    bridge.getWebView().evaluateJavascript(js, null);
                } catch (Exception ignored) {}
            }
        });
    }

    private void startListeningInternal(final String lang, final boolean isRetry) {
        isRetryAttempt = isRetry;
        currentTargetLang = (lang != null && !lang.trim().isEmpty()) ? lang.trim() : "en-US";

        if (speechRecognizer == null) {
            try {
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
                speechRecognizer.setRecognitionListener(new RecognitionListener() {
                    @Override
                    public void onReadyForSpeech(Bundle params) {
                        isListening = true;
                        sendJsEvent("start", "");
                    }

                    @Override
                    public void onBeginningOfSpeech() {}

                    @Override
                    public void onRmsChanged(float rmsdB) {}

                    @Override
                    public void onBufferReceived(byte[] buffer) {}

                    @Override
                    public void onEndOfSpeech() {
                        isListening = false;
                    }

                    @Override
                    public void onError(int error) {
                        Log.e(TAG, "SpeechRecognizer onError: " + error + " (lang=" + currentTargetLang + ", isRetry=" + isRetryAttempt + ")");
                        isListening = false;

                        // Automatic fallback on network/server/language unavailable:
                        // If fr-CA failed, retry fr-FR. If fr-FR failed, retry fr-CA.
                        // NEVER fallback to English when the game requested French!
                        if (!isRetryAttempt && currentTargetLang.toLowerCase().startsWith("fr") 
                                && (error == SpeechRecognizer.ERROR_NETWORK 
                                || error == SpeechRecognizer.ERROR_NETWORK_TIMEOUT 
                                || error == SpeechRecognizer.ERROR_SERVER 
                                || error == 12 /* ERROR_LANGUAGE_NOT_SUPPORTED */ 
                                || error == 13 /* ERROR_LANGUAGE_UNAVAILABLE */
                                || error == 14 /* ERROR_CANNOT_CHECK_SUPPORT */)) {
                            String nextLang = currentTargetLang.equalsIgnoreCase("fr-CA") ? "fr-FR" : "fr-CA";
                            Log.w(TAG, "French model " + currentTargetLang + " error " + error + ", trying " + nextLang + "...");
                            mainHandler.postDelayed(() -> {
                                startListeningInternal(nextLang, true);
                            }, 250);
                            return;
                        }

                        if (error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY) {
                            Log.w(TAG, "SpeechRecognizer busy, resetting and retrying...");
                            try { speechRecognizer.cancel(); } catch (Exception ignored) {}
                            mainHandler.postDelayed(() -> {
                                startListeningInternal(currentTargetLang, true);
                            }, 300);
                            return;
                        }

                        String errorMsg = "network";
                        switch (error) {
                            case SpeechRecognizer.ERROR_AUDIO:
                                errorMsg = "audio-capture";
                                break;
                            case SpeechRecognizer.ERROR_CLIENT:
                                errorMsg = "aborted";
                                break;
                            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                                errorMsg = "not-allowed";
                                break;
                            case SpeechRecognizer.ERROR_NO_MATCH:
                            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                                errorMsg = "no-speech";
                                break;
                            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                                errorMsg = "busy";
                                break;
                            case 12: // ERROR_LANGUAGE_NOT_SUPPORTED
                            case 13: // ERROR_LANGUAGE_UNAVAILABLE
                                errorMsg = "language-unavailable";
                                break;
                            default:
                                errorMsg = "network";
                                break;
                        }
                        sendJsEvent("error", errorMsg);
                        sendJsEvent("end", "");
                    }

                    @Override
                    public void onResults(Bundle results) {
                        isListening = false;
                        if (results != null) {
                            ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                            if (matches != null && !matches.isEmpty()) {
                                Log.i(TAG, "Speech recognized matches: " + matches);
                                org.json.JSONArray arr = new org.json.JSONArray(matches);
                                sendJsResult(arr.toString(), true);
                            }
                        }
                        sendJsEvent("end", "");
                    }

                    @Override
                    public void onPartialResults(Bundle partialResults) {
                        if (partialResults != null) {
                            ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                            if (matches != null && !matches.isEmpty()) {
                                org.json.JSONArray arr = new org.json.JSONArray(matches);
                                sendJsResult(arr.toString(), false);
                            }
                        }
                    }

                    @Override
                    public void onEvent(int eventType, Bundle params) {}
                });
            } catch (Exception e) {
                Log.e(TAG, "Failed to create SpeechRecognizer", e);
                speechRecognizer = null;
                sendJsEvent("error", "audio-capture");
                sendJsEvent("end", "");
                return;
            }
        } else {
            try {
                speechRecognizer.cancel();
            } catch (Exception ignored) {}
        }

        try {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);

            if (currentTargetLang.toLowerCase().startsWith("fr")) {
                String primary = currentTargetLang.equalsIgnoreCase("fr-FR") ? "fr-FR" : "fr-CA";
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, primary);
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, primary);
                intent.putExtra("android.speech.extra.ADDITIONAL_LANGUAGES", new String[]{"fr-CA", "fr-FR", "fr"});
            } else {
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, currentTargetLang);
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, currentTargetLang);
                intent.putExtra("android.speech.extra.ADDITIONAL_LANGUAGES", new String[]{"en-US", "en-CA", "en-GB"});
            }

            // Word biasing on Android 13+ (API 33+)
            if (currentHints != null && !currentHints.isEmpty()) {
                intent.putStringArrayListExtra("android.speech.extra.BIASING_STRINGS", currentHints);
            }

            // Silence tolerance: give user ample time to speak short single-syllable words
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 3000L);
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 1800L);
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 1800L);

            Log.i(TAG, "Starting speech recognition with lang=" + currentTargetLang + ", retry=" + isRetry + ", hints=" + currentHints.size());
            speechRecognizer.startListening(intent);
        } catch (Exception e) {
            Log.e(TAG, "Exception in startListening", e);
            try {
                speechRecognizer.destroy();
            } catch (Exception ignored) {}
            speechRecognizer = null;
            isListening = false;
            sendJsEvent("error", "audio-capture");
            sendJsEvent("end", "");
        }
    }

    private void sendJsEvent(String eventType, String detail) {
        mainHandler.post(() -> {
            if (bridge != null && bridge.getWebView() != null) {
                String js = String.format("window.__onAndroidSpeechEvent && window.__onAndroidSpeechEvent('%s', '%s');", eventType, detail.replace("'", "\\'"));
                bridge.getWebView().evaluateJavascript(js, null);
            }
        });
    }

    private void sendJsResult(String transcript, boolean isFinal) {
        mainHandler.post(() -> {
            if (bridge != null && bridge.getWebView() != null) {
                String escaped = transcript.replace("\\", "\\\\").replace("\"", "\\\"").replace("'", "\\'");
                String js = String.format("window.__onAndroidSpeechResult && window.__onAndroidSpeechResult(\"%s\", %b);", escaped, isFinal);
                bridge.getWebView().evaluateJavascript(js, null);
            }
        });
    }

    @Override
    public void onDestroy() {
        if (textToSpeech != null) {
            try {
                textToSpeech.stop();
                textToSpeech.shutdown();
            } catch (Exception ignored) {}
            textToSpeech = null;
        }
        if (speechRecognizer != null) {
            try {
                speechRecognizer.destroy();
            } catch (Exception ignored) {}
            speechRecognizer = null;
        }
        super.onDestroy();
    }
}
