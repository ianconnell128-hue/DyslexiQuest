//  DyslexiQuest v7.6 – game.js
// ─────────────────────────────────────────────────────────────────────────────
// Core Game Logic, Social Cloud Engine, and 3D OpenGL Arena
// ─────────────────────────────────────────────────────────────────────────────

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
const SELL_PRICES = { Common: 50, Uncommon: 100, Rare: 250, Epic: 500, Legendary: 1200, Mythic: 3000 };
const RARITY_STATS = {
  'Common': { hp: 100, dmg: 1.0 },
  'Uncommon': { hp: 130, dmg: 1.3 },
  'Rare': { hp: 170, dmg: 1.7 },
  'Epic': { hp: 220, dmg: 2.2 },
  'Legendary': { hp: 300, dmg: 3.0 },
  'Mythic': { hp: 450, dmg: 4.5 }
};

const MODELS = {
  cesium: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
  michelle: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Michelle.glb',
  figure: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb',
  astro: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  fox: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
  robot: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb'
};

const GEAR_SHOP = [
  { id: 'hat_1', name: 'Scout Outfit', cat: 'Hats', model: MODELS.cesium, price: 25, icon: '🧢' },
  { id: 'hat_2', name: 'Pink Ribbon Suit', cat: 'Hats', model: MODELS.michelle, price: 20, icon: '🎀' },
  { id: 'hat_3', name: 'Astro Suit', cat: 'Hats', model: MODELS.astro, price: 45, icon: '🥽' },
  { id: 'hat_4', name: 'Soldier Gear', cat: 'Hats', model: MODELS.cesium, price: 30, icon: '🪖' },
  { id: 'hat_5', name: 'Explorer Gear', cat: 'Hats', model: MODELS.cesium, price: 35, icon: '🤠' },
  { id: 'hat_6', name: 'Hero Figure', cat: 'Hats', model: MODELS.figure, price: 40, icon: '👲' },
  { id: 'hat_7', name: 'Royal Suit', cat: 'Hats', model: MODELS.michelle, price: 150, icon: '👑' },
  { id: 'hat_8', name: 'Warrior Gear', cat: 'Hats', model: MODELS.cesium, price: 85, icon: '🪖' },
  { id: 'hat_9', name: 'Space Helmet', cat: 'Hats', model: MODELS.astro, price: 120, icon: '🧑‍🚀' },
  { id: 'hat_10', name: 'Cesium Suit', cat: 'Hats', model: MODELS.cesium, price: 95, icon: '🎩' },
  { id: 'hat_11', name: 'Action Figure', cat: 'Hats', model: MODELS.figure, price: 65, icon: '🤠' },
  { id: 'hat_12', name: 'Noble Outfit', cat: 'Hats', model: MODELS.michelle, price: 110, icon: '💎' },
  { id: 'hat_13', name: 'Combat Suit', cat: 'Hats', model: MODELS.cesium, price: 55, icon: '🕵️' },
  { id: 'hat_14', name: 'Winter Suit', cat: 'Hats', model: MODELS.cesium, price: 25, icon: '🧣' },
  { id: 'hat_15', name: 'Pilot Gear', cat: 'Hats', model: MODELS.astro, price: 130, icon: '🛩️' },
  { id: 'shirt_1', name: 'Soldier Tunic', cat: 'Shirts', model: MODELS.cesium, price: 40, icon: '🥋' },
  { id: 'shirt_2', name: 'Cesium Top', cat: 'Shirts', model: MODELS.cesium, price: 55, icon: '👕' },
  { id: 'set_0m', name: 'Base Boy', cat: 'Sets', model: MODELS.cesium, price: 0, icon: '🧍‍♂️' },
  { id: 'set_0f', name: 'Base Girl', cat: 'Sets', model: MODELS.michelle, price: 0, icon: '🧍‍♀️' }
];

