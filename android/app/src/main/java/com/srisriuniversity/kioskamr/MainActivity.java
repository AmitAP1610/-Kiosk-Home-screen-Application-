package com.srisriuniversity.kioskamr;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.media.AudioManager;
import android.media.MediaPlayer;
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
                    if (speechRecognizer == null) {
                        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(activity);
                    } else {
                        try {
                            speechRecognizer.cancel();
                        } catch (Exception ignored) {}
                    }

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

                            if (error == 8 || error == 5) {
                                try {
                                    speechRecognizer.cancel();
                                    speechRecognizer.destroy();
                                } catch (Exception ignored) {}
                                speechRecognizer = null;
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
        private MediaPlayer sampleMediaPlayer = null;

        private String pendingText = null;
        private float pendingPitch = 0.74f;
        private float pendingRate = 0.86f;

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
                        int bestScore = Integer.MIN_VALUE;

                        if (voices != null && !voices.isEmpty()) {
                            for (Voice v : voices) {
                                String name = (v.getName() != null) ? v.getName().toLowerCase() : "";
                                Locale loc = v.getLocale();
                                String lang = (loc != null && loc.getLanguage() != null) ? loc.getLanguage().toLowerCase() : "";
                                String country = (loc != null && loc.getCountry() != null) ? loc.getCountry().toLowerCase() : "";

                                // Strictly filter out known female voice models
                                boolean isFemale = name.contains("female") || name.contains("woman") || name.contains("girl")
                                        || name.contains("zira") || name.contains("jenny") || name.contains("aria")
                                        || name.contains("hazel") || name.contains("susan") || name.contains("linda")
                                        || name.contains("heera") || name.contains("kalpana") || name.contains("samantha")
                                        || name.contains("priya") || name.contains("ananya") || name.contains("pooja")
                                        || name.contains("neerja") || name.contains("swara") || name.contains("veena");

                                if (isFemale) continue;

                                int score = 0;

                                // English language weighting
                                if (lang.equals("en")) {
                                    score += 40;
                                    if (country.equals("gb")) score += 35; // British baritone closest to reference sample
                                    else if (country.equals("us")) score += 25;
                                    else if (country.equals("in")) score += 20;
                                }

                                // Male baritone signatures
                                if (name.contains("male") || name.contains("man") || name.contains("baritone")) score += 60;
                                if (name.contains("rjs") || name.contains("sfg") || name.contains("iom") || name.contains("george")
                                        || name.contains("brian") || name.contains("david") || name.contains("guy")
                                        || name.contains("prabhat") || name.contains("ravi") || name.contains("madhav")) {
                                    score += 50;
                                }

                                // Prioritize pre-installed offline voices (no network lag or failure)
                                if (!v.isNetworkConnectionRequired()) {
                                    score += 30;
                                }

                                if (score > bestScore) {
                                    bestScore = score;
                                    bestVoice = v;
                                }
                            }
                        }

                        if (bestVoice != null && bestScore > 0) {
                            tts.setVoice(bestVoice);
                            if (bestVoice.getLocale() != null) {
                                tts.setLanguage(bestVoice.getLocale());
                            }
                        } else {
                            // Safe fallback sequence: US -> UK -> English -> Default
                            int res = tts.setLanguage(Locale.US);
                            if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                                res = tts.setLanguage(Locale.UK);
                                if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                                    res = tts.setLanguage(Locale.ENGLISH);
                                    if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                                        tts.setLanguage(Locale.getDefault());
                                    }
                                }
                            }
                        }
                    } catch (Exception ignored) {
                        try {
                            tts.setLanguage(Locale.US);
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

        /**
         * Plays the official voice sample audio file (/voice-sample.mp3) directly using
         * native Android MediaPlayer with hardware acceleration and zero autoplay restrictions.
         */
        @JavascriptInterface
        public void playSampleVoice() {
            mainHandler.post(() -> {
                stop();
                try {
                    AssetFileDescriptor afd = null;
                    try {
                        afd = activity.getAssets().openFd("public/voice-sample.mp3");
                    } catch (Exception e1) {
                        try {
                            afd = activity.getAssets().openFd("voice-sample.mp3");
                        } catch (Exception ignored) {}
                    }

                    if (afd == null) {
                        evalJs("window.onAndroidAudioError && window.onAndroidAudioError('Audio asset voice-sample.mp3 not found in APK assets');");
                        return;
                    }

                    sampleMediaPlayer = new MediaPlayer();
                    sampleMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
                    sampleMediaPlayer.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                    afd.close();

                    sampleMediaPlayer.setOnPreparedListener(mp -> {
                        mp.start();
                        evalJs("window.onAndroidAudioStart && window.onAndroidAudioStart();");
                    });

                    sampleMediaPlayer.setOnCompletionListener(mp -> {
                        evalJs("window.onAndroidAudioEnd && window.onAndroidAudioEnd();");
                        try {
                            mp.release();
                        } catch (Exception ignored) {}
                        sampleMediaPlayer = null;
                    });

                    sampleMediaPlayer.setOnErrorListener((mp, what, extra) -> {
                        evalJs("window.onAndroidAudioError && window.onAndroidAudioError('MediaPlayer error " + what + "');");
                        try {
                            mp.release();
                        } catch (Exception ignored) {}
                        sampleMediaPlayer = null;
                        return true;
                    });

                    sampleMediaPlayer.prepareAsync();
                } catch (Exception e) {
                    evalJs("window.onAndroidAudioError && window.onAndroidAudioError('" + escapeJs(e.getMessage()) + "');");
                }
            });
        }

        @JavascriptInterface
        public void stopSampleVoice() {
            mainHandler.post(() -> {
                if (sampleMediaPlayer != null) {
                    try {
                        if (sampleMediaPlayer.isPlaying()) {
                            sampleMediaPlayer.stop();
                        }
                        sampleMediaPlayer.release();
                    } catch (Exception ignored) {}
                    sampleMediaPlayer = null;
                }
                evalJs("window.onAndroidAudioEnd && window.onAndroidAudioEnd();");
            });
        }

        @JavascriptInterface
        public void openTTSSettings() {
            mainHandler.post(() -> {
                try {
                    Intent intent = new Intent();
                    intent.setAction("com.android.settings.TTS_SETTINGS");
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    activity.startActivity(intent);
                } catch (Exception e) {
                    try {
                        Intent intent = new Intent(android.provider.Settings.ACTION_SETTINGS);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        activity.startActivity(intent);
                    } catch (Exception ignored) {}
                }
            });
        }

        @JavascriptInterface
        public void speak(final String text, final float pitch, final float rate) {
            mainHandler.post(() -> {
                if (text == null || text.trim().isEmpty()) {
                    evalJs("window.onAndroidTTSEnd && window.onAndroidTTSEnd();");
                    return;
                }

                // Stop any playing audio sample before speaking new text
                if (sampleMediaPlayer != null) {
                    try {
                        if (sampleMediaPlayer.isPlaying()) {
                            sampleMediaPlayer.stop();
                        }
                        sampleMediaPlayer.release();
                    } catch (Exception ignored) {}
                    sampleMediaPlayer = null;
                }

                if (!isInitialized || tts == null) {
                    pendingText = text;
                    pendingPitch = pitch;
                    pendingRate = rate;
                    initTTS();
                    return;
                }

                try {
                    // Deep baritone resonance: pitch 0.74, measured pacing: rate 0.86
                    float targetPitch = (pitch > 0.4f && pitch < 2.0f) ? pitch : 0.74f;
                    float targetRate = (rate > 0.4f && rate < 2.0f) ? rate : 0.86f;
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
                if (sampleMediaPlayer != null) {
                    try {
                        if (sampleMediaPlayer.isPlaying()) {
                            sampleMediaPlayer.stop();
                        }
                        sampleMediaPlayer.release();
                    } catch (Exception ignored) {}
                    sampleMediaPlayer = null;
                }
                if (tts != null) {
                    try {
                        tts.stop();
                    } catch (Exception ignored) {}
                }
                evalJs("window.onAndroidTTSEnd && window.onAndroidTTSEnd();");
            });
        }

        public void destroy() {
            if (sampleMediaPlayer != null) {
                try {
                    sampleMediaPlayer.release();
                } catch (Exception ignored) {}
                sampleMediaPlayer = null;
            }
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
