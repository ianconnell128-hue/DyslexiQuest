
// ─────────────────────────────────────────────────────────────────────────────
//  DyslexiQuest v2 – game.js
// ─────────────────────────────────────────────────────────────────────────────

// ── 3-D collectible characters ──────────────────────────────────────────────
// ALL MODELS VERIFIED TO LOAD (200 OK)
const ANIMALS = [
  // COMMON (60%) - 15 items
  { name: 'Red Fox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Yellow Duck', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Ripe Avocado', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Wild Horse', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Magic Box', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Comfy Chair', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Water Bottle', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Speedy Car', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Happy Emoji', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SmilingFace/glTF-Binary/SmilingFace.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Sea Compass', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/OrientationTest/glTF-Binary/OrientationTest.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Tiny Fox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Rubber Duck', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Fresh Avocado', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Small Box', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', color: '#94a3b8', rarity: 'Common' },
  { name: 'Blue Bottle', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb', color: '#94a3b8', rarity: 'Common' },

  // UNCOMMON (25%) - 12 items
  { name: 'Great Shark', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Big Fish', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Iron Gear', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Bright Lantern', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Helper Robot', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Blue Shark', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Silver Gear', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Old Lantern', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Smart Robot', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Deep Shark', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'River Fish', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon' },
  { name: 'Brass Gear', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb', color: '#3b82f6', rarity: 'Uncommon' },

  // RARE (10%) - 10 items
  { name: 'Cesium Man', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Star Voyager', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Retro BoomBox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Spy Camera', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Space Walker', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Golden Camera', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Cesium Pilot', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Galaxy Runner', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Sound Master', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#a855f7', rarity: 'Rare' },
  { name: 'Snap Shot', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb', color: '#a855f7', rarity: 'Rare' },

  // EPIC (4%) - 6 items
  { name: 'Hero Helmet', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Neon Lamp', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Battle Helmet', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Crystal Lamp', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'War Helmet', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#f97316', rarity: 'Epic' },
  { name: 'Plasma Lamp', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb', color: '#f97316', rarity: 'Epic' },

  // LEGENDARY (0.9%) - 4 items
  { name: 'Neil Armstrong', model: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', color: '#eab308', rarity: 'Legendary' },
  { name: 'Ancient Dragon', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#eab308', rarity: 'Legendary' },
  { name: 'Moon Walker', model: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', color: '#eab308', rarity: 'Legendary' },
  { name: 'Gold Dragon', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#eab308', rarity: 'Legendary' },

  // MYTHIC (0.1%) - 3 items
  { name: 'Alpha Astronaut', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#ef4444', rarity: 'Mythic' },
  { name: 'Golden Fox', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#ef4444', rarity: 'Mythic' },
  { name: 'Deep Space Shark', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#ef4444', rarity: 'Mythic' }
];

const RARITY_WEIGHTS = { 'Common': 60, 'Uncommon': 25, 'Rare': 10, 'Epic': 4, 'Legendary': 0.9, 'Mythic': 0.1 };
const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
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

const FALLBACK_WORDS = {
  en: { 1: ['cat','dog','hat','bat','rat'], 2: ['the','and','you','are','was'], 3: ['they','with','have','this','from'] },
  fr: { 1: ['jai','dit','le','la','je','vois','un','une'], 2: ['mon','est','regarde','suis','ma','dans','peux'], 3: ['aussi','non','va','maman','papa','en','mes'] }
};

function getWordShapeHTML(word) {
  const ascenders = 'bdfhklitABCDEFGHIJKLMNOPQRSTUVWXYZ', descenders = 'gpqyfj'; 
  let html = '<div class="word-shape-container">';
  [...word].forEach(char => {
    let type = 'mid';
    if (ascenders.includes(char)) type = 'tall';
    else if (descenders.includes(char)) type = 'low';
    html += `<div class="shape-block ${type}"></div>`;
  });
  return html + '</div>';
}

function parseLevels(text) {
  const result = {};
  const chunks = text.split(/(?:Niveau|Level)\s+(\d+)/i);
  for (let i = 1; i < chunks.length; i += 2) {
    const levelNum = parseInt(chunks[i], 10), body = chunks[i + 1] || '', tokens = body.match(/[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'\-]{1,}/g) || [], seen = new Set(), words = [];
    for (const t of tokens) {
      const w = t.trim().toLowerCase();
      if (w.length >= 2 && !seen.has(w) && !/^(niveau|level|titre|title|terminaisons)$/i.test(w)) { seen.add(w); words.push({ word: w }); }
    }
    if (words.length > 0) result[levelNum] = words;
  }
  return result;
}

class Game {
  constructor() {
    this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 100;
    this.isFrench = false; this.isTalkMode = false; this.micGranted = false; this.micTested = false; this.isTestMode = false;
    this.targetWord = null; this.unlockedAnimals = []; this.currentPool = []; this.selectedVoiceURI = null;
    this.wordBank = { en: {}, fr: {} }; this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    this.currentUser = null; this.canClick = true; this.attemptsForCurrentWord = 0; this.currentAudio = null;
    this.recognition = null; this.isListening = false; this.sounds = {};
    Object.entries(SFX).forEach(([key, url]) => { this.sounds[key] = new Audio(url); this.sounds[key].volume = 0.5; });
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false; this.recognition.interimResults = true; this.recognition.maxAlternatives = 1;
      this.recognition.onstart = () => {
        this.isListening = true; const targetBtn = this.isTestMode ? 'mic-test-btn' : 'mic-btn';
        const micBtn = document.getElementById(targetBtn), feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);
        if (micBtn) micBtn.classList.add('mic-listening');
        if (feedback) feedback.innerHTML = '<span style="color:var(--danger)">👂 Listening... Speak now!</span>';
      };
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim(), isFinal = event.results[0].isFinal;
        const feedback = document.getElementById(this.isTestMode ? 'mic-test-feedback' : 'speech-feedback');
        if (feedback && !isFinal) feedback.innerHTML = `Hearing: <b style="color:var(--primary)">"${transcript}..."</b>`;
        if (isFinal) { if (this.isTestMode) this.handleTestResult(transcript); else this.handleSpeechResult(transcript); }
      };
      this.recognition.onerror = (event) => {
        const feedback = document.getElementById(this.isTestMode ? 'mic-test-feedback' : 'speech-feedback');
        if (feedback) {
          if (event.error === 'no-speech') feedback.textContent = "Didn't hear anything!";
          else if (event.error === 'not-allowed') { feedback.textContent = "Allow mic access!"; this.micGranted = false; this.showMicPermissionOnboarding(); }
          else feedback.textContent = `Error: ${event.error}`;
        }
        this.playSFX('wrong');
      };
      this.recognition.onend = () => { this.isListening = false; const micBtn = document.getElementById(this.isTestMode ? 'mic-test-btn' : 'mic-btn'); if (micBtn) micBtn.classList.remove('mic-listening'); };
    }
  }

  async start() {
    this.bindEvents(); try { await this.loadWordFiles(); } catch (e) {} this.hideLoading(); this.showProfileSelect();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => this.populateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices(); setTimeout(updateVoices, 500);
    }
  }

  playSFX(name) { if (this.sounds[name]) { this.sounds[name].currentTime = 0; this.sounds[name].play().catch(() => {}); } }
  hideLoading() { const el = document.getElementById('loading-overlay'); if (el) el.style.display = 'none'; }

  async loadWordFiles() {
    const load = async (path, lang) => {
      try {
        const res = await fetch(path); if (!res.ok) throw new Error(); const text = await res.text(), parsed = parseLevels(text);
        if (Object.keys(parsed).length === 0) throw new Error(); this.wordBank[lang] = parsed;
      } catch (e) {
        const fb = FALLBACK_WORDS[lang] || {}; for (const [lv, arr] of Object.entries(fb)) this.wordBank[lang][lv] = arr.map(w => ({ word: w }));
      }
    };
    await Promise.all([load('french_school_words_1-9.md', 'fr'), load('english_school_words_1-9.md', 'en')]);
  }

  showProfileSelect() {
    const overlay = document.getElementById('start-overlay'), selectView = document.getElementById('profile-select-view');
    const createView = document.getElementById('profile-create-view'), list = document.getElementById('profile-list');
    overlay.style.display = 'flex'; const userKeys = Object.keys(this.users);
    if (userKeys.length > 0) {
      selectView.style.display = 'block'; createView.style.display = 'none'; list.innerHTML = '';
      userKeys.forEach(id => {
        const u = this.users[id], btn = document.createElement('button');
        btn.style.justifyContent = 'space-between'; btn.style.background = '#f8fafc'; btn.style.width = '100%'; btn.style.marginBottom = '10px';
        btn.innerHTML = `<span>${u.name}</span> <span style="font-size:0.8em; color:var(--text-light); font-weight:600;">Lvl ${u.level}</span>`;
        btn.addEventListener('click', () => { this.playSFX('click'); this.loadProfile(id); });
        list.appendChild(btn);
      });
    } else { selectView.style.display = 'none'; createView.style.display = 'block'; document.getElementById('create-step-1').style.display = 'block'; document.getElementById('create-step-2').style.display = 'none'; }
  }

  loadProfile(id) {
    this.currentUser = id; const u = this.users[id];
    this.level = u.level || 1; this.score = u.score || 0; this.streak = u.streak || 0; this.xp = u.xp || 0;
    this.maxXP = Math.min(100 + (this.level - 1) * 50, 500); this.isFrench = u.isFrench || false;
    this.unlockedAnimals = u.unlockedAnimals || []; this.selectedVoiceURI = u.selectedVoiceURI || null;
    this.micTested = u.micTested || false; this.startGameplay();
  }

  createProfile() {
    const name = document.getElementById('new-player-name').value.trim(); if (!name) return;
    const id = Date.now().toString();
    this.users[id] = { name: name, level: 1, score: 0, streak: 0, xp: 0, isFrench: document.getElementById('new-player-fr').classList.contains('active'), unlockedAnimals: [], selectedVoiceURI: null, micTested: false };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users)); this.loadProfile(id);
  }

  saveProfile() {
    if (!this.currentUser) return;
    this.users[this.currentUser] = { ...this.users[this.currentUser], level: this.level, score: this.score, streak: this.streak, xp: this.xp, isFrench: this.isFrench, unlockedAnimals: this.unlockedAnimals, selectedVoiceURI: this.selectedVoiceURI, micTested: this.micTested };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
  }

  deleteCurrentProfile() {
    if (!this.currentUser || !confirm(`Delete profile for "${this.users[this.currentUser].name}"?`)) return;
    delete this.users[this.currentUser]; localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    this.currentUser = null; this.playSFX('click'); document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').style.display = 'none'; this.showProfileSelect();
  }

  startGameplay() { document.getElementById('start-overlay').style.display = 'none'; this.updateStats(); this.updateCollectionButton(); this.populateVoiceList(); this.newTarget(); }

  populateVoiceList() {
    const voiceSelect = document.getElementById('voice-select'); if (!voiceSelect || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices(); if (voices.length === 0) return;
    const langPrefix = this.isFrench ? 'fr' : 'en'; voiceSelect.innerHTML = `<option value="">-- Auto --</option>`;
    voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix)).forEach(v => {
      const opt = document.createElement('option'); opt.value = v.voiceURI; opt.textContent = `${v.name} (${v.lang})`;
      if (this.selectedVoiceURI === v.voiceURI) opt.selected = true; voiceSelect.appendChild(opt);
    });
  }

  speak(testWord = null) {
    const text = testWord || (this.targetWord ? this.targetWord.word : null); if (!text) return;
    const speakBtn = document.getElementById('speak-btn'); if (speakBtn) { speakBtn.classList.add('listen-pulse'); setTimeout(() => speakBtn.classList.remove('listen-pulse'), 2000); }
    if (this.currentAudio) { this.currentAudio.pause(); this.currentAudio = null; }
    const sysSpeak = () => {
      if (!window.speechSynthesis) return; window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text); msg.lang = this.isFrench ? 'fr-FR' : 'en-US';
      if (this.selectedVoiceURI) { const found = window.speechSynthesis.getVoices().find(v => v.voiceURI === this.selectedVoiceURI); if (found) msg.voice = found; }
      msg.rate = 0.7; msg.pitch = 1.1; window.speechSynthesis.speak(msg);
    };
    if (this.selectedVoiceURI) { sysSpeak(); return; }
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${this.isFrench?'fr':'en'}&client=tw-ob`;
    this.currentAudio = new Audio(url); let started = false; this.currentAudio.onplay = () => started = true;
    this.currentAudio.play().catch(() => sysSpeak()); setTimeout(() => { if (!started) sysSpeak(); }, 1000);
  }

  showMicPermissionOnboarding() { document.getElementById('mic-permission-view').style.display = 'flex'; document.getElementById('mic-test-view').style.display = 'none'; document.getElementById('talk-active-view').style.display = 'none'; }

  async requestMicAccess() {
    this.playSFX('click');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true }); this.micGranted = true; s.getTracks().forEach(t => t.stop());
      if (!this.micTested) { document.getElementById('mic-permission-view').style.display = 'none'; document.getElementById('mic-test-view').style.display = 'flex'; }
      else { document.getElementById('mic-permission-view').style.display = 'none'; document.getElementById('talk-active-view').style.display = 'flex'; }
    } catch (e) { alert("Mic access denied!"); }
  }

  startListening(isTest = false) {
    if (!this.recognition) { alert("Speech recognition unsupported!"); return; }
    if (this.isListening) { try { this.recognition.stop(); } catch(e) {} return; }
    this.isTestMode = isTest; this.recognition.lang = this.isFrench ? 'fr-FR' : 'en-US'; this.playSFX('click');
    try { this.recognition.start(); } catch (e) {}
  }

  handleTestResult(t) {
    const fb = document.getElementById('mic-test-feedback'), target = this.isFrench ? "bonjour" : "hello";
    if (fb) fb.innerHTML = `I heard: <b style="color:var(--primary)">"${t}"</b>`;
    if (t.includes(target) || t.includes("hell") || t.includes("halo")) {
      this.playSFX('correct'); this.micTested = true; this.saveProfile();
      if (fb) fb.innerHTML = '<span style="color:var(--accent)">It works! ✨</span>';
      setTimeout(() => { document.getElementById('mic-test-view').style.display = 'none'; document.getElementById('talk-active-view').style.display = 'flex'; this.newTarget(); }, 1500);
    } else { this.playSFX('wrong'); if (fb) fb.innerHTML = `<span style="color:var(--secondary)">Try saying "${target}".</span>`; }
  }

  handleSpeechResult(t) {
    const target = this.targetWord.word.toLowerCase(), fb = document.getElementById('speech-feedback');
    if (fb) fb.innerHTML = `I heard: <b style="color:var(--primary)">"${t}"</b>`;
    if (t === target || t.includes(target)) {
      this.playSFX('correct'); this.streak++; this.score += 150; this.xp += 30 * this.level;
      if (fb) fb.innerHTML = '<span style="color:var(--accent)">YES! ✨</span>';
      this.updateStats(); this.saveProfile(); setTimeout(() => this.levelUpOrNext(), 1500);
    } else {
      this.playSFX('wrong'); this.streak = 0; if (fb) fb.innerHTML = `<span style="color:var(--secondary)">NO, I heard "${t}".</span>`;
      setTimeout(() => { if (this.isTalkMode) this.speak(); }, 1500); this.updateStats();
    }
  }

  buildPool() {
    const bank = this.wordBank[this.isFrench ? 'fr' : 'en'], pool = [];
    for (let lv = 1; lv <= this.level; lv++) {
      const words = bank[lv] || [], diff = this.level - lv, weight = diff === 0 ? 5 : diff === 1 ? 3 : 1;
      for (let w = 0; w < weight; w++) pool.push(...words);
    }
    return pool;
  }

  newTarget() {
    this.currentPool = this.buildPool(); if (this.currentPool.length === 0) return;
    this.targetWord = this.currentPool[Math.floor(Math.random() * this.currentPool.length)];
    this.attemptsForCurrentWord = 0; this.canClick = true;
    document.getElementById('game-area').style.display = this.isTalkMode ? 'none' : 'flex';
    document.getElementById('talk-mode-container').style.display = this.isTalkMode ? 'flex' : 'none';
    document.getElementById('speak-btn').style.display = this.isTalkMode ? 'none' : 'block';
    document.getElementById('word-prompt').textContent = this.isTalkMode ? 'Look and Say!' : 'Listen and Find!';
    if (this.isTalkMode) {
      if (!this.micGranted) this.showMicPermissionOnboarding();
      else if (!this.micTested) { document.getElementById('mic-permission-view').style.display = 'none'; document.getElementById('mic-test-view').style.display = 'flex'; }
      else { document.getElementById('mic-permission-view').style.display = 'none'; document.getElementById('talk-active-view').style.display = 'flex'; }
      const displayWord = this.formatWordContextually(this.targetWord.word);
      document.getElementById('speech-target-card').innerHTML = `<div class="card" style="margin:0 auto; flex:none; width:100%;">${getWordShapeHTML(displayWord)}<div class="card-word ruled" style="font-size: 2.5rem;">${displayWord}</div></div>`;
      document.getElementById('speech-feedback').textContent = "Click the mic when ready!";
    } else { setTimeout(() => this.speak(), 500); this.renderCards(); }
  }

  formatWordContextually(w) { return Math.random() > 0.5 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase(); }

  renderCards() {
    const gameArea = document.getElementById('game-area'); gameArea.innerHTML = '';
    const distractors = this.currentPool.filter(w => w.word !== this.targetWord.word).slice(0, 4);
    let cards = [this.targetWord, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    const roundIsRuled = Math.random() > 0.5;
    cards.forEach(wordData => {
      const card = document.createElement('div'); card.className = 'card';
      const displayWord = this.formatWordContextually(wordData.word);
      card.innerHTML = `<div class="particles" style="display:none"></div><div class="feedback"></div>${getWordShapeHTML(displayWord)}<div class="card-word ${roundIsRuled ? 'ruled' : ''}">${displayWord}</div>`;
      card.addEventListener('click', (e) => this.onCardClick(e, wordData)); gameArea.appendChild(card);
    });
  }

  onCardClick(e, clickedWord) {
    if (!this.canClick) return; const card = e.currentTarget, isCorrect = clickedWord.word === this.targetWord.word;
    this.attemptsForCurrentWord++;
    if (isCorrect) {
      this.canClick = false; this.playSFX('correct'); card.classList.add('correct-zoom');
      this.xp += (this.attemptsForCurrentWord === 1) ? 25 * this.level : 10 * this.level;
      this.streak = (this.attemptsForCurrentWord === 1) ? this.streak + 1 : 0;
      this.score += 100; this.updateStats(); this.saveProfile(); setTimeout(() => this.levelUpOrNext(), 1500);
    } else {
      this.streak = 0; this.canClick = false; this.playSFX('wrong'); card.style.opacity = '0.3';
      document.getElementById('game-area').style.opacity = '0.6';
      setTimeout(() => { this.canClick = true; document.getElementById('game-area').style.opacity = '1'; this.speak(); }, 1500);
    }
  }

  levelUpOrNext() { if (this.xp >= this.maxXP) this.levelUp(); else this.newTarget(); }

  updateStats() {
    document.getElementById('level').textContent = this.level; document.getElementById('score').textContent = this.score;
    const streakEl = document.getElementById('streak'); streakEl.textContent = this.streak; streakEl.classList.toggle('on-fire', this.streak >= 3);
    document.getElementById('xp').textContent = this.xp; document.getElementById('max-xp').textContent = this.maxXP;
    const xpFill = document.getElementById('xp-fill'); if (xpFill) xpFill.style.width = `${(this.xp / this.maxXP) * 100}%`;
  }

  updateCollectionButton() { document.getElementById('collection-count').textContent = this.unlockedAnimals.length; }

  levelUp() {
    this.playSFX('levelUp'); this.level++; this.maxXP = Math.min(100 + (this.level - 1) * 50, 500); this.xp = 0;
    this.updateStats(); this.saveProfile(); document.getElementById('new-level').textContent = this.level;
    document.getElementById('level-up-modal').style.display = 'flex';
  }

  getAnimalForLevel() { 
    const roll = Math.random() * 100; let accumulated = 0, selectedRarity = 'Common';
    const rarities = [...RARITY_ORDER].reverse(); 
    for (const r of rarities) { accumulated += RARITY_WEIGHTS[r]; if (roll <= accumulated) { selectedRarity = r; break; } }
    const pool = ANIMALS.filter(a => a.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)] || ANIMALS[0];
  }

  checkAnimalUnlock() {
    if (this.level > 1) { const animal = this.getAnimalForLevel(); if (animal) this.showUnlockScreen(animal); else this.newTarget(); }
    else this.newTarget();
  }

  showStoreScreen() {
    this.playSFX('click'); const container = document.getElementById('store-trade-list'); container.innerHTML = '';
    const counts = {}; RARITY_ORDER.forEach(r => counts[r] = 0);
    this.unlockedAnimals.forEach(ua => { const data = ANIMALS.find(a => a.name === ua.animalName); if (data) counts[data.rarity]++; });
    RARITY_ORDER.slice(0, -1).forEach((rarity, index) => {
      const nextRarity = RARITY_ORDER[index + 1], count = counts[rarity], canTrade = count >= 3;
      const row = document.createElement('div'); row.className = 'collection-card'; row.style.flexDirection = 'row'; row.style.justifyContent = 'space-between'; row.style.width = '100%'; row.style.padding = '20px';
      row.innerHTML = `<div style="text-align: left;"><div style="font-weight: 800; color: var(--text);">Trade 3 ${rarity}s</div><div style="font-size: 0.8rem; color: var(--text-light);">You have: <b>${count}</b></div></div><div style="font-size: 1.5rem;">→</div><div style="text-align: right;"><div class="rarity-display rarity-${nextRarity.toLowerCase()}" style="margin-bottom: 5px;">${nextRarity}</div><button class="${canTrade ? 'accent' : ''}" style="width: auto; padding: 8px 20px; font-size: 0.9rem;" ${canTrade ? '' : 'disabled'}>Trade In!</button></div>`;
      if (canTrade) row.querySelector('button').addEventListener('click', () => this.performTrade(rarity, nextRarity));
      container.appendChild(row);
    });
    document.getElementById('store-screen').style.display = 'flex';
  }

  performTrade(fromRarity, toRarity) {
    if (!confirm(`Trade 3 of your ${fromRarity} pets for 1 random ${toRarity} pet?`)) return;
    let removedCount = 0; const newUnlocked = [];
    for (const ua of this.unlockedAnimals) {
      const data = ANIMALS.find(a => a.name === ua.animalName);
      if (removedCount < 3 && data && data.rarity === fromRarity) { removedCount++; continue; }
      newUnlocked.push(ua);
    }
    if (removedCount === 3) {
      this.unlockedAnimals = newUnlocked; const pool = ANIMALS.filter(a => a.rarity === toRarity);
      const prize = pool[Math.floor(Math.random() * pool.length)];
      const availableNames = PET_NAMES.filter(n => !this.unlockedAnimals.some(u => u.petName === n));
      const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${prize.name} Elite`;
      this.unlockedAnimals.push({ animalName: prize.name, petName: petName, level: this.level });
      this.saveProfile(); this.updateCollectionButton(); document.getElementById('store-screen').style.display = 'none'; this.showUnlockScreen(prize); 
    }
  }

  showUnlockScreen(animal) {
    const usedNames = this.unlockedAnimals.map(u => u.petName), availableNames = PET_NAMES.filter(n => !usedNames.includes(n));
    const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${animal.name} #${this.unlockedAnimals.length + 1}`;
    this.unlockedAnimals.push({ animalName: animal.name, petName: petName, level: this.level });
    this.updateCollectionButton(); this.saveProfile();
    const content = document.getElementById('unlock-content');
    content.innerHTML = `<div class="unlock-title">NEW PET UNLOCKED!</div><div class="rarity-display rarity-${animal.rarity.toLowerCase()}">${animal.rarity}</div><h2 style="font-size:2.5em;margin:10px 0">${petName}</h2><p style="color:var(--text-light); margin-bottom:20px;">The ${animal.name}</p><div class="unlock-animal-container" id="prize-model-container"><model-viewer id="prize-model" src="${animal.model}" shadow-intensity="1" camera-controls auto-rotate ar style="width:100%;height:100%;--poster-color:#ffffff" class="unlock-animal-model" alt="${animal.name}"></model-viewer></div><button id="continue-unlock-btn" class="unlock-btn">Add to Collection!</button>`;
    document.getElementById('continue-unlock-btn').addEventListener('click', () => { this.playSFX('click'); this.animatePrizeToChest(); });
    document.getElementById('unlock-screen').style.display = 'flex';
  }

  animatePrizeToChest() {
    const startRect = document.getElementById('prize-model-container').getBoundingClientRect();
    const endRect = document.getElementById('chest-container').getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.style.position = 'absolute'; flyer.style.top = `${startRect.top}px`; flyer.style.left = `${startRect.left}px`; flyer.style.width = `${startRect.width}px`; flyer.style.height = `${startRect.height}px`; flyer.style.background = 'radial-gradient(circle, var(--primary) 0%, transparent 70%)'; flyer.style.borderRadius = '50%'; flyer.style.zIndex = '10001'; flyer.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    flyer.innerHTML = `<div style="font-size: 3rem; display:flex; align-items:center; justify-content:center; height:100%;">✨</div>`;
    document.getElementById('flying-prize-container').appendChild(flyer); document.getElementById('flying-prize-container').style.display = 'block'; document.getElementById('unlock-screen').style.display = 'none';
    requestAnimationFrame(() => { flyer.style.top = `${endRect.top}px`; flyer.style.left = `${endRect.left}px`; flyer.style.width = '40px'; flyer.style.height = '40px'; flyer.style.opacity = '0.5'; flyer.style.transform = 'rotate(360deg)'; });
    setTimeout(() => {
      document.getElementById('chest-container').style.transform = 'scale(1.5) rotate(15deg)';
      setTimeout(() => { document.getElementById('chest-container').style.transform = 'scale(1) rotate(0deg)'; const badge = document.getElementById('chest-badge'); if (badge) { badge.style.display = 'block'; badge.textContent = this.unlockedAnimals.length; } }, 200);
      flyer.remove(); document.getElementById('flying-prize-container').style.display = 'none'; this.newTarget();
    }, 800);
  }

  showCollectionScreen() {
    this.playSFX('click'); const badge = document.getElementById('chest-badge'); if (badge) badge.style.display = 'none';
    const content = document.getElementById('collection-content');
    content.innerHTML = `<h2 style="font-size:3em;margin-bottom:20px; font-family:'Outfit'; color:var(--primary);">Your Treasure</h2><div id="collection-list" style="text-align:left; display:flex; flex-direction:column; gap:30px; margin-bottom:30px; max-height:60vh; overflow-y:auto; padding-right:10px;"></div><button id="close-collection-btn" class="primary" style="border-radius:20px; padding:15px 40px; width:auto; margin:0 auto;">Close Treasure</button>`;
    const list = document.getElementById('collection-list'), grid = document.createElement('div'); grid.className = 'collection-grid';
    [...this.unlockedAnimals].reverse().forEach(ua => {
      const animalData = ANIMALS.find(a => a.name === ua.animalName); if (!animalData) return;
      const card = document.createElement('div'); card.className = 'collection-card';
      card.innerHTML = `<div class="rarity-display rarity-${animalData.rarity.toLowerCase()}" style="margin-bottom:5px;">${animalData.rarity}</div><div style="font-weight:800; color:var(--primary); font-size:1.1rem;">${ua.petName}</div><div class="collection-animal-container" style="height:120px; width:100%;"><model-viewer src="${animalData.model}" shadow-intensity="1" camera-controls auto-rotate style="width:100%; height:100%; --poster-color:#ffffff"></model-viewer></div><div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:var(--text-light);">${animalData.name}</div><div style="font-size:0.7rem; font-weight:800; background:#f1f5f9; padding:4px 10px; border-radius:10px; margin-top:5px;">LVL ${ua.level}</div>`;
      grid.appendChild(card);
    });
    if (this.unlockedAnimals.length === 0) list.innerHTML = `<p style="text-align:center; color:var(--text-light);">Keep playing to unlock treasure!</p>`;
    else list.appendChild(grid);
    document.getElementById('close-collection-btn').addEventListener('click', () => { this.playSFX('click'); document.getElementById('animal-collection-screen').style.display = 'none'; });
    document.getElementById('animal-collection-screen').style.display = 'flex';
  }

  setLang(l) { this.isFrench = (l === 'fr'); this.saveProfile(); this.populateVoiceList(); document.getElementById('new-player-en').classList.toggle('active', !this.isFrench); document.getElementById('new-player-fr').classList.toggle('active', this.isFrench); this.newTarget(); }
  setMode(m) { this.isTalkMode = (m === 'talk'); document.getElementById('mode-listen').classList.toggle('active', !this.isTalkMode); document.getElementById('mode-talk').classList.toggle('active', this.isTalkMode); this.newTarget(); }
  reset() { this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 100; this.unlockedAnimals = []; this.saveProfile(); this.updateStats(); this.updateCollectionButton(); this.newTarget(); }

  bindEvents() {
    document.getElementById('next-to-lang-btn')?.addEventListener('click', () => { this.playSFX('click'); const name = document.getElementById('new-player-name').value.trim(); if (name) { document.getElementById('create-step-1').style.display = 'none'; document.getElementById('create-step-2').style.display = 'block'; } });
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
    document.getElementById('new-game').addEventListener('click', () => { if(confirm("Reset progress?")) this.reset(); });
    document.getElementById('delete-profile-btn').addEventListener('click', () => this.deleteCurrentProfile());
    document.getElementById('store-btn').addEventListener('click', () => this.showStoreScreen());
    document.getElementById('close-store-btn').addEventListener('click', () => { this.playSFX('click'); document.getElementById('store-screen').style.display = 'none'; });
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
