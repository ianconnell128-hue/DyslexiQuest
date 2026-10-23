/**
 * DyslexiQuest Android Speech Recognition & Audio Bridge
 * Connects standard Web Speech API to Android's native android.speech.SpeechRecognizer
 */
(function() {
  console.log("[SpeechBridge] Initializing Android Speech Bridge...");

  let activeRecognition = null;

  // Called from Android MainActivity via evaluateJavascript
  window.__onAndroidSpeechEvent = function(eventType, detail) {
    console.log("[SpeechBridge] Received event:", eventType, detail);
    if (window.DevLog) {
      window.DevLog.log('SPEECH_EVENT', { type: eventType, detail: detail || '' });
    }
    if (!activeRecognition) return;

    if (eventType === 'start') {
      if (typeof activeRecognition.onstart === 'function') {
        activeRecognition.onstart(new Event('start'));
      }
    } else if (eventType === 'error') {
      if (typeof activeRecognition.onerror === 'function') {
        const errEvent = new Event('error');
        errEvent.error = detail || 'unknown';
        activeRecognition.onerror(errEvent);
      }
    } else if (eventType === 'end') {
      if (typeof activeRecognition.onend === 'function') {
        activeRecognition.onend(new Event('end'));
      }
      activeRecognition = null;
    }
  };

  // Called from Android MainActivity when speech is recognized
  window.__onAndroidSpeechResult = function(rawTranscript, isFinal) {
    console.log("[SpeechBridge] Received result:", rawTranscript, "isFinal:", isFinal);
    if (!activeRecognition) return;

    let candidates = [];
    if (typeof rawTranscript === 'string' && rawTranscript.startsWith('[')) {
      try {
        const parsed = JSON.parse(rawTranscript);
        if (Array.isArray(parsed)) candidates = parsed;
      } catch (e) {
        candidates = [rawTranscript];
      }
    } else if (Array.isArray(rawTranscript)) {
      candidates = rawTranscript;
    } else {
      candidates = [rawTranscript];
    }

    if (window.DevLog) {
      window.DevLog.log('SPEECH_RESULT', {
        isFinal: Boolean(isFinal),
        candidates: candidates
      });
    }

    if (typeof activeRecognition.onresult === 'function') {
      // Build W3C SpeechRecognitionEvent compatible structure with all alternatives
      const alternatives = candidates.map(t => ({
        transcript: t,
        confidence: 0.95
      }));
      alternatives.isFinal = Boolean(isFinal);
      alternatives.length = candidates.length;

      const event = {
        resultIndex: 0,
        results: [alternatives]
      };

      activeRecognition.onresult(event);
    }
  };

  class AndroidSpeechRecognition {
    constructor() {
      this.continuous = false;
      this.interimResults = true;
      this.maxAlternatives = 5;
      this.lang = 'en-US';
      this.hints = [];
      this.onstart = null;
      this.onresult = null;
      this.onerror = null;
      this.onend = null;
    }

    start() {
      console.log("[SpeechBridge] SpeechRecognition.start() called, lang:", this.lang, "hints:", this.hints);
      if (window.DevLog) {
        window.DevLog.log('SPEECH_START', { lang: this.lang, hints: this.hints });
      }
      activeRecognition = this;
      const callNative = () => {
        if (!window.AndroidSpeechBridge) return false;
        const hintsJson = (this.hints && this.hints.length) ? JSON.stringify(this.hints) : null;
        if (typeof window.AndroidSpeechBridge.startListeningWithHints === 'function') {
          window.AndroidSpeechBridge.startListeningWithHints(this.lang || 'en-US', hintsJson);
          return true;
        } else if (typeof window.AndroidSpeechBridge.startListening === 'function') {
          window.AndroidSpeechBridge.startListening(this.lang || 'en-US');
          return true;
        }
        return false;
      };

      if (!callNative()) {
        console.warn("[SpeechBridge] AndroidSpeechBridge not attached yet, waiting...");
        setTimeout(() => {
          if (!callNative()) {
            console.error("[SpeechBridge] Native SpeechRecognizer unavailable");
            if (typeof this.onerror === 'function') {
              const err = new Event('error');
              err.error = 'service-not-allowed';
              this.onerror(err);
            }
            if (typeof this.onend === 'function') this.onend(new Event('end'));
          }
        }, 200);
      }
    }

    stop() {
      console.log("[SpeechBridge] SpeechRecognition.stop() called");
      if (window.AndroidSpeechBridge && typeof window.AndroidSpeechBridge.stopListening === 'function') {
        window.AndroidSpeechBridge.stopListening();
      }
    }

    abort() {
      console.log("[SpeechBridge] SpeechRecognition.abort() called");
      if (window.AndroidSpeechBridge && typeof window.AndroidSpeechBridge.abort === 'function') {
        window.AndroidSpeechBridge.abort();
      }
      activeRecognition = null;
    }
  }

  class AndroidSpeechSynthesisUtterance {
    constructor(text = '') {
      this.text = text;
      this.lang = 'en-US';
      this.voice = null;
      this.volume = 1;
      this.rate = 1;
      this.pitch = 1;
      this.onstart = null;
      this.onend = null;
      this.onerror = null;
    }
  }

  class AndroidSpeechSynthesis {
    constructor() {
      this.speaking = false;
      this.pending = false;
      this.paused = false;
    }

    speak(utterance) {
      if (!utterance || !utterance.text) return;
      this.speaking = true;
      const text = utterance.text;
      const lang = utterance.lang || 'en-US';
      const rate = utterance.rate || 0.85;
      const pitch = utterance.pitch || 1.0;

      console.log("[SpeechBridge] SpeechSynthesis.speak():", text, "lang:", lang);
      if (window.AndroidSpeechBridge && typeof window.AndroidSpeechBridge.speakText === 'function') {
        window.AndroidSpeechBridge.speakText(text, lang, rate, pitch);
      }

      setTimeout(() => {
        if (typeof utterance.onstart === 'function') utterance.onstart(new Event('start'));
      }, 50);

      const wordCount = text.split(/\s+/).length;
      const durationMs = Math.max(800, (wordCount * 450) / rate);
      setTimeout(() => {
        this.speaking = false;
        if (typeof utterance.onend === 'function') utterance.onend(new Event('end'));
      }, durationMs);
    }

    cancel() {
      this.speaking = false;
      if (window.AndroidSpeechBridge && typeof window.AndroidSpeechBridge.stopSpeaking === 'function') {
        window.AndroidSpeechBridge.stopSpeaking();
      }
    }

    pause() {
      this.cancel();
    }

    resume() {}

    getVoices() {
      return [
        { voiceURI: 'AndroidNative_en', name: 'Android English (US)', lang: 'en-US', default: true },
        { voiceURI: 'AndroidNative_fr_CA', name: 'Android French (Canada)', lang: 'fr-CA', default: false },
        { voiceURI: 'AndroidNative_fr_FR', name: 'Android French (France)', lang: 'fr-FR', default: false }
      ];
    }
  }

  // Always expose on Android / WebView, or fallback if native SpeechRecognition / SpeechSynthesis is missing
  if (!window.SpeechRecognition || window.AndroidSpeechBridge || (window.Capacitor && window.Capacitor.isNativePlatform())) {
    window.SpeechRecognition = AndroidSpeechRecognition;
    window.webkitSpeechRecognition = AndroidSpeechRecognition;
    console.log("[SpeechBridge] SpeechRecognition polyfill installed.");
  }

  if (!window.speechSynthesis || window.AndroidSpeechBridge || (window.Capacitor && window.Capacitor.isNativePlatform())) {
    window.speechSynthesis = new AndroidSpeechSynthesis();
    window.SpeechSynthesisUtterance = AndroidSpeechSynthesisUtterance;
    console.log("[SpeechBridge] SpeechSynthesis polyfill installed.");
  }

  // ── Touch & Audio Responsiveness Booster for Mobile / WebView ──
  (function initTouchBooster() {
    // 1. Prewarm Web Audio context on very first interaction so sounds trigger with 0ms latency
    const unlockAudio = () => {
      try {
        if (window.game) {
          if (!window.game.audioCtx) {
            window.game.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (window.game.audioCtx && window.game.audioCtx.state === 'suspended') {
            window.game.audioCtx.resume();
          }
        }
      } catch (_) {}
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });

    // 2. Immediate 0ms visual depression & haptic click when touching buttons/cards
    document.addEventListener('touchstart', (e) => {
      const el = e.target.closest('button, .card, .profile-card, .filter-btn, .avatar-option, .shop-item, [role="button"]');
      if (el) {
        el.classList.add('touched');
        if (window.AndroidSpeechBridge && typeof window.AndroidSpeechBridge.hapticFeedback === 'function') {
          window.AndroidSpeechBridge.hapticFeedback();
        } else if (navigator.vibrate) {
          try { navigator.vibrate(10); } catch (_) {}
        }
      }
    }, { passive: true });

    const releaseTouch = (e) => {
      const el = e.target.closest('button, .card, .profile-card, .filter-btn, .avatar-option, .shop-item, [role="button"]');
      if (el) {
        setTimeout(() => el.classList.remove('touched'), 60);
      } else {
        document.querySelectorAll('.touched').forEach(item => item.classList.remove('touched'));
      }
    };
    document.addEventListener('touchend', releaseTouch, { passive: true });
    document.addEventListener('touchcancel', releaseTouch, { passive: true });
  })();
})();
