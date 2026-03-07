
// ─────────────────────────────────────────────────────────────────────────────
//  DyslexiQuest v5.9 – game.js
// ─────────────────────────────────────────────────────────────────────────────

const QUEST_TEMPLATES = [
  { id: 'correct_words', text: 'Master {target} words', targets: [10, 20, 30], reward: 200 },
  { id: 'level_up', text: 'Level up {target} time', targets: [1], reward: 300 },
  { id: 'use_talk', text: 'Use Talk Mode {target} times', targets: [5, 10], reward: 150 },
  { id: 'streak', text: 'Get a streak of {target}', targets: [5, 10], reward: 250 }
];

const BGM_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// ── 3-D collectible characters ──────────────────────────────────────────────
const ANIMALS = [
  { name: 'Red Fox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'A clever forest dweller.', powers: 'Speed' },
  { name: 'Yellow Duck', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common', story: 'Bravest swimmer.', powers: 'Water Shield' },
  { name: 'Wild Horse', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#94a3b8', rarity: 'Common', story: 'Fast and free.', powers: 'Gallop' },
  { name: 'Paper Plane', env: 'space', model: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb', color: '#94a3b8', rarity: 'Common', story: 'Magical paper.', powers: 'Glide' },
  { name: 'Toy Sedan', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', color: '#94a3b8', rarity: 'Common', story: 'Small heart.', powers: 'Turbo' },
  { name: 'Happy Avocado', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', color: '#94a3b8', rarity: 'Common', story: 'Healthy fats!', powers: 'Glow' },
  { name: 'Magic Cube', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', color: '#94a3b8', rarity: 'Common', story: 'Mysterious.', powers: 'Blast' },
  { name: 'Smiley Emoji', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SmilingFace/glTF-Binary/SmilingFace.glb', color: '#94a3b8', rarity: 'Common', story: 'Spreads joy.', powers: 'Friendship' },
  { name: 'Silver Fox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'Sparkly fur.', powers: 'Frost' },
  { name: 'Rubber Ducky', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common', story: 'Bubble king.', powers: 'Splash' },
  { name: 'Pony', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#94a3b8', rarity: 'Common', story: 'Strong carrying.', powers: 'Luck' },
  { name: 'Toy Racer', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb', color: '#94a3b8', rarity: 'Common', story: 'Living room star.', powers: 'Drift' },
  { name: 'Cool Plane', env: 'space', model: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb', color: '#94a3b8', rarity: 'Common', story: 'Expert acrobat.', powers: 'Sonic' },
  { name: 'Giggly Avocado', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb', color: '#94a3b8', rarity: 'Common', story: 'Heard a joke.', powers: 'Laughter' },
  { name: 'Mystery Box', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', color: '#94a3b8', rarity: 'Common', story: 'Hidden treasure.', powers: 'Surprise' },
  { name: 'Dune Buggy', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Mars explorer.', powers: 'Jets' },
  { name: 'Great Shark', env: 'water', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Ocean king.', powers: 'Bite' },
  { name: 'Helper Bot', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Logic expert.', powers: 'Data' },
  { name: 'Little Alien', env: 'space', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/alien.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Visitor.', powers: 'Gravity' },
  { name: 'T-Rex', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Mighty dino.', powers: 'Roar' },
  { name: 'Giant Fish', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Mega splash.', powers: 'Armor' },
  { name: 'Off-Roader', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Mountain climber.', powers: 'Grip' },
  { name: 'Hammerhead', env: 'water', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Metal hunter.', powers: 'Sonar' },
  { name: 'Friendly Bot', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Waving hello.', powers: 'Electric' },
  { name: 'Martian', env: 'space', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/alien.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Pizza lover.', powers: 'Hover' },
  { name: 'Dino King', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Crown wearer.', powers: 'Wave' },
  { name: 'Neon Fish', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'Sub detector.', powers: 'Glow' },
  { name: 'Star Voyager', env: 'space', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare', story: 'Planet hopper.', powers: 'Comet' },
  { name: 'Cosmic Pilot', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', color: '#a855f7', rarity: 'Rare', story: 'Speed king.', powers: 'Solar' },
  { name: 'Party BoomBox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#a855f7', rarity: 'Rare', story: 'Victory song.', powers: 'Bass' },
  { name: 'Galaxy Ranger', env: 'space', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare', story: 'Nebula protector.', powers: 'Ray' },
  { name: 'Lunar Walker', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', color: '#a855f7', rarity: 'Rare', story: 'Moon jumps.', powers: 'Crater' },
  { name: 'Music Master', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#a855f7', rarity: 'Rare', story: 'Symphony man.', powers: 'Sonic' },
  { name: 'Orbit Scout', env: 'space', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare', story: 'Scouts play.', powers: 'Rocket' },
  { name: 'Jet Setter', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb', color: '#a855f7', rarity: 'Rare', story: 'High flight.', powers: 'Jet' },
  { name: 'Beat Box', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', color: '#a855f7', rarity: 'Rare', story: 'Talking box.', powers: 'Echo' },
  { name: 'Star Runner', env: 'space', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#a855f7', rarity: 'Rare', story: 'Saturn racing.', powers: 'Ring' },
  { name: 'Titan Helmet', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#f97316', rarity: 'Epic', story: 'Defender.', powers: 'Strength' },
  { name: 'Turbo Buggy', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb', color: '#f97316', rarity: 'Epic', story: 'Warp engine.', powers: 'Jump' },
  { name: 'Super Robot', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#f97316', rarity: 'Epic', story: 'Guardian.', powers: 'Laser' },
  { name: 'Iron Helmet', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', color: '#f97316', rarity: 'Epic', story: 'Ancient.', powers: 'Light' },
  { name: 'Racer Buggy', env: 'land', model: 'https://raw.githubusercontent.com/Buggy/glTF-Binary/Buggy.glb', color: '#f97316', rarity: 'Epic', story: 'Wall climber.', powers: 'Tire' },
  { name: 'Ultra Bot', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#f97316', rarity: 'Epic', story: 'Advanced.', powers: 'AI' },
  { name: 'Neil Armstrong', env: 'space', model: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', color: '#eab308', rarity: 'Legendary', story: 'True hero.', powers: 'History' },
  { name: 'Ancient Dragon', env: 'land', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#eab308', rarity: 'Legendary', story: 'Ancient wisdom.', powers: 'Fire' },
  { name: 'Gold Fox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#eab308', rarity: 'Legendary', story: 'Pure luck.', powers: 'Touch' },
  { name: 'Fire Dragon', env: 'land', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#eab308', rarity: 'Legendary', story: 'Light sky.', powers: 'Inferno' },
  { name: 'Alpha Astronaut', env: 'space', model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', color: '#ef4444', rarity: 'Mythic', story: 'Multiverse hero.', powers: 'Reality' },
  { name: 'Space Shark', env: 'space', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#ef4444', rarity: 'Mythic', story: 'Star swimmer.', powers: 'Gulp' },
  { name: 'Cyber Dino', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#ef4444', rarity: 'Mythic', story: 'Future beast.', powers: 'Cyber' }
];

const RARITY_WEIGHTS = { 'Common': 60, 'Uncommon': 25, 'Rare': 10, 'Epic': 4, 'Legendary': 0.9, 'Mythic': 0.1 };
const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
// TREASURE SELL PRICES ($ - Realistic scale)
const SELL_PRICES = { 'Common': 50, 'Uncommon': 100, 'Rare': 250, 'Epic': 500, 'Legendary': 1000, 'Mythic': 2500 };

const MODELS = {
  soldier: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Soldier.glb',
  michelle: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Michelle.glb',
  cesium: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
  figure: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb',
  astro: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  fox: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
  robot: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb'
};

const GEAR_SHOP = [
  // HATS (15 items) - Realistic Day Prices ($25 - $150)
  { id: 'hat_1', name: 'Scout Hat', cat: 'Hats', model: MODELS.cesium, price: 25 },
  { id: 'hat_2', name: 'Pink Ribbon', cat: 'Hats', model: MODELS.michelle, price: 20 },
  { id: 'hat_3', name: 'Sport Goggles', cat: 'Hats', model: MODELS.astro, price: 45 },
  { id: 'hat_4', name: 'Red Cap', cat: 'Hats', model: MODELS.soldier, price: 30 },
  { id: 'hat_5', name: 'Blue Beanie', cat: 'Hats', model: MODELS.cesium, price: 35 },
  { id: 'hat_6', name: 'Straw Hat', cat: 'Hats', model: MODELS.figure, price: 40 },
  { id: 'hat_7', name: 'Golden Crown', cat: 'Hats', model: MODELS.michelle, price: 150 },
  { id: 'hat_8', name: 'Viking Horns', cat: 'Hats', model: MODELS.soldier, price: 85 },
  { id: 'hat_9', name: 'Space Helm', cat: 'Hats', model: MODELS.astro, price: 120 },
  { id: 'hat_10', name: 'Magic Hat', cat: 'Hats', model: MODELS.cesium, price: 95 },
  { id: 'hat_11', name: 'Cowboy Hat', cat: 'Hats', model: MODELS.figure, price: 65 },
  { id: 'hat_12', name: 'Jeweled Tiara', cat: 'Hats', model: MODELS.michelle, price: 110 },
  { id: 'hat_13', name: 'Classic Fedora', cat: 'Hats', model: MODELS.soldier, price: 55 },
  { id: 'hat_14', name: 'Winter Cap', cat: 'Hats', model: MODELS.cesium, price: 25 },
  { id: 'hat_15', name: 'Pilot Helmet', cat: 'Hats', model: MODELS.astro, price: 130 },

  // SHIRTS (15 items) - Realistic Day Prices ($40 - $300)
  { id: 'shirt_1', name: 'Blue Scarf', cat: 'Shirts', model: MODELS.soldier, price: 40 },
  { id: 'shirt_2', name: 'Green Polo', cat: 'Shirts', model: MODELS.cesium, price: 55 },
  { id: 'shirt_3', name: 'Yellow Vest', cat: 'Shirts', model: MODELS.soldier, price: 65 },
  { id: 'shirt_4', name: 'Star Badge Shirt', cat: 'Shirts', model: MODELS.astro, price: 80 },
  { id: 'shirt_5', name: 'Red Cotton Tee', cat: 'Shirts', model: MODELS.figure, price: 45 },
  { id: 'shirt_6', name: 'Nature Jacket', cat: 'Shirts', model: MODELS.cesium, price: 95 },
  { id: 'shirt_7', name: 'Hero Cape', cat: 'Shirts', model: MODELS.figure, price: 150 },
  { id: 'shirt_8', name: 'Armor Plate', cat: 'Shirts', model: MODELS.soldier, price: 250 },
  { id: 'shirt_9', name: 'Space Top', cat: 'Shirts', model: MODELS.astro, price: 200 },
  { id: 'shirt_10', name: 'Fancy Tunic', cat: 'Shirts', model: MODELS.michelle, price: 120 },
  { id: 'shirt_11', name: 'Explorer Shirt', cat: 'Shirts', model: MODELS.cesium, price: 75 },
  { id: 'shirt_12', name: 'Training Gear', cat: 'Shirts', model: MODELS.figure, price: 60 },
  { id: 'shirt_13', name: 'Commander Top', cat: 'Shirts', model: MODELS.soldier, price: 180 },
  { id: 'shirt_14', name: 'Graphic Tee', cat: 'Shirts', model: MODELS.michelle, price: 50 },
  { id: 'shirt_15', name: 'Winter Parka', cat: 'Shirts', model: MODELS.cesium, price: 140 },

  // PANTS (15 items) - Realistic Day Prices ($50 - $350)
  { id: 'pants_1', name: 'Cargo Pants', cat: 'Pants', model: MODELS.soldier, price: 65 },
  { id: 'pants_2', name: 'Work Pants', cat: 'Pants', model: MODELS.soldier, price: 75 },
  { id: 'pants_3', name: 'Hiker Pants', cat: 'Pants', model: MODELS.cesium, price: 85 },
  { id: 'pants_4', name: 'Denim Jeans', cat: 'Pants', model: MODELS.soldier, price: 60 },
  { id: 'pants_5', name: 'Summer Shorts', cat: 'Pants', model: MODELS.michelle, price: 45 },
  { id: 'pants_6', name: 'Sport Leggings', cat: 'Pants', model: MODELS.michelle, price: 55 },
  { id: 'pants_7', name: 'Armor Skirt', cat: 'Pants', model: MODELS.figure, price: 180 },
  { id: 'pants_8', name: 'Space Pants', cat: 'Pants', model: MODELS.astro, price: 150 },
  { id: 'pants_9', name: 'Elite Slacks', cat: 'Pants', model: MODELS.soldier, price: 95 },
  { id: 'pants_10', name: 'Joggers', cat: 'Pants', model: MODELS.cesium, price: 50 },
  { id: 'pants_11', name: 'Royal Pants', cat: 'Pants', model: MODELS.figure, price: 220 },
  { id: 'pants_12', name: 'Pilot Trousers', cat: 'Pants', model: MODELS.astro, price: 140 },
  { id: 'pants_13', name: 'Combat Pants', cat: 'Pants', model: MODELS.soldier, price: 110 },
  { id: 'pants_14', name: 'Denim Shorts', cat: 'Pants', model: MODELS.michelle, price: 50 },
  { id: 'pants_15', name: 'Thermal Pants', cat: 'Pants', model: MODELS.cesium, price: 90 },

  // SHOES (15 items) - Realistic Day Prices ($80 - $500)
  { id: 'shoes_1', name: 'Red Boots', cat: 'Shoes', model: MODELS.figure, price: 120 },
  { id: 'shoes_2', name: 'Pro Runners', cat: 'Shoes', model: MODELS.figure, price: 140 },
  { id: 'shoes_3', name: 'Fast Shoes', cat: 'Shoes', model: MODELS.cesium, price: 110 },
  { id: 'shoes_4', name: 'Heavy Boots', cat: 'Shoes', model: MODELS.soldier, price: 130 },
  { id: 'shoes_5', name: 'Space Boots', cat: 'Shoes', model: MODELS.astro, price: 250 },
  { id: 'shoes_6', name: 'Travel Sandals', cat: 'Shoes', model: MODELS.figure, price: 80 },
  { id: 'shoes_7', name: 'Golden Shoes', cat: 'Shoes', model: MODELS.michelle, price: 500 },
  { id: 'shoes_8', name: 'Sneakers', cat: 'Shoes', model: MODELS.cesium, price: 90 },
  { id: 'shoes_9', name: 'Combat Boots', cat: 'Shoes', model: MODELS.soldier, price: 160 },
  { id: 'shoes_10', name: 'Moon Walkers', cat: 'Shoes', model: MODELS.astro, price: 350 },
  { id: 'shoes_11', name: 'Ballet Flats', cat: 'Shoes', model: MODELS.michelle, price: 95 },
  { id: 'shoes_12', name: 'Hiking Boots', cat: 'Shoes', model: MODELS.cesium, price: 150 },
  { id: 'shoes_13', name: 'Royal Slippers', cat: 'Shoes', model: MODELS.figure, price: 280 },
  { id: 'shoes_14', name: 'Iron Sabatons', cat: 'Shoes', model: MODELS.soldier, price: 320 },
  { id: 'shoes_15', name: 'Jump Shoes', cat: 'Shoes', model: MODELS.astro, price: 400 },

  // SETS (15 items) - High End Prices ($500 - $5000)
  { id: 'set_1', name: 'Hero Spirit', cat: 'Sets', model: MODELS.figure, price: 500 },
  { id: 'set_2', name: 'Iron Knight', cat: 'Sets', model: MODELS.soldier, price: 750 },
  { id: 'set_3', name: 'Explorer Form', cat: 'Sets', model: MODELS.cesium, price: 600 },
  { id: 'set_4', name: 'Dancer Spirit', cat: 'Sets', model: MODELS.figure, price: 550 },
  { id: 'set_5', name: 'Marine Suit', cat: 'Sets', model: MODELS.soldier, price: 850 },
  { id: 'set_6', name: 'Superstar Form', cat: 'Sets', model: MODELS.michelle, price: 1200 },
  { id: 'set_7', name: 'Space Cadet', cat: 'Sets', model: MODELS.astro, price: 1000 },
  { id: 'set_8', name: 'Elite Guard', cat: 'Sets', model: MODELS.soldier, price: 1500 },
  { id: 'set_9', name: 'Royal Hero', cat: 'Sets', model: MODELS.figure, price: 2000 },
  { id: 'set_10', name: 'Astro Pilot', cat: 'Sets', model: MODELS.astro, price: 1800 },
  { id: 'set_11', name: 'Fox Spirit Suit', cat: 'Sets', model: MODELS.fox, price: 2500 },
  { id: 'set_12', name: 'Mecha-Human', cat: 'Sets', model: MODELS.robot, price: 3000 },
  { id: 'set_13', name: 'Shadow Stalker', cat: 'Sets', model: MODELS.soldier, price: 3500 },
  { id: 'set_14', name: 'Mythic Guardian', cat: 'Sets', model: MODELS.michelle, price: 4000 },
  { id: 'set_15', name: 'Celestial God', cat: 'Sets', model: MODELS.figure, price: 5000 }
];

const SHOP_CATEGORIES = ['All', 'Hats', 'Shirts', 'Pants', 'Shoes', 'Sets'];

const AVATAR_MODELS = {
  male: MODELS.soldier,
  female: MODELS.michelle
};

const COLORS = {
  skin: ['#fde68a', '#fbbf24', '#d97706', '#92400e', '#451a03'],
  hair: ['#451a03', '#92400e', '#d97706', '#fbbf24', '#1e293b', '#3b82f6'],
  eye: ['#3b82f6', '#10b981', '#92400e', '#1e293b']
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

const FALLBACK_WORDS = {
  en: { 1: ['cat','dog','hat','bat','rat'], 2: ['the','and','you','are','was'], 3: ['they','with','have','this','from'] },
  fr: { 1: ['jai','dit','le','la','je','vois','un','une'], 2: ['mon','est','regarde','suis','ma','dans','peux'], 3: ['aussi','non','va','maman','papa','en','mes'] }
};

function generateShape(word) {
  const codes = [...word].map(c => c.charCodeAt(0)), sum = codes.reduce((a, b) => a + b, 0), len = word.length;
  const cx = 100, cy = 100, r = 55 + (sum % 20), bump = 15 + (len * 3);
  const paths = [
    `M${cx - r},${cy + r} Q${cx - bump},${cy - r - 10} ${cx},${cy - r} Q${cx + bump},${cy - r - 10} ${cx + r},${cy + r}`,
    `M${cx - r},${cy} Q${cx - 20},${cy - r} ${cx},${cy} Q${cx + 20},${cy + r} ${cx + r},${cy}`,
    `M${cx - r},${cy + r} L${cx},${cy - r} L${cx + r},${cy + r} M${cx - r + 10},${cy + r} L${cx + r - 10},${cy + r}`,
    `M${cx},${cy - r} Q${cx + r + 20},${cy} ${cx},${cy + r} Q${cx - r - 20},${cy} ${cx},${cy - r}`,
    `M${cx - r},${cy + r} Q${cx - 30},${cy} ${cx},${cy - r - 10} Q${cx + 30},${cy} ${cx + r},${cy + r}`,
  ];
  return paths[sum % paths.length];
}

function parseLevels(text) {
  const result = {};
  const chunks = text.split(/(?:Niveau|Level)\s+(\d+)/i);
  for (let i = 1; i < chunks.length; i += 2) {
    const levelNum = parseInt(chunks[i], 10), body = chunks[i + 1] || '', tokens = body.match(/[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'\-]{1,}/g) || [], seen = new Set(), words = [];
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
    this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 5;
    this.isFrench = false; this.isTalkMode = false; this.micGranted = false; this.micTested = false; this.isTestMode = false;
    this.targetWord = null; this.unlockedAnimals = []; this.currentPool = []; this.selectedVoiceURI = null;
    this.gender = 'male';
    this.avatarModel = AVATAR_MODELS.male; this.nextUnlockLevel = 1;
    this.coins = 0; this.unlockedAvatars = [AVATAR_MODELS.male, AVATAR_MODELS.female];
    this.avatarColors = { skin: COLORS.skin[0], hair: COLORS.hair[0], eye: COLORS.eye[0] };
    this.activeQuests = []; this.lastQuestRefresh = null;
    this.equippedPet = null; this.bgm = new Audio(BGM_URL); this.bgm.loop = true; this.bgm.volume = 0.2;
    this.dyslexicFont = false;
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
        const feedback = feedbackId ? document.getElementById(feedbackId) : null;
        if (micBtn) micBtn.classList.add('mic-listening');
        if (feedback) feedback.innerHTML = '<span style="color:var(--danger)">👂 Listening... Speak now!</span>';
      };
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim(), isFinal = event.results[0].isFinal;
        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = feedbackId ? document.getElementById(feedbackId) : null;
        if (feedback && !isFinal) feedback.innerHTML = `Hearing: <b style="color:var(--primary)">"${transcript}..."</b>`;
        if (isFinal) { if (this.isTestMode) this.handleTestResult(transcript); else this.handleSpeechResult(transcript); }
      };
      this.recognition.onerror = (event) => {
        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = feedbackId ? document.getElementById(feedbackId) : null;
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
    } else { selectView.style.display = 'none'; createView.style.display = 'block'; document.getElementById('create-step-1').style.display = 'block'; document.getElementById('create-step-avatar').style.display = 'none'; document.getElementById('create-step-2').style.display = 'none'; }
  }

  loadProfile(id) {
    this.currentUser = id; const u = this.users[id];
    this.level = u.level || 1; this.score = u.score || 0; this.streak = u.streak || 0; this.xp = u.xp || 0;
    this.maxXP = 5 + (this.level - 1) * 5; this.isFrench = u.isFrench || false;
    this.unlockedAnimals = u.unlockedAnimals || []; this.selectedVoiceURI = u.selectedVoiceURI || null;
    this.micTested = u.micTested || false;
    this.gender = u.gender || 'male';
    this.avatarModel = u.avatarModel || AVATAR_MODELS.male;
    this.nextUnlockLevel = u.nextUnlockLevel;
    if (this.nextUnlockLevel === undefined || this.nextUnlockLevel === null) {
      // If user has no animals but is high level, trigger next encounter immediately
      this.nextUnlockLevel = (this.unlockedAnimals.length === 0 && this.level > 1) ? this.level : (this.level + 2);
    }
    this.coins = u.coins || 0;
    this.unlockedAvatars = u.unlockedAvatars || [AVATAR_MODELS.male, AVATAR_MODELS.female];
    this.avatarColors = u.avatarColors || { skin: COLORS.skin[0], hair: COLORS.hair[0], eye: COLORS.eye[0] };
    this.activeQuests = u.activeQuests || []; this.lastQuestRefresh = u.lastQuestRefresh || null;
    this.equippedPet = u.equippedPet || null; this.dyslexicFont = u.dyslexicFont || false;
    this.startGameplay();
  }

  createProfile() {
    const name = document.getElementById('new-player-name').value.trim(); if (!name) return;
    const id = Date.now().toString();
    this.users[id] = { 
      name: name, level: 1, score: 0, streak: 0, xp: 0, 
      isFrench: document.getElementById('new-player-en').classList.contains('active'), 
      unlockedAnimals: [], selectedVoiceURI: null, micTested: false,
      gender: this.gender, avatarModel: this.avatarModel, nextUnlockLevel: 2,
      coins: 0, unlockedAvatars: this.unlockedAvatars, avatarColors: this.avatarColors
    };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users)); this.loadProfile(id);
  }

  saveProfile() {
    if (!this.currentUser) return;
    this.users[this.currentUser] = { 
      ...this.users[this.currentUser], 
      level: this.level, score: this.score, streak: this.streak, xp: this.xp, 
      isFrench: this.isFrench, unlockedAnimals: this.unlockedAnimals, 
      selectedVoiceURI: this.selectedVoiceURI, micTested: this.micTested,
      gender: this.gender, avatarModel: this.avatarModel, nextUnlockLevel: this.nextUnlockLevel,
      coins: this.coins, unlockedAvatars: this.unlockedAvatars, avatarColors: this.avatarColors,
      activeQuests: this.activeQuests, lastQuestRefresh: this.lastQuestRefresh,
      equippedPet: this.equippedPet, dyslexicFont: this.dyslexicFont
    };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
  }

  showAvatarDesigner(isOnboarding = false) {
    this.playSFX('click');
    const screen = isOnboarding ? document.getElementById('create-step-avatar') : document.getElementById('avatar-designer-screen');
    const modelViewer = isOnboarding ? document.getElementById('create-avatar-preview') : document.getElementById('avatar-preview-model');
    const gearList = document.getElementById('my-gear-list');
    let currentMyGearCat = 'All';
    
    const updatePreview = () => {
      modelViewer.src = this.avatarModel;
    };
    updatePreview();

    const setGender = (g) => {
      this.gender = g;
      this.avatarModel = AVATAR_MODELS[g];
      document.getElementById('avatar-gender-male').classList.toggle('active', g === 'male');
      document.getElementById('avatar-gender-female').classList.toggle('active', g === 'female');
      updatePreview();
      this.playSFX('click');
    };

    const renderMyGear = (cat) => {
      if (!gearList) return;
      gearList.innerHTML = '';
      
      const filtered = this.unlockedAvatars.filter(modelUrl => {
        if (cat === 'All') return true;
        const gearInfo = GEAR_SHOP.find(g => g.model === modelUrl);
        if (modelUrl === AVATAR_MODELS.male || modelUrl === AVATAR_MODELS.female) {
          return cat === 'Sets';
        }
        return gearInfo && gearInfo.cat === cat;
      });

      filtered.forEach(modelUrl => {
        const gearInfo = GEAR_SHOP.find(g => g.model === modelUrl) || { name: 'Base' };
        if (modelUrl === AVATAR_MODELS.male || modelUrl === AVATAR_MODELS.female) {
          gearInfo.name = modelUrl === AVATAR_MODELS.male ? 'Base Boy' : 'Base Girl';
        }
        
        const btn = document.createElement('button');
        btn.style.width = '80px'; btn.style.height = '100px'; btn.style.flexShrink = '0';
        btn.style.padding = '5px'; btn.style.fontSize = '0.7rem'; btn.style.border = '2px solid #e2e8f0';
        btn.style.borderRadius = '12px'; btn.style.background = 'white';
        if (this.avatarModel === modelUrl) btn.style.borderColor = 'var(--primary)';
        
        btn.innerHTML = `<div style="height:60px"><model-viewer src="${modelUrl}" auto-rotate style="width:100%;height:100%"></model-viewer></div><div style="margin-top:5px; line-height:1.1;">${gearInfo.name}</div>`;
        btn.onclick = () => {
          this.avatarModel = modelUrl;
          this.playSFX('click');
          updatePreview();
          [...gearList.children].forEach(b => b.style.borderColor = '#e2e8f0');
          btn.style.borderColor = 'var(--primary)';
        };
        gearList.appendChild(btn);
      });
    };

    if (isOnboarding) {
      document.getElementById('avatar-gender-male').onclick = () => setGender('male');
      document.getElementById('avatar-gender-female').onclick = () => setGender('female');
      
      const renderColors = (type, targetId) => {
        const container = document.getElementById(targetId);
        if (!container) return;
        container.innerHTML = '';
        COLORS[type].forEach(c => {
          const swatch = document.createElement('div');
          swatch.className = `color-swatch ${this.avatarColors[type] === c ? 'active' : ''}`;
          swatch.style.background = c;
          swatch.onclick = () => {
            this.avatarColors[type] = c;
            [...container.children].forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            this.playSFX('click');
          };
          container.appendChild(swatch);
        });
      };

      renderColors('skin', 'skin-colors');
      renderColors('hair', 'hair-colors');
      renderColors('eye', 'eye-colors');
      document.getElementById('create-step-1').style.display = 'none';
      screen.style.display = 'block';
    } else {
      const content = screen.querySelector('.collection-content');
      let tabs = content.querySelector('.my-gear-tabs');
      if (!tabs) {
        tabs = document.createElement('div');
        tabs.className = 'my-gear-tabs cat-tabs';
        tabs.style.display = 'flex'; tabs.style.gap = '5px'; tabs.style.overflowX = 'auto'; tabs.style.marginBottom = '15px'; tabs.style.padding = '5px';
        SHOP_CATEGORIES.forEach(cat => {
          const btn = document.createElement('button');
          btn.textContent = cat; btn.style.fontSize = '0.7rem'; btn.style.padding = '8px'; btn.style.width = 'auto';
          btn.onclick = () => {
            currentMyGearCat = cat;
            [...tabs.children].forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMyGear(cat);
          };
          if (cat === 'All') btn.classList.add('active');
          tabs.appendChild(btn);
        });
        content.insertBefore(tabs, gearList.parentNode);
      } else {
        [...tabs.children].forEach(b => b.classList.remove('active'));
        const activeIdx = SHOP_CATEGORIES.indexOf(currentMyGearCat);
        if (activeIdx !== -1) tabs.children[activeIdx].classList.add('active');
      }

      renderMyGear(currentMyGearCat);

      document.getElementById('save-avatar-btn').onclick = () => {
        this.playSFX('click'); this.saveProfile(); screen.style.display = 'none';
      };
      screen.style.display = 'flex';
    }
  }

  deleteCurrentProfile() {
    if (!this.currentUser || !confirm(`Delete profile for "${this.users[this.currentUser].name}"?`)) return;
    delete this.users[this.currentUser]; localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    this.currentUser = null; this.playSFX('click'); document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').style.display = 'none'; this.showProfileSelect();
  }

  startGameplay() { 
    document.getElementById('start-overlay').style.display = 'none'; 
    this.updateStats(); this.updateCollectionButton(); this.populateVoiceList(); 
    this.checkDailyRefresh(); this.updateGameplayVisuals(); this.setFont(this.dyslexicFont);
    
    // Check if we are overdue for a treasure (like if the user is level 30 but has none)
    if (this.level > 1 && this.level >= this.nextUnlockLevel) {
      this.checkAnimalUnlock();
    } else {
      this.newTarget(); 
    }
    
    document.addEventListener('click', () => { this.bgm.play().catch(() => {}); }, { once: true });
  }

  setFont(isDyslexic) {
    this.dyslexicFont = isDyslexic;
    document.body.classList.toggle('font-dyslexic', isDyslexic);
    document.getElementById('font-standard-btn')?.classList.toggle('active', !isDyslexic);
    document.getElementById('font-dyslexic-btn')?.classList.toggle('active', isDyslexic);
    this.saveProfile();
  }

  triggerAvatarReaction(type) {
    const avatar = document.getElementById('gameplay-visuals');
    if (!avatar) return;
    if (type === 'correct') {
      avatar.style.transform = 'translateY(-30px) scale(1.1)';
      setTimeout(() => avatar.style.transform = 'translateY(0) scale(1)', 300);
    } else {
      avatar.style.transform = 'translateX(-10px)';
      setTimeout(() => avatar.style.transform = 'translateX(10px)', 100);
      setTimeout(() => avatar.style.transform = 'translateX(0)', 200);
    }
  }

  updateGameplayVisuals() {
    const avatar = document.getElementById('main-avatar-viewer');
    const pet = document.getElementById('main-pet-viewer');
    if (avatar) avatar.src = this.avatarModel;
    if (pet) {
      if (this.equippedPet) {
        const petData = ANIMALS.find(a => a.name === this.equippedPet.animalName);
        pet.src = petData ? petData.model : '';
        pet.style.display = 'block';
      } else {
        pet.style.display = 'none';
      }
    }
  }

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
      this.playSFX('correct'); this.streak++; this.score += 150; this.xp += 5;
      this.updateQuestProgress('correct_words', 1);
      this.updateQuestProgress('use_talk', 1);
      this.updateQuestProgress('streak', this.streak);
      this.triggerAvatarReaction('correct');
      if (fb) fb.innerHTML = '<span style="color:var(--accent)">YES! ✨</span>';
      this.updateStats(); this.saveProfile(); setTimeout(() => this.levelUpOrNext(), 1500);
    } else {
      this.playSFX('wrong'); this.streak = 0; 
      this.triggerAvatarReaction('wrong');
      if (fb) fb.innerHTML = `<span style="color:var(--secondary)">NO, I heard "${t}".</span>`;
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
      const displayWord = this.targetWord.word.toUpperCase();
      const targetCard = document.getElementById('speech-target-card');
      if (targetCard) targetCard.innerHTML = `<div class="card" style="margin:0 auto; flex:none; width:100%;">
        <svg class="shape-svg" viewBox="0 0 200 200"><path d="${this.targetWord.shape || generateShape(this.targetWord.word)}"/></svg>
        <div class="card-word" style="font-size: 2.5rem;">${displayWord}</div></div>`;
      const feedback = document.getElementById('speech-feedback');
      if (feedback) feedback.textContent = "Click the mic when ready!";
    } else { setTimeout(() => this.speak(), 500); this.renderCards(); }
  }

  formatWordContextually(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }

  renderCards() {
    const gameArea = document.getElementById('game-area'); gameArea.innerHTML = '';
    const distractors = this.currentPool.filter(w => w.word !== this.targetWord.word).slice(0, 4);
    let cards = [this.targetWord, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    const roundIsRuled = Math.random() > 0.5;
    cards.forEach(wordData => {
      const card = document.createElement('div'); card.className = 'card';
      const displayWord = wordData.word.toUpperCase();
      card.innerHTML = `<div class="particles" style="display:none"></div><div class="feedback"></div>
        <svg class="shape-svg" viewBox="0 0 200 200"><path d="${wordData.shape || generateShape(wordData.word)}"/></svg>
        <div class="card-word">${displayWord}</div>`;
      card.addEventListener('click', (e) => this.onCardClick(e, wordData)); gameArea.appendChild(card);
    });
  }

  onCardClick(e, clickedWord) {
    if (!this.canClick) return; const card = e.currentTarget, isCorrect = clickedWord.word === this.targetWord.word;
    this.attemptsForCurrentWord++;
    if (isCorrect) {
      this.canClick = false; this.playSFX('correct'); card.classList.add('correct-zoom');
      this.xp += 5;
      this.streak = (this.attemptsForCurrentWord === 1) ? this.streak + 1 : 0;
      this.updateQuestProgress('correct_words', 1);
      this.updateQuestProgress('streak', this.streak);
      this.triggerAvatarReaction('correct');
      this.score += 100; this.updateStats(); this.saveProfile(); setTimeout(() => this.levelUpOrNext(), 1500);
    } else {
      this.streak = 0; this.canClick = false; this.playSFX('wrong'); card.style.opacity = '0.3';
      this.triggerAvatarReaction('wrong');
      document.getElementById('game-area').style.opacity = '0.6';
      setTimeout(() => { this.canClick = true; document.getElementById('game-area').style.opacity = '1'; this.speak(); }, 1500);
    }
  }

  levelUpOrNext() { if (this.xp >= this.maxXP) this.levelUp(); else this.newTarget(); }

  updateStats() {
    const levelEl = document.getElementById('level');
    if (levelEl) levelEl.textContent = this.level;
    
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = this.score;
    
    const coinsEl = document.getElementById('coins');
    if (coinsEl) coinsEl.textContent = this.coins;
    
    const streakEl = document.getElementById('streak');
    if (streakEl) {
      streakEl.textContent = this.streak;
      streakEl.classList.toggle('on-fire', this.streak >= 3);
    }
    
    this.maxXP = 5 + (this.level - 1) * 5;
    
    const xpEl = document.getElementById('xp');
    if (xpEl) xpEl.textContent = this.xp;
    
    const maxXpEl = document.getElementById('max-xp');
    if (maxXpEl) maxXpEl.textContent = this.maxXP;
    
    const xpFill = document.getElementById('xp-fill');
    if (xpFill) xpFill.style.width = `${(this.xp / this.maxXP) * 100}%`;
  }

  updateCollectionButton() { document.getElementById('collection-count').textContent = this.unlockedAnimals.length; }

  showShopScreen() {
    this.playSFX('click');
    const screen = document.getElementById('shop-screen');
    const buyList = document.getElementById('shop-buy-list');
    const sellList = document.getElementById('shop-sell-list');
    let currentBuyCat = 'All';

    const renderBuy = (cat) => {
      buyList.innerHTML = '';
      const items = cat === 'All' ? GEAR_SHOP : GEAR_SHOP.filter(g => g.cat === cat);
      items.forEach(item => {
        const isOwned = this.unlockedAvatars.includes(item.model);
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
          <div style="font-weight: 800; font-size: 0.9rem;">${item.name}</div>
          <div style="height: 80px;"><model-viewer src="${item.model}" auto-rotate style="width:100%; height:100%;"></model-viewer></div>
          <button class="${isOwned ? '' : 'accent'}" style="margin-top: 10px; font-size: 0.8rem; padding: 8px;" ${isOwned ? 'disabled' : ''}>
            ${isOwned ? 'Owned' : `Buy $${item.price}`}
          </button>
        `;
        if (!isOwned) card.querySelector('button').onclick = () => this.performBuyGear(item);
        buyList.appendChild(card);
      });
    };

    const renderSell = () => {
      sellList.innerHTML = '';
      if (this.unlockedAnimals.length === 0) {
        sellList.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-light);">No treasures to sell yet!</p>';
        return;
      }
      this.unlockedAnimals.forEach((ua, index) => {
        const data = ANIMALS.find(a => a.name === ua.animalName);
        if (!data) return;
        const price = SELL_PRICES[data.rarity] || 50;
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
          <div style="font-weight: 800; font-size: 0.9rem;">${ua.petName}</div>
          <div style="font-size: 0.7rem; color: var(--text-light);">${data.rarity}</div>
          <button class="primary" style="margin-top: 10px; font-size: 0.8rem; padding: 8px;">Sell $${price}</button>
        `;
        card.querySelector('button').onclick = () => this.performSell(index, price);
        sellList.appendChild(card);
      });
    };

    const buyView = document.getElementById('shop-buy-view');
    let tabs = buyView.querySelector('.cat-tabs');
    if (!tabs) {
      tabs = document.createElement('div');
      tabs.className = 'cat-tabs';
      tabs.style.display = 'flex'; tabs.style.gap = '5px'; tabs.style.overflowX = 'auto'; tabs.style.marginBottom = '15px'; tabs.style.padding = '5px';
      SHOP_CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat; btn.style.fontSize = '0.7rem'; btn.style.padding = '8px'; btn.style.width = 'auto';
        btn.onclick = () => {
          currentBuyCat = cat;
          [...tabs.children].forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderBuy(cat);
        };
        if (cat === 'All') btn.classList.add('active');
        tabs.appendChild(btn);
      });
      buyView.insertBefore(tabs, buyList);
    } else {
      [...tabs.children].forEach(b => b.classList.remove('active'));
      const activeIdx = SHOP_CATEGORIES.indexOf(currentBuyCat);
      if (activeIdx !== -1) tabs.children[activeIdx].classList.add('active');
    }

    document.getElementById('shop-tab-sell').onclick = (e) => {
      e.target.classList.add('active'); document.getElementById('shop-tab-buy').classList.remove('active');
      document.getElementById('shop-sell-view').style.display = 'block'; document.getElementById('shop-buy-view').style.display = 'none';
      renderSell();
    };
    document.getElementById('shop-tab-buy').onclick = (e) => {
      e.target.classList.add('active'); document.getElementById('shop-tab-sell').classList.remove('active');
      document.getElementById('shop-sell-view').style.display = 'none'; document.getElementById('shop-buy-view').style.display = 'block';
      renderBuy(currentBuyCat);
    };

    renderSell();
    screen.style.display = 'flex';
  }

  checkDailyRefresh() {
    const today = new Date().toLocaleDateString();
    if (this.lastQuestRefresh !== today) {
      this.refreshQuests();
      this.lastQuestRefresh = today;
      this.saveProfile();
    }
  }

  refreshQuests() {
    this.activeQuests = [];
    const available = [...QUEST_TEMPLATES];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * available.length);
      const template = available.splice(idx, 1)[0];
      const target = template.targets[Math.floor(Math.random() * template.targets.length)];
      this.activeQuests.push({
        id: template.id,
        text: template.text.replace('{target}', target),
        target: target,
        reward: template.reward,
        progress: 0,
        claimed: false
      });
    }
  }

  updateQuestProgress(type, amount = 1) {
    let changed = false;
    this.activeQuests.forEach(q => {
      if (q.id === type && !q.claimed && q.progress < q.target) {
        if (type === 'streak') {
          if (amount > q.progress) q.progress = amount;
        } else {
          q.progress += amount;
        }
        if (q.progress > q.target) q.progress = q.target;
        changed = true;
      }
    });
    if (changed) this.saveProfile();
  }

  showQuestsScreen() {
    this.playSFX('click');
    this.checkDailyRefresh();
    const screen = document.getElementById('quests-screen');
    const list = document.getElementById('quests-list');
    list.innerHTML = '';

    this.activeQuests.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'quest-card';
      const isReady = q.progress >= q.target && !q.claimed;
      const progressPct = (q.progress / q.target) * 100;

      card.innerHTML = `
        <div class="quest-header">
          <span class="quest-title">${q.text}</span>
          <span class="quest-reward">$${q.reward}</span>
        </div>
        <div class="quest-progress-bg">
          <div class="quest-progress-fill" style="width: ${progressPct}%"></div>
        </div>
        <div style="font-size: 0.7rem; color: var(--text-light); text-align: right;">${q.progress} / ${q.target}</div>
        <button class="quest-claim-btn ${q.claimed ? 'claimed' : (isReady ? 'ready' : 'locked')}" 
                ${!isReady ? 'disabled' : ''}>
          ${q.claimed ? 'Claimed ✓' : (isReady ? 'Claim Reward!' : 'Keep Playing...')}
        </button>
      `;
      
      if (isReady) {
        card.querySelector('button').onclick = () => this.claimQuestReward(idx);
      }
      list.appendChild(card);
    });

    screen.style.display = 'flex';
  }

  claimQuestReward(idx) {
    const q = this.activeQuests[idx];
    if (q.claimed) return;
    this.playSFX('correct');
    q.claimed = true;
    this.coins += q.reward;
    this.updateStats();
    this.saveProfile();
    this.showQuestsScreen();
  }

  performSell(index, price) {
    const ua = this.unlockedAnimals[index];
    if (!confirm(`Sell "${ua.petName}" for $${price}?`)) return;
    this.unlockedAnimals.splice(index, 1);
    this.coins += price;
    this.playSFX('correct');
    this.saveProfile();
    this.updateStats();
    this.showShopScreen();
  }

  performBuyGear(item) {
    if (this.coins < item.price) {
      alert("Not enough money!");
      return;
    }
    if (!confirm(`Buy "${item.name}" for $${item.price}?`)) return;
    this.coins -= item.price;
    this.unlockedAvatars.push(item.model);
    this.playSFX('correct');
    this.saveProfile();
    this.updateStats();
    this.showShopScreen();
  }

  levelUp() {
    this.playSFX('levelUp'); this.level++; 
    this.maxXP = 5 + (this.level - 1) * 5; this.xp = 0;
    this.updateQuestProgress('level_up', 1);
    this.updateStats(); this.saveProfile();
    const newLevelEl = document.getElementById('new-level');
    if (newLevelEl) newLevelEl.textContent = this.level;
    const levelUpModal = document.getElementById('level-up-modal');
    if (levelUpModal) levelUpModal.style.display = 'flex';
  }

  getAnimalForLevel() { 
    const roll = Math.random() * 100; let accumulated = 0, selectedRarity = 'Common';
    const rarities = [...RARITY_ORDER].reverse(); 
    for (const r of rarities) { accumulated += RARITY_WEIGHTS[r]; if (roll <= accumulated) { selectedRarity = r; break; } }
    const pool = ANIMALS.filter(a => a.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)] || ANIMALS[0];
  }

  checkAnimalUnlock() {
    if (this.level > 1 && this.level >= this.nextUnlockLevel) { 
      this.nextUnlockLevel = this.level + 2;
      this.saveProfile();
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
    const avatar = document.getElementById('catching-player-avatar');
    
    if (model) model.src = animal.model;
    if (avatar) avatar.src = this.avatarModel || AVATAR_MODELS.male;
    
    if (challengeArea) challengeArea.style.display = 'block';
    if (actionArea) actionArea.style.display = 'none';
    if (screen) screen.style.display = 'flex';

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
    if (area) area.innerHTML = '';
    if (prompt) prompt.textContent = "Listen and Find!";
    
    setTimeout(() => this.speak(target.word), 500);

    cards.forEach(wordData => {
      const card = document.createElement('div');
      card.className = 'card';
      const displayWord = wordData.word.toUpperCase();
      card.innerHTML = `<svg class="shape-svg" viewBox="0 0 200 200"><path d="${wordData.shape || generateShape(wordData.word)}"/></svg><div class="card-word">${displayWord}</div>`;
      card.addEventListener('click', () => {
        if (wordData.word === target.word) {
          this.playSFX('correct');
          const challengeArea = document.getElementById('catch-challenge-area');
          if (challengeArea) challengeArea.style.display = 'none';
          const actionArea = document.getElementById('capture-action-area');
          if (actionArea) actionArea.style.display = 'block';
          const shootBtn = document.getElementById('shoot-power-btn');
          if (shootBtn) shootBtn.onclick = () => this.fireCapturePower(animal);
        } else {
          this.playSFX('wrong');
          card.style.opacity = '0.3';
          this.speak(target.word);
        }
      });
      if (area) area.appendChild(card);
    });
  }

  fireCapturePower(animal) {
    this.playSFX('click');
    const btn = document.getElementById('shoot-power-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

    const modelViewer = document.getElementById('catch-model');
    const avatarViewer = document.getElementById('catching-player-avatar');
    const modelRect = modelViewer.getBoundingClientRect();
    const avatarRect = avatarViewer.getBoundingClientRect();
    const startX = avatarRect.left + avatarRect.width / 2;
    const startY = avatarRect.top + avatarRect.height / 2;

    const power = document.createElement('div');
    power.className = 'blue-power';
    power.style.background = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)';
    power.style.left = `${startX}px`;
    power.style.top = `${startY}px`;
    document.body.appendChild(power);

    requestAnimationFrame(() => {
      power.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      power.style.left = `${modelRect.left + modelRect.width / 2}px`;
      power.style.top = `${modelRect.top + modelRect.height / 2}px`;
      power.style.transform = 'scale(2) rotate(360deg)';
    });

    setTimeout(() => {
      power.remove();
      this.wrapTreasureInSwirl(animal, modelViewer, avatarViewer);
    }, 800);
  }

  wrapTreasureInSwirl(animal, modelViewer, avatarViewer) {
    const rect = modelViewer.getBoundingClientRect();
    const swirl = document.createElement('div');
    swirl.className = 'rainbow-swirl';
    swirl.style.left = `${rect.left + rect.width / 2}px`;
    swirl.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(swirl);

    modelViewer.style.transition = 'opacity 1s';
    modelViewer.style.opacity = '0';

    setTimeout(() => {
      swirl.remove();
      this.showShardBall(animal, rect, avatarViewer);
    }, 2000);
  }

  showShardBall(animal, rect, avatarViewer) {
    const ball = document.createElement('div');
    ball.className = 'shard-ball';
    ball.style.background = `linear-gradient(135deg, #fff 0%, ${animal.color || '#3b82f6'} 50%, #fff 100%)`;
    ball.style.left = `${rect.left + rect.width / 2 - 40}px`;
    ball.style.top = `${rect.top + rect.height / 2 - 40}px`;
    document.body.appendChild(ball);

    avatarViewer.style.transition = 'right 1.5s ease-in-out';
    avatarViewer.style.right = 'calc(100% - 35%)';

    setTimeout(() => {
      this.pickUpBall(ball, avatarViewer, animal);
    }, 1600);
  }

  pickUpBall(ball, avatarViewer, animal) {
    const avatarRect = avatarViewer.getBoundingClientRect();
    ball.style.transition = 'all 0.5s ease-in';
    ball.style.left = `${avatarRect.left + avatarRect.width / 2 - 40}px`;
    ball.style.top = `${avatarRect.top + avatarRect.height / 3}px`;
    ball.style.transform = 'scale(0.2)';
    ball.style.opacity = '0';

    setTimeout(() => {
      ball.remove();
      this.finalizeCapture(animal, avatarViewer);
    }, 500);
  }

  finalizeCapture(animal, avatarViewer) {
    avatarViewer.style.right = '15%';
    setTimeout(() => {
      const screen = document.getElementById('catching-screen');
      if (screen) screen.style.display = 'none';
      const model = document.getElementById('catch-model');
      if (model) model.style.opacity = '1';
      
      const usedNames = this.unlockedAnimals.map(u => u.petName), availableNames = PET_NAMES.filter(n => !usedNames.includes(n));
      const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${animal.name} #${this.unlockedAnimals.length + 1}`;
      this.unlockedAnimals.push({ animalName: animal.name, petName: petName, level: this.level });
      this.updateCollectionButton(); this.saveProfile();
      
      const chest = document.getElementById('chest-container');
      if (chest) {
        chest.style.transform = 'scale(1.5) rotate(15deg)';
        setTimeout(() => { 
          chest.style.transform = 'scale(1) rotate(0deg)'; 
          const badge = document.getElementById('chest-badge'); 
          if (badge) { badge.style.display = 'block'; badge.textContent = this.unlockedAnimals.length; } 
        }, 200);
      }
      this.newTarget();
    }, 1000);
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

  showUnlockScreen(animal) { this.startCatchingSequence(animal); }

  showCollectionScreen() {
    this.playSFX('click');
    const badge = document.getElementById('chest-badge'); if (badge) badge.style.display = 'none';
    const content = document.getElementById('collection-content');
    content.innerHTML = `<h2 style="font-size:3em;margin-bottom:20px; font-family:'Outfit'; color:var(--primary);">Your Treasures</h2><div id="collection-list" style="text-align:left; display:flex; flex-direction:column; gap:20px; margin-bottom:30px; max-height:60vh; overflow-y:auto; padding-right:10px;"></div><button id="close-collection-btn" class="primary" style="border-radius:20px; padding:15px 40px; width:auto; margin:0 auto;">Close Treasures</button>`;
    const list = document.getElementById('collection-list');

    if (this.unlockedAnimals.length === 0) {
      list.innerHTML = `<p style="text-align:center; color:var(--text-light); margin-top: 20px;">Keep playing to unlock your first treasure!</p>`;
    } else {
      const grouped = {};
      RARITY_ORDER.forEach(r => grouped[r] = []);
      this.unlockedAnimals.forEach(ua => {
        const animalData = ANIMALS.find(a => a.name === ua.animalName);
        if (animalData) grouped[animalData.rarity].push({ ua, data: animalData });
      });

      RARITY_ORDER.forEach(rarity => {
        const items = grouped[rarity];
        if (items.length === 0) return;
        const section = document.createElement('div');
        section.innerHTML = `<h4 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; color: var(--text-light); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">${rarity} (${items.length})</h4>`;
        const grid = document.createElement('div'); grid.className = 'collection-grid';
        items.reverse().forEach(item => {
          const card = document.createElement('div'); card.className = 'collection-card'; card.style.cursor = 'pointer';
          let envBg = 'linear-gradient(to bottom, #dcfce7 0%, #86efac 100%)';
          if (item.data.env === 'water') envBg = 'linear-gradient(to bottom, #e0f2fe 0%, #3b82f6 100%)';
          if (item.data.env === 'space') envBg = 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)';
          card.style.background = envBg;
          card.innerHTML = `<div class="rarity-display rarity-${item.data.rarity.toLowerCase()}" style="margin-bottom:5px;">${item.data.rarity}</div><div style="font-weight:800; color:var(--primary); font-size:1.1rem; text-shadow: 0 1px 2px rgba(255,255,255,0.5);">${item.ua.petName}</div><div class="collection-animal-container" style="height:120px; width:100%; background: transparent; border: none;"><model-viewer src="${item.data.model}" shadow-intensity="1" camera-controls auto-rotate style="width:100%; height:100%;"></model-viewer></div><div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:var(--text);">${item.data.name}</div><div style="font-size:0.7rem; font-weight:800; background:rgba(255,255,255,0.8); padding:4px 10px; border-radius:10px; margin-top:5px;">LVL ${item.ua.level}</div>`;
          card.addEventListener('click', () => this.showTreasureDetail(item.ua)); grid.appendChild(card);
        });
        section.appendChild(grid); list.appendChild(section);
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
    let envBg = 'linear-gradient(to bottom, #dcfce7 0%, #86efac 100%)';
    if (animalData.env === 'water') envBg = 'linear-gradient(to bottom, #e0f2fe 0%, #3b82f6 100%)';
    if (animalData.env === 'space') envBg = 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)';
    const container = modal.querySelector('.unlock-animal-container');
    if (container) container.style.background = envBg;
    document.getElementById('detail-rarity').textContent = animalData.rarity;
    document.getElementById('detail-rarity').className = `rarity-display rarity-${animalData.rarity.toLowerCase()}`;
    document.getElementById('detail-pet-name').textContent = userAnimal.petName;
    document.getElementById('detail-animal-name').textContent = `The ${animalData.name}`;
    document.getElementById('detail-model').src = animalData.model;
    document.getElementById('detail-story').textContent = animalData.story || "Mysterious treasure.";
    document.getElementById('detail-powers').textContent = animalData.powers || "Magic properties.";
    
    const equipBtn = document.getElementById('equip-pet-btn');
    if (equipBtn) {
      const isEquipped = this.equippedPet && this.equippedPet.petName === userAnimal.petName;
      equipBtn.textContent = isEquipped ? 'Equipped ✓' : 'Equip as Pet ✨';
      equipBtn.onclick = () => {
        this.playSFX('correct');
        this.equippedPet = isEquipped ? null : userAnimal;
        this.saveProfile();
        this.updateGameplayVisuals();
        this.showTreasureDetail(userAnimal);
      };
    }

    document.getElementById('close-detail-btn').onclick = () => { this.playSFX('click'); modal.style.display = 'none'; };
    modal.style.display = 'flex';
  }

  setLang(l) { this.isFrench = (l === 'fr'); this.saveProfile(); this.populateVoiceList(); document.getElementById('new-player-en').classList.toggle('active', !this.isFrench); document.getElementById('new-player-fr').classList.toggle('active', this.isFrench); this.newTarget(); }
  setMode(m) { this.isTalkMode = (m === 'talk'); document.getElementById('mode-listen').classList.toggle('active', !this.isTalkMode); document.getElementById('mode-talk').classList.toggle('active', this.isTalkMode); this.newTarget(); }
  reset() { this.level = 1; this.score = 0; this.streak = 0; this.xp = 0; this.maxXP = 5; this.unlockedAnimals = []; this.saveProfile(); this.updateStats(); this.updateCollectionButton(); this.newTarget(); }

  bindEvents() {
    document.getElementById('next-to-avatar-btn')?.addEventListener('click', () => this.showAvatarDesigner(true));
    document.getElementById('next-to-lang-btn')?.addEventListener('click', () => { 
      this.playSFX('click'); 
      const avatarScreen = document.getElementById('create-step-avatar');
      if (avatarScreen && avatarScreen.style.display !== 'none') {
        avatarScreen.style.display = 'none';
        document.getElementById('create-step-2').style.display = 'block';
      }
    });
    document.getElementById('create-player-btn')?.addEventListener('click', () => { this.playSFX('click'); this.createProfile(); });
    document.getElementById('back-to-name-btn')?.addEventListener('click', () => { 
      this.playSFX('click'); 
      document.getElementById('create-step-avatar').style.display = 'none';
      document.getElementById('create-step-1').style.display = 'block'; 
    });
    document.getElementById('show-new-profile-btn')?.addEventListener('click', () => { 
      this.playSFX('click'); 
      document.getElementById('profile-select-view').style.display = 'none'; 
      document.getElementById('profile-create-view').style.display = 'block'; 
      document.getElementById('create-step-1').style.display = 'block'; 
      document.getElementById('create-step-avatar').style.display = 'none';
      document.getElementById('create-step-2').style.display = 'none'; 
    });
    document.getElementById('new-player-en')?.addEventListener('click', () => this.setLang('en'));
    document.getElementById('new-player-fr')?.addEventListener('click', () => this.setLang('fr'));
    document.getElementById('request-mic-btn')?.addEventListener('click', () => this.requestMicAccess());
    document.getElementById('mic-test-btn')?.addEventListener('click', () => this.startListening(true));
    document.getElementById('mode-listen').addEventListener('click', () => this.setMode('listen'));
    document.getElementById('mode-talk').addEventListener('click', () => this.setMode('talk'));
    document.getElementById('avatar-btn').addEventListener('click', () => this.showAvatarDesigner());
    document.getElementById('sidebar-toggle').addEventListener('click', () => { this.playSFX('click'); document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebar-overlay').style.display = 'block'; });
    document.getElementById('sidebar-close').addEventListener('click', () => { this.playSFX('click'); document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').style.display = 'none'; });
    document.getElementById('sidebar-overlay').addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').style.display = 'none'; });
    document.getElementById('new-game').addEventListener('click', () => { if(confirm("Reset progress?")) this.reset(); });
    document.getElementById('delete-profile-btn').addEventListener('click', () => this.deleteCurrentProfile());
    document.getElementById('store-btn').addEventListener('click', () => this.showStoreScreen());
    document.getElementById('quests-btn-top')?.addEventListener('click', () => this.showQuestsScreen());
    document.getElementById('font-standard-btn')?.addEventListener('click', () => this.setFont(false));
    document.getElementById('font-dyslexic-btn')?.addEventListener('click', () => this.setFont(true));
    document.getElementById('close-quests-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('quests-screen').style.display = 'none'; });
    document.getElementById('shop-btn').addEventListener('click', () => this.showShopScreen());
    document.getElementById('shop-btn-sidebar')?.addEventListener('click', () => this.showShopScreen());
    document.getElementById('close-shop-btn').addEventListener('click', () => { this.playSFX('click'); document.getElementById('shop-screen').style.display = 'none'; });
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
