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
import android.speech.tts.TextToSpeech;
import android.util.Log;
import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends BridgeActivity {

    private static final int PERMISSION_RECORD_AUDIO = 2001;
    private static final String TAG = "DyslexiQuestSpeech";
    private SpeechRecognizer speechRecognizer;
    private boolean isListening = false;
    private String currentTargetLang = "en-US";
    private boolean isRetryAttempt = false;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private TextToSpeech textToSpeech;
    private boolean ttsReady = false;
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

        // Pre-request RECORD_AUDIO permission if needed
        checkAndRequestAudioPermission();

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

    private void checkAndRequestAudioPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, PERMISSION_RECORD_AUDIO);
        }
    }

    private void setupBridge(WebView webView) {
        webView.addJavascriptInterface(new SpeechInterface(), "AndroidSpeechBridge");

        // In-app updater (sideloaded builds): window.AndroidUpdater
        if (appUpdater == null) appUpdater = new AppUpdater(this, webView);
        webView.addJavascriptInterface(appUpdater, "AndroidUpdater");

        // Custom WebChromeClient to grant WebRTC / getUserMedia audio capture
        webView.setWebChromeClient(new BridgeWebChromeClient(bridge) {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(request.getResources());
                    } else {
                        checkAndRequestAudioPermission();
                        request.grant(request.getResources());
                    }
                });
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
            runOnUiThread(() -> checkAndRequestAudioPermission());
        }

        @JavascriptInterface
        public void startListening(final String lang) {
            startListeningWithHints(lang, null);
        }

        @JavascriptInterface
        public void startListeningWithHints(final String lang, final String hintsJson) {
            mainHandler.post(() -> {
                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    checkAndRequestAudioPermission();
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
    }

    private void initTextToSpeech() {
        try {
            textToSpeech = new TextToSpeech(this, status -> {
                if (status == TextToSpeech.SUCCESS) {
                    ttsReady = true;
                    try {
                        textToSpeech.setLanguage(Locale.US);
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
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
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
            Locale loc = ("fr".equalsIgnoreCase(lang) || "fr-FR".equalsIgnoreCase(lang) || "french".equalsIgnoreCase(lang))
                    ? Locale.FRENCH
                    : Locale.US;
            textToSpeech.setLanguage(loc);
            textToSpeech.setSpeechRate(rate > 0 ? rate : 0.85f);
            textToSpeech.setPitch(pitch > 0 ? pitch : 1.0f);
            textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "dq_tts_" + System.currentTimeMillis());
        } catch (Exception e) {
            e.printStackTrace();
        }
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
