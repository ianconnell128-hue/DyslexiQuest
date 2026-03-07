
// ─────────────────────────────────────────────────────────────────────────────
//  DyslexiQuest v2 – game.js
// ─────────────────────────────────────────────────────────────────────────────

// ── 3-D collectible characters ──────────────────────────────────────────────
const ANIMALS = [
  // COMMON (40%)
  { name: 'Fox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Duck', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Avocado', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Water Bottle', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Cactus', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Cactus/glTF-Binary/Cactus.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Chair', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Toy Car', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Box', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Cylinder', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Cylinder/glTF-Binary/Cylinder.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Gearbox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb', color: '#94a3b8', rarity: 'Common' },
  
  // UNCOMMON (25%)
  { name: 'Bee', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Bee/glTF-Binary/Bee.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Shark', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Shark/glTF-Binary/Shark.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Barramundi', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Lantern', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Microphone', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Microphone/glTF-Binary/Microphone.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Coffee Cart', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CoffeeCart/glTF-Binary/CoffeeCart.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Bottle Rocket', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BottleRocket/glTF-Binary/BottleRocket.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Antique Camera', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb', color: '#3b82f6', rarity: 'Uncommon' },
  
  // RARE (15%)
  { name: 'Flamingo', model: 'https://modelviewer.dev/shared-assets/models/Flamingo.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Astronaut', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Cesium Man', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Monster', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Monster/glTF-Binary/Monster.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Sci-Fi Helmet', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SciFiHelmet/glTF-Binary/SciFiHelmet.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Stained Glass Lamp', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/StainedGlassLamp/glTF-Binary/StainedGlassLamp.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Brain Stem', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF-Binary/BrainStem.glb', color: '#a855f7', rarity: 'Rare' },

  // EPIC (10%)
  { name: 'Boom Box', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Damaged Helmet', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Flight Helmet', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlightHelmet/glTF-Binary/FlightHelmet.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Materials Shoe', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Virtual City', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VirtualCity/glTF-Binary/VirtualCity.glb', color: '#f97316', rarity: 'Epic' },

  // LEGENDARY (7%)
  { name: 'Neil Armstrong', model: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', color: '#eab308', rarity: 'Legendary' },
  { name: 'Dragon', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb', color: '#eab308', rarity: 'Legendary' },
  { name: 'Iridescence Lamp', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb', color: '#eab308', rarity: 'Legendary' },
  { name: 'Moszkva Square', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MoszkvaSquare/glTF-Binary/MoszkvaSquare.glb', color: '#eab308', rarity: 'Legendary' },

  // MYTHIC (3%)
  { name: 'Alpha Astronaut', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#ef4444', rarity: 'Mythic' },
  { name: 'Golden Fox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#ef4444', rarity: 'Mythic' },
  { name: 'Deep Space Shark', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Shark/glTF-Binary/Shark.glb', color: '#ef4444', rarity: 'Mythic' }
];

const RARITY_WEIGHTS = {
  'Common': 40,
  'Uncommon': 25,
  'Rare': 15,
  'Epic': 10,
  'Legendary': 7,
  'Mythic': 3
};

const PET_NAMES = [
  'Barnaby', 'Pip', 'Zelda', 'Finn', 'Mochi', 'Rocket', 'Luna', 'Buster', 'Cleo', 'Dash',
  'Willow', 'Coco', 'Gizmo', 'Nova', 'Rex', 'Socks', 'Toby', 'Ziggy', 'Pearl', 'Ollie',
  'Sparky', 'Sunny', 'Boots', 'Fifi', 'Gus', 'Ivy', 'Leo', 'Misty', 'Nala', 'Pixel'
];

const SFX = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
};

// ── Fallback words ──────────────────────────────────────────────────────────
const FALLBACK_WORDS = {
  en: {
    1: ['cat','dog','hat','bat','rat'],
    2: ['the','and','you','are','was'],
    3: ['they','with','have','this','from'],
  },
  fr: {
    1: ['jai','dit','le','la','je','vois','un','une'],
    2: ['mon','est','regarde','suis','ma','dans','peux'],
    3: ['aussi','non','va','maman','papa','en','mes'],
  },
};

// ── Word Shape Logic (Pedagogical silhouette blocks) ──────────────────────────
function getWordShapeHTML(word) {
  const ascenders  = 'bdfhklitABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const descenders = 'gpqyfj'; 
  let html = '<div class="word-shape-container">';
  [...word].forEach(char => {
    let type = 'mid';
    if (ascenders.includes(char)) type = 'tall';
    else if (descenders.includes(char)) type = 'low';
    html += `<div class="shape-block ${type}"></div>`;
  });
  html += '</div>';
  return html;
}

function parseLevels(text) {
  const result = {};
  const chunks = text.split(/(?:Niveau|Level)\s+(\d+)/i);
  for (let i = 1; i < chunks.length; i += 2) {
    const levelNum = parseInt(chunks[i], 10);
    const body = chunks[i + 1] || '';
    const tokens = body.match(/[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'\-]{1,}/g) || [];
    const seen = new Set();
    const words = [];
    for (const t of tokens) {
      const w = t.trim().toLowerCase();
      if (w.length >= 2 && !seen.has(w) && !/^(niveau|level|titre|title|terminaisons)$/i.test(w)) {
        seen.add(w);
        words.push({ word: w });
      }
    }
    if (words.length > 0) result[levelNum] = words;
  }
  return result;
}

class Game {
  constructor() {
    this.level = 1;
    this.score = 0;
    this.streak = 0;
    this.xp = 0;
    this.maxXP = 100;
    this.isFrench = false;
    this.isTalkMode = false;
    this.micGranted = false;
    this.micTested = false;
    this.isTestMode = false;
    this.targetWord = null;
    this.unlockedAnimals = [];
    this.currentPool = [];
    this.selectedVoiceURI = null;
    this.wordBank = { en: {}, fr: {} };
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    this.currentUser = null;
    this.canClick = true;
    this.attemptsForCurrentWord = 0;
    this.currentAudio = null;
    this.recognition = null;
    this.isListening = false;
    
    // SFX caching
    this.sounds = {};
    Object.entries(SFX).forEach(([key, url]) => {
      this.sounds[key] = new Audio(url);
      this.sounds[key].volume = 0.5;
    });

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true; // Changed to true for better feedback
      this.recognition.maxAlternatives = 1;
      
      this.recognition.onstart = () => {
        console.log("Recognition started");
        this.isListening = true;
        const targetBtn = this.isTestMode ? 'mic-test-btn' : 'mic-btn';
        const micBtn = document.getElementById(targetBtn);
        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);
        
        if (micBtn) micBtn.classList.add('mic-listening');
        if (feedback) feedback.innerHTML = '<span style="color:var(--danger)">👂 Listening... Speak now!</span>';
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const isFinal = event.results[0].isFinal;
        
        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);
        if (feedback && !isFinal) {
          feedback.innerHTML = `Hearing: <b style="color:var(--primary)">"${transcript}..."</b>`;
        }

        if (isFinal) {
          if (this.isTestMode) {
            this.handleTestResult(transcript);
          } else {
            this.handleSpeechResult(transcript);
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);
        if (feedback) {
          if (event.error === 'no-speech') feedback.textContent = "Didn't hear anything. Try again!";
          else if (event.error === 'not-allowed') {
            feedback.textContent = "Please allow microphone access!";
            this.micGranted = false;
            this.showMicPermissionOnboarding();
          }
          else feedback.textContent = `Error: ${event.error}. Try again!`;
        }
        this.playSFX('wrong');
      };

      this.recognition.onend = () => {
        console.log("Recognition ended");
        this.isListening = false;
        const micBtn = document.getElementById(this.isTestMode ? 'mic-test-btn' : 'mic-btn');
        if (micBtn) micBtn.classList.remove('mic-listening');
      };
    }
  }

  async start() {
    this.bindEvents();
    try { await this.loadWordFiles(); } catch (e) { console.warn("Load error:", e); }
    this.hideLoading();
    this.showProfileSelect();

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => this.populateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
      updateVoices();
      setTimeout(updateVoices, 500);
    }
  }

  playSFX(name) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play().catch(() => {});
    }
  }

  hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.style.display = 'none';
  }

  async loadWordFiles() {
    const load = async (path, lang) => {
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(res.status);
        const text = await res.text();
        const parsed = parseLevels(text);
        if (Object.keys(parsed).length === 0) throw new Error('empty');
        this.wordBank[lang] = parsed;
      } catch (e) {
        const fb = FALLBACK_WORDS[lang] || {};
        for (const [lv, arr] of Object.entries(fb)) {
          this.wordBank[lang][lv] = arr.map(w => ({ word: w }));
        }
      }
    };
    await Promise.all([
      load('french_school_words_1-9.md', 'fr'),
      load('english_school_words_1-9.md', 'en'),
    ]);
  }

  // ── Profile Management ──────────────────────────────────────────────────────
  showProfileSelect() {
    const overlay = document.getElementById('start-overlay');
    const selectView = document.getElementById('profile-select-view');
    const createView = document.getElementById('profile-create-view');
    const list = document.getElementById('profile-list');
    
    overlay.style.display = 'flex';
    const userKeys = Object.keys(this.users);
    
    if (userKeys.length > 0) {
      selectView.style.display = 'block';
      createView.style.display = 'none';
      list.innerHTML = '';
      userKeys.forEach(id => {
        const u = this.users[id];
        const btn = document.createElement('button');
        btn.style.justifyContent = 'space-between';
        btn.style.background = '#f8fafc';
        btn.style.width = '100%';
        btn.style.marginBottom = '10px';
        btn.innerHTML = `<span>${u.name}</span> <span style="font-size:0.8em; color:var(--text-light); font-weight:600;">Lvl ${u.level}</span>`;
        btn.addEventListener('click', () => { this.playSFX('click'); this.loadProfile(id); });
        list.appendChild(btn);
      });
    } else {
      selectView.style.display = 'none';
      createView.style.display = 'block';
      document.getElementById('create-step-1').style.display = 'block';
      document.getElementById('create-step-2').style.display = 'none';
    }
  }

  loadProfile(id) {
    this.currentUser = id;
    const u = this.users[id];
    this.level = u.level || 1;
    this.score = u.score || 0;
    this.streak = u.streak || 0;
    this.xp = u.xp || 0;
    this.maxXP = Math.min(100 + (this.level - 1) * 50, 500);
    this.isFrench = u.isFrench || false;
    this.unlockedAnimals = u.unlockedAnimals || [];
    this.selectedVoiceURI = u.selectedVoiceURI || null;
    this.micTested = u.micTested || false;
    this.startGameplay();
  }

  createProfile() {
    const name = document.getElementById('new-player-name').value.trim();
    if (!name) return;
    const id = Date.now().toString();
    this.users[id] = {
      name: name, level: 1, score: 0, streak: 0, xp: 0,
      isFrench: document.getElementById('new-player-fr').classList.contains('active'),
      unlockedAnimals: [], selectedVoiceURI: null, micTested: false
    };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    this.loadProfile(id);
  }

  saveProfile() {
    if (!this.currentUser) return;
    this.users[this.currentUser] = {
      ...this.users[this.currentUser],
      level: this.level, score: this.score, streak: this.streak, xp: this.xp,
      isFrench: this.isFrench, unlockedAnimals: this.unlockedAnimals, 
      selectedVoiceURI: this.selectedVoiceURI, micTested: this.micTested
    };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
  }

  startGameplay() {
    document.getElementById('start-overlay').style.display = 'none';
    this.updateStats();
    this.updateCollectionButton();
    this.populateVoiceList();
    this.newTarget();
  }

  // ── Voice Management ───────────────────────────────────────────────────────
  populateVoiceList() {
    const voiceSelect = document.getElementById('voice-select');
    if (!voiceSelect || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;
    const langPrefix = this.isFrench ? 'fr' : 'en';
    const filteredVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
    voiceSelect.innerHTML = `<option value="">-- Auto Select --</option>`;
    filteredVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceURI;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (this.selectedVoiceURI === voice.voiceURI) option.selected = true;
      voiceSelect.appendChild(option);
    });
  }

  speak(testWord = null) {
    const textToSpeak = testWord || (this.targetWord ? this.targetWord.word : null);
    if (!textToSpeak) return;

    console.log("Speaking:", textToSpeak);

    const speakBtn = document.getElementById('speak-btn');
    if (speakBtn) {
      speakBtn.classList.add('listen-pulse');
      setTimeout(() => speakBtn.classList.remove('listen-pulse'), 2000);
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    const speakSystemVoice = () => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      const lang = this.isFrench ? 'fr-FR' : 'en-US';
      msg.lang = lang;
      if (this.selectedVoiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const found = voices.find(v => v.voiceURI === this.selectedVoiceURI);
        if (found) msg.voice = found;
      }
      msg.rate = 0.7;
      msg.pitch = 1.1;
      window.speechSynthesis.speak(msg);
    };

    if (this.selectedVoiceURI) {
      speakSystemVoice();
      return;
    }

    const langCode = this.isFrench ? 'fr' : 'en';
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSpeak)}&tl=${langCode}&client=tw-ob`;
    this.currentAudio = new Audio(ttsUrl);
    let playStarted = false;
    this.currentAudio.onplay = () => { playStarted = true; };
    this.currentAudio.play().catch(e => {
      console.warn("External TTS play failed, using fallback:", e);
      speakSystemVoice();
    });

    setTimeout(() => {
      if (!playStarted && !this.selectedVoiceURI) {
        console.log("External TTS timed out, switching to system voice.");
        speakSystemVoice();
      }
    }, 1000);
  }

  // ── Talk Mode Logic ─────────────────────────────────────────────────────────
  showMicPermissionOnboarding() {
    document.getElementById('mic-permission-view').style.display = 'flex';
    document.getElementById('mic-test-view').style.display = 'none';
    document.getElementById('talk-active-view').style.display = 'none';
  }

  async requestMicAccess() {
    this.playSFX('click');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micGranted = true;
      stream.getTracks().forEach(track => track.stop());
      
      if (!this.micTested) {
        document.getElementById('mic-permission-view').style.display = 'none';
        document.getElementById('mic-test-view').style.display = 'flex';
      } else {
        document.getElementById('mic-permission-view').style.display = 'none';
        document.getElementById('talk-active-view').style.display = 'flex';
      }
    } catch (e) {
      console.warn("Mic access denied or error:", e);
      alert("Microphone access is needed for this mode. Please check your browser settings!");
    }
  }

  startListening(isTest = false) {
    if (!this.recognition) {
      alert("Speech recognition isn't supported in this browser. Try Chrome!");
      return;
    }
    if (this.isListening) {
      try { this.recognition.stop(); } catch(e) {}
      return;
    }

    this.isTestMode = isTest;
    this.recognition.lang = this.isFrench ? 'fr-FR' : 'en-US';
    this.playSFX('click');
    try { this.recognition.start(); } catch (e) { console.warn("Start error:", e); }
  }

  handleTestResult(transcript) {
    const feedback = document.getElementById('mic-test-feedback');
    const target = this.isFrench ? "bonjour" : "hello";
    
    console.log("Test result:", transcript);
    if (feedback) feedback.innerHTML = `I heard: <b style="color:var(--primary)">"${transcript}"</b>`;
    
    if (transcript.includes(target) || transcript.includes("hell") || transcript.includes("halo")) {
      this.playSFX('correct');
      this.micTested = true;
      this.saveProfile();
      if (feedback) feedback.innerHTML = '<span style="color:var(--accent)">It works! Perfect. ✨</span>';
      setTimeout(() => {
        document.getElementById('mic-test-view').style.display = 'none';
        document.getElementById('talk-active-view').style.display = 'flex';
        this.newTarget();
      }, 1500);
    } else {
      this.playSFX('wrong');
      if (feedback) feedback.innerHTML = `<span style="color:var(--secondary)">Try once more! Say "${target}".</span>`;
    }
  }

  handleSpeechResult(transcript) {
    const target = this.targetWord.word.toLowerCase();
    const feedback = document.getElementById('speech-feedback');
    
    console.log("Game result:", transcript, "Target:", target);
    if (feedback) feedback.innerHTML = `I heard: <b style="color:var(--primary)">"${transcript}"</b>`;
    
    if (transcript === target || transcript.includes(target)) {
      this.playSFX('correct');
      this.streak++;
      this.score += 150; 
      this.xp += 30 * this.level;
      if (feedback) feedback.innerHTML = '<span style="color:var(--accent)">YES! That is correct! ✨</span>';
      this.updateStats();
      this.saveProfile();
      setTimeout(() => this.levelUpOrNext(), 1500);
    } else {
      this.playSFX('wrong');
      this.streak = 0;
      if (feedback) feedback.innerHTML = `<span style="color:var(--secondary)">NO, not quite. I heard "${transcript}".</span>`;
      setTimeout(() => {
        if (this.isTalkMode) {
          if (feedback) feedback.textContent = "Listen and try again!";
          this.speak();
        }
      }, 1500);
      this.updateStats();
    }
  }

  // ── Gameplay Core ──────────────────────────────────────────────────────────
  buildPool() {
    const bank = this.wordBank[this.isFrench ? 'fr' : 'en'];
    const pool = [];
    for (let lv = 1; lv <= this.level; lv++) {
      const words = bank[lv] || [];
      const diff = this.level - lv;
      const weight = diff === 0 ? 5 : diff === 1 ? 3 : 1;
      for (let w = 0; w < weight; w++) pool.push(...words);
    }
    return pool;
  }

  newTarget() {
    this.currentPool = this.buildPool();
    if (this.currentPool.length === 0) return;
    this.targetWord = this.currentPool[Math.floor(Math.random() * this.currentPool.length)];
    this.attemptsForCurrentWord = 0;
    this.canClick = true;
    
    document.getElementById('game-area').style.display = this.isTalkMode ? 'none' : 'flex';
    document.getElementById('talk-mode-container').style.display = this.isTalkMode ? 'flex' : 'none';
    document.getElementById('speak-btn').style.display = this.isTalkMode ? 'none' : 'block';
    document.getElementById('word-prompt').textContent = this.isTalkMode ? 'Look and Say!' : 'Listen and Find!';

    if (this.isTalkMode) {
      if (!this.micGranted) {
        this.showMicPermissionOnboarding();
      } else if (!this.micTested) {
        document.getElementById('mic-permission-view').style.display = 'none';
        document.getElementById('mic-test-view').style.display = 'flex';
        document.getElementById('talk-active-view').style.display = 'none';
      } else {
        document.getElementById('mic-permission-view').style.display = 'none';
        document.getElementById('mic-test-view').style.display = 'none';
        document.getElementById('talk-active-view').style.display = 'flex';
      }
      
      const displayWord = this.formatWordContextually(this.targetWord.word);
      document.getElementById('speech-target-card').innerHTML = `
        <div class="card" style="margin:0 auto; flex:none; width:100%;">
          ${getWordShapeHTML(displayWord)}
          <div class="card-word ruled" style="font-size: 2.5rem;">${displayWord}</div>
        </div>
      `;
      document.getElementById('speech-feedback').textContent = "Click the mic when ready!";
    } else {
      setTimeout(() => this.speak(), 500);
      this.renderCards();
    }
  }

  formatWordContextually(word) {
    if (Math.random() > 0.5) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  }

  renderCards() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    const distractors = this.currentPool.filter(w => w.word !== this.targetWord.word).slice(0, 4);
    let cards = [this.targetWord, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    const roundIsRuled = Math.random() > 0.5;
    cards.forEach(wordData => {
      const card = document.createElement('div');
      card.className = 'card';
      const displayWord = this.formatWordContextually(wordData.word);
      card.innerHTML = `<div class="particles" style="display:none"></div><div class="feedback"></div>${getWordShapeHTML(displayWord)}<div class="card-word ${roundIsRuled ? 'ruled' : ''}">${displayWord}</div>`;
      card.addEventListener('click', (e) => this.onCardClick(e, wordData));
      gameArea.appendChild(card);
    });
  }

  onCardClick(e, clickedWord) {
    if (!this.canClick) return;
    const card = e.currentTarget;
    const isCorrect = clickedWord.word === this.targetWord.word;
    this.attemptsForCurrentWord++;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('target-card', 'correct-zoom'));
    if (isCorrect) {
      this.canClick = false;
      this.playSFX('correct');
      card.classList.add('correct-zoom');
      this.xp += (this.attemptsForCurrentWord === 1) ? 25 * this.level : 10 * this.level;
      this.streak = (this.attemptsForCurrentWord === 1) ? this.streak + 1 : 0;
      this.score += 100;
      this.updateStats();
      this.saveProfile();
      setTimeout(() => this.levelUpOrNext(), 1500);
    } else {
      this.streak = 0; this.canClick = false; this.playSFX('wrong');
      card.style.opacity = '0.3';
      document.getElementById('game-area').style.opacity = '0.6';
      setTimeout(() => { this.canClick = true; document.getElementById('game-area').style.opacity = '1'; this.speak(); }, 1500);
    }
  }

  levelUpOrNext() {
    if (this.xp >= this.maxXP) this.levelUp();
    else this.newTarget();
  }

  updateStats() {
    document.getElementById('level').textContent = this.level;
    document.getElementById('score').textContent = this.score;
    const streakEl = document.getElementById('streak');
    streakEl.textContent = this.streak;
    streakEl.classList.toggle('on-fire', this.streak >= 3);
    document.getElementById('xp').textContent = this.xp;
    document.getElementById('max-xp').textContent = this.maxXP;
    const xpFill = document.getElementById('xp-fill');
    if (xpFill) xpFill.style.width = `${(this.xp / this.maxXP) * 100}%`;
  }

  updateCollectionButton() { document.getElementById('collection-count').textContent = this.unlockedAnimals.length; }

  levelUp() {
    this.playSFX('levelUp');
    this.level++;
    this.maxXP = Math.min(100 + (this.level - 1) * 50, 500);
    this.xp = 0;
    this.updateStats();
    this.saveProfile();
    document.getElementById('new-level').textContent = this.level;
    document.getElementById('level-up-modal').style.display = 'flex';
  }

  getAnimalForLevel() { 
    // Rarity-based selection
    const roll = Math.random() * 100;
    let accumulated = 0;
    let selectedRarity = 'Common';
    
    // Reverse weights to check from rarest to common
    const rarities = Object.keys(RARITY_WEIGHTS).reverse(); 
    for (const r of rarities) {
      accumulated += RARITY_WEIGHTS[r];
      if (roll <= accumulated) {
        selectedRarity = r;
        break;
      }
    }
    
    const pool = ANIMALS.filter(a => a.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)] || ANIMALS[0];
  }

  checkAnimalUnlock() {
    // Award prize every 4 levels (e.g., reaching level 5, 9, 13...)
    if ((this.level - 1) % 4 === 0 && this.level > 1) {
      const animal = this.getAnimalForLevel();
      if (animal) this.showUnlockScreen(animal);
      else this.newTarget();
    } else {
      this.newTarget();
    }
  }

  showUnlockScreen(animal) {
    const usedNames = this.unlockedAnimals.map(u => u.petName);
    const availableNames = PET_NAMES.filter(n => !usedNames.includes(n));
    const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${animal.name} #${this.unlockedAnimals.length + 1}`;
    this.unlockedAnimals.push({ animalName: animal.name, petName: petName, level: this.level });
    this.updateCollectionButton(); this.saveProfile();
    const content = document.getElementById('unlock-content');
    content.innerHTML = `<div class="unlock-title">NEW PET UNLOCKED!</div><div class="rarity-display rarity-${animal.rarity.toLowerCase()}">${animal.rarity}</div><h2 style="font-size:2.5em;margin:10px 0">${petName}</h2><p style="color:var(--text-light); margin-bottom:20px;">The ${animal.name}</p><div class="unlock-animal-container" id="prize-model-container"><model-viewer id="prize-model" src="${animal.model}" shadow-intensity="1" camera-controls auto-rotate ar style="width:100%;height:100%;--poster-color:${animal.color}" class="unlock-animal-model" alt="${animal.name}"></model-viewer></div><button id="continue-unlock-btn" class="unlock-btn">Add to Collection!</button>`;
    document.getElementById('continue-unlock-btn').addEventListener('click', () => { this.playSFX('click'); this.animatePrizeToChest(); });
    document.getElementById('unlock-screen').style.display = 'flex';
  }

  animatePrizeToChest() {
    const startRect = document.getElementById('prize-model-container').getBoundingClientRect();
    const endRect = document.getElementById('chest-container').getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.style.position = 'absolute'; flyer.style.top = `${startRect.top}px`; flyer.style.left = `${startRect.left}px`;
    flyer.style.width = `${startRect.width}px`; flyer.style.height = `${startRect.height}px`;
    flyer.style.background = 'radial-gradient(circle, var(--primary) 0%, transparent 70%)';
    flyer.style.borderRadius = '50%'; flyer.style.zIndex = '10001';
    flyer.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    flyer.innerHTML = `<div style="font-size: 3rem; display:flex; align-items:center; justify-content:center; height:100%;">✨</div>`;
    document.getElementById('flying-prize-container').appendChild(flyer);
    document.getElementById('flying-prize-container').style.display = 'block';
    document.getElementById('unlock-screen').style.display = 'none';
    requestAnimationFrame(() => { flyer.style.top = `${endRect.top}px`; flyer.style.left = `${endRect.left}px`; flyer.style.width = '40px'; flyer.style.height = '40px'; flyer.style.opacity = '0.5'; flyer.style.transform = 'rotate(360deg)'; });
    setTimeout(() => {
      document.getElementById('chest-container').style.transform = 'scale(1.5) rotate(15deg)';
      setTimeout(() => { document.getElementById('chest-container').style.transform = 'scale(1) rotate(0deg)'; const badge = document.getElementById('chest-badge'); if (badge) { badge.style.display = 'block'; badge.textContent = this.unlockedAnimals.length; } }, 200);
      flyer.remove(); document.getElementById('flying-prize-container').style.display = 'none'; this.newTarget();
    }, 800);
  }

  showCollectionScreen() {
    this.playSFX('click');
    const badge = document.getElementById('chest-badge'); if (badge) badge.style.display = 'none';
    const content = document.getElementById('collection-content');
    content.innerHTML = `<h2 style="font-size:3em;margin-bottom:20px; font-family:'Outfit'; color:var(--primary);">Your Treasure</h2><div id="collection-list" style="text-align:left; display:flex; flex-direction:column; gap:30px; margin-bottom:30px; max-height:60vh; overflow-y:auto; padding-right:10px;"></div><button id="close-collection-btn" class="primary" style="border-radius:20px; padding:15px 40px; width:auto; margin:0 auto;">Close Treasure</button>`;
    const list = document.getElementById('collection-list');
    
    const grid = document.createElement('div'); 
    grid.className = 'collection-grid';
    
    // Show all unlocked characters in reverse order (newest first)
    [...this.unlockedAnimals].reverse().forEach(userAnimal => {
      const animalData = ANIMALS.find(a => a.name === userAnimal.animalName);
      if (!animalData) return;
      
      const card = document.createElement('div'); 
      card.className = 'collection-card';
      card.innerHTML = `
        <div style="font-weight:800; color:var(--primary); font-size:1.1rem;">${userAnimal.petName}</div>
        <div class="collection-animal-container" style="height:120px;">
          <model-viewer src="${animalData.model}" shadow-intensity="1" camera-controls auto-rotate style="width:100%; height:100%; --poster-color:${animalData.color}"></model-viewer>
        </div>
        <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:var(--text-light);">${animalData.name}</div>
        <div style="font-size:0.7rem; font-weight:800; background:#f1f5f9; padding:4px 8px; border-radius:10px; align-self:flex-start;">LEVEL ${userAnimal.level}</div>
      `;
      grid.appendChild(card);
    });
    
    if (this.unlockedAnimals.length === 0) {
      list.innerHTML = `<p style="text-align:center; color:var(--text-light);">Keep playing to unlock your first treasure!</p>`;
    } else {
      list.appendChild(grid);
    }
    
    document.getElementById('close-collection-btn').addEventListener('click', () => { this.playSFX('click'); document.getElementById('animal-collection-screen').style.display = 'none'; });
    document.getElementById('animal-collection-screen').style.display = 'flex';
  }

  setLang(lang) { 
    this.isFrench = (lang === 'fr'); 
    this.saveProfile(); 
    this.populateVoiceList(); 
    document.getElementById('new-player-en').classList.toggle('active', !this.isFrench);
    document.getElementById('new-player-fr').classList.toggle('active', this.isFrench);
    this.newTarget(); 
  }

  setMode(mode) {
    this.isTalkMode = (mode === 'talk');
    document.getElementById('mode-listen').classList.toggle('active', !this.isTalkMode);
    document.getElementById('mode-talk').classList.toggle('active', this.isTalkMode);
    this.newTarget();
  }

  reset() {
    this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 100;
    this.unlockedAnimals = [];
    this.saveProfile();
    this.updateStats(); 
    this.updateCollectionButton(); 
    this.newTarget();
  }

  bindEvents() {
    document.getElementById('next-to-lang-btn')?.addEventListener('click', () => { 
      this.playSFX('click'); 
      const name = document.getElementById('new-player-name').value.trim(); 
      if (name) { 
        document.getElementById('create-step-1').style.display = 'none'; 
        document.getElementById('create-step-2').style.display = 'block'; 
      } 
    });
    document.getElementById('create-player-btn')?.addEventListener('click', () => { this.playSFX('click'); this.createProfile(); });
    document.getElementById('back-to-name-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('create-step-1').style.display = 'block'; document.getElementById('create-step-2').style.display = 'none'; });
    document.getElementById('show-new-profile-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('profile-select-view').style.display = 'none'; document.getElementById('profile-create-view').style.display = 'block'; document.getElementById('create-step-1').style.display = 'block'; document.getElementById('create-step-2').style.display = 'none'; });
    document.getElementById('new-player-en')?.addEventListener('click', () => this.setLang('en'));
    document.getElementById('new-player-fr')?.addEventListener('click', () => this.setLang('fr'));
    document.getElementById('request-mic-btn')?.addEventListener('click', () => this.requestMicAccess());
    document.getElementById('mic-test-btn')?.addEventListener('click', () => this.startListening(true));
    document.getElementById('mode-listen').addEventListener('click', () => this.setMode('listen'));
    document.getElementById('mode-talk').addEventListener('click', () => this.setMode('talk'));
    document.getElementById('sidebar-toggle').addEventListener('click', () => { this.playSFX('click'); document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebar-overlay').style.display = 'block'; });
    document.getElementById('sidebar-close').addEventListener('click', () => { this.playSFX('click'); document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').style.display = 'none'; });
    document.getElementById('sidebar-overlay').addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').style.display = 'none'; });
    document.getElementById('new-game').addEventListener('click', () => { if(confirm("Reset all progress?")) this.reset(); });
    document.getElementById('english-btn').addEventListener('click', () => this.setLang('en'));
    document.getElementById('french-btn').addEventListener('click', () => this.setLang('fr'));
    document.getElementById('speak-btn').addEventListener('click', () => this.speak());
    document.getElementById('mic-btn').addEventListener('click', () => this.startListening(false));
    document.getElementById('chest-container').addEventListener('click', () => this.showCollectionScreen());
    document.getElementById('continue-btn').addEventListener('click', () => { document.getElementById('level-up-modal').style.display = 'none'; this.checkAnimalUnlock(); });
  }
}

const game = new Game();
window.addEventListener('load', () => game.start());
