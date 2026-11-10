package com.srisriuniversity.kioskamr;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Set;

public class MainActivity extends BridgeActivity {
    private static final int PERMISSION_REQ_CODE = 101;
    private AndroidSpeechBridge speechBridge;
    private AndroidTTSBridge ttsBridge;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep screen on continuously for kiosk robot operation
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUI();

        // Ensure comfortable volume for KIOSK audio output
        setComfortableVolume();

        // Request microphone and audio permissions immediately on startup
        requestAudioPermissions();

        // Configure WebView media and native bridges
        setupWebView();
    }

    private void setComfortableVolume() {
        try {
            AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                int currentVol = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
                int maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                if (currentVol < (maxVol * 0.4)) {
                    audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, (int) (maxVol * 0.8), 0);
                }
            }
        } catch (Exception ignored) {}
    }

    private void requestAudioPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                new String[]{
                    Manifest.permission.RECORD_AUDIO,
                    Manifest.permission.MODIFY_AUDIO_SETTINGS
                },
                PERMISSION_REQ_CODE
            );
        }
    }

    private void setupWebView() {
        WebView webView = getBridgeWebView();
        if (webView != null) {
            configureWebView(webView);
        } else {
            // If WebView not attached yet, schedule retry on main thread
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                WebView delayedView = getBridgeWebView();
                if (delayedView != null) {
                    configureWebView(delayedView);
                }
            }, 300);
        }
    }

    private WebView getBridgeWebView() {
        if (bridge != null && bridge.getWebView() != null) {
            return bridge.getWebView();
        }
        return null;
    }

    private void configureWebView(WebView webView) {
        WebSettings settings = webView.getSettings();

        // Allow audio and media autoplay without requiring an initial touch gesture
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // Ensure fresh assets on app updates (prevent stale cached HTML/JS)
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.clearCache(true);

        // Register native Speech Recognizer and Text-to-Speech bridges
        speechBridge = new AndroidSpeechBridge(this, webView);
        ttsBridge = new AndroidTTSBridge(this, webView);

        webView.addJavascriptInterface(speechBridge, "AndroidSpeechRecognizer");
        webView.addJavascriptInterface(ttsBridge, "AndroidTTS");
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQ_CODE) {
            if (grantResults != null && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                if (speechBridge != null && speechBridge.hasPendingListen()) {
                    speechBridge.startPendingListen();
                }
            } else {
                WebView webView = getBridgeWebView();
                if (webView != null) {
                    webView.evaluateJavascript("window.onAndroidSpeechError && window.onAndroidSpeechError('Microphone permission was denied. Please allow it in Tablet Settings.', 'not-allowed');", null);
                }
            }
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    private void hideSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
        );
    }

    @Override
    public void onDestroy() {
        if (speechBridge != null) {
            speechBridge.destroy();
        }
        if (ttsBridge != null) {
            ttsBridge.destroy();
        }
        super.onDestroy();
    }

    // ==========================================
    // Native Android Speech-To-Text Bridge
    // ==========================================
    public static class AndroidSpeechBridge {
        private final Activity activity;
        private final WebView webView;
        private SpeechRecognizer speechRecognizer;
        private final Handler mainHandler = new Handler(Looper.getMainLooper());
        private boolean isListening = false;
        private String lastPartialResult = "";
        private String pendingListenLanguage = null;

        public AndroidSpeechBridge(Activity activity, WebView webView) {
            this.activity = activity;
            this.webView = webView;
        }

        public boolean hasPendingListen() {
            return pendingListenLanguage != null;
        }

        public void startPendingListen() {
            if (pendingListenLanguage != null) {
                String lang = pendingListenLanguage;
                pendingListenLanguage = null;
                startListening(lang);
            }
        }

        @JavascriptInterface
        public boolean isSupported() {
            return SpeechRecognizer.isRecognitionAvailable(activity) || speechRecognizer != null;
        }

        @JavascriptInterface
        public boolean hasMicrophonePermission() {
            return ContextCompat.checkSelfPermission(activity, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
        }

        @JavascriptInterface
        public void requestMicrophonePermission() {
            mainHandler.post(() -> {
                ActivityCompat.requestPermissions(
                    activity,
                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS},
                    PERMISSION_REQ_CODE
                );
            });
        }

        @JavascriptInterface
        public void startListening(final String language) {
            mainHandler.post(() -> {
                if (ContextCompat.checkSelfPermission(activity, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    pendingListenLanguage = language;
                    ActivityCompat.requestPermissions(
                        activity,
                        new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS},
                        PERMISSION_REQ_CODE
                    );
                    return;
                }
                pendingListenLanguage = null;

                try {
                    if (speechRecognizer != null) {
                        try {
                            speechRecognizer.cancel();
                            speechRecognizer.destroy();
                        } catch (Exception ignored) {}
                    }

                    speechRecognizer = SpeechRecognizer.createSpeechRecognizer(activity);
                    if (speechRecognizer == null) {
                        evalJs("window.onAndroidSpeechError && window.onAndroidSpeechError('Speech recognizer service not available on device.', 'unsupported');");
                        return;
                    }

                    lastPartialResult = "";

                    Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                    intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
                    intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
                    intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, activity.getPackageName());
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 3000L);
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 2500L);
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 2500L);

                    if (language != null && !language.isEmpty()) {
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, language);
                    } else {
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault().toString());
                    }

                    speechRecognizer.setRecognitionListener(new RecognitionListener() {
                        @Override
                        public void onReadyForSpeech(Bundle params) {
                            isListening = true;
                            evalJs("window.onAndroidSpeechStart && window.onAndroidSpeechStart();");
                        }

                        @Override
                        public void onBeginningOfSpeech() {}

                        @Override
                        public void onRmsChanged(float rmsdB) {}

                        @Override
                        public void onBufferReceived(byte[] buffer) {}

                        @Override
                        public void onEndOfSpeech() {
                            // Audio capture finished; recognition decoding in progress
                        }

                        @Override
                        public void onError(int error) {
                            isListening = false;

                            // If error is no-match (7) but we already captured an interim phrase, deliver it
                            if (error == 7 && lastPartialResult != null && !lastPartialResult.trim().isEmpty()) {
                                evalJs("window.onAndroidSpeechResult && window.onAndroidSpeechResult('" + escapeJs(lastPartialResult.trim()) + "', true);");
                                lastPartialResult = "";
                                evalJs("window.onAndroidSpeechEnd && window.onAndroidSpeechEnd();");
                                return;
                            }

                            String type = "unknown";
                            String msg = "Speech recognition error (" + error + ")";
                            switch (error) {
                                case 7: // ERROR_NO_MATCH
                                    type = "no-speech";
                                    msg = "No speech detected. Please tap Speak and try again.";
                                    break;
                                case 1: // ERROR_NETWORK_TIMEOUT
                                case 2: // ERROR_NETWORK
                                    type = "network";
                                    msg = "Network connection required for speech recognition. Please connect tablet to Wi-Fi.";
                                    break;
                                case 9: // ERROR_INSUFFICIENT_PERMISSIONS
                                    type = "not-allowed";
                                    msg = "Microphone permission denied. Please allow microphone in tablet settings.";
                                    break;
                                case 8: // ERROR_RECOGNIZER_BUSY
                                    type = "busy";
                                    msg = "Speech recognizer is busy. Please wait a second.";
                                    break;
                                case 3: // ERROR_AUDIO
                                    type = "audio";
                                    msg = "Audio recording error. Please check tablet microphone.";
                                    break;
                                case 5: // ERROR_CLIENT
                                    type = "client";
                                    msg = "Speech recognition client error (" + error + ")";
                                    break;
                                case 4: // ERROR_SERVER
                                    type = "network";
                                    msg = "Speech recognition server error.";
                                    break;
                                default:
                                    type = "unknown";
                                    msg = "Speech recognition error (" + error + ")";
                                    break;
                            }
                            evalJs("window.onAndroidSpeechError && window.onAndroidSpeechError('" + escapeJs(msg) + "', '" + type + "');");
                            evalJs("window.onAndroidSpeechEnd && window.onAndroidSpeechEnd();");
                        }

                        @Override
                        public void onResults(Bundle results) {
                            isListening = false;
                            ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                            if (matches != null && !matches.isEmpty()) {
                                String text = matches.get(0);
                                evalJs("window.onAndroidSpeechResult && window.onAndroidSpeechResult('" + escapeJs(text) + "', true);");
                            } else if (lastPartialResult != null && !lastPartialResult.trim().isEmpty()) {
                                evalJs("window.onAndroidSpeechResult && window.onAndroidSpeechResult('" + escapeJs(lastPartialResult.trim()) + "', true);");
                            }
                            lastPartialResult = "";
                            evalJs("window.onAndroidSpeechEnd && window.onAndroidSpeechEnd();");
                        }

                        @Override
                        public void onPartialResults(Bundle partialResults) {
                            ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                            if (matches != null && !matches.isEmpty()) {
                                lastPartialResult = matches.get(0);
                                evalJs("window.onAndroidSpeechResult && window.onAndroidSpeechResult('" + escapeJs(lastPartialResult) + "', false);");
                            }
                        }

                        @Override
                        public void onEvent(int eventType, Bundle params) {}
                    });

                    speechRecognizer.startListening(intent);
                } catch (Exception e) {
                    evalJs("window.onAndroidSpeechError && window.onAndroidSpeechError('" + escapeJs(e.getMessage()) + "', 'unknown');");
                    evalJs("window.onAndroidSpeechEnd && window.onAndroidSpeechEnd();");
                }
            });
        }

        @JavascriptInterface
        public void stopListening() {
            mainHandler.post(() -> {
                if (speechRecognizer != null) {
                    try {
                        speechRecognizer.stopListening();
                    } catch (Exception ignored) {}
                }
                isListening = false;
                evalJs("window.onAndroidSpeechEnd && window.onAndroidSpeechEnd();");
            });
        }

        public void destroy() {
            if (speechRecognizer != null) {
                try {
                    speechRecognizer.destroy();
                } catch (Exception ignored) {}
                speechRecognizer = null;
            }
        }

        private void evalJs(String script) {
            mainHandler.post(() -> {
                if (webView != null) {
                    webView.evaluateJavascript(script, null);
                }
            });
        }

        private String escapeJs(String text) {
            if (text == null) return "";
            return text.replace("\\", "\\\\")
                       .replace("'", "\\'")
                       .replace("\"", "\\\"")
                       .replace("\n", "\\n")
                       .replace("\r", "");
        }
    }

    // ==========================================
    // Native Android Text-To-Speech Bridge
    // ==========================================
    public static class AndroidTTSBridge {
        private final Activity activity;
        private final WebView webView;
        private TextToSpeech tts;
        private boolean isInitialized = false;
        private final Handler mainHandler = new Handler(Looper.getMainLooper());

        private String pendingText = null;
        private float pendingPitch = 0.8f;
        private float pendingRate = 0.88f;

        public AndroidTTSBridge(Activity activity, WebView webView) {
            this.activity = activity;
            this.webView = webView;
            initTTS();
        }

        private void initTTS() {
            if (tts != null) {
                try {
                    tts.stop();
                    tts.shutdown();
                } catch (Exception ignored) {}
            }

            tts = new TextToSpeech(activity.getApplicationContext(), status -> {
                if (status == TextToSpeech.SUCCESS) {
                    isInitialized = true;

                    // Automatically configure the deep resonant male baritone voice matching the sample
                    try {
                        Set<Voice> voices = tts.getVoices();
                        Voice bestVoice = null;
                        if (voices != null && !voices.isEmpty()) {
                            // Tier 1: Look for UK English Male (matches "I fear darkness hunts us..." sample)
                            for (Voice v : voices) {
                                String name = v.getName().toLowerCase();
                                Locale loc = v.getLocale();
                                boolean isUK = loc != null && (loc.getCountry().equalsIgnoreCase("GB") || name.contains("en-gb") || name.contains("en_gb"));
                                boolean isMale = (name.contains("male") || name.contains("rjs") || name.contains("man")) && !name.contains("female");
                                if (isUK && isMale) {
                                    bestVoice = v;
                                    break;
                                }
                            }
                            // Tier 2: Look for US English Male (e.g. en-us-x-sfg#male, en-us-x-iom)
                            if (bestVoice == null) {
                                for (Voice v : voices) {
                                    String name = v.getName().toLowerCase();
                                    Locale loc = v.getLocale();
                                    boolean isUS = loc != null && (loc.getCountry().equalsIgnoreCase("US") || name.contains("en-us") || name.contains("en_us"));
                                    boolean isMale = (name.contains("male") || name.contains("sfg") || name.contains("iom") || name.contains("guy") || name.contains("david")) && !name.contains("female");
                                    if (isUS && isMale) {
                                        bestVoice = v;
                                        break;
                                    }
                                }
                            }
                            // Tier 3: Any English Male voice
                            if (bestVoice == null) {
                                for (Voice v : voices) {
                                    String name = v.getName().toLowerCase();
                                    Locale loc = v.getLocale();
                                    boolean isEn = loc != null && loc.getLanguage().equalsIgnoreCase("en");
                                    boolean isMale = (name.contains("male") || name.contains("rjs") || name.contains("sfg") || name.contains("end")) && !name.contains("female");
                                    if (isEn && isMale) {
                                        bestVoice = v;
                                        break;
                                    }
                                }
                            }
                        }

                        if (bestVoice != null) {
                            tts.setVoice(bestVoice);
                            if (bestVoice.getLocale() != null) {
                                tts.setLanguage(bestVoice.getLocale());
                            }
                        } else {
                            int res = tts.setLanguage(Locale.UK);
                            if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                                tts.setLanguage(Locale.US);
                            }
                        }
                    } catch (Exception ignored) {
                        try {
                            tts.setLanguage(Locale.UK);
                        } catch (Exception e) {
                            tts.setLanguage(Locale.getDefault());
                        }
                    }

                    tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                        @Override
                        public void onStart(String utteranceId) {
                            evalJs("window.onAndroidTTSStart && window.onAndroidTTSStart();");
                        }

                        @Override
                        public void onDone(String utteranceId) {
                            evalJs("window.onAndroidTTSEnd && window.onAndroidTTSEnd();");
                        }

                        @Override
                        public void onError(String utteranceId) {
                            evalJs("window.onAndroidTTSError && window.onAndroidTTSError('TTS playback failed');");
                        }
                    });

                    // Flush any pending utterance queued before TTS finished initializing
                    if (pendingText != null) {
                        String text = pendingText;
                        float pitch = pendingPitch;
                        float rate = pendingRate;
                        pendingText = null;
                        speak(text, pitch, rate);
                    }
                } else {
                    isInitialized = false;
                    evalJs("window.onAndroidTTSError && window.onAndroidTTSError('TTS init failed (" + status + ")');");
                }
            });
        }

        @JavascriptInterface
        public boolean isSupported() {
            return isInitialized;
        }

        @JavascriptInterface
        public void speak(final String text, final float pitch, final float rate) {
            mainHandler.post(() -> {
                if (text == null || text.trim().isEmpty()) {
                    evalJs("window.onAndroidTTSEnd && window.onAndroidTTSEnd();");
                    return;
                }

                if (!isInitialized || tts == null) {
                    pendingText = text;
                    pendingPitch = pitch;
                    pendingRate = rate;
                    initTTS();
                    return;
                }

                try {
                    // Deep baritone resonance: pitch 0.75, measured pacing: rate 0.85
                    float targetPitch = (pitch > 0.4f && pitch < 2.0f) ? pitch : 0.75f;
                    float targetRate = (rate > 0.4f && rate < 2.0f) ? rate : 0.85f;
                    tts.setPitch(targetPitch);
                    tts.setSpeechRate(targetRate);

                    String utteranceId = "kiosk_tts_" + System.currentTimeMillis();
                    int res = tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId);
                    if (res != TextToSpeech.SUCCESS) {
                        evalJs("window.onAndroidTTSError && window.onAndroidTTSError('TTS speak returned code " + res + "');");
                    }
                } catch (Exception e) {
                    evalJs("window.onAndroidTTSError && window.onAndroidTTSError('" + escapeJs(e.getMessage()) + "');");
                }
            });
        }

        @JavascriptInterface
        public void stop() {
            mainHandler.post(() -> {
                if (tts != null) {
                    try {
                        tts.stop();
                    } catch (Exception ignored) {}
                }
                evalJs("window.onAndroidTTSEnd && window.onAndroidTTSEnd();");
            });
        }

        public void destroy() {
            if (tts != null) {
                try {
                    tts.stop();
                    tts.shutdown();
                } catch (Exception ignored) {}
                tts = null;
            }
        }

        private void evalJs(String script) {
            mainHandler.post(() -> {
                if (webView != null) {
                    webView.evaluateJavascript(script, null);
                }
            });
        }

        private String escapeJs(String text) {
            if (text == null) return "";
            return text.replace("\\", "\\\\")
                       .replace("'", "\\'")
                       .replace("\"", "\\\"")
                       .replace("\n", "\\n")
                       .replace("\r", "");
        }
    }
}