const ANIMALS = [
  { name: 'Swift Fox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'A clever forest friend.', powers: 'Speed', bg: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)' },
  { name: 'Puddle Duck', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common', story: 'The bravest swimmer.', powers: 'Dash', bg: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)' },
  { name: 'Gallopy Horse', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#94a3b8', rarity: 'Common', story: 'Fast and free.', powers: 'Stomp', bg: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)' },
  { name: 'Cloud Eagle', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'A celestial bird.', powers: 'Wind', bg: 'linear-gradient(135deg, #e0e7ff 0%, #6366f1 100%)' },
  { name: 'Chompy Shark', env: 'water', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'King of the reefs.', powers: 'Bite', bg: 'linear-gradient(135deg, #bae6fd 0%, #0284c7 100%)' },
  { name: 'Stone Golem', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Ancient boulders.', powers: 'Earthquake', bg: 'linear-gradient(135deg, #f8fafc 0%, #334155 100%)' },
  { name: 'Tiny T-Rex', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Mighty body.', powers: 'Shockwave', bg: 'linear-gradient(135deg, #fef2f2 0%, #b91c1c 100%)' },
  { name: 'Cyber Dino', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#ef4444', rarity: 'Mythic', story: 'Unstoppable beast.', powers: 'Shockwave', bg: 'linear-gradient(135deg, #111827 0%, #10b981 100%)' }
];

const AVATAR_MODELS = { male: MODELS.cesium, female: MODELS.michelle };
const COLORS = { skin: ['#fde68a', '#fbbf24', '#d97706'], hair: ['#451a03', '#92400e', '#3b82f6'], eye: ['#1e293b', '#3b82f6'] };
const PET_NAMES = ["Buddy", "Rex", "Luna", "Ace", "Bolt", "Coco", "Nova"];
const SONGS = { 1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' };

class Game {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    this.currentUser = null; this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 5;
    this.isFrench = false; this.isTalkMode = false; this.canClick = true; this.wordBank = { en: {}, fr: {} };
    this.currentPool = []; this.unlockedAnimals = []; this.equippedPets = []; this.notifications = []; this.friends = [];
    this.avatarModel = AVATAR_MODELS.male; this.coins = 0; this.unlockedAvatars = ['set_0m', 'set_0f'];
    this.avatarColors = { skin: COLORS.skin[0], hair: COLORS.hair[0], eye: COLORS.eye[0] };
    this.activeQuests = []; this.currentSong = 1; this.musicEnabled = true; this.networkId = 'local';
    this.bgm = new Audio(SONGS[1]); this.bgm.loop = true;
    this.sounds = {
      correct: new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'),
      wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
      levelUp: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
      click: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
    };
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      this.recognition = new SR(); this.recognition.continuous = false; this.recognition.interimResults = true;
      this.recognition.onstart = () => { this.isListening = true; document.getElementById('mic-btn')?.classList.add('mic-listening'); };
      this.recognition.onresult = (e) => { let t = ''; for (let i = e.resultIndex; i < e.results.length; ++i) if (e.results[i].isFinal) t += e.results[i][0].transcript; if (t) this.handleSpeechResult(t.toLowerCase().trim()); };
      this.recognition.onerror = () => { this.isListening = false; document.getElementById('mic-btn')?.classList.remove('mic-listening'); };
      this.recognition.onend = () => { this.isListening = false; document.getElementById('mic-btn')?.classList.remove('mic-listening'); };
    }
  }

  async start() { this.bindEvents(); await this.loadWordFiles(); this.hideLoading(); this.showProfileSelect(); }
  playSFX(n) { if (this.sounds[n]) { this.sounds[n].currentTime = 0; this.sounds[n].play().catch(() => {}); } }
  hideLoading() { const el = document.getElementById('loading-overlay'); if (el) el.style.display = 'none'; }

  async loadWordFiles() {
    const load = async (p, l) => {
      try {
        const r = await fetch(p); const t = await r.text();
        const chunks = t.split(/(?:Niveau|Level)\s+(\d+)/i);
        for (let i = 1; i < chunks.length; i += 2) {
          const lv = parseInt(chunks[i]), words = chunks[i+1].match(/[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'\-]{1,}/g) || [];
          if (words.length > 0) this.wordBank[l][lv] = words.map(w => ({ word: w.toLowerCase() }));
        }
      } catch (e) { this.wordBank[l][1] = [{word:'cat'},{word:'dog'}]; }
    };
    await Promise.all([load('french_school_words_1-9.md', 'fr'), load('english_school_words_1-9.md', 'en')]);
  }

  showProfileSelect() {
    const overlay = document.getElementById('start-overlay'); if (overlay) overlay.style.display = 'flex';
    const list = document.getElementById('profile-list'); if (list) list.innerHTML = '';
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    Object.keys(this.users).forEach(id => {
      const u = this.users[id], btn = document.createElement('button');
      btn.className = 'profile-btn'; btn.innerHTML = `<b>${u.name}</b> (Lvl ${u.level || 1})`;
      btn.onclick = () => this.loadProfile(id); if (list) list.appendChild(btn);
    });
    const sv = document.getElementById('profile-select-view'); if (sv) sv.style.display = 'block';
    const cv = document.getElementById('profile-create-view'); if (cv) cv.style.display = Object.keys(this.users).length ? 'none' : 'block';
  }

  loadProfile(id) {
    const u = this.users[id]; this.currentUser = id; this.level = u.level || 1; this.score = u.score || 0; this.xp = u.xp || 0;
    this.unlockedAnimals = u.unlockedAnimals || []; this.equippedPets = u.equippedPets || []; this.coins = u.coins || 0;
    this.avatarModel = u.avatarModel || AVATAR_MODELS.male; this.startGameplay();
  }

  createProfile() {
    const name = document.getElementById('new-player-name').value.trim(); if (!name) return;
    const id = Date.now().toString();
    this.users[id] = { name, level: 1, xp: 0, coins: 0, unlockedAnimals: [], equippedPets: [], avatarModel: this.avatarModel };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users)); this.loadProfile(id);
  }

  saveProfile() {
    if (!this.currentUser) return;
    const u = this.users[this.currentUser];
    u.level = this.level; u.xp = this.xp; u.coins = this.coins; u.unlockedAnimals = this.unlockedAnimals; u.equippedPets = this.equippedPets; u.avatarModel = this.avatarModel;
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    this.syncWithCloud(this.currentUser, u);
  }

  async syncWithCloud(id, data) {
    try { await fetch('https://api.restful-api.dev/objects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `dq_v7_profile_${id}`, data: { ...data, networkId: this.networkId, lastSeen: Date.now() } }) }); }
    catch(e) {}
  }

  async searchAndPlayYouTube() {
    const q = document.getElementById('yt-search-input').value.trim(); if (!q) return;
    const c = document.getElementById('yt-player-container');
    let url = q.includes('v=') ? `https://www.youtube.com/embed/${q.split('v=')[1].split('&')[0]}?autoplay=1` : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(q)}&autoplay=1`;
    this.setMusic(false); c.innerHTML = `<iframe width="1" height="1" src="${url}" frameborder="0" allow="autoplay"></iframe>`;
    alert(`Playing: ${q} 🎵`);
  }

  async startGameplay() {
    document.getElementById('start-overlay').style.display = 'none'; this.updateStats(); this.updateCollectionButton();
    try { const r = await fetch('https://api.ipify.org?format=json'), d = await r.json(); this.networkId = d.ip; } catch(e) { this.networkId = 'local'; }
    this.newTarget();
  }

  updateStats() {
    const levelEl = document.getElementById('level'); if (levelEl) levelEl.textContent = this.level;
    const coinsEl = document.getElementById('coins'); if (coinsEl) coinsEl.textContent = this.coins;
    const xpFill = document.getElementById('hud-xp-fill');
    if (xpFill) { const p = (this.xp / (5 + (this.level-1)*5)) * 100; xpFill.style.width = `${p}%`; }
  }

  updateCollectionButton() { const el = document.getElementById('collection-count'); if (el) el.textContent = this.unlockedAnimals.length; }

  newTarget() {
    const bank = this.wordBank[this.isFrench ? 'fr' : 'en'][this.level] || [{word:'cat'}];
    this.targetWord = bank[Math.floor(Math.random() * bank.length)]; this.renderCards(); this.speak();
  }

  renderCards() {
    const area = document.getElementById('game-area'); if (!area) return; area.innerHTML = '';
    const pool = this.wordBank[this.isFrench ? 'fr' : 'en'][this.level] || [{word:'cat'}];
    const cards = [this.targetWord, ...pool.filter(w => w.word !== this.targetWord.word).slice(0, 3)];
    cards.sort(() => Math.random() - 0.5).forEach(w => {
      const c = document.createElement('div'); c.className = 'card'; c.innerHTML = `<div class="card-word ruled">${w.word}</div>`;
      c.onclick = () => { if (w.word === this.targetWord.word) { this.playSFX('correct'); this.xp += 2; if (this.xp >= 5 + (this.level-1)*5) { this.level++; this.xp = 0; this.playSFX('levelUp'); } this.saveProfile(); this.updateStats(); this.newTarget(); } else { this.playSFX('wrong'); c.style.opacity = '0.3'; } };
      area.appendChild(c);
    });
  }

  speak() { if (this.targetWord) { const m = new SpeechSynthesisUtterance(this.targetWord.word); m.lang = this.isFrench ? 'fr-FR' : 'en-US'; window.speechSynthesis.speak(m); } }
  setMusic(e) { this.musicEnabled = e; if (e) this.bgm.play().catch(() => {}); else this.bgm.pause(); }

  startBattleSequence(mode = 'pet') {
    this.playSFX('levelUp');
    const first = ["Explorer", "Ranger", "Hunter", "Trainer"], last = ["Sam", "Luna", "Alex", "Mia"];
    const npc = `${first[Math.floor(Math.random()*4)]} ${last[Math.floor(Math.random()*4)]}`;
    const pPet = this.equippedPets[0] || (this.unlockedAnimals.length ? this.unlockedAnimals[0] : { animalName: 'Swift Fox', petName: 'Hero' });
    const pData = ANIMALS.find(a => a.name === pPet.animalName) || ANIMALS[0];
    const eData = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    this.battleState = { playerHp: 100, enemyHp: 100, playerPet: { ...pData, name: pPet.petName }, enemyPet: { ...eData, name: npc }, lives: 3 };
    this.initBattle3DScene(pData.env); document.getElementById('battle-screen').style.display = 'flex';
    document.getElementById('battle-player-pet').src = pData.model; document.getElementById('battle-enemy-pet').src = eData.model;
    document.getElementById('battle-player-name').textContent = pPet.petName; document.getElementById('battle-enemy-name').textContent = npc;
    document.getElementById('battle-player-hp').style.width = '100%'; document.getElementById('battle-enemy-hp').style.width = '100%';
    this.renderBattleChallenge();
  }

  initBattle3DScene(env) {
    const c = document.getElementById('battle-canvas-container'); if (!c) return; c.innerHTML = '';
    const scene = new THREE.Scene(); scene.background = new THREE.Color(env === 'space' ? 0x1e1b4b : 0xbae6fd);
    const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); cam.position.set(0, 10, 30); cam.lookAt(0, 5, 0);
    const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true }); ren.setSize(window.innerWidth, window.innerHeight); c.appendChild(ren.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const ground = new THREE.Mesh(new THREE.CylinderGeometry(15, 16, 2, 32), new THREE.MeshLambertMaterial({ color: 0x16a34a })); ground.position.y = -1; scene.add(ground);
    const animate = () => { if (document.getElementById('battle-screen').style.display === 'none') return; requestAnimationFrame(animate); scene.rotation.y += 0.002; ren.render(scene, cam); }; animate();
  }

  renderBattleChallenge() {
    const area = document.getElementById('battle-game-area'); if (!area) return; area.innerHTML = '';
    const words = (this.wordBank['en'][1] || [{word:'cat'}]).slice(0, 4);
    words.forEach(w => {
      const c = document.createElement('div'); c.className = 'card'; c.style.width='60px'; c.style.height='80px'; c.innerHTML = `<div class="card-word" style="font-size:0.5rem">${w.word.toUpperCase()}</div>`;
      c.onclick = () => this.fireBattleAttack(); area.appendChild(c);
    });
  }

  fireBattleAttack() {
    const pp = document.getElementById('battle-player-pet'), ep = document.getElementById('battle-enemy-pet'), bs = document.getElementById('battle-screen');
    const pwr = this.battleState.playerPet.powers;
    if (pwr === 'Shockwave' || pwr === 'Stomp' || this.battleState.playerPet.animalName.includes('T-Rex')) {
      pp.classList.add('anim-stomp');
      setTimeout(() => {
        pp.classList.remove('anim-stomp'); bs.classList.add('anim-shake-screen');
        const sw = document.createElement('div'); sw.className = 'shockwave-effect'; const r = pp.getBoundingClientRect(); sw.style.left = `${r.left}px`; sw.style.top = `${r.bottom - 50}px`; bs.appendChild(sw);
        setTimeout(() => { bs.classList.remove('anim-shake-screen'); sw.remove(); this.applyBattleDamage(); }, 600);
      }, 400);
    } else { this.applyBattleDamage(); }
  }

  applyBattleDamage() {
    const ep = document.getElementById('battle-enemy-pet');
    this.battleState.enemyHp -= 30; document.getElementById('battle-enemy-hp').style.width = `${Math.max(0, this.battleState.enemyHp)}%`;
    if (this.battleState.enemyHp <= 0) { ep.classList.add('anim-knocked'); setTimeout(() => { alert("Victory!"); document.getElementById('battle-screen').style.display = 'none'; this.newTarget(); }, 1000); }
    else { setTimeout(() => this.renderBattleChallenge(), 1000); }
  }

  bindEvents() {
    document.getElementById('yt-search-btn')?.addEventListener('click', () => this.searchAndPlayYouTube());
    document.getElementById('yt-search-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.searchAndPlayYouTube(); });
    document.getElementById('battle-btn')?.addEventListener('click', () => this.startBattleSequence());
    document.getElementById('close-battle-btn')?.addEventListener('click', () => { document.getElementById('battle-screen').style.display = 'none'; });
    document.getElementById('show-new-profile-btn')?.addEventListener('click', () => { document.getElementById('profile-create-view').style.display = 'block'; });
    document.getElementById('create-player-btn')?.addEventListener('click', () => this.createProfile());
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebar-overlay').style.display = 'block'; });
    document.getElementById('sidebar-close')?.addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').style.display = 'none'; });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').style.display = 'none'; });
  }
}

const game = new Game(); window.addEventListener('load', () => game.start());
