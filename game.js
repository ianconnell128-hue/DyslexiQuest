
// ─────────────────────────────────────────────────────────────────────────────
//  DyslexiQuest v2 – game.js
// ─────────────────────────────────────────────────────────────────────────────

// ── 3-D collectible animals ──────────────────────────────────────────────────
const ANIMALS = [
  { name: 'Playful Fox',          model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#e67e22', rarity: 'Common'    },
  { name: 'Golden Duck',           model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#f1c40f', rarity: 'Common'    },
  { name: 'Honey Bee',             model: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Bee/glTF-Binary/Bee.glb', color: '#f9ca24', rarity: 'Common'    },
  { name: 'Swift Shark',           model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Shark/glTF-Binary/Shark.glb', color: '#3498db', rarity: 'Uncommon'  },
  { name: 'Sturdy Cactus',         model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Cactus/glTF-Binary/Cactus.glb', color: '#2ecc71', rarity: 'Uncommon'  },
  { name: 'Red Chair',             model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb', color: '#e74c3c', rarity: 'Uncommon'  },
  { name: 'Space Astronaut',       model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#ffffff', rarity: 'Rare'      },
  { name: 'Pink Flamingo',         model: 'https://modelviewer.dev/shared-assets/models/Flamingo.glb', color: '#ff7979', rarity: 'Rare'      },
  { name: 'Water Bottle',          model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb', color: '#1abc9c', rarity: 'Rare'      },
  { name: 'Antique Lantern',       model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb', color: '#d35400', rarity: 'Epic'      },
  { name: 'Boom Box',              model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#2c3e50', rarity: 'Epic'      },
  { name: 'Toy Car',               model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', color: '#c0392b', rarity: 'Epic'      },
  { name: 'Avocado Friend',        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', color: '#badc58', rarity: 'Legendary' },
  { name: 'Stained Glass Lamp',    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/StainedGlassLamp/glTF-Binary/StainedGlassLamp.glb', color: '#f093fb', rarity: 'Legendary' },
  { name: 'Damaged Helmet',        model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#95afc0', rarity: 'Legendary' },
];

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

function generateShape(word) {
  const codes = [...word].map(c => c.charCodeAt(0));
  const sum = codes.reduce((a, b) => a + b, 0);
  const len = word.length;
  const cx = 100, cy = 100, r = 55 + (sum % 20), bump = 15 + (len * 3);
  const left = cx - r, right = cx + r, top = cy - r, bottom = cy + r;
  const paths = [
    `M${left},${bottom} Q${cx - bump},${top - 10} ${cx},${top} Q${cx + bump},${top - 10} ${right},${bottom}`,
    `M${left},${cy} Q${cx - 20},${cy - r} ${cx},${cy} Q${cx + 20},${cy + r} ${right},${cy}`,
    `M${left},${bottom} L${cx},${top} L${right},${bottom} M${left + 10},${bottom} L${right - 10},${bottom}`,
    `M${cx},${top} Q${right + 20},${cy} ${cx},${bottom} Q${left - 20},${cy} ${cx},${top}`,
    `M${left},${bottom} Q${cx - 30},${cy} ${cx},${top - 10} Q${cx + 30},${cy} ${right},${bottom}`,
  ];
  return paths[sum % paths.length];
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
        words.push({ word: w, shape: generateShape(w) });
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
    this.targetWord = null;
    this.unlockedAnimals = [];
    this.currentPool = [];
    this.selectedVoiceURI = null;
    this.wordBank = { en: {}, fr: {} };

    // User Management
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    this.currentUser = null;
  }

  async start() {
    console.log("Game start initializing...");
    try {
      await this.loadWordFiles();
    } catch (e) {
      console.warn("Word files could not be loaded, using fallbacks.", e);
    }
    
    this.bindEvents();
    this.hideLoading();
    this.showProfileSelect();

    // Voice initialization for Firefox/Chrome
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => this.populateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
      updateVoices();
      setTimeout(updateVoices, 100);
      setTimeout(updateVoices, 1000);
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
          this.wordBank[lang][lv] = arr.map(w => ({ word: w, shape: generateShape(w) }));
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
    const cancelBtn = document.getElementById('cancel-new-profile-btn');
    
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
        btn.innerHTML = `<span>${u.name}</span> <span style="font-size:0.8em; color:var(--text-light); font-weight:600;">Lvl ${u.level} • ${u.isFrench ? 'FR' : 'EN'}</span>`;
        btn.addEventListener('click', () => this.loadProfile(id));
        list.appendChild(btn);
      });
      cancelBtn.style.display = 'inline-block';
    } else {
      selectView.style.display = 'none';
      createView.style.display = 'block';
      cancelBtn.style.display = 'none';
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
    
    this.startGameplay();
  }

  createProfile() {
    const nameInput = document.getElementById('new-player-name');
    const name = nameInput.value.trim();
    if (!name) return;
    
    const id = Date.now().toString();
    const isFr = document.getElementById('new-player-fr').classList.contains('active');
    
    this.users[id] = {
      name: name,
      level: 1, score: 0, streak: 0, xp: 0,
      isFrench: isFr,
      unlockedAnimals: [],
      selectedVoiceURI: null
    };
    
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    nameInput.value = '';
    this.loadProfile(id);
  }

  saveProfile() {
    if (!this.currentUser) return;
    this.users[this.currentUser] = {
      ...this.users[this.currentUser],
      level: this.level,
      score: this.score,
      streak: this.streak,
      xp: this.xp,
      isFrench: this.isFrench,
      unlockedAnimals: this.unlockedAnimals,
      selectedVoiceURI: this.selectedVoiceURI
    };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
  }

  startGameplay() {
    document.getElementById('start-overlay').style.display = 'none';
    
    // UI update based on user preferences
    document.getElementById('english-btn').classList.toggle('active', !this.isFrench);
    document.getElementById('french-btn').classList.toggle('active', this.isFrench);
    
    this.updateStats();
    this.updateCollectionButton();
    this.populateVoiceList();
    this.newTarget();
  }

  // ── Voice Management ───────────────────────────────────────────────────────
  populateVoiceList() {
    const voiceSelect = document.getElementById('voice-select');
    if (!voiceSelect || typeof window === 'undefined' || !window.speechSynthesis) return;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    const langPrefix = this.isFrench ? 'fr' : 'en';
    const filteredVoices = voices
      .filter(v => v.lang.toLowerCase().startsWith(langPrefix))
      .sort((a, b) => {
        const aPref = /google|premium|natural/i.test(a.name);
        const bPref = /google|premium|natural/i.test(b.name);
        return (bPref - aPref) || a.name.localeCompare(b.name);
      });

    const currentURI = this.selectedVoiceURI;
    voiceSelect.innerHTML = `<option value="">-- Auto Select (${this.isFrench ? 'French' : 'English'}) --</option>`;

    filteredVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceURI;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (currentURI === voice.voiceURI) option.selected = true;
      voiceSelect.appendChild(option);
    });
  }

  speak(testWord = null) {
    const textToSpeak = testWord || (this.targetWord ? this.targetWord.word : null);
    if (!textToSpeak || !window.speechSynthesis) return;

    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (this.selectedVoiceURI) {
      selectedVoice = voices.find(v => v.voiceURI === this.selectedVoiceURI);
    }

    if (!selectedVoice) {
      const targetLang = this.isFrench ? 'fr' : 'en';
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLang));
    }

    if (selectedVoice) {
      msg.voice = selectedVoice;
      msg.lang = selectedVoice.lang;
    } else {
      msg.lang = this.isFrench ? 'fr-FR' : 'en-US';
    }

    msg.rate = 0.8;
    msg.pitch = 1.0;
    window.speechSynthesis.speak(msg);
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
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }

  newTarget() {
    this.currentPool = this.buildPool();
    if (this.currentPool.length === 0) {
      document.getElementById('word-prompt').textContent = 'No words loaded!';
      return;
    }
    this.targetWord = this.currentPool[Math.floor(Math.random() * this.currentPool.length)];
    document.getElementById('word-prompt').textContent = `Listen for the word!`;
    this.speak();
    this.renderCards();
  }

  renderCards() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    const distractors = this.currentPool
      .filter(w => w.word !== this.targetWord.word)
      .slice(0, 4);
    let cards = [this.targetWord, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach(wordData => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="particles" style="display:none"></div>
        <div class="feedback"></div>
        <svg class="shape-svg" viewBox="0 0 200 200"><path d="${wordData.shape}" /></svg>
        <div class="card-word">${wordData.word.toUpperCase()}</div>
      `;
      card.addEventListener('click', (e) => this.onCardClick(e, wordData));
      gameArea.appendChild(card);
    });
  }

  onCardClick(e, clickedWord) {
    const card = e.currentTarget;
    const isCorrect = clickedWord.word === this.targetWord.word;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('target-card'));
    if (isCorrect) {
      this.streak++;
      this.score += 100;
      this.xp += 25 * this.level;
      card.classList.add('target-card');
      this.showFeedback(card, 'Great job!', 'correct');
      this.createParticles(card);
      this.updateStats();
      this.saveProfile();
      if (this.xp >= this.maxXP) setTimeout(() => this.levelUp(), 1500);
      else setTimeout(() => this.newTarget(), 1500);
    } else {
      this.streak = 0;
      this.showFeedback(card, 'Try again!', 'wrong');
      card.classList.add('target-card');
      this.updateStats();
      this.saveProfile();
    }
  }

  showFeedback(card, text, type) {
    const fb = card.querySelector('.feedback');
    fb.textContent = text;
    fb.className = `feedback ${type}`;
    setTimeout(() => { fb.className = 'feedback'; fb.textContent = ''; }, 1000);
  }

  createParticles(card) {
    const container = card.querySelector('.particles');
    container.style.display = 'block';
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 0.3}s`;
      container.appendChild(p);
    }
    setTimeout(() => { container.style.display = 'none'; container.innerHTML = ''; }, 1600);
  }

  updateStats() {
    document.getElementById('level').textContent = this.level;
    document.getElementById('score').textContent = this.score;
    document.getElementById('streak').textContent = this.streak;
    document.getElementById('xp').textContent = this.xp;
    document.getElementById('max-xp').textContent = this.maxXP;

    const xpFill = document.getElementById('xp-fill');
    if (xpFill) {
      const percentage = (this.xp / this.maxXP) * 100;
      xpFill.style.width = `${percentage}%`;
    }
  }

  updateCollectionButton() {
    document.getElementById('collection-count').textContent = this.unlockedAnimals.length;
  }

  levelUp() {
    this.level++;
    this.maxXP = Math.min(100 + (this.level - 1) * 50, 500);
    this.xp = 0;
    this.updateStats();
    this.saveProfile();
    document.getElementById('new-level').textContent = this.level;
    document.getElementById('level-up-modal').style.display = 'flex';
    const modalFill = document.getElementById('modal-progress-fill');
    if (modalFill) modalFill.style.width = '100%';
  }

  getAnimalForLevel() {
    return ANIMALS[Math.floor((this.level - 1) / 5)] || null;
  }

  checkAnimalUnlock() {
    const animal = this.getAnimalForLevel();
    if (animal && !this.unlockedAnimals.includes(animal.name)) {
      this.showUnlockScreen(animal);
    } else {
      this.newTarget();
    }
  }

  showUnlockScreen(animal) {
    this.unlockedAnimals.push(animal.name);
    this.updateCollectionButton();
    this.saveProfile();
    
    const unlockScreen = document.getElementById('unlock-screen');
    const content = document.getElementById('unlock-content');
    content.innerHTML = `
      <div class="unlock-title">NEW PET UNLOCKED!</div>
      <div class="rarity-display rarity-${animal.rarity.toLowerCase()}">${animal.rarity}</div>
      <h2 style="font-size:2.5em;margin:20px 0">${animal.name}</h2>
      <div class="unlock-animal-container" id="prize-model-container">
        <model-viewer id="prize-model" src="${animal.model}" shadow-intensity="1" camera-controls auto-rotate ar style="width:100%;height:100%;--poster-color:${animal.color}" class="unlock-animal-model" alt="${animal.name}"></model-viewer>
      </div>
      <button id="continue-unlock-btn" class="unlock-btn">Add to Collection!</button>
    `;

    document.getElementById('continue-unlock-btn').addEventListener('click', () => {
      this.animatePrizeToChest();
    });
    unlockScreen.style.display = 'flex';
  }

  animatePrizeToChest() {
    const unlockScreen = document.getElementById('unlock-screen');
    const prizeModelContainer = document.getElementById('prize-model-container');
    const chest = document.getElementById('chest-container');
    const flyingContainer = document.getElementById('flying-prize-container');

    if (!prizeModelContainer || !chest || !flyingContainer) {
      unlockScreen.style.display = 'none';
      this.newTarget();
      return;
    }

    const startRect = prizeModelContainer.getBoundingClientRect();
    const endRect = chest.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.style.position = 'absolute';
    flyer.style.top = `${startRect.top}px`;
    flyer.style.left = `${startRect.left}px`;
    flyer.style.width = `${startRect.width}px`;
    flyer.style.height = `${startRect.height}px`;
    flyer.style.background = 'radial-gradient(circle, var(--primary) 0%, transparent 70%)';
    flyer.style.borderRadius = '50%';
    flyer.style.zIndex = '10001';
    flyer.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    flyer.innerHTML = `<div style="font-size: 3rem; display:flex; align-items:center; justify-content:center; height:100%;">✨</div>`;
    
    flyingContainer.appendChild(flyer);
    flyingContainer.style.display = 'block';
    unlockScreen.style.display = 'none';

    requestAnimationFrame(() => {
      flyer.style.top = `${endRect.top}px`;
      flyer.style.left = `${endRect.left}px`;
      flyer.style.width = '40px';
      flyer.style.height = '40px';
      flyer.style.opacity = '0.5';
      flyer.style.transform = 'rotate(360deg)';
    });

    setTimeout(() => {
      chest.style.transform = 'scale(1.5) rotate(15deg)';
      setTimeout(() => {
        chest.style.transform = 'scale(1) rotate(0deg)';
        const badge = document.getElementById('chest-badge');
        if (badge) {
          badge.style.display = 'block';
          badge.textContent = this.unlockedAnimals.length;
        }
      }, 200);
      flyer.remove();
      flyingContainer.style.display = 'none';
      this.newTarget();
    }, 800);
  }

  showCollectionScreen() {
    const screen = document.getElementById('animal-collection-screen');
    const content = document.getElementById('collection-content');
    
    // Hide the notification badge when looking at collection
    const badge = document.getElementById('chest-badge');
    if (badge) badge.style.display = 'none';

    content.innerHTML = `<h2 style="font-size:3em;margin-bottom:20px">Your Pets (${this.unlockedAnimals.length})</h2><div class="collection-grid" id="collection-grid"></div><button id="close-collection-btn" class="unlock-btn">Close</button>`;
    const grid = document.getElementById('collection-grid');
    ANIMALS.forEach(animal => {
      const unlocked = this.unlockedAnimals.includes(animal.name);
      const card = document.createElement('div');
      card.className = `collection-card rarity-${animal.rarity.toLowerCase()}${unlocked ? '' : ' locked'}`;
      card.innerHTML = `<div style="font-size:1.1em">${animal.rarity}</div><div class="collection-animal-container"><model-viewer src="${animal.model}" shadow-intensity="1" camera-controls auto-rotate style="width:100%;height:100%;--poster-color:${animal.color}" class="collection-animal" alt="${animal.name}"></model-viewer></div><div style="font-size:1.3em;font-weight:700">${animal.name}</div>`;
      grid.appendChild(card);
    });
    document.getElementById('close-collection-btn').addEventListener('click', () => screen.style.display = 'none');
    screen.style.display = 'flex';
  }

  reset() {
    this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 100;
    this.unlockedAnimals = [];
    this.saveProfile();
    this.updateStats(); 
    this.updateCollectionButton(); 
    this.newTarget();
  }

  setLang(lang) {
    this.isFrench = (lang === 'fr');
    document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(lang === 'fr' ? 'french-btn' : 'english-btn').classList.add('active');
    this.saveProfile();
    this.populateVoiceList();
    this.newTarget();
  }

  bindEvents() {
    // Profile Selection Events
    const createBtn = document.getElementById('create-player-btn');
    if (createBtn) createBtn.addEventListener('click', () => this.createProfile());
    
    document.getElementById('show-new-profile-btn')?.addEventListener('click', () => {
      document.getElementById('profile-select-view').style.display = 'none';
      document.getElementById('profile-create-view').style.display = 'block';
    });
    
    document.getElementById('cancel-new-profile-btn')?.addEventListener('click', () => {
      document.getElementById('profile-select-view').style.display = 'block';
      document.getElementById('profile-create-view').style.display = 'none';
    });
    
    document.getElementById('new-player-en')?.addEventListener('click', (e) => {
      e.target.classList.add('active');
      document.getElementById('new-player-fr').classList.remove('active');
    });
    
    document.getElementById('new-player-fr')?.addEventListener('click', (e) => {
      e.target.classList.add('active');
      document.getElementById('new-player-en').classList.remove('active');
    });

    // Sidebar Toggle Logic
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggle = document.getElementById('sidebar-toggle');
    const close = document.getElementById('sidebar-close');

    const openSidebar = () => { sidebar.classList.add('open'); overlay.style.display = 'block'; };
    const closeSidebar = () => { sidebar.classList.remove('open'); overlay.style.display = 'none'; };

    if (toggle) toggle.addEventListener('click', openSidebar);
    if (close) close.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // In-game Controls
    document.getElementById('new-game').addEventListener('click', () => { 
      if(confirm("Are you sure you want to reset all progress for this player?")) {
        this.reset(); closeSidebar(); 
      }
    });
    document.getElementById('flash-cards-btn').addEventListener('click', () => { this.renderCards(); closeSidebar(); });
    document.getElementById('collection-btn').addEventListener('click', () => { this.showCollectionScreen(); closeSidebar(); });
    
    document.getElementById('english-btn').addEventListener('click', () => this.setLang('en'));
    document.getElementById('french-btn').addEventListener('click', () => this.setLang('fr'));
    
    document.getElementById('speak-btn').addEventListener('click', () => this.speak());
    
    // Treasure Chest Click
    document.getElementById('chest-container')?.addEventListener('click', () => {
      this.showCollectionScreen();
    });
    
    document.getElementById('voice-select').addEventListener('change', (e) => {
      this.selectedVoiceURI = e.target.value;
      this.saveProfile();
    });
    
    document.getElementById('test-voice-btn').addEventListener('click', () => {
      this.speak(this.isFrench ? "Bonjour." : "Hello.");
    });
    
    document.getElementById('continue-btn').addEventListener('click', () => {
      document.getElementById('level-up-modal').style.display = 'none';
      this.checkAnimalUnlock();
    });
  }
}

const game = new Game();
window.addEventListener('load', () => game.start());
