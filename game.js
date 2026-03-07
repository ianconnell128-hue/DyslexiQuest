
// ─────────────────────────────────────────────────────────────────────────────
//  DyslexiQuest v2 – game.js
// ─────────────────────────────────────────────────────────────────────────────

// ── 3-D collectible characters ──────────────────────────────────────────────
// A curated set of child-friendly, high-quality 3D models with stories and powers.
const ANIMALS = [
  // COMMON (60%) - 15 entries
  { 
    name: 'Red Fox', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'A clever forest dweller who knows every secret path in the woods.',
    powers: 'Super Speed & Night Vision'
  },
  { 
    name: 'Yellow Duck', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'The bravest swimmer in the pond, always ready for a splashy adventure.',
    powers: 'Water Shield & Happy Quack'
  },
  { 
    name: 'Wild Horse', 
    model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'Galloping through the meadows, this horse dreams of reaching the mountains.',
    powers: 'Mighty Gallop & Infinite Stamina'
  },
  { 
    name: 'Paper Plane', 
    model: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'Crafted from a magical notebook, it can fly forever on a gentle breeze.',
    powers: 'Glide Glide & Wind Rider'
  },
  { 
    name: 'Toy Sedan', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'A small car with a big heart, perfect for racing across the playroom floor.',
    powers: 'Turbo Boost & Tight Turns'
  },
  { 
    name: 'Happy Avocado', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'Always smiling because it knows it’s full of healthy healthy fats!',
    powers: 'Super Nutrition & Green Glow'
  },
  { 
    name: 'Magic Cube', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'A mysterious box that hums with energy when you solve a puzzle.',
    powers: 'Mystery Gifting & Geometry Blast'
  },
  { 
    name: 'Smiley Emoji', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SmilingFace/glTF-Binary/SmilingFace.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'Spread happiness wherever it goes. It’s impossible to be sad near it.',
    powers: 'Joy Aura & Friendship Link'
  },
  { 
    name: 'Silver Fox', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'A rare winter fox whose fur sparkles like fresh snow.',
    powers: 'Ice Camouflage & Frost Breath'
  },
  { 
    name: 'Rubber Ducky', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'A champion of the bathtub, feared by bubbles everywhere.',
    powers: 'Bubble Blast & Unsinkable'
  },
  { 
    name: 'Pony', 
    model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'Small but strong, this pony loves carrying treasures through the fields.',
    powers: 'Mini-Sprint & Lucky Charm'
  },
  { 
    name: 'Toy Racer', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'Built for speed, this racer has won the Living Room Grand Prix ten times.',
    powers: 'Nitrous Kick & Drift King'
  },
  { 
    name: 'Cool Plane', 
    model: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'An expert at loop-de-loops and sky-writing your name.',
    powers: 'Sonic Boom & Sky Dive'
  },
  { 
    name: 'Giggly Avocado', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'It just heard a really good joke and can’t stop laughing.',
    powers: 'Laughter Pulse & Vitamin Boost'
  },
  { 
    name: 'Mystery Box', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', 
    color: '#94a3b8', 
    rarity: 'Common',
    story: 'No one knows what is inside, but it shakes whenever you learn a new word.',
    powers: 'Surprise Surge & Hidden Treasure'
  },

  // UNCOMMON (25%) - 12 entries
  { 
    name: 'Dune Buggy', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'A rugged vehicle built for the toughest deserts on Mars.',
    powers: 'Sand Stormer & Jump Jets'
  },
  { 
    name: 'Great White Shark', 
    model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'The king of the ocean, searching for the legendary Lost City of Atlantis.',
    powers: 'Hydro Bite & Deep Dive'
  },
  { 
    name: 'Helper Bot', 
    model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'Designed to help students, this bot can translate any language.',
    powers: 'Logic Pulse & Multi-Tool'
  },
  { 
    name: 'Little Alien', 
    model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/alien.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'A friendly visitor from the Andromeda Galaxy who loves earth candy.',
    powers: 'Gravity Hop & Star Signal'
  },
  { 
    name: 'T-Rex', 
    model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'The mightiest dinosaur, though his arms are a bit too short for high-fives.',
    powers: 'Primal Roar & Earth Quake'
  },
  { 
    name: 'Giant Fish', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'A fish so big it once swallowed a small treasure chest by accident.',
    powers: 'Mega Splash & Scaly Armor'
  },
  { 
    name: 'Off-Roader', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'Can climb mountains and cross rivers without breaking a sweat.',
    powers: 'All-Terrain Grip & Winch Pull'
  },
  { 
    name: 'Hammerhead', 
    model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'Uses its wide head like a metal detector to find hidden gold.',
    powers: 'Sonar Scan & Metal Munch'
  },
  { 
    name: 'Friendly Bot', 
    model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'Always ready with a wave and a digital smile.',
    powers: 'Data Sync & Electric Fist'
  },
  { 
    name: 'Martian', 
    model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/alien.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'He came to Earth to find the perfect pizza recipe.',
    powers: 'Telepathy & Hover Boots'
  },
  { 
    name: 'Dino King', 
    model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'Wears a crown made of fossilized leaves and ancient bones.',
    powers: 'Stomp Wave & Command Roar'
  },
  { 
    name: 'Neon Fish', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', 
    color: '#3b82f6', 
    rarity: 'Uncommon',
    story: 'Glows in the dark, lighting the way for lost submarines.',
    powers: 'Glow Flare & Speed Fin'
  },

  // RARE (10%) - 10 entries
  { 
    name: 'Star Voyager', 
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'An astronaut who has visited every planet in the solar system.',
    powers: 'Zero Gravity & Comet Dash'
  },
  { 
    name: 'Cosmic Pilot', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'A pioneer of space flight, testing the fastest rockets ever built.',
    powers: 'Light Speed & Solar Shield'
  },
  { 
    name: 'Party BoomBox', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'It only plays the most epic victory songs when you level up.',
    powers: 'Bass Blast & Dance Party'
  },
  { 
    name: 'Galaxy Ranger', 
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'Protects the galaxy from space pirates and black holes.',
    powers: 'Plasma Ray & Nebula Cloak'
  },
  { 
    name: 'Lunar Walker', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'His footprints were the first ones left on the far side of the moon.',
    powers: 'Moon Jump & Crater Slide'
  },
  { 
    name: 'Music Master', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'Can turn any sound into a beautiful symphony.',
    powers: 'Sonic Wave & Rhythm Lock'
  },
  { 
    name: 'Orbit Scout', 
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'Scouts out new planets where kids can play all day long.',
    powers: 'Planet Scan & Rocket Pack'
  },
  { 
    name: 'Jet Setter', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'Always on the move, flying from one adventure to the next.',
    powers: 'Jet Stream & High Altitude'
  },
  { 
    name: 'Beat Box', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'A boombox that can actually talk! Its voice is a heavy bass line.',
    powers: 'Sound Barrier & Echo Trap'
  },
  { 
    name: 'Star Runner', 
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    color: '#a855f7', 
    rarity: 'Rare',
    story: 'Race through the rings of Saturn for fun every weekend.',
    powers: 'Ring Dash & Astro Glide'
  },

  // EPIC (4%) - 6 entries
  { 
    name: 'Titan Helmet', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', 
    color: '#f97316', 
    rarity: 'Epic',
    story: 'Worn by the defender of the Floating Cities in the clouds.',
    powers: 'Titan Strength & Sky Strike'
  },
  { 
    name: 'Turbo Buggy', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', 
    color: '#f97316', 
    rarity: 'Epic',
    story: 'Equipped with an experimental engine fueled by pure joy.',
    powers: 'Warp Speed & Mega Jump'
  },
  { 
    name: 'Super Robot', 
    model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', 
    color: '#f97316', 
    rarity: 'Epic',
    story: 'The ultimate guardian of the DyslexiQuest Academy.',
    powers: 'Laser Eyes & Flight Mode'
  },
  { 
    name: 'Iron Helmet', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', 
    color: '#f97316', 
    rarity: 'Epic',
    story: 'Found in an ancient ruin, it still glows with a mysterious orange light.',
    powers: 'Iron Defense & Light Burst'
  },
  { 
    name: 'Racer Buggy', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', 
    color: '#f97316', 
    rarity: 'Epic',
    story: 'Specially modified to drive on vertical walls and even ceilings.',
    powers: 'Wall Climb & Tire Grip'
  },
  { 
    name: 'Ultra Bot', 
    model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', 
    color: '#f97316', 
    rarity: 'Epic',
    story: 'The most advanced robot ever built, with 1,000 different gadgets.',
    powers: 'Gadget Storm & AI Overdrive'
  },

  // LEGENDARY (0.9%) - 4 entries
  { 
    name: 'Neil Armstrong', 
    model: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', 
    color: '#eab308', 
    rarity: 'Legendary',
    story: 'A true hero of humanity, the first person to walk on another world.',
    powers: 'Legacy of Discovery & Star Navigation'
  },
  { 
    name: 'Ancient Dragon', 
    model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', 
    color: '#eab308', 
    rarity: 'Legendary',
    story: 'Woken from a thousand-year sleep by the sound of learning.',
    powers: 'Fire Storm & Ancient Wisdom'
  },
  { 
    name: 'Gold Fox', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', 
    color: '#eab308', 
    rarity: 'Legendary',
    story: 'A fox made of pure solid gold, said to bring infinite luck.',
    powers: 'Golden Touch & Fortune Gaze'
  },
  { 
    name: 'Fire Dragon', 
    model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', 
    color: '#eab308', 
    rarity: 'Legendary',
    story: 'This dragon’s breath can light up the entire night sky.',
    powers: 'Inferno Blast & Magma Wing'
  },

  // MYTHIC (0.1%) - 3 entries
  { 
    name: 'Alpha Astronaut', 
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 
    color: '#ef4444', 
    rarity: 'Mythic',
    story: 'The legendary first explorer of the Multiverse.',
    powers: 'Dimension Shift & Reality Warp'
  },
  { 
    name: 'Deep Space Shark', 
    model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', 
    color: '#ef4444', 
    rarity: 'Mythic',
    story: 'A shark that swims through the stars as if they were water.',
    powers: 'Black Hole Gulp & Nebula Swim'
  },
  { 
    name: 'Cyber Dino', 
    model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', 
    color: '#ef4444', 
    rarity: 'Mythic',
    story: 'A prehistoric T-Rex upgraded with futuristic cyber-armor.',
    powers: 'Cyber Roar & Digital Stomp'
  }
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
    if (this.level > 1) { 
      const animal = this.getAnimalForLevel(); 
      if (animal) this.startCatchingSequence(animal); 
      else this.newTarget(); 
    }
    else this.newTarget();
  }

  startCatchingSequence(animal) {
    this.playSFX('levelUp');
    const screen = document.getElementById('catching-screen');
    const model = document.getElementById('catch-model');
    const challengeArea = document.getElementById('catch-challenge-area');
    const actionArea = document.getElementById('capture-action-area');
    
    model.src = animal.model;
    challengeArea.style.display = 'block';
    actionArea.style.display = 'none';
    screen.style.display = 'flex';

    this.renderCatchingChallenge(animal);
  }

  renderCatchingChallenge(animal) {
    const pool = this.buildPool();
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = pool.filter(w => w.word !== target.word).slice(0, 3);
    let cards = [target, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }

    const prompt = document.getElementById('catch-word-prompt');
    const area = document.getElementById('catch-game-area');
    area.innerHTML = '';
    prompt.textContent = "Listen and Find!";
    
    setTimeout(() => this.speak(target.word), 500);

    cards.forEach(wordData => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `${getWordShapeHTML(wordData.word)}<div class="card-word">${wordData.word}</div>`;
      card.addEventListener('click', () => {
        if (wordData.word === target.word) {
          this.playSFX('correct');
          document.getElementById('catch-challenge-area').style.display = 'none';
          document.getElementById('capture-action-area').style.display = 'block';
          document.getElementById('shoot-power-btn').onclick = () => this.fireCapturePower(animal);
        } else {
          this.playSFX('wrong');
          card.style.opacity = '0.3';
          this.speak(target.word);
        }
      });
      area.appendChild(card);
    });
  }

  fireCapturePower(animal) {
    this.playSFX('click');
    const btn = document.getElementById('shoot-power-btn');
    btn.disabled = true;
    btn.style.opacity = '0.5';

    const modelRect = document.getElementById('catch-model').getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight - 50;

    // Create blue power projectile
    const power = document.createElement('div');
    power.className = 'blue-power';
    power.style.left = `${startX}px`;
    power.style.top = `${startY}px`;
    document.body.appendChild(power);

    // Animate to model
    requestAnimationFrame(() => {
      power.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      power.style.left = `${modelRect.left + modelRect.width / 2}px`;
      power.style.top = `${modelRect.top + modelRect.height / 2}px`;
      power.style.transform = 'scale(2)';
    });

    setTimeout(() => {
      power.remove();
      this.condenseToSpikyBall(animal, modelRect);
    }, 600);
  }

  condenseToSpikyBall(animal, rect) {
    // Hide model
    document.getElementById('catch-model').style.opacity = '0';
    
    // Create spiky ball
    const ball = document.createElement('div');
    ball.className = 'spiky-ball';
    ball.style.background = animal.color;
    ball.style.color = animal.color; // For spikes
    ball.style.left = `${rect.left + rect.width / 2 - 40}px`;
    ball.style.top = `${rect.top + rect.height / 2 - 40}px`;
    ball.style.transform = 'scale(0)';
    
    // Add spikes
    for (let i = 0; i < 12; i++) {
      const spike = document.createElement('div');
      spike.className = 'spike';
      spike.style.transform = `rotate(${i * 30}deg)`;
      ball.appendChild(spike);
    }
    
    document.body.appendChild(ball);

    // Animate ball appearing
    requestAnimationFrame(() => {
      ball.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      ball.style.transform = 'scale(1)';
    });

    setTimeout(() => {
      this.animateBallToChest(ball, animal);
    }, 1000);
  }

  animateBallToChest(ball, animal) {
    const endRect = document.getElementById('chest-container').getBoundingClientRect();
    
    ball.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    ball.style.left = `${endRect.left}px`;
    ball.style.top = `${endRect.top}px`;
    ball.style.transform = 'scale(0.3) rotate(360deg)';
    ball.style.opacity = '0.5';

    setTimeout(() => {
      ball.remove();
      document.getElementById('catching-screen').style.display = 'none';
      document.getElementById('catch-model').style.opacity = '1';
      
      // Finalize unlock
      const usedNames = this.unlockedAnimals.map(u => u.petName), availableNames = PET_NAMES.filter(n => !usedNames.includes(n));
      const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${animal.name} #${this.unlockedAnimals.length + 1}`;
      this.unlockedAnimals.push({ animalName: animal.name, petName: petName, level: this.level });
      this.updateCollectionButton(); this.saveProfile();
      
      // Visual feedback on chest
      document.getElementById('chest-container').style.transform = 'scale(1.5) rotate(15deg)';
      setTimeout(() => { 
        document.getElementById('chest-container').style.transform = 'scale(1) rotate(0deg)'; 
        const badge = document.getElementById('chest-badge'); 
        if (badge) { badge.style.display = 'block'; badge.textContent = this.unlockedAnimals.length; } 
      }, 200);
      
      this.newTarget();
    }, 800);
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
    if (!confirm(`Trade 3 of your ${fromRarity} treasures for 1 random ${toRarity} treasure?`)) return;
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
    this.startCatchingSequence(animal);
  }

  showCollectionScreen() {
    this.playSFX('click');
    const badge = document.getElementById('chest-badge'); if (badge) badge.style.display = 'none';
    const content = document.getElementById('collection-content');
    content.innerHTML = `<h2 style="font-size:3em;margin-bottom:20px; font-family:'Outfit'; color:var(--primary);">Your Treasures</h2><div id="collection-list" style="text-align:left; display:flex; flex-direction:column; gap:20px; margin-bottom:30px; max-height:60vh; overflow-y:auto; padding-right:10px;"></div><button id="close-collection-btn" class="primary" style="border-radius:20px; padding:15px 40px; width:auto; margin:0 auto;">Close Treasures</button>`;
    const list = document.getElementById('collection-list');

    if (this.unlockedAnimals.length === 0) {
      list.innerHTML = `<p style="text-align:center; color:var(--text-light); margin-top: 20px;">Keep playing to unlock your first treasure!</p>`;
    } else {
      // Group by rarity
      const grouped = {};
      RARITY_ORDER.forEach(r => grouped[r] = []);
      
      this.unlockedAnimals.forEach(ua => {
        const animalData = ANIMALS.find(a => a.name === ua.animalName);
        if (animalData) grouped[animalData.rarity].push({ ua, data: animalData });
      });

      // Render each rarity section
      RARITY_ORDER.forEach(rarity => {
        const items = grouped[rarity];
        if (items.length === 0) return;

        const section = document.createElement('div');
        section.innerHTML = `<h4 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; color: var(--text-light); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">${rarity} (${items.length})</h4>`;
        
        const grid = document.createElement('div');
        grid.className = 'collection-grid';
        
        items.reverse().forEach(item => {
          const card = document.createElement('div');
          card.className = 'collection-card';
          card.style.cursor = 'pointer';
          card.innerHTML = `
            <div class="rarity-display rarity-${item.data.rarity.toLowerCase()}" style="margin-bottom:5px;">${item.data.rarity}</div>
            <div style="font-weight:800; color:var(--primary); font-size:1.1rem;">${item.ua.petName}</div>
            <div class="collection-animal-container" style="height:120px; width:100%;">
              <model-viewer src="${item.data.model}" shadow-intensity="1" camera-controls auto-rotate style="width:100%; height:100%; --poster-color:#ffffff"></model-viewer>
            </div>
            <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:var(--text-light);">${item.data.name}</div>
            <div style="font-size:0.7rem; font-weight:800; background:#f1f5f9; padding:4px 10px; border-radius:10px; margin-top:5px;">LVL ${item.ua.level}</div>
          `;
          card.addEventListener('click', () => this.showTreasureDetail(item.ua));
          grid.appendChild(card);
        });
        
        section.appendChild(grid);
        list.appendChild(section);
      });
    }

    document.getElementById('close-collection-btn').addEventListener('click', () => { this.playSFX('click'); document.getElementById('animal-collection-screen').style.display = 'none'; });
    document.getElementById('animal-collection-screen').style.display = 'flex';
  }

  showTreasureDetail(userAnimal) {
    this.playSFX('click');
    const animalData = ANIMALS.find(a => a.name === userAnimal.animalName);
    if (!animalData) return;

    const modal = document.getElementById('treasure-detail-screen');
    document.getElementById('detail-rarity').textContent = animalData.rarity;
    document.getElementById('detail-rarity').className = `rarity-display rarity-${animalData.rarity.toLowerCase()}`;
    document.getElementById('detail-pet-name').textContent = userAnimal.petName;
    document.getElementById('detail-animal-name').textContent = `The ${animalData.name}`;
    document.getElementById('detail-model').src = animalData.model;
    document.getElementById('detail-story').textContent = animalData.story || "A mysterious treasure from a distant land.";
    document.getElementById('detail-powers').textContent = animalData.powers || "Unknown magic properties.";

    document.getElementById('close-detail-btn').onclick = () => { this.playSFX('click'); modal.style.display = 'none'; };
    modal.style.display = 'flex';
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
