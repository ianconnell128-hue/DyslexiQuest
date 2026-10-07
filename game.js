
// ─────────────────────────────────────────────────────────────────────────────
//  dyslexiquest.com – game.js
// ─────────────────────────────────────────────────────────────────────────────

const QUEST_TEMPLATES = [
  { id: 'correct_words', text: 'Master {target} words', targets: [10, 20, 30], reward: 200 },
  { id: 'level_up', text: 'Level up {target} times', targets: [1, 2], reward: 300 },
  { id: 'use_talk', text: 'Use Talk Mode {target} times', targets: [5, 10], reward: 150 },
  { id: 'streak', text: 'Get a streak of {target}', targets: [10, 15, 20], reward: 250 },
  { id: 'capture_animal', text: 'Capture {target} animals', targets: [1, 2, 3], reward: 400 },
  { id: 'battle_win', text: 'Win {target} Arena Battles', targets: [1, 3], reward: 500 },
  { id: 'spend_coins', text: 'Spend {target} DyslexiCoins', targets: [200, 500, 1000], reward: 300 },
  { id: 'change_song', text: 'Try a different music track', targets: [1], reward: 100 }
];

const SONGS = {
  1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  4: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  5: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  6: 'https://raw.githubusercontent.com/effacestudios/Royalty-Free-Music-Pack/master/technologist.mp3',
  7: 'https://raw.githubusercontent.com/Solanacean/GrimoireDigiMusicDLL/master/Music/!UPBEAT.mp3'
};

// ── 3-D collectible characters ──────────────────────────────────────────────
const ANIMALS = [
  { name: 'Swift Fox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'A clever forest friend known for outsmarting larger predators. It leaves a trail of tiny glowing footprints when it runs.', powers: 'Speed', bg: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)' },
  { name: 'Puddle Duck', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', color: '#94a3b8', rarity: 'Common', story: 'The bravest swimmer in the shallow ponds. It wears a magical water-resistant coat that reflects sunlight like a prism.', powers: 'Water Shield', bg: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)' },
  { name: 'Gallopy Horse', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#94a3b8', rarity: 'Common', story: 'Fast and free, this wild horse roams the open plains. Its hooves strike the ground with the sound of distant thunder.', powers: 'Gallop', bg: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)' },
  { name: 'Cloud Eagle', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'A celestial bird that nests in the rings of Saturn. It can fly through the vacuum of space without ever getting tired.', powers: 'Wind Gust', bg: 'linear-gradient(135deg, #e0e7ff 0%, #6366f1 100%)' },
  { name: 'Forest Deer', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#94a3b8', rarity: 'Common', story: 'A gentle creature with antlers made of living wood. It is said that wherever it walks, flowers bloom instantly.', powers: 'Nature Heal', bg: 'linear-gradient(135deg, #ecfdf5 0%, #10b981 100%)' },
  { name: 'Mystery Box', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', color: '#94a3b8', rarity: 'Common', story: 'An enigmatic block of unknown origin. It constantly shifts its weight and occasionally hums a low, resonant tone.', powers: 'Blast', bg: 'linear-gradient(135deg, #f1f5f9 0%, #64748b 100%)' },
  { name: 'Spotted Leopard', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#94a3b8', rarity: 'Common', story: 'A master of camouflage in the dappled sunlight. It can move as silently as a ghost through the thickest jungle.', powers: 'Stealth', bg: 'linear-gradient(135deg, #fffbeb 0%, #fbbf24 100%)' },
  { name: 'Pink Flamingo', env: 'water', model: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb', color: '#94a3b8', rarity: 'Common', story: 'A graceful bird that loves to stand on one leg. Its pink feathers glow with a soft light at sunset.', powers: 'Splash', bg: 'linear-gradient(135deg, #fce7f3 0%, #db2777 100%)' },
  { name: 'Graceful Alpaca', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/alpaca.glb', color: '#94a3b8', rarity: 'Common', story: 'Known for its incredibly soft wool and gentle nature. It hums softly to itself while wandering the high mountains.', powers: 'Wool-Cloud', bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)' },
  { name: 'Brave Donkey', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/donkey.glb', color: '#94a3b8', rarity: 'Common', story: 'A loyal and hardworking companion. Its stubbornness is actually its greatest strength when protecting its friends.', powers: 'Kick', bg: 'linear-gradient(135deg, #fef3c7 0%, #92400e 100%)' },
  { name: 'Highland Cow', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/cow.glb', color: '#94a3b8', rarity: 'Common', story: 'A peaceful giant with long, shaggy hair. It loves to munch on magical clover and provide warmth to smaller animals.', powers: 'Moo-Blast', bg: 'linear-gradient(135deg, #fffbeb 0%, #d97706 100%)' },
  { name: 'Snowy Owl', env: 'space', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/owl.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A silent hunter of the night. Its eyes can see through the thickest clouds and track movement across entire continents.', powers: 'Night-Vision', bg: 'linear-gradient(135deg, #f1f5f9 0%, #1e293b 100%)' },
  { name: 'Brave Rabbit', env: 'land', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/rabbit.glb', color: '#94a3b8', rarity: 'Common', story: 'Small but incredibly fast. It can hop over entire mountains if it gets enough of a head start.', powers: 'Super-Jump', bg: 'linear-gradient(135deg, #f1f5f9 0%, #475569 100%)' },
  { name: 'Chompy Shark', env: 'water', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'The undisputed king of the coral reefs. It guards sunken treasure ships and only eats magical, deep-sea kelp.', powers: 'Bite', bg: 'linear-gradient(135deg, #bae6fd 0%, #0284c7 100%)' },
  { name: 'Colorful Parrot', env: 'space', model: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Parrot.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A talkative friend from the jungle. It can mimic any sound it hears, even the sound of a spaceship engine!', powers: 'Echo', bg: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)' },
  { name: 'Sky Seagull', env: 'water', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/seagull.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A coastal explorer that loves to dive for glowing fish. Its cry can be heard from miles away.', powers: 'Dive', bg: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)' },
  { name: 'Stone Golem', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A creature made of ancient boulders and moss. It was built centuries ago to guard the secret entrance to the mountain.', powers: 'Earthquake', bg: 'linear-gradient(135deg, #f8fafc 0%, #334155 100%)' },
  { name: 'Zippy Alien', env: 'space', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/alien.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A friendly visitor from the Andromeda galaxy. It uses localized gravity fields to float above the ground and loves earth snacks.', powers: 'Gravity', bg: 'linear-gradient(135deg, #fae8ff 0%, #a21caf 100%)' },
  { name: 'Tiny T-Rex', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A mighty dinosaur trapped in a small body. What it lacks in size, it makes up for with an incredibly loud, earth-shaking roar.', powers: 'Roar', bg: 'linear-gradient(135deg, #fef2f2 0%, #b91c1c 100%)' },
  { name: 'Tri-Horn', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triceratops/glTF-Binary/Triceratops.glb', color: '#3b82f6', rarity: 'Rare', story: 'A three-horned defender of the prehistoric plains. It is famous for its massive bony frill and its powerful charging speed.', powers: 'Charge', bg: 'linear-gradient(135deg, #fef3c7 0%, #92400e 100%)' },
  { name: 'Spike Tail', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Stegosaurus/glTF-Binary/Stegosaurus.glb', color: '#3b82f6', rarity: 'Rare', story: 'A heavily armored herbivore with dangerous spikes on its tail. It uses its plated back to absorb sunlight and stay warm.', powers: 'Swipe', bg: 'linear-gradient(135deg, #dcfce7 0%, #166534 100%)' },
  { name: 'Sky Glider', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Pterodactyl/glTF-Binary/Pterodactyl.glb', color: '#8b5cf6', rarity: 'Epic', story: 'The undisputed ruler of the ancient skies. It can dive from incredible heights to surprise its prey with its sharp beak.', powers: 'Dive', bg: 'linear-gradient(135deg, #e0e7ff 0%, #4338ca 100%)' },
  { name: 'Swift Raptor', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Velociraptor/glTF-Binary/Velociraptor.glb', color: '#f43f5e', rarity: 'Epic', story: 'One of the fastest and smartest hunters to ever walk the earth. It works in small packs to outmaneuver much larger creatures.', powers: 'Pounce', bg: 'linear-gradient(135deg, #ffe4e6 0%, #9f1239 100%)' },
  { name: 'Apatosaurus', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/apatosaurus.glb', color: '#eab308', rarity: 'Legendary', story: 'A giant so large the earth trembles when it walks. It spent its days peacefully grazing on the tallest treetops.', powers: 'Earth-Stomp', bg: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)' },
  { name: 'Frost Wolf', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#a855f7', rarity: 'Rare', story: 'A guardian of the frozen north. Its fur is made of shimmering ice that never melts, even in the hottest sun.', powers: 'Blizzard', bg: 'linear-gradient(135deg, #e0e7ff 0%, #7c3aed 100%)' },
  { name: 'Pink Flamingo', env: 'water', model: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb', color: '#94a3b8', rarity: 'Common', story: 'A graceful bird that loves to stand on one leg. Its pink feathers glow with a soft light at sunset.', powers: 'Splash', bg: 'linear-gradient(135deg, #fce7f3 0%, #db2777 100%)' },
  { name: 'Colorful Parrot', env: 'space', model: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Parrot.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A talkative friend from the jungle. It can mimic any sound it hears, even the sound of a spaceship engine!', powers: 'Echo', bg: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)' },
  { name: 'Brave Rabbit', env: 'land', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/rabbit.glb', color: '#94a3b8', rarity: 'Common', story: 'Small but incredibly fast. It can hop over entire mountains if it gets enough of a head start.', powers: 'Super-Jump', bg: 'linear-gradient(135deg, #f1f5f9 0%, #475569 100%)' },
  { name: 'Golden Dragon', env: 'space', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#ef4444', rarity: 'Mythic', story: 'A legendary beast made of pure celestial gold. Its breath creates new stars in the night sky.', powers: 'Nova-Breath', bg: 'linear-gradient(135deg, #451a03 0%, #fbbf24 100%)' },
  { name: 'Noble Stag', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/stegosaurus.glb', color: '#94a3b8', rarity: 'Common', story: 'A majestic creature of the deep forest. Its presence brings peace to all who see it.', powers: 'Forest-Light', bg: 'linear-gradient(135deg, #dcfce7 0%, #166534 100%)' },
  { name: 'Strong Bull', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/bull.glb', color: '#94a3b8', rarity: 'Common', story: 'A powerhouse of muscle and determination. It never backs down from a challenge.', powers: 'Stampede', bg: 'linear-gradient(135deg, #fee2e2 0%, #ef4444 100%)' },
  { name: 'Mighty Elephant', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/elephant.glb', color: '#3b82f6', rarity: 'Rare', story: 'A gentle giant with memory that spans centuries. Its trunk can create powerful gusts of wind.', powers: 'Trunk-Blast', bg: 'linear-gradient(135deg, #f1f5f9 0%, #475569 100%)' },
  { name: 'Iron Rhino', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/rhino.glb', color: '#3b82f6', rarity: 'Rare', story: 'Built like a tank, this creature is the ultimate defender. Its horn is harder than diamond.', powers: 'Horn-Strike', bg: 'linear-gradient(135deg, #cbd5e1 0%, #1e293b 100%)' },
  { name: 'Big Splash Fish', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A river legend capable of creating mega splashes. Its scales are as tough as iron armor, protecting it from fierce currents.', powers: 'Armor', bg: 'linear-gradient(135deg, #eff6ff 0%, #1d4ed8 100%)' },
  { name: 'Dino King', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'The crowned ruler of the prehistoric valley. With a single stomp, it can summon shockwaves that topple ancient trees.', powers: 'Wave', bg: 'linear-gradient(135deg, #fdf2f8 0%, #db2777 100%)' },
  { name: 'Glowy Fish', env: 'water', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#3b82f6', rarity: 'Uncommon', story: 'A deep-sea wanderer equipped with a natural submarine detector. It illuminates the darkest trenches with neon bioluminescence.', powers: 'Glow', bg: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)' },
  { name: 'Star Phoenix', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#a855f7', rarity: 'Rare', story: 'A mythical bird born from the heart of a dying star. Its wings are made of pure solar flares that never go out.', powers: 'Sun Burn', bg: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)' },
  { name: 'Frost Wolf', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#a855f7', rarity: 'Rare', story: 'A giant wolf with fur made of icicles. It guards the frozen peaks and can freeze its enemies with a single howl.', powers: 'Blizzard', bg: 'linear-gradient(135deg, #4c1d95 0%, #db2777 100%)' },
  { name: 'Cosmic Whale', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb', color: '#a855f7', rarity: 'Rare', story: 'A massive creature that swims through the ocean of stars. It sings songs that can be heard across entire solar systems.', powers: 'Echo', bg: 'linear-gradient(135deg, #2e1065 0%, #9333ea 100%)' },
  { name: 'Royal Gryphon', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#a855f7', rarity: 'Rare', story: 'Half lion and half eagle, this majestic beast is the protector of the high king. It is loyal only to the brave.', powers: 'Air Strike', bg: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)' },
  { name: 'Magical Pegasus', env: 'land', model: 'https://modelviewer.dev/shared-assets/models/Horse.glb', color: '#f97316', rarity: 'Epic', story: 'A winged horse that can fly between the clouds. It is said that seeing a Pegasus brings seven years of good luck.', powers: 'Sky Dive', bg: 'linear-gradient(135deg, #451a03 0%, #ea580c 100%)' },
  { name: 'Ancient Kraken', env: 'water', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#f97316', rarity: 'Epic', story: 'A giant of the deep that was once thought to be a myth. It can create whirlpools just by flicking its massive tail.', powers: 'Whirlpool', bg: 'linear-gradient(135deg, #0f172a 0%, #ef4444 100%)' },
  { name: 'Wizened Dragon', env: 'land', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#eab308', rarity: 'Legendary', story: 'A mythical beast of immense ancient wisdom. Having guarded the mountain peak for millennia, it controls the very essence of fire.', powers: 'Fire', bg: 'linear-gradient(135deg, #422006 0%, #d97706 100%)' },
  { name: 'Shiny Gold Fox', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb', color: '#eab308', rarity: 'Legendary', story: 'A creature of pure luck and fortune. Legend says that anyone who touches its shimmering coat is blessed with endless prosperity.', powers: 'Touch', bg: 'linear-gradient(135deg, #78350f 0%, #fbbf24 100%)' },
  { name: 'Nebula Dragon', env: 'space', model: 'https://assets.babylonjs.com/meshes/Georgia-Tech-Dragon/dragonUV.glb', color: '#ef4444', rarity: 'Mythic', story: 'A legendary dragon that lives inside colorful space nebulae. Its scales reflect the light of a thousand distant stars.', powers: 'Stardust', bg: 'linear-gradient(135deg, #000000 0%, #ef4444 100%)' },
  { name: 'Space Shark', env: 'space', model: 'https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/shark.glb', color: '#ef4444', rarity: 'Mythic', story: 'A terrifying and majestic star swimmer. It cruises through asteroid belts, capable of gulping down entire comets in a single bite.', powers: 'Gulp', bg: 'linear-gradient(135deg, #020617 0%, #3b82f6 100%)' },
  { name: 'Tri-Horn', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triceratops/glTF-Binary/Triceratops.glb', color: '#3b82f6', rarity: 'Rare', story: 'A three-horned defender of the prehistoric plains. It is famous for its massive bony frill and its powerful charging speed.', powers: 'Charge', bg: 'linear-gradient(135deg, #fef3c7 0%, #92400e 100%)' },
  { name: 'Spike Tail', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Stegosaurus/glTF-Binary/Stegosaurus.glb', color: '#3b82f6', rarity: 'Rare', story: 'A heavily armored herbivore with dangerous spikes on its tail. It uses its plated back to absorb sunlight and stay warm.', powers: 'Swipe', bg: 'linear-gradient(135deg, #dcfce7 0%, #166534 100%)' },
  { name: 'Sky Glider', env: 'space', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Pterodactyl/glTF-Binary/Pterodactyl.glb', color: '#8b5cf6', rarity: 'Epic', story: 'The undisputed ruler of the ancient skies. It can dive from incredible heights to surprise its prey with its sharp beak.', powers: 'Dive', bg: 'linear-gradient(135deg, #e0e7ff 0%, #4338ca 100%)' },
  { name: 'Swift Raptor', env: 'land', model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Velociraptor/glTF-Binary/Velociraptor.glb', color: '#f43f5e', rarity: 'Epic', story: 'One of the fastest and smartest hunters to ever walk the earth. It works in small packs to outmaneuver much larger creatures.', powers: 'Pounce', bg: 'linear-gradient(135deg, #ffe4e6 0%, #9f1239 100%)' },
  { name: 'Ankylosaurus', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/ankylosaurus.glb', color: '#3b82f6', rarity: 'Rare', story: 'A walking fortress with a heavy tail-club. It is nearly impossible for predators to break through its thick armor plates.', powers: 'Tail-Club', bg: 'linear-gradient(135deg, #eff6ff 0%, #1d4ed8 100%)' },
  { name: 'Parasaurolophus', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/parasaurolophus.glb', color: '#10b981', rarity: 'Uncommon', story: 'Known for the musical crest on its head. It can communicate with its herd over long distances using trumpet-like sounds.', powers: 'Sonic-Crest', bg: 'linear-gradient(135deg, #ecfdf5 0%, #059669 100%)' },
  { name: 'Pachy', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/pachycephalosaurus.glb', color: '#f59e0b', rarity: 'Rare', story: 'The head-butt champion of the dinosaur world. Its skull is 10 inches thick, making it a formidable opponent in any scuffle.', powers: 'Head-Butt', bg: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)' },
  { name: 'Apatosaurus', env: 'land', model: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/apatosaurus.glb', color: '#eab308', rarity: 'Legendary', story: 'A giant so large the earth trembles when it walks. It spent its days peacefully grazing on the tallest treetops.', powers: 'Earth-Stomp', bg: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)' },
  { name: 'Cyber Dino', env: 'land', model: 'https://raw.githubusercontent.com/adityakeyal/blender-models/main/Trex.glb', color: '#ef4444', rarity: 'Mythic', story: 'An unstoppable beast from the distant future. Combining raw prehistoric power with advanced cybernetics, it is the ultimate apex predator.', powers: 'Cyber', bg: 'linear-gradient(135deg, #111827 0%, #10b981 100%)' }
];

const RARITY_WEIGHTS = { 'Common': 60, 'Uncommon': 25, 'Rare': 10, 'Epic': 4, 'Legendary': 0.9, 'Mythic': 0.1 };
const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
// TREASURE SELL PRICES ($ - Realistic scale)
const SELL_PRICES = { 'Common': 50, 'Uncommon': 100, 'Rare': 250, 'Epic': 500, 'Legendary': 1000, 'Mythic': 2500 };

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
  // HATS (15 items) - Realistic Day Prices ($25 - $150)
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

  // SHIRTS (15 items) - Realistic Day Prices ($40 - $300)
  { id: 'shirt_1', name: 'Soldier Tunic', cat: 'Shirts', model: MODELS.cesium, price: 40, icon: '🥋' },
  { id: 'shirt_2', name: 'Cesium Top', cat: 'Shirts', model: MODELS.cesium, price: 55, icon: '👕' },
  { id: 'shirt_3', name: 'Yellow Uniform', cat: 'Shirts', model: MODELS.cesium, price: 65, icon: '🦺' },
  { id: 'shirt_4', name: 'Astro Top', cat: 'Shirts', model: MODELS.astro, price: 80, icon: '👕' },
  { id: 'shirt_5', name: 'Heroic Plate', cat: 'Shirts', model: MODELS.figure, price: 45, icon: '👕' },
  { id: 'shirt_6', name: 'Nature Suit', cat: 'Shirts', model: MODELS.cesium, price: 95, icon: '🧥' },
  { id: 'shirt_7', name: 'Classic Figure', cat: 'Shirts', model: MODELS.figure, price: 150, icon: '🦸' },
  { id: 'shirt_8', name: 'Armor Set', cat: 'Shirts', model: MODELS.cesium, price: 250, icon: '🛡️' },
  { id: 'shirt_9', name: 'Space Explorer', cat: 'Shirts', model: MODELS.astro, price: 200, icon: '🚀' },
  { id: 'shirt_10', name: 'Fancy Dress', cat: 'Shirts', model: MODELS.michelle, price: 120, icon: '👗' },
  { id: 'shirt_11', name: 'Adventure Gear', cat: 'Shirts', model: MODELS.cesium, price: 75, icon: '🦺' },
  { id: 'shirt_12', name: 'Gym Suit', cat: 'Shirts', model: MODELS.figure, price: 60, icon: '🎽' },
  { id: 'shirt_13', name: 'Commander Gear', cat: 'Shirts', model: MODELS.cesium, price: 180, icon: '👔' },
  { id: 'shirt_14', name: 'Modern Style', cat: 'Shirts', model: MODELS.michelle, price: 50, icon: '👚' },
  { id: 'shirt_15', name: 'Arctic Suit', cat: 'Shirts', model: MODELS.cesium, price: 140, icon: '🧥' },

  // PANTS (15 items) - Realistic Day Prices ($50 - $350)
  { id: 'pants_1', name: 'Combat Slacks', cat: 'Pants', model: MODELS.cesium, price: 65, icon: '👖' },
  { id: 'pants_2', name: 'Duty Pants', cat: 'Pants', model: MODELS.cesium, price: 75, icon: '👖' },
  { id: 'pants_3', name: 'Trail Pants', cat: 'Pants', model: MODELS.cesium, price: 85, icon: '👖' },
  { id: 'pants_4', name: 'Urban Jeans', cat: 'Pants', model: MODELS.cesium, price: 60, icon: '👖' },
  { id: 'pants_5', name: 'Summer Outfit', cat: 'Pants', model: MODELS.michelle, price: 45, icon: '🩳' },
  { id: 'pants_6', name: 'Sport Gear', cat: 'Pants', model: MODELS.michelle, price: 55, icon: '🩳' },
  { id: 'pants_7', name: 'Heroic Skirt', cat: 'Pants', model: MODELS.figure, price: 180, icon: '👗' },
  { id: 'pants_8', name: 'Lunar Pants', cat: 'Pants', model: MODELS.astro, price: 150, icon: '👖' },
  { id: 'pants_9', name: 'Elite Uniform', cat: 'Pants', model: MODELS.cesium, price: 95, icon: '👖' },
  { id: 'pants_10', name: 'Jogging Suit', cat: 'Pants', model: MODELS.cesium, price: 50, icon: '👖' },
  { id: 'pants_11', name: 'Royal Robes', cat: 'Pants', model: MODELS.figure, price: 220, icon: '👘' },
  { id: 'pants_12', name: 'Aviator Pants', cat: 'Pants', model: MODELS.astro, price: 140, icon: '👖' },
  { id: 'pants_13', name: 'Tactical Gear', cat: 'Pants', model: MODELS.cesium, price: 110, icon: '👖' },
  { id: 'pants_14', name: 'Denim Style', cat: 'Pants', model: MODELS.michelle, price: 50, icon: '👖' },
  { id: 'pants_15', name: 'Thermal Suit', cat: 'Pants', model: MODELS.cesium, price: 90, icon: '👖' },

  // SHOES (15 items) - Realistic Day Prices ($80 - $500)
  { id: 'shoes_1', name: 'Heroic Boots', cat: 'Shoes', model: MODELS.figure, price: 120, icon: '👢' },
  { id: 'shoes_2', name: 'Pro Athlete', cat: 'Shoes', model: MODELS.figure, price: 140, icon: '👟' },
  { id: 'shoes_3', name: 'Fast Runner', cat: 'Shoes', model: MODELS.cesium, price: 110, icon: '👟' },
  { id: 'shoes_4', name: 'Heavy Duty', cat: 'Shoes', model: MODELS.cesium, price: 130, icon: '🥾' },
  { id: 'shoes_5', name: 'Galactic Boots', cat: 'Shoes', model: MODELS.astro, price: 250, icon: '🚀' },
  { id: 'shoes_6', name: 'Nomad Sandals', cat: 'Shoes', model: MODELS.figure, price: 80, icon: '👡' },
  { id: 'shoes_7', name: 'Gilded Shoes', cat: 'Shoes', model: MODELS.michelle, price: 500, icon: '👠' },
  { id: 'shoes_8', name: 'Street Sneakers', cat: 'Shoes', model: MODELS.cesium, price: 90, icon: '👟' },
  { id: 'shoes_9', name: 'Army Boots', cat: 'Shoes', model: MODELS.cesium, price: 160, icon: '🥾' },
  { id: 'shoes_10', name: 'Moon Walkers', cat: 'Shoes', model: MODELS.astro, price: 350, icon: '⛸️' },
  { id: 'shoes_11', name: 'Royal Flats', cat: 'Shoes', model: MODELS.michelle, price: 95, icon: '🥿' },
  { id: 'shoes_12', name: 'Mountain Boots', cat: 'Shoes', model: MODELS.cesium, price: 150, icon: '🥾' },
  { id: 'shoes_13', name: 'Regal Slippers', cat: 'Shoes', model: MODELS.figure, price: 280, icon: '🥿' },
  { id: 'shoes_14', name: 'Steel Sabatons', cat: 'Shoes', model: MODELS.cesium, price: 320, icon: '🛡️' },
  { id: 'shoes_15', name: 'Gravity Shoes', cat: 'Shoes', model: MODELS.astro, price: 400, icon: '🪐' },

  // SETS (17 items) - High End Prices ($0 - $5000)
  { id: 'set_0m', name: 'Base Boy', cat: 'Sets', model: MODELS.cesium, price: 0, icon: '🧍‍♂️' },
  { id: 'set_0f', name: 'Base Girl', cat: 'Sets', model: MODELS.michelle, price: 0, icon: '🧍‍♀️' },
  { id: 'set_1', name: 'Hero Spirit', cat: 'Sets', model: MODELS.figure, price: 500, icon: '🦸' },
  { id: 'set_2', name: 'Iron Knight', cat: 'Sets', model: MODELS.cesium, price: 750, icon: '⚔️' },
  { id: 'set_3', name: 'Explorer Form', cat: 'Sets', model: MODELS.cesium, price: 600, icon: '🗺️' },
  { id: 'set_4', name: 'Dancer Spirit', cat: 'Sets', model: MODELS.figure, price: 550, icon: '💃' },
  { id: 'set_5', name: 'Marine Suit', cat: 'Sets', model: MODELS.cesium, price: 850, icon: '⚓' },
  { id: 'set_6', name: 'Superstar Form', cat: 'Sets', model: MODELS.michelle, price: 1200, icon: '🌟' },
  { id: 'set_7', name: 'Space Cadet', cat: 'Sets', model: MODELS.astro, price: 1000, icon: '🚀' },
  { id: 'set_8', name: 'Elite Guard', cat: 'Sets', model: MODELS.cesium, price: 1500, icon: '🛡️' },
  { id: 'set_9', name: 'Royal Hero', cat: 'Sets', model: MODELS.figure, price: 2000, icon: '👑' },
  { id: 'set_10', name: 'Astro Pilot', cat: 'Sets', model: MODELS.astro, price: 1800, icon: '🛸' },
  { id: 'set_11', name: 'Fox Spirit Suit', cat: 'Sets', model: MODELS.fox, price: 2500, icon: '🦊' },
  { id: 'set_12', name: 'Mecha-Human', cat: 'Sets', model: MODELS.robot, price: 3000, icon: '🤖' },
  { id: 'set_13', name: 'Shadow Stalker', cat: 'Sets', model: MODELS.cesium, price: 3500, icon: '🥷' },
  { id: 'set_14', name: 'Mythic Guardian', cat: 'Sets', model: MODELS.michelle, price: 4000, icon: '✨' },
  { id: 'set_15', name: 'Celestial God', cat: 'Sets', model: MODELS.figure, price: 5000, icon: '⚡' }
];

const SHOP_CATEGORIES = ['All', 'Hats', 'Shirts', 'Pants', 'Shoes', 'Sets'];

const PACKS = [
  { id: 'pack_aquatic', name: 'Aquatic Pack', cat: 'Packs', price: 200, color: '#0ea5e9', env: 'water', icon: '🌊' },
  { id: 'pack_space', name: 'Space Pack', cat: 'Packs', price: 350, color: '#8b5cf6', env: 'space', icon: '🚀' },
  { id: 'pack_forest', name: 'Forest Pack', cat: 'Packs', price: 150, color: '#10b981', env: 'land', icon: '🌲' },
  { id: 'pack_elemental', name: 'Elemental Core', cat: 'Packs', price: 500, color: '#f43f5e', env: 'all', icon: '☄️' },
  { id: 'pack_prehistoric', name: 'Prehistoric Pack', cat: 'Packs', price: 400, color: '#92400e', env: 'land', icon: '🦴' }
];

const AVATAR_MODELS = {
  male: MODELS.cesium,
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
    const levelNum = parseInt(chunks[i], 10), body = chunks[i + 1] || '';
    const lines = body.split('\n').filter(l => !l.trim().startsWith('#') && !l.trim().toLowerCase().startsWith('terminaisons'));
    const items = lines.join(',').split(',');
    const seen = new Set(), words = [];
    for (const item of items) {
      const w = item.trim().toLowerCase().replace(/[!.]/g, '');
      if (w.length >= 1 && !seen.has(w) && !/^(niveau|level|titre|title|terminaisons)$/i.test(w)) {
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
    this.isFrench = true; this.isTalkMode = true; this.micGranted = false; this.micTested = false; this.isTestMode = false;
    this.targetWord = null; this.unlockedAnimals = []; this.currentPool = []; this.selectedVoiceURI = null;
    this.gender = 'male';
    this.avatarModel = AVATAR_MODELS.male; this.nextUnlockLevel = 1;
    this.coins = 0; this.unlockedAvatars = ['set_0m', 'set_0f'];
    this.avatarColors = { skin: COLORS.skin[0], hair: COLORS.hair[0], eye: COLORS.eye[0] };
    this.activeQuests = []; this.lastQuestRefresh = null;
    this.currentSong = 1;
    this.equippedPets = []; this.bgm = new Audio(SONGS[this.currentSong]); this.bgm.loop = true; this.bgm.volume = 0.2;
    this.musicEnabled = true;
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
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        const targetId = this.isTestMode ? 'mic-test-btn' : 'mic-btn';
        const micBtn = document.getElementById(targetId);
        if (micBtn) micBtn.classList.add('mic-listening');

        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);
        if (feedback) feedback.innerHTML = '<span style="color:var(--danger)">👂 Listening...</span>';
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        const allCandidates = [];

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          for (let j = 0; j < res.length; j++) {
            const transcript = (res[j].transcript || '').toLowerCase().trim();
            if (transcript && !allCandidates.includes(transcript)) {
              allCandidates.push(transcript);
            }
          }
          if (res.isFinal) {
            finalTranscript += (res[0].transcript || '').toLowerCase().trim();
          } else {
            interimTranscript += (res[0].transcript || '').toLowerCase().trim();
          }
        }

        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);

        if (finalTranscript || (allCandidates.length > 0 && event.results[event.results.length - 1].isFinal)) {
          const mainResult = finalTranscript || allCandidates[0];
          if (this.isTestMode) this.handleTestResult(mainResult, allCandidates);
          else this.handleSpeechResult(mainResult, allCandidates);
        } else if (feedback && interimTranscript) {
          const safeInterim = interimTranscript.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          feedback.innerHTML = `Hearing: <b style="color:var(--primary)">"${safeInterim}..."</b>`;
        }
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        this.isListening = false;
        const feedbackId = this.isTestMode ? 'mic-test-feedback' : 'speech-feedback';
        const feedback = document.getElementById(feedbackId);
        if (feedback) {
          if (event.error === 'no-speech') feedback.textContent = "No speech heard. Tap mic to speak!";
          else if (event.error === 'not-allowed') feedback.textContent = "Mic access blocked! Please enable in settings.";
          else if (event.error === 'busy') feedback.textContent = "Mic busy. Tap to try again!";
          else if (event.error === 'network') feedback.innerHTML = '<span style="color:var(--secondary)">Tap mic to speak! 🎤</span>';
          else feedback.textContent = "Tap mic to speak!";
        }
        const targetId = this.isTestMode ? 'mic-test-btn' : 'mic-btn';
        const micBtn = document.getElementById(targetId);
        if (micBtn) micBtn.classList.remove('mic-listening');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        const targetId = this.isTestMode ? 'mic-test-btn' : 'mic-btn';
        const micBtn = document.getElementById(targetId);
        if (micBtn) micBtn.classList.remove('mic-listening');
      };
    }
  }
  async start() {
    try { this.bindEvents(); } catch (e) { console.error("bindEvents failed", e); }
    try { await this.loadWordFiles(); } catch (e) { console.error("loadWordFiles failed", e); }
    this.hideLoading(); 
    this.showProfileSelect();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => this.populateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices(); setTimeout(updateVoices, 500);
    }
  }

  playSFX(name) {
    let played = false;
    if (this.sounds[name]) {
      try {
        this.sounds[name].currentTime = 0;
        const p = this.sounds[name].play();
        if (p) {
          p.then(() => { played = true; }).catch(() => { this.synthSFX(name); });
        } else {
          played = true;
        }
      } catch(e) {
        this.synthSFX(name);
      }
    } else {
      this.synthSFX(name);
    }
  }

  synthSFX(name) {
    try {
      const ctx = this.audioCtx || (this.audioCtx = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      if (name === 'click') {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.frequency.setValueAtTime(800, now);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.05);
      } else if (name === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator(), g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.2, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.2);
        });
      } else if (name === 'wrong') {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        g.gain.setValueAtTime(0.18, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.25);
      } else if (name === 'levelUp') {
        [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
          const osc = ctx.createOscillator(), g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.25, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.35);
        });
      }
    } catch(e) {}
  }
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
    overlay.style.display = 'flex'; 
    
    // Always refresh users from localStorage to ensure all profiles are present
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    const userKeys = Object.keys(this.users);
    
    if (userKeys.length > 0) {
      selectView.style.display = 'block'; 
      createView.style.display = 'none'; 
      list.innerHTML = '';
      
      // Sort users by level (highest to lowest)
      const sortedKeys = [...userKeys].sort((a, b) => (this.users[b].level || 1) - (this.users[a].level || 1));
      const maxLevel = this.users[sortedKeys[0]].level || 1;

      sortedKeys.forEach(id => {
        try {
          const u = this.users[id];
          if (!u) return;
          
          const btn = document.createElement('button');
          const isTop = u.level === maxLevel && u.level > 0;
          const crown = isTop ? '<span style="margin-right:8px; font-size: 1.2rem;">👑</span>' : '';
          
          // Generate a short ID for display (Safely)
          let shortId = "No Animal";
          const pet = (u.equippedPets && u.equippedPets.length > 0) ? u.equippedPets[0] : (u.unlockedAnimals && u.unlockedAnimals.length > 0 ? u.unlockedAnimals[0] : null);
          
          if (pet) {
            const data = ANIMALS.find(a => a.name === pet.animalName);
            if (data) {
              const battleData = { n: pet.petName, m: data.model, r: data.rarity, p: data.powers, h: 100 + (u.level * 10) };
              shortId = btoa(JSON.stringify(battleData)).substring(0, 8);
            }
          }

          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'space-between'; 
          btn.style.background = isTop ? 'linear-gradient(to right, #fefce8, #f8fafc)' : '#f8fafc';
          btn.style.width = '100%'; 
          btn.style.marginBottom = '10px';
          btn.style.border = isTop ? '2px solid #facc15' : '1px solid #e2e8f0';
          
          btn.innerHTML = `
            <div style="display:flex; align-items:center; gap: 15px;">
              <div style="width: 50px; height: 50px; background: white; border-radius: 12px; border: 2px solid #e2e8f0; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <model-viewer src="${u.avatarModel || AVATAR_MODELS.male}" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width: 100%; height: 100%;" autoplay animation-name="Idle"></model-viewer>
              </div>
              <div style="display:flex; flex-direction:column; align-items:flex-start;">
                <div style="display:flex; align-items:center;">
                  ${crown}
                  <span style="font-weight: 800;">${u.name}</span>
                </div>
                <span style="font-size: 0.6rem; opacity: 0.6; font-family: monospace;">ID: ${shortId}</span>
              </div>
            </div> 
            <span style="font-size:0.8em; color:var(--text-light); font-weight:700; background: white; padding: 4px 10px; border-radius: 10px; border: 1px solid #f1f5f9;">Lvl ${u.level || 1}</span>
          `;
          
          btn.addEventListener('click', () => { this.playSFX('click'); this.loadProfile(id); });
          list.appendChild(btn);
        } catch (e) {
          console.error("Failed to render profile:", id, e);
        }
      });
    } else { 
      selectView.style.display = 'none'; 
      createView.style.display = 'block'; 
      document.getElementById('create-step-1').style.display = 'block'; 
      document.getElementById('create-step-avatar').style.display = 'none'; 
      document.getElementById('create-step-2').style.display = 'none'; 
    }
  }

  loadProfile(id) {
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    const u = this.users[id];
    if (!u) {
      this.showProfileSelect();
      return;
    }
    this.currentUser = id;
    this.level = u.level || 1; this.score = u.score || 0; this.streak = u.streak || 0; this.xp = u.xp || 0;
    this.maxXP = 5 + (this.level - 1) * 5;
    this.isFrench = (u.isFrench !== undefined) ? u.isFrench : true;
    this.isTalkMode = (u.isTalkMode !== undefined) ? u.isTalkMode : true;
    this.unlockedAnimals = u.unlockedAnimals || []; this.selectedVoiceURI = u.selectedVoiceURI || null;
    this.micGranted = (u.micGranted !== undefined) ? u.micGranted : Boolean(window.AndroidSpeechBridge);
    this.micTested = (u.micTested !== undefined) ? u.micTested : Boolean(window.AndroidSpeechBridge);
    this.gender = u.gender || 'male';
    this.avatarModel = u.avatarModel || AVATAR_MODELS.male;
    this.coins = u.coins || 0;
    this.unlockedAvatars = u.unlockedAvatars || ['set_0m', 'set_0f'];
    // Migration for URLs to IDs
    this.unlockedAvatars = this.unlockedAvatars.map(item => {
      if (typeof item === 'string' && item.startsWith('http')) {
        const gear = GEAR_SHOP.find(g => g.model === item);
        return gear ? gear.id : item;
      }
      return item;
    });
    this.avatarColors = u.avatarColors || { skin: COLORS.skin[0], hair: COLORS.hair[0], eye: COLORS.eye[0] };
    this.activeQuests = u.activeQuests || []; this.lastQuestRefresh = u.lastQuestRefresh || null;
    this.equippedPets = u.equippedPets || (u.equippedPet ? [u.equippedPet] : []); 
    this.notifications = u.notifications || [];
    this.friends = u.friends || [];
    this.dyslexicFont = u.dyslexicFont || false;
    this.musicEnabled = (u.musicEnabled !== undefined) ? u.musicEnabled : true;
    this.currentSong = u.currentSong || 1;
    this.setSong(this.currentSong, false); 
    this.startGameplay();
  }

  createProfile() {
    const name = document.getElementById('new-player-name').value.trim() || 'Adventurer';
    const id = Date.now().toString();
    const isFr = document.getElementById('new-player-fr') ? document.getElementById('new-player-fr').classList.contains('active') : true;
    
    // START WITH FRESH DEFAULTS for new profiles (Default to French and Talk mode)
    this.users[id] = {
      name: name, level: 1, score: 0, streak: 0, xp: 0,
      isFrench: isFr,
      isTalkMode: true,
      unlockedAnimals: [], selectedVoiceURI: null,
      micGranted: Boolean(window.AndroidSpeechBridge),
      micTested: Boolean(window.AndroidSpeechBridge),
      gender: this.gender, avatarModel: this.avatarModel,
      coins: 0, unlockedAvatars: ['set_0m', 'set_0f'], 
      avatarColors: { skin: COLORS.skin[0], hair: COLORS.hair[0], eye: COLORS.eye[0] },
      equippedPets: [], notifications: [], currentSong: 1
    };
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users)); this.loadProfile(id);
  }

  saveProfile() {
    if (!this.currentUser) return;
    const allUsers = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    const profile = {
      level: this.level, score: this.score, streak: this.streak, xp: this.xp,
      cloudCode: this.users[this.currentUser].cloudCode,
      isFrench: this.isFrench,
      isTalkMode: this.isTalkMode,
      unlockedAnimals: this.unlockedAnimals,
      selectedVoiceURI: this.selectedVoiceURI, micTested: this.micTested,
      gender: this.gender, avatarModel: this.avatarModel,
      coins: this.coins, unlockedAvatars: this.unlockedAvatars, avatarColors: this.avatarColors,
      activeQuests: this.activeQuests, lastQuestRefresh: this.lastQuestRefresh,
      equippedPets: this.equippedPets, notifications: this.notifications, friends: this.friends, dyslexicFont: this.dyslexicFont,
      musicEnabled: this.musicEnabled, currentSong: this.currentSong
    };
    allUsers[this.currentUser] = {
      ...allUsers[this.currentUser],
      ...profile,
      name: this.users[this.currentUser].name
    };
    this.users = allUsers;
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    
    this.syncWithCloud(this.currentUser, profile);
    this.checkForCloudBeams();
  }

  async syncWithCloud(id, data) {
    try {
      await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `dq_v7_profile_${id}`,
          data: { ...data, name: this.users[id].name, id: id, networkId: this.networkId, lastSeen: Date.now() }
        })
      });
    } catch (e) { console.warn("Cloud sync failed", e); }
  }

  initBattle3DScene(env) {
    const container = document.getElementById('battle-canvas-container');
    if (!container) return; container.innerHTML = '';
    
    const scene = new THREE.Scene();
    const isSpace = env === 'space';
    const isWater = env === 'water';
    
    let bgColor = 0x1e1b4b; // Space
    if (isWater) bgColor = 0x0ea5e9;
    else if (env === 'land') bgColor = 0xbae6fd;
    scene.background = new THREE.Color(bgColor);
    if (isSpace) scene.fog = new THREE.FogExp2(0x1e1b4b, 0.01);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 40);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(10, 20, 10);
    scene.add(sun);

    // Main Arena Platform
    const groundGeo = new THREE.CylinderGeometry(18, 20, 3, 32);
    let groundColor = 0x312e81; // Space
    if (isWater) groundColor = 0x075985;
    else if (env === 'land') groundColor = 0x16a34a;
    
    const ground = new THREE.Mesh(groundGeo, new THREE.MeshLambertMaterial({ color: groundColor }));
    ground.position.y = -1.5;
    scene.add(ground);

    // Floating Islands / Rocks
    for (let i = 0; i < 15; i++) {
      const rockGeo = new THREE.IcosahedronGeometry(2 + Math.random() * 3, 0);
      const rockMat = new THREE.MeshLambertMaterial({ color: isSpace ? 0x4338ca : 0x15803d });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 40;
      rock.position.set(Math.cos(angle) * dist, Math.random() * 20 - 5, Math.sin(angle) * dist);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      scene.add(rock);
    }

    // Animated "Stadium" Pillars
    const pillars = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const p = new THREE.Mesh(new THREE.BoxGeometry(2, 12, 2), new THREE.MeshLambertMaterial({ color: isSpace ? 0x818cf8 : 0xfacc15 }));
      p.position.set(Math.cos(angle) * 25, 4, Math.sin(angle) * 25);
      pillars.add(p);
    }
    scene.add(pillars);

    const animate = () => {
      if (document.getElementById('battle-screen').style.display === 'none') return;
      requestAnimationFrame(animate);
      
      // Cinematic rotation
      scene.rotation.y += 0.001;
      pillars.rotation.y -= 0.003;
      
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  async checkForCloudBeams() {
    if (!this.currentUser) return;
    const myCode = this.users[this.currentUser].cloudCode;
    try {
      const response = await fetch('https://api.restful-api.dev/objects');
      const all = await response.json();
      const beams = all.filter(obj => obj.name && obj.name.startsWith(`dq_beam_${myCode}_`));
      
      for (const beam of beams) {
        const notif = beam.data;
        if (!this.notifications.some(n => n.id === notif.id)) {
          this.notifications.unshift(notif);
          this.updateStats(); 
          fetch(`https://api.restful-api.dev/objects/${beam.id}`, { method: 'DELETE' }).catch(() => {});
        }
      }
      if (beams.length > 0) this.saveProfile();
    } catch(e) {}
  }

  async beamNotification(targetCode, notif) {
    try {
      await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `dq_beam_${targetCode}_${Date.now()}`,
          data: { ...notif, id: Date.now(), timestamp: new Date().toISOString() }
        })
      });
    } catch(e) { console.error("Beam failed", e); }
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
      // Update Step 1 preview too
      const step1Preview = document.getElementById('name-step-avatar-preview');
      if (step1Preview) step1Preview.src = this.avatarModel;
      this.playSFX('click');
    };

    const renderMyGear = (cat) => {
      if (!gearList) return;
      gearList.innerHTML = '';

      // 1. Regular Gear
      const filtered = this.unlockedAvatars.filter(id => {
        if (cat === 'All') return true;
        if (cat === 'Treasures') return false;
        const gearInfo = GEAR_SHOP.find(g => g.id === id);
        return gearInfo && gearInfo.cat === cat;
      });

      filtered.forEach(id => {
        const gearInfo = GEAR_SHOP.find(g => g.id === id);
        if (!gearInfo) return;
        const modelUrl = gearInfo.model;

        const btn = document.createElement('button');
        btn.style.width = '100%'; btn.style.height = '120px'; btn.style.minWidth = '0';
        btn.style.padding = '5px'; btn.style.fontSize = '0.7rem'; btn.style.border = '2px solid #e2e8f0';
        btn.style.borderRadius = '12px'; btn.style.background = 'white';
        btn.style.display = 'flex'; btn.style.flexDirection = 'column'; btn.style.alignItems = 'center';
        if (this.avatarModel === modelUrl) btn.style.borderColor = 'var(--primary)';

        btn.innerHTML = `<div style="height:70px; width:100%;"><model-viewer src="${modelUrl}" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width:100%; height:100%; filter: drop-shadow(0 0 5px white)"></model-viewer></div><div style="margin-top:5px; line-height:1.1; overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap;">${gearInfo.name}</div>`;
        btn.onclick = () => {
          this.avatarModel = modelUrl;
          this.playSFX('click');
          updatePreview();
          [...gearList.children].forEach(b => b.style.borderColor = '#e2e8f0');
          btn.style.borderColor = 'var(--primary)';
        };
        gearList.appendChild(btn);
      });

      // 2. Unlocked Treasures (Become Treasure)
      if (cat === 'All' || cat === 'Treasures') {
        this.unlockedAnimals.forEach(ua => {
          const animalData = ANIMALS.find(a => a.name === ua.animalName);
          if (!animalData || animalData.name === 'Mystery Box') return;

          const btn = document.createElement('button');
          btn.style.width = '100%'; btn.style.height = '120px'; btn.style.minWidth = '0';
          btn.style.padding = '5px'; btn.style.fontSize = '0.7rem'; btn.style.border = '2px solid #059669';
          btn.style.borderRadius = '12px'; btn.style.background = animalData.bg || '#ecfdf5';
          btn.style.display = 'flex'; btn.style.flexDirection = 'column'; btn.style.alignItems = 'center';
          if (this.avatarModel === animalData.model) btn.style.borderColor = 'var(--primary)';

          btn.innerHTML = `<div style="height:70px; width:100%;"><model-viewer src="${animalData.model}" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width:100%; height:100%; filter: drop-shadow(0 0 5px white)"></model-viewer></div><div style="margin-top:5px; line-height:1.1; overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap; color:#065f46; font-weight:800;">${ua.petName}</div>`;
          btn.onclick = () => {
            this.avatarModel = animalData.model;
            this.playSFX('click');
            updatePreview();
            [...gearList.children].forEach(b => b.style.borderColor = '#e2e8f0');
            btn.style.borderColor = 'var(--primary)';
          };
          gearList.appendChild(btn);
        });
      }
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
      const tabsContainer = document.getElementById('my-gear-cat-tabs');
      if (tabsContainer) {
        tabsContainer.querySelectorAll('button').forEach(btn => {
          btn.onclick = () => {
            tabsContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.textContent === 'Become Treasure' ? 'Treasures' : btn.textContent;
            renderMyGear(cat);
          };
        });
      }

      renderMyGear('All');

      document.getElementById('save-avatar-btn').onclick = () => {
        this.playSFX('click'); this.saveProfile(); this.updateGameplayVisuals(); this.updateCollectionButton(); screen.style.display = 'none';
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

  async startGameplay() { 
    document.getElementById('start-overlay').style.display = 'none'; 
    this.updateStats(); this.updateCollectionButton(); this.populateVoiceList(); 
    this.checkDailyRefresh(); this.updateGameplayVisuals(); this.setFont(this.dyslexicFont);
    this.setMusic(this.musicEnabled);
    document.getElementById('new-player-en')?.classList.toggle('active', !this.isFrench);
    document.getElementById('new-player-fr')?.classList.toggle('active', this.isFrench);
    document.getElementById('english-btn')?.classList.toggle('active', !this.isFrench);
    document.getElementById('french-btn')?.classList.toggle('active', this.isFrench);
    document.getElementById('mode-listen')?.classList.toggle('active', !this.isTalkMode);
    document.getElementById('mode-talk')?.classList.toggle('active', this.isTalkMode);
    
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      this.networkId = [...data.ip].reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0).toString(16);
    } catch(e) { this.networkId = 'local'; }

    // Check if we are overdue for a treasure (e.g. Level 30 with 0 animals)
    if (this.level >= 2 && (this.level % 2 === 0)) {
      const animal = this.getAnimalForLevel();
      if (animal) {
        this.startCatchingSequence(animal);
        return;
      }
    }
    
    this.newTarget(); 
    document.addEventListener('click', () => { 
      if (this.musicEnabled) this.bgm.play().catch(() => {}); 
    }, { once: true });
  }

  setMusic(enabled) {
    this.musicEnabled = enabled;
    if (this.bgm) {
      if (enabled) this.bgm.play().catch(() => {});
      else this.bgm.pause();
    }
    document.getElementById('music-on-btn')?.classList.toggle('active', enabled);
    document.getElementById('music-off-btn')?.classList.toggle('active', !enabled);
    this.saveProfile();
  }

  setFont(isDyslexic) {
    this.dyslexicFont = isDyslexic;
    document.body.classList.toggle('font-dyslexic', isDyslexic);
    document.getElementById('font-standard-btn')?.classList.toggle('active', !isDyslexic);
    document.getElementById('font-dyslexic-btn')?.classList.toggle('active', isDyslexic);
    this.saveProfile();
  }

  setSong(num, autoPlay = true) {
    this.currentSong = num;
    if (this.bgm) {
      this.bgm.src = SONGS[num];
      if (autoPlay && this.musicEnabled) {
        this.bgm.play().catch(() => {});
      }
    }
    
    const selector = document.getElementById('song-selector');
    if (selector) selector.value = num.toString();

    const onBtn = document.getElementById('music-on-btn');
    const offBtn = document.getElementById('music-off-btn');
    if (onBtn) onBtn.classList.toggle('active', this.musicEnabled);
    if (offBtn) offBtn.classList.toggle('active', !this.musicEnabled);

    this.updateQuestProgress('change_song', 1);
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
    if (avatar) avatar.src = this.avatarModel;
    
    const petsContainer = document.getElementById('pets-container');
    if (petsContainer) {
      petsContainer.innerHTML = '';
      this.equippedPets.forEach(pet => {
        const petData = ANIMALS.find(a => a.name === pet.animalName);
        if (petData) {
          const viewer = document.createElement('model-viewer');
          viewer.src = petData.model;
          viewer.setAttribute('shadow-intensity', '1');
          viewer.setAttribute('camera-orbit', '0deg 75deg auto');
          viewer.setAttribute('disable-zoom', '');
          viewer.setAttribute('interaction-prompt', 'none');
          viewer.style.width = '100px';
          viewer.style.height = '100px';
          petsContainer.appendChild(viewer);
        }
      });
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

    // Direct Native Android TextToSpeech
    if (window.AndroidSpeechBridge && typeof window.AndroidSpeechBridge.speakText === 'function') {
      window.AndroidSpeechBridge.speakText(text, this.isFrench ? 'fr' : 'en', 0.8, 1.05);
      return;
    }

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

  showMicPermissionOnboarding() { 
    const v1 = document.getElementById('mic-permission-view'), v2 = document.getElementById('mic-test-view'), v3 = document.getElementById('talk-active-view');
    if (v1) v1.style.display = 'flex';
    if (v2) v2.style.display = 'none';
    if (v3) v3.style.display = 'none';
  }

  async requestMicAccess() {
    this.playSFX('click');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true }); 
      this.micGranted = true; 
      s.getTracks().forEach(t => t.stop());

      const v1 = document.getElementById('mic-permission-view');
      const v2 = document.getElementById('mic-test-view');
      const v3 = document.getElementById('talk-active-view');

      if (v1) v1.style.display = 'none';
      if (!this.micTested) {
        if (v2) v2.style.display = 'flex';
      } else {
        if (v3) v3.style.display = 'flex';
      }
    } catch (e) { 
      console.error("Mic access denied:", e);
      alert("Mic access denied! Please enable it in your browser settings."); 
    }
  }
  startListening(isTest = false) {
    if (!this.recognition) {
      this.initSpeechRecognition();
      if (!this.recognition) {
        alert("Your browser doesn't support speech recognition. Try Chrome!");
        return;
      }
    }

    if (this.isListening) {
      try { this.recognition.stop(); } catch(e) {}
      return;
    }

    this.isTestMode = isTest;
    this.recognition.lang = this.isFrench ? 'fr-CA' : 'en-US';

    // Provide target word hints to Android speech recognizer
    if (this.isTestMode) {
      this.recognition.hints = this.isFrench ? ['bonjour', 'salut', 'allo'] : ['hello', 'hi'];
    } else if (this.targetWord && this.targetWord.word) {
      const currentBank = this.wordBank[this.isFrench ? 'fr' : 'en'];
      const lvlWords = (currentBank && currentBank[this.level]) ? currentBank[this.level].map(w => w.word) : [];
      this.recognition.hints = [this.targetWord.word, ...lvlWords.slice(0, 10)];
    } else {
      this.recognition.hints = [];
    }

    this.playSFX('click');

    try {
      this.recognition.start();
    } catch (e) {
      console.error("Speech start failed:", e);
      this.isListening = false;
      // Try to stop and start again after a tiny delay if it was already "running"
      try { this.recognition.stop(); } catch(err) {}
      setTimeout(() => { try { this.recognition.start(); } catch(err) {} }, 100);
    }
  }

  handleTestResult(t, allCandidates = []) {
    const candidates = [t, ...allCandidates].filter(Boolean).map(s => s.toLowerCase().trim());
    const target = this.isFrench ? "bonjour" : "hello";
    const fb = document.getElementById('mic-test-feedback');
    const display = (candidates[0] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (fb) fb.innerHTML = `I heard: <b style="color:var(--primary)">"${display}"</b>`;

    const isMatch = candidates.some(c => 
      c.includes(target) || 
      (this.isFrench && (c.includes("bon") || c.includes("salut") || c.includes("allo") || c.includes("jour"))) ||
      (!this.isFrench && (c.includes("hell") || c.includes("halo") || c.includes("hi")))
    );

    if (isMatch) {
      this.playSFX('correct'); this.micTested = true; this.saveProfile();
      if (fb) fb.innerHTML = '<span style="color:var(--accent)">It works! ✨</span>';
      setTimeout(() => { document.getElementById('mic-test-view').style.display = 'none'; document.getElementById('talk-active-view').style.display = 'flex'; this.newTarget(); }, 1500);
    } else {
      this.playSFX('wrong');
      if (fb) fb.innerHTML = `<span style="color:var(--secondary)">Try saying "${target}".</span>`;
    }
  }

  handleSpeechResult(t, allCandidates = []) {
    const rawTarget = this.targetWord ? this.targetWord.word : '';
    const clean = s => (s || '').toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents
      .replace(/['’\-]/g, "") // strip apostrophes & hyphens
      .replace(/[^a-z0-9]/g, "")
      .trim();

    const cleanTarget = clean(rawTarget);
    const candidates = [t, ...allCandidates].filter(Boolean);

    // Number word mapping
    const NUM_MAP = {
      '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
      '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix'
    };

    // French common homophones
    const HOMOPHONES = {
      'vert': ['verre', 'vers', 'ver'],
      'verre': ['vert', 'vers', 'ver'],
      'vers': ['vert', 'verre', 'ver'],
      'mer': ['mere', 'maire'],
      'mere': ['mer', 'maire'],
      'sans': ['sang', 'cent'],
      'sang': ['sans', 'cent'],
      'cent': ['sans', 'sang'],
      'doigt': ['doit'],
      'doit': ['doigt'],
      'lit': ['lis'],
      'lis': ['lit'],
      'faim': ['fin'],
      'fin': ['faim'],
      'pain': ['pin'],
      'pin': ['pain'],
      'eau': ['au', 'aux', 'haut'],
      'au': ['eau', 'aux', 'haut'],
      'aux': ['eau', 'au', 'haut'],
      'haut': ['eau', 'au', 'aux'],
      'porc': ['port'],
      'port': ['porc'],
      'lait': ['laid'],
      'laid': ['lait'],
      'poids': ['pois'],
      'pois': ['poids'],
      'voix': ['voit', 'voie'],
      'voit': ['voix', 'voie'],
      'a': ['ah'],
      'ah': ['a'],
      'son': ['sont'],
      'sont': ['son'],
      'et': ['est', 'ai'],
      'est': ['et', 'es'],
      'on': ['ont'],
      'ont': ['on'],
      'mes': ['mais', 'met', 'mai'],
      'mais': ['mes', 'met', 'mai'],
      'ces': ['ses', 'cest', 'sest'],
      'ses': ['ces', 'cest', 'sest'],
      'cest': ['ces', 'ses', 'sest'],
      'un': ['1', 'une', 'in'],
      'deux': ['2'],
      'trois': ['3'],
      'quatre': ['4'],
      'cinq': ['5'],
      'six': ['6'],
      'sept': ['7'],
      'huit': ['8'],
      'neuf': ['9'],
      'dix': ['10'],
      'jai': ['j', 'ai', 'jay'],
      'nest': ['n', 'est'],
      'senva': ['sen va', 's en va'],
      'aujourdhui': ['aujourd hui'],
      // English letters & homophones
      'are': ['r', 'our', 'ar', 'ah'],
      'you': ['u', 'ya', 'yu', 'yew'],
      'see': ['c', 'sea'],
      'be': ['b', 'bee'],
      'why': ['y'],
      'to': ['too', 'two', '2'],
      'two': ['to', 'too', '2'],
      'too': ['to', 'two', '2'],
      'for': ['four', 'fore', '4'],
      'four': ['for', 'fore', '4'],
      'one': ['1', 'won'],
      'won': ['one', '1'],
      'ate': ['8', 'eight'],
      'eight': ['8', 'ate'],
      'no': ['know'],
      'know': ['no'],
      'here': ['hear'],
      'hear': ['here'],
      'our': ['hour', 'are'],
      'hour': ['our'],
      'blue': ['blew'],
      'blew': ['blue'],
      'red': ['read'],
      'read': ['red'],
      'by': ['buy', 'bye'],
      'buy': ['by', 'bye'],
      'so': ['sew', 'sow']
    };

    const stripArticle = s => s.replace(/^(le|la|les|un|une|des|du|de|d|l|the|a|an)\s+/i, '').trim();

    let isMatch = false;
    let matchedCandidate = '';

    for (const cand of candidates) {
      const cleanCand = clean(cand);
      const strippedCand = clean(stripArticle(cand));
      const candAsWord = NUM_MAP[cleanCand] || cleanCand;

      if (cleanCand === cleanTarget || strippedCand === cleanTarget || candAsWord === cleanTarget) {
        isMatch = true;
        matchedCandidate = cand;
        break;
      }

      // Substring match
      if (cleanCand.includes(cleanTarget) || (cleanCand.length >= 3 && cleanTarget.includes(cleanCand))) {
        isMatch = true;
        matchedCandidate = cand;
        break;
      }

      // Homophone / letter match (French and English)
      const equivalents = HOMOPHONES[cleanTarget] || [];
      if (equivalents.includes(cleanCand) || equivalents.includes(strippedCand) || equivalents.includes(candAsWord)) {
        isMatch = true;
        matchedCandidate = cand;
        break;
      }
    }

    if (window.DevLog) {
      window.DevLog.log('EVAL_RESULT', {
        target: rawTarget,
        cleanTarget: cleanTarget,
        isFrench: this.isFrench,
        candidates: candidates,
        isMatch: isMatch,
        matchedOn: matchedCandidate
      });
    }

    const fb = document.getElementById('speech-feedback');
    const heardDisplay = (candidates[0] || t || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (fb) fb.innerHTML = `I heard: <b style="color:var(--primary)">"${heardDisplay}"</b>`;

    if (isMatch) {
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
      if (fb) fb.innerHTML = `<span style="color:var(--secondary)">NO, I heard "${heardDisplay}".</span>`;
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
      const displayWord = this.targetWord.word.charAt(0).toUpperCase() + this.targetWord.word.slice(1).toLowerCase();
      const targetCard = document.getElementById('speech-target-card');
      if (targetCard) targetCard.innerHTML = `<div class="card" style="margin:0 auto; flex:none; width:100%;">
        <div class="card-word ruled" style="font-size: 2.5rem;">${displayWord}</div></div>`;
      const feedback = document.getElementById('speech-feedback');
      if (feedback) feedback.textContent = "Click the mic when ready!";
    } else { setTimeout(() => this.speak(), 500); this.renderCards(); }
  }

  formatWordContextually(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }

  renderCards() {
    const gameArea = document.getElementById('game-area'); gameArea.innerHTML = '';
    
    const targetLetter = this.targetWord.word.charAt(0).toLowerCase();
    
    // 1. Get ALL words from the current language bank that start with the same letter
    const globalSameLetterPool = [];
    const currentBank = this.wordBank[this.isFrench ? 'fr' : 'en'];
    
    Object.values(currentBank).forEach(levelWords => {
      levelWords.forEach(w => {
        if (w.word.toLowerCase() !== this.targetWord.word.toLowerCase() && 
            w.word.charAt(0).toLowerCase() === targetLetter) {
          globalSameLetterPool.push(w);
        }
      });
    });

    // 2. Pick 4 distractors (Global search first for maximum consistency)
    let distractors = [];
    if (globalSameLetterPool.length >= 4) {
      // Shuffle global pool and pick 4
      distractors = globalSameLetterPool.sort(() => Math.random() - 0.5).slice(0, 4);
    } else {
      // Emergency fallback if even global bank is tiny for this letter
      const otherWords = this.currentPool.filter(w => 
        w.word.toLowerCase() !== this.targetWord.word.toLowerCase() && 
        w.word.charAt(0).toLowerCase() !== targetLetter
      ).sort(() => Math.random() - 0.5);
      distractors = [...globalSameLetterPool, ...otherWords].slice(0, 4);
    }

    let cards = [this.targetWord, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }

    cards.forEach(wordData => {
      const card = document.createElement('div'); card.className = 'card';
      const isSentenceCase = Math.random() > 0.5;
      const isRuled = Math.random() > 0.4;

      let displayWord = wordData.word.toLowerCase();
      if (isSentenceCase) {
        displayWord = displayWord.charAt(0).toUpperCase() + displayWord.slice(1);
      }

      card.innerHTML = `<div class="particles" style="display:none"></div><div class="feedback"></div>
        <div class="card-word ${isRuled ? 'ruled' : ''}">${displayWord}</div>`;

      card.addEventListener('click', (e) => this.onCardClick(e, wordData));
      gameArea.appendChild(card);
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
      this.score += 100; this.updateStats(); this.saveProfile(); setTimeout(() => this.levelUpOrNext(), 750);
    } else {
      this.streak = 0; this.playSFX('wrong');
      card.style.opacity = '0.35';
      card.style.pointerEvents = 'none';
      card.classList.add('wrong-shake');
      this.triggerAvatarReaction('wrong');
      // Rapid tap debounce without locking the rest of the board for 1.5s
      this.canClick = false;
      setTimeout(() => { this.canClick = true; }, 250);
    }
  }

  levelUpOrNext() {
    if (this.xp >= this.maxXP) {
      this.levelUp();
    } else {
      this.newTarget();
    }
  }

  updateStats() {
    const levelEl = document.getElementById('level');
    if (levelEl) levelEl.textContent = this.level;
    
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = this.score;
    
    const coinsEl = document.getElementById('coins');
    if (coinsEl) coinsEl.textContent = this.coins;

    const shopCoinsEl = document.getElementById('shop-coins-display');
    if (shopCoinsEl) shopCoinsEl.textContent = this.coins;
    
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

    const hudXpFill = document.getElementById('hud-xp-fill');
    if (hudXpFill) hudXpFill.style.width = `${(this.xp / this.maxXP) * 100}%`;

    // Handle Notification Badge (Sync from storage)
    const latestUsers = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    if (this.currentUser && latestUsers[this.currentUser]) {
      this.notifications = latestUsers[this.currentUser].notifications || [];
    }
    const badge = document.getElementById('notif-badge');
    if (badge) {
      const count = this.notifications ? this.notifications.length : 0;
      badge.textContent = count;
      badge.style.display = (count > 0) ? 'flex' : 'none';
    }
  }

  showNotificationsScreen() {
    this.playSFX('click');
    // Refresh notifications from storage first
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    if (this.currentUser && this.users[this.currentUser]) {
      this.notifications = this.users[this.currentUser].notifications || [];
    }
    
    const screen = document.getElementById('notif-screen');
    const list = document.getElementById('notif-list');
    if (!screen || !list) return;

    list.innerHTML = '';
    if (!this.notifications || this.notifications.length === 0) {
      list.innerHTML = '<p style="text-align:center; color:var(--text-light); padding:20px;">No new notifications! ✨</p>';
    } else {
      this.notifications.forEach((n, idx) => {
        const item = document.createElement('div');
        item.style.background = '#f8fafc';
        item.style.padding = '15px';
        item.style.borderRadius = '15px';
        item.style.border = '2px solid #e2e8f0';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.gap = '10px';

        let actionHtml = '';
        if (n.type === 'friend_request') {
          actionHtml = `
            <div style="display:flex; gap:10px;">
              <button class="primary" style="padding:8px; font-size:0.75rem;">Accept</button>
              <button class="danger" style="padding:8px; font-size:0.75rem; background:#cbd5e1; border-color:#94a3b8; color:white;">Decline</button>
            </div>
          `;
        } else {
          actionHtml = `<button class="primary" style="padding:8px; font-size:0.75rem; width:auto; align-self:flex-end;">Dismiss</button>`;
        }

        item.innerHTML = `
          <div style="font-weight:800; font-size:0.9rem;">${n.title}</div>
          <div style="font-size:0.85rem; color:var(--text);">${n.message}</div>
          ${actionHtml}
        `;

        const btns = item.querySelectorAll('button');
        if (n.type === 'friend_request') {
          btns[0].onclick = () => {
            this.playSFX('levelUp');
            
            // 1. Add to current user's friends
            if (!this.friends.includes(n.fromId)) this.friends.push(n.fromId);
            
            // 2. Add current user to sender's friends (Sync local)
            const allUsers = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
            if (allUsers[n.fromId]) {
              if (!allUsers[n.fromId].friends) allUsers[n.fromId].friends = [];
              if (!allUsers[n.fromId].friends.includes(this.currentUser)) allUsers[n.fromId].friends.push(this.currentUser);
              
              // Also send a "Confirmation" notification to the sender
              if (!allUsers[n.fromId].notifications) allUsers[n.fromId].notifications = [];
              allUsers[n.fromId].notifications.push({
                type: 'info',
                title: 'Request Accepted! 🎉',
                message: `${this.users[this.currentUser].name} accepted your friend request!`,
                id: Date.now(),
                timestamp: new Date().toISOString()
              });
            }
            localStorage.setItem('dyslexiquest_users', JSON.stringify(allUsers));

            alert(`You and ${n.fromName} are now friends! 🤝`);
            this.notifications.splice(idx, 1);
            this.saveProfile();
            this.showNotificationsScreen();
            this.updateStats();
          };
          btns[1].onclick = () => {
            this.playSFX('click');
            this.notifications.splice(idx, 1);
            this.saveProfile();
            this.showNotificationsScreen();
            this.updateStats();
          };
        } else {
          btns[0].onclick = () => {
            this.playSFX('click');
            this.notifications.splice(idx, 1);
            this.saveProfile();
            this.showNotificationsScreen();
            this.updateStats();
          };
        }
        list.appendChild(item);
      });
    }

    document.getElementById('close-notif-btn').onclick = () => { this.playSFX('click'); screen.style.display = 'none'; };
    screen.style.display = 'flex';
  }

  addNotificationToUser(userId, notif) {
    const users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    if (users[userId]) {
      if (!users[userId].notifications) users[userId].notifications = [];
      users[userId].notifications.push({ ...notif, id: Date.now(), timestamp: new Date().toISOString() });
      localStorage.setItem('dyslexiquest_users', JSON.stringify(users));
    }
  }

  updateCollectionButton() { 
    document.getElementById('collection-count').textContent = this.unlockedAnimals.length;
    
    // Update Profile Badges (Sidebar & HUD)
    if (this.currentUser) {
      const u = this.users[this.currentUser];
      const sidebarHeader = document.getElementById('sidebar-profile-header');
      const sidebarName = document.getElementById('sidebar-user-name');
      const sidebarAvatar = document.getElementById('sidebar-avatar-preview');
      const codeEl = document.getElementById('sidebar-friend-code-display');
      
      const hudBtn = document.getElementById('hud-profile-btn');
      const hudName = document.getElementById('hud-user-name');
      const hudAvatar = document.getElementById('hud-avatar-preview');

      if (sidebarName) sidebarName.textContent = u.name;
      if (hudName) hudName.textContent = u.name;

      const model = u.avatarModel || AVATAR_MODELS.male;
      if (sidebarAvatar) sidebarAvatar.src = model;
      if (hudAvatar) hudAvatar.src = model;

      const openDesigner = () => { this.playSFX('click'); this.showAvatarDesigner(); };
      if (sidebarHeader) sidebarHeader.onclick = openDesigner;
      if (hudBtn) hudBtn.onclick = openDesigner;
      
      const get5DigitCode = (uid) => {
        const user = this.users[uid];
        let hash = 0;
        const str = user.name + uid;
        for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
        return Math.abs(hash % 90000 + 10000).toString();
      };
      
      const battleCode = get5DigitCode(this.currentUser);
      if (codeEl) {
        codeEl.textContent = battleCode;
        codeEl.onclick = (e) => {
          e.stopPropagation(); 
          navigator.clipboard.writeText(battleCode);
          const oldText = codeEl.textContent;
          codeEl.textContent = "COPIED!";
          setTimeout(() => { codeEl.textContent = battleCode; }, 1000);
        };
      }
    }
  }

  async loadFromCloud() {
    const code = prompt("Enter your 5-DIGIT Cloud Code:");
    if (!code || code.length !== 5) {
      if (code) alert("Please enter a 5-digit code!");
      return;
    }

    this.playSFX('click');
    document.getElementById('loading-overlay').style.display = 'flex';
    
    try {
      const response = await fetch(`https://api.restful-api.dev/objects`);
      const allObjects = await response.json();
      
      const matches = allObjects.filter(obj => obj.name === `dq_v7_${code}`);
      if (matches.length > 0) {
        matches.sort((a, b) => b.id.localeCompare(a.id));
        const cloudUser = matches[0].data;
        
        this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
        const localId = cloudUser.id || Date.now().toString();
        this.users[localId] = cloudUser;
        localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
        
        alert(`Welcome back, ${cloudUser.name}! Profile loaded! ☁️✨`);
        this.showProfileSelect();
      } else {
        alert("Hero not found in the cloud! Double check your code.");
      }
    } catch (e) {
      alert("Cloud connection busy. Try one more time!");
    } finally {
      this.hideLoading();
    }
  }

  showBattleHub() {
    this.playSFX('click');
    const screen = document.getElementById('battle-mode-screen');
    const list = document.getElementById('battle-hub-list');
    if (!screen || !list) return;

    list.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>';
    
    const otherUsers = Object.keys(this.users).filter(id => id !== this.currentUser);
    const friendIds = this.friends || [];

    const createOption = (title, subtitle, icon, color, action) => {
      const btn = document.createElement('button');
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.gap = '15px';
      btn.style.padding = '15px';
      btn.style.background = '#f8fafc';
      btn.style.border = `2px solid ${color}`;
      btn.style.borderRadius = '20px';
      btn.style.textAlign = 'left';
      btn.style.width = '100%';
      btn.style.justifyContent = 'flex-start';

      btn.innerHTML = `
        <div style="font-size: 2rem; width: 50px; text-align: center;">${icon}</div>
        <div style="flex-grow: 1;">
          <div style="font-weight: 800; font-size: 1rem; color: var(--text);">${title}</div>
          <div style="font-size: 0.75rem; color: var(--text-light); font-weight: 600;">${subtitle}</div>
        </div>
      `;
      btn.onclick = () => {
        this.playSFX('click');
        screen.style.display = 'none';
        action();
      };
      list.appendChild(btn);
    };

    // Fetch Cloud for "Nearby" people
    fetch('https://api.restful-api.dev/objects')
      .then(r => r.json())
      .then(all => {
        list.innerHTML = '';
        
        // 1. WILD ARENA (Always first)
        createOption("WILD ARENA", "Fight a random powerful opponent!", "🦁", "#ef4444", () => {
          this.startBattleSequence('pet');
        });

        // 2. People on your Wi-Fi!
        const nearby = all.filter(obj => 
          obj.name && obj.name.startsWith('dq_v7_') && 
          obj.data.networkId === this.networkId && 
          obj.data.id !== this.currentUser &&
          (Date.now() - obj.data.lastSeen < 3600000) // Seen in last hour
        );

        if (nearby.length > 0) {
          const nearbyHeader = document.createElement('div');
          nearbyHeader.style.margin = '10px 0 5px';
          nearbyHeader.style.fontSize = '0.7rem';
          nearbyHeader.style.fontWeight = '800';
          nearbyHeader.style.color = 'var(--primary)';
          nearbyHeader.textContent = '📍 ON YOUR WI-FI';
          list.appendChild(nearbyHeader);

          nearby.forEach(obj => {
            const p = obj.data;
            createOption(p.name, `Level ${p.level} Nearby Explorer`, "📶", "#10b981", () => {
              const pet = (p.equippedPets && p.equippedPets.length > 0) ? p.equippedPets[0] : (p.unlockedAnimals && p.unlockedAnimals.length > 0 ? p.unlockedAnimals[0] : null);
              if (!pet) { alert("They have no animals!"); return; }
              const data = ANIMALS.find(a => a.name === pet.animalName);
              this.startBattleSequence('pet', { ...data, name: pet.petName, hp: 100 + (p.level * 10) });
            });
          });
        }

        // 3. Added Friends
        if (friendIds.length > 0) {
          const friendsHeader = document.createElement('div');
          friendsHeader.style.margin = '10px 0 5px';
          friendsHeader.style.fontSize = '0.7rem';
          friendsHeader.style.fontWeight = '800';
          friendsHeader.style.color = 'var(--text-light)';
          friendsHeader.textContent = 'ADDED FRIENDS';
          list.appendChild(friendsHeader);

          friendIds.forEach(fid => {
            const friend = this.users[fid];
            if (friend) {
              createOption(friend.name, `Level ${friend.level} Friend`, "🤝", "#0ea5e9", () => {
                const pet = (friend.equippedPets && friend.equippedPets.length > 0) ? friend.equippedPets[0] : (friend.unlockedAnimals && friend.unlockedAnimals.length > 0 ? friend.unlockedAnimals[0] : null);
                if (!pet) { alert("This friend has no animals!"); return; }
                const data = ANIMALS.find(a => a.name === pet.animalName);
                this.startBattleSequence('pet', { ...data, name: pet.petName, hp: 100 + (friend.level * 10) });
              });
            }
          });
        }

        // 4. Local People
        const localOthers = otherUsers.filter(id => !friendIds.includes(id));
        if (localOthers.length > 0) {
          const localHeader = document.createElement('div');
          localHeader.style.margin = '10px 0 5px';
          localHeader.style.fontSize = '0.7rem';
          localHeader.style.fontWeight = '800';
          localHeader.style.color = 'var(--text-light)';
          localHeader.textContent = 'LOCAL PROFILES';
          list.appendChild(localHeader);

          localOthers.forEach(id => {
            const local = this.users[id];
            createOption(local.name, `Level ${local.level} Explorer`, "🏠", "#84cc16", () => {
              const pet = (local.equippedPets && local.equippedPets.length > 0) ? local.equippedPets[0] : (local.unlockedAnimals && local.unlockedAnimals.length > 0 ? local.unlockedAnimals[0] : null);
              if (!pet) { alert("This player has no animals!"); return; }
              const data = ANIMALS.find(a => a.name === pet.animalName);
              this.startBattleSequence('pet', { ...data, name: pet.petName, hp: 100 + (local.level * 10) });
            });
          });
        }
      }).catch(() => {
        list.innerHTML = '<p style="color:var(--danger);">Failed to load Arena Hub. Check connection!</p>';
      });

    screen.style.display = 'flex';
  }

  openPack(pack) {
    const screen = document.getElementById('wheel-screen');
    const container = document.getElementById('wheel-container');
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spin-btn');
    const closeBtn = document.getElementById('close-wheel-btn');
    
    document.getElementById('wheel-title').textContent = `${pack.name} Wheel!`;
    document.getElementById('wheel-subtitle').textContent = `Theme: ${pack.env.toUpperCase()}`;
    
    // Prepare Prizes (8 slots)
    let themedAnimals = [];
    if (pack.id === 'pack_elemental') {
      // High Rarity Focus: Rare, Epic, Legendary, Mythic only
      themedAnimals = ANIMALS.filter(a => ['Rare', 'Epic', 'Legendary', 'Mythic'].includes(a.rarity));
    } else if (pack.id === 'pack_prehistoric') {
      // Dinosaur and Ancient themes
      themedAnimals = ANIMALS.filter(a => a.name.includes('Dino') || a.name.includes('Rex') || a.name.includes('Stone Golem'));
    } else {
      themedAnimals = ANIMALS.filter(a => a.env === pack.env);
    }

    if (themedAnimals.length === 0) themedAnimals = [ANIMALS[0]]; // Safety fallback

    const prizes = [];
    for (let i = 0; i < 8; i++) {
      const a = themedAnimals[Math.floor(Math.random() * themedAnimals.length)];
      prizes.push({ type: 'treasure', value: a, label: a.name });
    }    
    // Shuffle prizes
    prizes.sort(() => Math.random() - 0.5);

    const drawWheel = () => {
      const arc = (2 * Math.PI) / prizes.length;
      prizes.forEach((p, i) => {
        const angle = i * arc;
        ctx.fillStyle = i % 2 === 0 ? pack.color : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(160, 160);
        ctx.arc(160, 160, 160, angle, angle + arc);
        ctx.fill();
        
        ctx.save();
        ctx.translate(160, 160);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px Outfit';
        ctx.fillText(p.label, 150, 5);
        ctx.restore();
      });
    };

    drawWheel();
    screen.style.display = 'flex';
    spinBtn.style.display = 'block';
    closeBtn.style.display = 'none';
    container.style.transform = 'rotate(0deg)';

    spinBtn.onclick = () => {
      spinBtn.style.display = 'none';
      const extraDegrees = 1800 + Math.floor(Math.random() * 360);
      container.style.transform = `rotate(${extraDegrees}deg)`;
      
      setTimeout(() => {
        const actualDeg = extraDegrees % 360;
        // Pointer is at top (270 degrees in canvas coords, but we rotated the container)
        // Prize index: 
        const prizeIndex = Math.floor(((360 - actualDeg + 270) % 360) / (360 / prizes.length));
        const win = prizes[prizeIndex];
        
        document.getElementById('wheel-title').textContent = "YOU WON!";
        document.getElementById('wheel-subtitle').textContent = `New Treasure: ${win.value.name}!`;
        
        const availableNames = PET_NAMES.filter(n => !this.unlockedAnimals.some(u => u.petName === n));
        const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${win.value.name} Jr`;
        
        this.unlockedAnimals.push({ petName: petName, animalName: win.value.name, level: 1 });
        
        this.updateStats();
        this.saveProfile();
        closeBtn.style.display = 'block';
        this.playSFX('levelUp');
      }, 4000);
    };

    closeBtn.onclick = () => {
      screen.style.display = 'none';
      this.updateCollectionButton();
    };
  }

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
        const isOwned = this.unlockedAvatars.includes(item.id);
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
          <div style="font-weight: 800; font-size: 0.9rem;">${item.name}</div>
          <div style="height: 80px;"><model-viewer src="${item.model}" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width:100%; height:100%; filter: drop-shadow(0 0 5px white)"></model-viewer></div>
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

      // Create a copy with original indices to perform correct deletion
      const indexedAnimals = this.unlockedAnimals.map((ua, idx) => ({ ...ua, originalIndex: idx }));

      // Sort by rarity order (Mythic down to Common)
      indexedAnimals.sort((a, b) => {
        const dataA = ANIMALS.find(an => an.name === a.animalName);
        const dataB = ANIMALS.find(an => an.name === b.animalName);
        const rankA = dataA ? RARITY_ORDER.indexOf(dataA.rarity) : -1;
        const rankB = dataB ? RARITY_ORDER.indexOf(dataB.rarity) : -1;
        return rankB - rankA;
      });

      indexedAnimals.forEach((ua) => {
        const data = ANIMALS.find(a => a.name === ua.animalName);
        if (!data) return;
        const price = SELL_PRICES[data.rarity] || 50;
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
          <div style="font-weight: 800; font-size: 0.9rem;">${ua.petName}</div>
          <div style="height: 60px; width: 100%;"><model-viewer src="${data.model}" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width:100%; height:100%; filter: drop-shadow(0 0 5px white) drop-shadow(0 0 2px white);"></model-viewer></div>
          <div class="rarity-display rarity-${data.rarity.toLowerCase()}" style="font-size: 0.6rem; padding: 2px 8px; margin: 5px 0;">${data.rarity}</div>
          <div style="display: flex; gap: 5px; margin-top: 5px;">
            <button class="primary" style="flex: 1; font-size: 0.75rem; padding: 8px;">Sell $${price}</button>
            <button class="accent" style="flex: 1; font-size: 0.75rem; padding: 8px; background: #8b5cf6;">🎁 Give</button>
          </div>
        `;
        const btns = card.querySelectorAll('button');
        btns[0].onclick = () => this.performSell(ua.originalIndex, price);
        btns[1].onclick = () => this.initiateGiveAnimal(ua.originalIndex);
        sellList.appendChild(card);
      });
    };

    const buyView = document.getElementById('shop-buy-view');
    const packsView = document.getElementById('shop-packs-view');
    const buyTitle = document.getElementById('shop-buy-title');

    const setActiveSideBtn = (id) => {
      document.querySelectorAll('.shop-sidebar-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.getElementById(id);
      if (activeBtn) activeBtn.classList.add('active');
    };

    const renderPacks = () => {
      const packsList = document.getElementById('shop-packs-list');
      packsList.innerHTML = '';
      PACKS.forEach(pack => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.style.border = `2px solid ${pack.color}`;
        card.innerHTML = `
          <div style="font-size: 3rem; margin: 10px 0;">${pack.icon}</div>
          <div style="font-weight: 800; font-size: 1.1rem; color: ${pack.color}">${pack.name}</div>
          <p style="font-size: 0.8rem; color: var(--text-light); margin: 5px 0;">Theme: ${pack.env}</p>
          <button class="accent" style="background: ${pack.color}; border: none; margin-top: 10px; font-size: 0.9rem; padding: 10px 20px;">
            Open for $${pack.price}
          </button>
        `;
        card.querySelector('button').onclick = () => {
          if (this.coins >= pack.price) {
            this.coins -= pack.price;
            this.updateQuestProgress('spend_coins', pack.price);
            this.updateStats();
            this.saveProfile();
            this.openPack(pack);
          } else {
            alert("Not enough coins! Master more words! 🪙");
          }
        };
        packsList.appendChild(card);
      });
    };

    document.getElementById('shop-side-sell').onclick = () => {
      setActiveSideBtn('shop-side-sell');
      document.getElementById('shop-sell-view').style.display = 'block';
      buyView.style.display = 'none';
      packsView.style.display = 'none';
      renderSell();
    };

    document.getElementById('shop-side-packs').onclick = () => {
      setActiveSideBtn('shop-side-packs');
      document.getElementById('shop-sell-view').style.display = 'none';
      buyView.style.display = 'none';
      packsView.style.display = 'block';
      renderPacks();
    };

    const handleBuyCategory = (id, cat, title) => {
      document.getElementById(id).onclick = () => {
        setActiveSideBtn(id);
        document.getElementById('shop-sell-view').style.display = 'none';
        packsView.style.display = 'none';
        buyView.style.display = 'block';
        buyTitle.textContent = title;
        renderBuy(cat);
      };
    };

    handleBuyCategory('shop-side-hats', 'Hats', 'Hero Hats');
    handleBuyCategory('shop-side-shirts', 'Shirts', 'Hero Shirts');
    handleBuyCategory('shop-side-pants', 'Pants', 'Hero Pants');
    handleBuyCategory('shop-side-shoes', 'Shoes', 'Hero Shoes');
    handleBuyCategory('shop-side-sets', 'Sets', 'Full Hero Sets');

    // Default view
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

  initiateGiveAnimal(index) {
    const ua = this.unlockedAnimals[index];
    const otherUsers = Object.keys(this.users).filter(id => id !== this.currentUser);
    
    if (otherUsers.length === 0) {
      alert("No other players found to give your animal to! Invite a friend to play.");
      return;
    }

    const selectHtml = otherUsers.map(id => `<option value="${id}">${this.users[id].name} (Lvl ${this.users[id].level || 1})</option>`).join('');
    
    // Using a simple custom modal or just prompt for simplicity if needed, 
    // but a confirm with a select is better. Let's use a standard choice prompt.
    const targetId = prompt(`Who would you like to give "${ua.petName}" to?\n\nType the name of the player:\n${otherUsers.map(id => `- ${this.users[id].name}`).join('\n')}`);
    
    if (targetId) {
      const recipientId = otherUsers.find(id => this.users[id].name.toLowerCase() === targetId.toLowerCase().trim());
      if (recipientId) {
        this.performGiveAnimal(index, recipientId);
      } else {
        alert("Player not found! Make sure you type the name exactly as it appears.");
      }
    }
  }

  performGiveAnimal(index, recipientId) {
    const ua = this.unlockedAnimals[index];
    // Reload to prevent stale data loss
    this.users = JSON.parse(localStorage.getItem('dyslexiquest_users')) || {};
    const recipientName = this.users[recipientId] ? this.users[recipientId].name : "Unknown";
    
    if (!confirm(`Are you sure you want to give "${ua.petName}" to ${recipientName}? This animal will leave your collection forever!`)) return;

    // 1. Remove from current user array
    this.unlockedAnimals.splice(index, 1);
    
    const notif = {
      type: 'gift',
      title: 'New Gift! 🎁',
      message: `${this.users[this.currentUser].name} sent you a treasure: ${ua.petName} (${ua.animalName})!`
    };

    // 2. Add to recipient in the main users object
    if (this.users[recipientId]) {
      if (!this.users[recipientId].unlockedAnimals) this.users[recipientId].unlockedAnimals = [];
      this.users[recipientId].unlockedAnimals.push(ua);
      
      // Send notification to recipient
      this.addNotificationToUser(recipientId, notif);
      if (this.users[recipientId].cloudCode) {
        this.beamNotification(this.users[recipientId].cloudCode, notif);
      }
    }
    
    // 3. Save the main users object (which now has the recipient's new animal)
    localStorage.setItem('dyslexiquest_users', JSON.stringify(this.users));
    
    // 4. Save current user's state (which now has one fewer animal)
    this.saveProfile(); 
    
    this.playSFX('levelUp');
    alert(`Success! "${ua.petName}" has been sent to ${recipientName}'s collection! 🎁`);
    
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
    this.updateQuestProgress('spend_coins', item.price);
    this.unlockedAvatars.push(item.id);
    this.avatarModel = item.model; // Auto-equip!
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

    // Unlock a treasure every second level (2, 4, 6...)
    if (this.level >= 2 && (this.level % 2 === 0)) {
      if (this.checkAnimalUnlock()) return;
    }

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
    this.saveProfile();
    const animal = this.getAnimalForLevel();
    if (animal) {
      this.startCatchingSequence(animal);
      return true;
    }
    this.newTarget();
    return false;
  }
  startBattleSequence(mode = 'pet', enemyData = null) {
    try {
      if (this.unlockedAnimals.length === 0 && mode === 'pet') {
        alert("You need at least one animal for a Pet Battle! Go capture some treasures first.");
        return;
      }

      this.playSFX('levelUp');
      const screen = document.getElementById('battle-screen');
      const challengeArea = document.getElementById('battle-challenge-area');
      const actionArea = document.getElementById('battle-action-area');
      const closeBtn = document.getElementById('close-battle-btn');
      
      // 1. Determine Player fighter
      let playerFighterModel = this.avatarModel;
      let playerFighterData = { name: 'Hero', powers: 'Strike', rarity: 'Common', color: '#3b82f6' };
      
      if (mode === 'pet') {
        const petUa = this.equippedPets.length > 0 ? this.equippedPets[0] : this.unlockedAnimals[0];
        const petData = ANIMALS.find(a => a.name === petUa.animalName);
        if (petData) {
          playerFighterModel = petData.model;
          playerFighterData = { ...petData, name: petUa.petName };
        } else {
          // Fallback if data is missing
          playerFighterModel = ANIMALS[0].model;
          playerFighterData = { ...ANIMALS[0], name: petUa.petName };
        }
      } else {
        const transformedData = ANIMALS.find(a => a.model === this.avatarModel);
        if (transformedData) playerFighterData = transformedData;
      }

      // 2. Determine Enemy fighter
      let enemyFighterModel, enemyFighterData, difficulty;

      if (enemyData) {
        enemyFighterModel = enemyData.model;
        enemyFighterData = enemyData;
        difficulty = { label: 'Friend', hp: enemyData.hp || 150, damageMult: 1.2, rewardMult: 2, color: '#0ea5e9' };
      } else {
        // Generate a random NPC with a "Normal" name
        const firstNames = ["Explorer", "Ranger", "Hunter", "Trainer", "Master", "Adventurer"];
        const lastNames = ["Sam", "Luna", "Tom", "Alex", "Jade", "Zane", "Mia", "Leo"];
        const npcName = `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`;
        
        enemyFighterData = { name: npcName, powers: 'Bash', rarity: 'Common', color: '#ef4444' };
        if (mode === 'pet') {
          const matchingEnv = ANIMALS.filter(a => a.env === (playerFighterData.env || 'land'));
          const randomEnemyPet = matchingEnv.length > 0 ? matchingEnv[Math.floor(Math.random() * matchingEnv.length)] : ANIMALS[0];
          enemyFighterModel = randomEnemyPet.model;
          enemyFighterData = { ...randomEnemyPet, name: npcName };
        } else {
          enemyFighterModel = Object.values(AVATAR_MODELS)[Math.floor(Math.random() * Object.values(AVATAR_MODELS).length)];
        }

        const diffRoll = Math.random();
        difficulty = { label: 'Normal', hp: 100, damageMult: 1, rewardMult: 1, color: '#fff' };
        if (diffRoll < 0.2) difficulty = { label: 'Very Weak', hp: 50, damageMult: 0.5, rewardMult: 0.5, color: '#94a3b8' };
        else if (diffRoll < 0.9) difficulty = { label: 'Strong', hp: 150, damageMult: 1.5, rewardMult: 2, color: '#f59e0b' };
        else difficulty = { label: 'Extremely Strong', hp: 250, damageMult: 2.5, rewardMult: 5, color: '#ef4444' };
      }

      const playerStats = RARITY_STATS[playerFighterData.rarity] || RARITY_STATS.Common;
      const enemyRarityStats = RARITY_STATS[enemyFighterData.rarity] || RARITY_STATS.Common;
      const finalEnemyHp = Math.round(difficulty.hp * enemyRarityStats.dmg);

      this.battleState = {
        playerHp: playerStats.hp,
        playerMaxHp: playerStats.hp,
        enemyHp: finalEnemyHp,
        enemyMaxHp: finalEnemyHp,
        playerPet: playerFighterData,
        enemyPet: enemyFighterData,
        playerAttackCount: 0,
        superAttackCharge: 0,
        difficulty: difficulty,
        mode: mode,
        lives: 3,
        usedPetNames: mode === 'pet' ? [playerFighterData.name] : ['Hero']
      };

      // 3. Initialize 3D Arena (OpenGL)
      this.initBattle3DScene(playerFighterData.env || 'land');
      this.updateArenaTheme(playerFighterData.env || 'land');
      
      document.getElementById('battle-player-hp').style.width = '100%';
      document.getElementById('battle-enemy-hp').style.width = '100%';
      this.updateBattleStatsUI();
      document.getElementById('battle-status').textContent = enemyData ? "FRIEND BATTLE!" : `${mode.toUpperCase()} BATTLE!`;
      document.getElementById('battle-status').style.color = "#7c3aed";

      document.getElementById('battle-player-avatar').style.display = 'none';
      document.getElementById('battle-enemy-avatar').style.display = 'none';
      
      const pFighter = document.getElementById('battle-player-pet');
      const eFighter = document.getElementById('battle-enemy-pet');
      if (pFighter) pFighter.src = playerFighterModel;
      if (eFighter) eFighter.src = enemyFighterModel;
      pFighter?.classList.remove('anim-knocked');
      eFighter?.classList.remove('anim-knocked');

      if (challengeArea) challengeArea.style.display = 'block';
      if (actionArea) actionArea.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'none';
      if (screen) screen.style.display = 'flex';

      this.renderBattleChallenge();
    } catch (err) {
      console.error("Arena Error:", err);
      alert("Oops! The Arena had a problem starting. Try again!");
    }
  }

  updateBattleStatsUI() {
    const data = this.battleState.playerPet;
    const enemy = this.battleState.enemyPet;
    const diff = this.battleState.difficulty;
    const livesIcons = "❤️".repeat(this.battleState.lives);
    document.getElementById('battle-player-name').innerHTML = `You ${livesIcons}<br><span style="color:var(--accent); font-size:0.7em;">HP: ${this.battleState.playerHp} | ${data.rarity}</span>`;
    document.getElementById('battle-enemy-name').innerHTML = `${enemy.name} <br><span style="color:${diff.color}; font-size:0.7em;">[${diff.label}] HP: ${this.battleState.enemyHp} | ${enemy.rarity}</span>`;
  }

  updateArenaTheme(env) {
    const screen = document.getElementById('battle-screen');
    const floor = document.getElementById('battle-bg');
    if (!screen || !floor) return;

    if (env === 'water') {
      screen.style.background = 'linear-gradient(180deg, #e0f2fe 0%, #38bdf8 50%, #0369a1 100%)';
      floor.style.background = '#075985';
      floor.style.borderTopColor = '#0ea5e9';
    } else if (env === 'space') {
      screen.style.background = 'linear-gradient(180deg, #1e1b4b 0%, #4c1d95 100%)';
      floor.style.background = '#312e81';
      floor.style.borderTopColor = '#4338ca';
    } else {
      // Land / Forest
      screen.style.background = 'linear-gradient(180deg, #bae6fd 0%, #7dd3fc 50%, #10b981 100%)';
      floor.style.background = '#16a34a';
      floor.style.borderTopColor = '#15803d';
    }
  }

  initiateFriendBattle() {
    this.playSFX('click');
    const otherUsers = Object.keys(this.users).filter(id => id !== this.currentUser);
    
    // Helper to check codes
    const getCode = (uid) => {
      const u = this.users[uid];
      let hash = 0;
      const str = u.name + uid;
      for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
      return Math.abs(hash % 90000 + 10000).toString();
    };

    let msg = "FRIEND OPTIONS 🌐\n\n";
    msg += "1. SHOW MY CODE\n";
    msg += "2. ADD FRIEND (Enter Code)\n";
    
    const friendList = this.friends || [];
    if (friendList.length > 0) {
      msg += "\nMY FRIENDS:\n";
      friendList.forEach((fid, i) => {
        if (this.users[fid]) msg += `${i+3}. ${this.users[fid].name} (Lvl ${this.users[fid].level})\n`;
      });
    }

    if (otherUsers.length > 0) {
      msg += "\nLOCAL PROFILES:\n";
      otherUsers.forEach((id, i) => {
        if (!friendList.includes(id)) msg += `${i + 3 + friendList.length}. ${this.users[id].name}\n`;
      });
    }
    msg += "\nType choice:";

    const input = prompt(msg);
    if (!input) return;

    if (input === "1") {
      alert(`Your BATTLE CODE is: ${getCode(this.currentUser)}\nGive this to a friend to add you!`);
    } else if (input === "2") {
      const code = prompt("Enter your friend's 5-digit code:");
      if (code && code.length === 5) {
        const foundId = Object.keys(this.users).find(uid => uid !== this.currentUser && getCode(uid) === code);
        if (foundId) {
          this.addNotificationToUser(foundId, {
            type: 'friend_request',
            fromId: this.currentUser,
            fromName: this.users[this.currentUser].name,
            title: 'Friend Request! 🤝',
            message: `${this.users[this.currentUser].name} used your code to send a request!`
          });
          alert("Request Sent! ✨");
        } else {
          alert("No player found with that code on this machine!");
        }
      }
    } else {
      const choice = parseInt(input);
      let targetId = null;
      if (choice >= 3 && choice < 3 + friendList.length) {
        targetId = friendList[choice - 3];
      } else {
        const filteredOther = otherUsers.filter(id => !friendList.includes(id));
        const idx = choice - 3 - friendList.length;
        if (filteredOther[idx]) targetId = filteredOther[idx];
      }

      if (targetId && this.users[targetId]) {
        const friend = this.users[targetId];
        const pet = (friend.equippedPets && friend.equippedPets.length > 0) ? friend.equippedPets[0] : (friend.unlockedAnimals && friend.unlockedAnimals.length > 0 ? friend.unlockedAnimals[0] : null);
        if (!pet) { alert(`${friend.name} has no animals!`); return; }
        const data = ANIMALS.find(a => a.name === pet.animalName);
        this.startBattleSequence('pet', { ...data, name: pet.petName, hp: 100 + (friend.level * 10) });
      }
    }
  }

  renderBattleChallenge() {
    const pool = this.buildPool();
    if (pool.length === 0) {
      document.getElementById('battle-status').textContent = "No words available!";
      return;
    }
    
    const target = pool[Math.floor(Math.random() * pool.length)];
    this.targetWord = target; 
    const targetLetter = target.word.charAt(0).toLowerCase();
    
    // Get same-letter distractors globally
    const globalSameLetterPool = [];
    const currentBank = this.wordBank[this.isFrench ? 'fr' : 'en'];
    Object.values(currentBank).forEach(levelWords => {
      levelWords.forEach(w => {
        if (w.word.toLowerCase() !== target.word.toLowerCase() && 
            w.word.charAt(0).toLowerCase() === targetLetter) {
          globalSameLetterPool.push(w);
        }
      });
    });

    let distractors = [];
    if (globalSameLetterPool.length >= 3) {
      distractors = globalSameLetterPool.sort(() => Math.random() - 0.5).slice(0, 3);
    } else {
      const otherWords = pool.filter(w => 
        w.word.toLowerCase() !== target.word.toLowerCase() && 
        w.word.charAt(0).toLowerCase() !== targetLetter
      ).sort(() => Math.random() - 0.5);
      distractors = [...globalSameLetterPool, ...otherWords].slice(0, 3);
    }

    let cards = [target, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }

    const area = document.getElementById('battle-game-area');
    const challengeArea = document.getElementById('battle-challenge-area');
    
    if (area) {
      area.innerHTML = '';
      area.style.display = 'grid'; 
    }
    
    setTimeout(() => this.speak(target.word), 500);

    cards.forEach(wordData => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.width = '60px'; card.style.height = '80px'; card.style.padding = '5px';
      card.style.margin = '0'; card.style.minWidth = '0'; card.style.minHeight = '0';
      
      const displayWord = wordData.word.toUpperCase();
      card.innerHTML = `<div class="card-word" style="font-size:0.5rem; width:100%; text-align:center;">${displayWord}</div>`;
      
      card.addEventListener('click', () => {
        if (wordData.word === this.targetWord.word) {
          this.playSFX('correct');
          document.getElementById('battle-status').textContent = `${this.battleState.playerPet.powers} charged!`;
          document.getElementById('battle-status').style.color = "#22c55e";
          if (challengeArea) challengeArea.style.display = 'none';
          const actionArea = document.getElementById('battle-action-area');
          if (actionArea) actionArea.style.display = 'block';
          
          const attackBtn = document.getElementById('battle-attack-btn');
          const superBtn = document.getElementById('battle-super-btn');
          
          if (this.battleState.superAttackCharge >= 3) {
            if (attackBtn) attackBtn.style.display = 'none';
            if (superBtn) {
              superBtn.style.display = 'block';
              superBtn.disabled = false;
              superBtn.style.opacity = '1';
              superBtn.onclick = () => this.fireBattleAttack(true);
            }
          } else {
            if (superBtn) superBtn.style.display = 'none';
            if (attackBtn) {
              attackBtn.style.display = 'block';
              attackBtn.textContent = `⚔️ USE ${this.battleState.playerPet.powers.toUpperCase()}! ⚔️`;
              attackBtn.disabled = false;
              attackBtn.style.opacity = '1';
              attackBtn.onclick = () => this.fireBattleAttack(false);
            }
          }
        } else {
          this.playSFX('wrong');
          document.getElementById('battle-status').textContent = "Missed! Enemy attacks!";
          document.getElementById('battle-status').style.color = "#ef4444";
          if (area) area.style.display = 'none';
          setTimeout(() => this.enemyAttack(), 1000);
        }
      });
      if (area) area.appendChild(card);
    });
  }

  fireBattleAttack(isSuper = false) {
    this.playSFX('click');
    const btn = isSuper ? document.getElementById('battle-super-btn') : document.getElementById('battle-attack-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

    this.battleState.playerAttackCount++;
    if (!isSuper) this.battleState.superAttackCharge++;

    const playerPet = document.getElementById('battle-player-pet');
    const enemyPet = document.getElementById('battle-enemy-pet');
    const battleScreen = document.getElementById('battle-screen');
    const power = this.battleState.playerPet.powers;

    // 1. "POWER GOES OUT" EFFECT
    playerPet.classList.add('anim-power');
    
    // specialized animations
    if (power === 'Shockwave' || power === 'Earthquake' || power === 'Stomp' || (this.battleState.playerPet.animalName && this.battleState.playerPet.animalName.toLowerCase().includes('rex'))) {
      playerPet.classList.add('anim-stomp');
      setTimeout(() => {
        playerPet.classList.remove('anim-stomp');
        battleScreen.classList.add('anim-shake-screen');
        const sw = document.createElement('div'); sw.className = 'shockwave-effect';
        const pr = playerPet.getBoundingClientRect(); sw.style.left = `${pr.left}px`; sw.style.top = `${pr.bottom - 50}px`;
        battleScreen.appendChild(sw);
        setTimeout(() => { 
          battleScreen.classList.remove('anim-shake-screen'); 
          sw.remove(); 
          this.applyBattleDamage(isSuper);
          playerPet.classList.remove('anim-power');
        }, 600);
      }, 400);
    } else if (power === 'Speed' || power === 'Dash' || power === 'Strike') {
      // ⚡ DASH ATTACK
      const pr = playerPet.getBoundingClientRect(), er = enemyPet.getBoundingClientRect();
      const dx = er.left - pr.left, dy = er.top - pr.top;
      playerPet.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      playerPet.style.transform = `translate(${dx}px, ${dy}px) scale(1.2)`;
      setTimeout(() => {
        this.applyBattleDamage(isSuper);
        playerPet.style.transform = 'translate(0,0) scale(1)';
        playerPet.classList.remove('anim-power');
      }, 250);
    } else {
      // 3. INSTANT HIT EFFECT (Replaces shooting ball)
      this.playSFX('correct');
      enemyPet.animate([
        { filter: 'brightness(1)', transform: 'scale(1)' },
        { filter: 'brightness(3) contrast(0.5)', transform: 'scale(1.1)', offset: 0.1 },
        { filter: 'brightness(1)', transform: 'scale(1)' }
      ], { duration: 400 });
      
      this.applyBattleDamage(isSuper);
      playerPet.classList.remove('anim-power');
    }
  }

  applyBattleDamage(isSuper) {
    const enemyPet = document.getElementById('battle-enemy-pet');
    this.playSFX('correct');
    enemyPet.animate([{ transform: 'translateX(20px)' }, { transform: 'translateX(0)' }], { duration: 300 });
    const stats = RARITY_STATS[this.battleState.playerPet.rarity] || RARITY_STATS.Common;
    let damage = Math.round((25 + Math.floor(Math.random() * 25)) * stats.dmg);
    if (isSuper) { damage = Math.round(damage * 2.5); this.battleState.superAttackCharge = 0; }
    this.battleState.enemyHp = Math.max(0, this.battleState.enemyHp - damage);
    document.getElementById('battle-enemy-hp').style.width = `${(this.battleState.enemyHp / this.battleState.enemyMaxHp) * 100}%`;
    document.getElementById('battle-status').textContent = `${this.battleState.playerPet.name} used ${isSuper ? "SUPER" : this.battleState.playerPet.powers.toUpperCase()}!`;
    document.getElementById('battle-status').style.color = isSuper ? "#f59e0b" : "#22c55e";
    document.getElementById('battle-action-area').style.display = 'none';
    if (this.battleState.enemyHp <= 0) {
      enemyPet.classList.add('anim-knocked');
      setTimeout(() => {
        const mult = this.battleState.difficulty.rewardMult;
        let cr = Math.round(50 * mult), xr = Math.round(20 * mult);
        document.getElementById('battle-status').textContent = `VICTORY!`;
        document.getElementById('battle-word-prompt').innerHTML = `${this.battleState.difficulty.label} Defeated!<br>💰 +${cr} 🪙 | ✨ +${xr} XP`;
        document.getElementById('battle-challenge-area').style.display = 'block';
        document.getElementById('battle-game-area').style.display = 'none';
        this.coins += cr; this.xp += xr; if (this.xp >= this.maxXP) this.levelUp();
        this.updateStats(); this.saveProfile();
        document.getElementById('close-battle-btn').style.display = 'block';
      }, 1000);
    } else { setTimeout(() => this.enemyAttack(), 1500); }
  }

  enemyAttack() {
    document.getElementById('battle-action-area').style.display = 'none';
    const playerPet = document.getElementById('battle-player-pet');
    const enemyPet = document.getElementById('battle-enemy-pet');
    
    // 1. INSTANT HIT EFFECT (Replaces shooting ball)
    this.playSFX('wrong');
    playerPet.animate([
      { filter: 'brightness(1)', transform: 'scale(1)' },
      { filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg)', transform: 'scale(0.95)', offset: 0.1 },
      { filter: 'brightness(1)', transform: 'scale(1)' }
    ], { duration: 400 });

    setTimeout(() => {
      const enemyRarityStats = RARITY_STATS[this.battleState.enemyPet.rarity] || RARITY_STATS.Common;
      const damage = Math.round((15 + Math.floor(Math.random() * 15)) * this.battleState.difficulty.damageMult * enemyRarityStats.dmg);
      this.battleState.playerHp = Math.max(0, this.battleState.playerHp - damage);
      document.getElementById('battle-player-hp').style.width = `${(this.battleState.playerHp / this.battleState.playerMaxHp) * 100}%`;
      
      if (this.battleState.playerHp <= 0) {
        if (this.battleState.mode === 'pet') {
          this.handlePlayerDefeat();
        } else {
          document.getElementById('battle-status').textContent = "DEFEAT!";
          document.getElementById('battle-status').style.color = "#ef4444";
          document.getElementById('close-battle-btn').style.display = 'block';
        }
      } else {
        document.getElementById('battle-status').textContent = "Your turn! Power up!";
        document.getElementById('battle-status').style.color = "#7c3aed";
        document.getElementById('battle-challenge-area').style.display = 'block';
        this.renderBattleChallenge();
      }
    }, 200);
  }

  handlePlayerDefeat() {
    this.playSFX('wrong');
    this.battleState.lives--;
    this.updateBattleStatsUI();

    if (this.battleState.lives > 0) {
      document.getElementById('battle-status').textContent = "ANIMAL EXHAUSTED! SWITCHING...";
      document.getElementById('battle-status').style.color = "#f59e0b";
      document.getElementById('battle-challenge-area').style.display = 'none';
      
      setTimeout(() => {
        this.showDefeatSelectScreen();
      }, 1500);
    } else {
      document.getElementById('battle-status').textContent = "NO LIVES LEFT! DEFEAT!";
      document.getElementById('battle-status').style.color = "#ef4444";
      document.getElementById('battle-challenge-area').style.display = 'none';
      document.getElementById('close-battle-btn').style.display = 'block';
    }
  }

  showDefeatSelectScreen() {
    const screen = document.getElementById('defeat-select-screen');
    const list = document.getElementById('defeat-treasure-list');
    list.innerHTML = '';
    
    // Filter out treasures already used in this battle
    const available = this.unlockedAnimals.filter(ua => !this.battleState.usedPetNames.includes(ua.petName));

    if (available.length === 0) {
      document.getElementById('battle-status').textContent = "NO MORE ANIMALS! DEFEAT!";
      document.getElementById('battle-status').style.color = "#ef4444";
      document.getElementById('close-battle-btn').style.display = 'block';
      return;
    }

    available.forEach(ua => {
      const data = ANIMALS.find(a => a.name === ua.animalName);
      if (!data) return;
      const card = document.createElement('div');
      card.className = 'collection-card';
      card.style.background = data.bg || 'white';
      card.style.cursor = 'pointer';
      card.style.padding = '10px';
      card.style.borderRadius = '20px';
      card.style.border = '3px solid #e2e8f0';

      card.innerHTML = `
        <div style="font-weight:800; font-size:0.8rem;">${ua.petName}</div>
        <div style="height:70px; width:100%;"><model-viewer src="${data.model}" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width:100%; height:100%; filter: drop-shadow(0 0 5px white);"></model-viewer></div>
        <div class="rarity-display rarity-${data.rarity.toLowerCase()}" style="font-size:0.5rem; padding:2px 5px;">${data.rarity}</div>
      `;
      card.onclick = () => {
        this.playSFX('click');
        this.battleState.usedPetNames.push(ua.petName);
        this.battleState.playerPet = { ...data, name: ua.petName };
        const playerStats = RARITY_STATS[data.rarity] || RARITY_STATS.Common;
        this.battleState.playerHp = playerStats.hp;
        this.battleState.playerMaxHp = playerStats.hp;
        
        document.getElementById('battle-player-pet').src = data.model;
        document.getElementById('battle-player-hp').style.width = '100%';
        this.updateBattleStatsUI();
        
        screen.style.display = 'none';
        document.getElementById('battle-status').textContent = "New Animal Ready!";
        document.getElementById('battle-status').style.color = "#22c55e";
        document.getElementById('battle-challenge-area').style.display = 'block';
        this.renderBattleChallenge();
      };
      list.appendChild(card);
    });
    
    document.getElementById('flee-battle-btn').onclick = () => {
      this.playSFX('click');
      screen.style.display = 'none';
      document.getElementById('battle-screen').style.display = 'none';
      this.newTarget();
    };
    screen.style.display = 'flex';
  }

  startCatchingSequence(animal) {
    this.playSFX('levelUp');
    const screen = document.getElementById('catching-screen');
    const model = document.getElementById('catch-model');
    const challengeArea = document.getElementById('catch-challenge-area');
    const actionArea = document.getElementById('capture-action-area');
    const avatar = document.getElementById('catching-player-avatar');
    const shootBtn = document.getElementById('shoot-power-btn');
    
    // Hide main game elements so they don't peek through
    const gameContainer = document.querySelector('.game-container');
    const topBar = document.querySelector('.top-bar');
    if (gameContainer) gameContainer.style.visibility = 'hidden';
    if (topBar) topBar.style.visibility = 'hidden';

    this.initCatching3DScene(animal.env);

    if (shootBtn) {
      shootBtn.disabled = false;
      shootBtn.style.opacity = '1';
    }

    if (model) {
      model.src = animal.model;
      model.style.opacity = '1';
      model.classList.remove('powered-up');
      model.style.transform = 'translateX(-50%)';
      model.style.transition = 'none';
      const mysteryOverlay = document.getElementById('catch-mystery-overlay');
      if (animal.name === 'Mystery Box') {
        model.style.filter = 'sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.6) drop-shadow(0 0 10px white)';
        if (mysteryOverlay) mysteryOverlay.style.display = 'block';
      } else {
        model.style.filter = 'drop-shadow(0 0 10px white)';
        if (mysteryOverlay) mysteryOverlay.style.display = 'none';
      }
    }
    if (avatar) {
      avatar.src = this.avatarModel || AVATAR_MODELS.male;
      avatar.setAttribute('camera-orbit', '0deg 75deg 5m');
      avatar.animationName = 'Idle';
      avatar.classList.remove('anim-power');
    }

    const content = document.getElementById('catching-content');
    if (content) {
      content.style.opacity = '1';
      content.style.pointerEvents = 'auto';
    }
    
    if (challengeArea) challengeArea.style.display = 'block';
    if (actionArea) actionArea.style.display = 'none';
    if (screen) screen.style.display = 'flex';

    this.renderCatchingChallenge(animal);
  }

  initCatching3DScene(env) {
    const container = document.getElementById('catching-canvas-container');
    if (!container) return;
    container.innerHTML = '';

    const scene = new THREE.Scene();
    
    // Background colors based on env
    if (env === 'water') {
      scene.background = new THREE.Color(0x0369a1);
    } else if (env === 'space') {
      scene.background = new THREE.Color(0x1e1b4b);
    } else {
      scene.background = new THREE.Color(0xbae6fd);
    }

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    let groundColor = 0x4ade80; // Land
    if (env === 'water') groundColor = 0x0284c7;
    if (env === 'space') groundColor = 0x312e81;
    const groundMat = new THREE.MeshLambertMaterial({ color: groundColor });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    // Add some simple trees/rocks (Pushed further back to not block view)
    for (let i = 0; i < 20; i++) {
      let mesh;
      const rx = (Math.random() - 0.5) * 50;
      const rz = (Math.random() * -30) - 5; // Start at -5 and go back to -35
      // Clear a much wider central area
      if (Math.abs(rx) < 15) continue; 

      if (env === 'space') {
        const geo = new THREE.DodecahedronGeometry(Math.random() * 2 + 1);
        const mat = new THREE.MeshLambertMaterial({ color: 0x8b5cf6 });
        mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(rx, Math.random() * 2, rz);
      } else if (env === 'water') {
        const geo = new THREE.CylinderGeometry(0.5, 0.5, Math.random() * 4 + 2);
        const mat = new THREE.MeshLambertMaterial({ color: 0x10b981 }); // Kelp
        mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(rx, 1, rz);
      } else {
        // Simple Tree
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 2);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        
        const leavesGeo = new THREE.ConeGeometry(1.5, 3);
        const leavesMat = new THREE.MeshLambertMaterial({ color: 0x16a34a });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = 2;
        
        mesh = new THREE.Group();
        mesh.add(trunk);
        mesh.add(leaves);
        mesh.position.set(rx, 0, rz);
      }
      scene.add(mesh);
    }

    const animate = () => {
      if (!document.getElementById('catching-screen') || document.getElementById('catching-screen').style.display === 'none') {
        return; // Stop animation loop when hidden
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }

  renderCatchingChallenge(animal) {
    const pool = this.buildPool();
    if (pool.length === 0) {
      console.error("Word pool is empty!");
      const prompt = document.getElementById('catch-word-prompt');
      if (prompt) prompt.textContent = "Oops! No words found.";
      return;
    }
    
    const target = pool[Math.floor(Math.random() * pool.length)];
    this.targetWord = target; // Critical: Set global target for 'Listen Again'
    
    const distractors = pool.filter(w => w.word !== target.word).slice(0, 3);
    let cards = [target, ...distractors];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }

    const prompt = document.getElementById('catch-word-prompt');
    const area = document.getElementById('catch-game-area');
    const challengeArea = document.getElementById('catch-challenge-area');
    
    if (challengeArea) challengeArea.style.display = 'block';
    if (area) {
      area.innerHTML = '';
      area.style.display = 'flex'; // Reset display!
    }
    if (prompt) prompt.textContent = "Listen and Find!";
    
    setTimeout(() => this.speak(target.word), 500);

    // Randomize Capture Element
    const themes = [
      { name: 'FIRE', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)', grad: 'linear-gradient(to bottom, #fde047, #ef4444)', btn: '🔥 FIRE CAPTURE! 🔥' },
      { name: 'WATER', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)', grad: 'linear-gradient(to bottom, #ffffff, #3b82f6)', btn: '🌊 WATER CAPTURE! 🌊' },
      { name: 'EARTH', color: '#84cc16', glow: 'rgba(132, 204, 22, 0.6)', grad: 'linear-gradient(to bottom, #fef08a, #84cc16)', btn: '🌿 EARTH CAPTURE! 🌿' },
      { name: 'WIND', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.6)', grad: 'linear-gradient(to bottom, #ffffff, #94a3b8)', btn: '💨 WIND CAPTURE! 💨' }
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    this.captureTheme = theme;

    cards.forEach(wordData => {
      const card = document.createElement('div');
      card.className = 'card';
      
      // Randomize formatting for each card
      const isSentenceCase = Math.random() > 0.5;
      const isRuled = Math.random() > 0.3;
      
      let displayWord = wordData.word.toLowerCase();
      if (isSentenceCase) {
        displayWord = displayWord.charAt(0).toUpperCase() + displayWord.slice(1);
      }
      
      card.innerHTML = `<div class="card-word ${isRuled ? 'ruled' : ''}">${displayWord}</div>`;
      
      card.addEventListener('click', () => {
        if (wordData.word === target.word) {
          this.playSFX('correct');
          const model = document.getElementById('catch-model');
          if (model) model.classList.add('powered-up');
          
          if (challengeArea) challengeArea.style.display = 'none';
          const actionArea = document.getElementById('capture-action-area');
          if (actionArea) actionArea.style.display = 'block';
          const shootBtn = document.getElementById('shoot-power-btn');
          if (shootBtn) {
            shootBtn.innerHTML = theme.btn;
            shootBtn.style.background = `linear-gradient(to right, ${theme.color}, ${theme.color}dd)`;
            shootBtn.onclick = () => this.fireCapturePower(animal);
          }
        } else {
          this.playSFX('wrong');
          const prompt = document.getElementById('catch-word-prompt');
          if (prompt) prompt.textContent = "Oh no! It ran away!";
          if (area) area.style.display = 'none';
          
          // Visual "Run Away" effect
          const model = document.getElementById('catch-model');
          if (model) {
            model.style.transition = 'all 1s ease-in';
            model.style.transform = 'translateX(calc(-50% - 400px)) scale(0.5)';
            model.style.opacity = '0';
          }
          
          setTimeout(() => {
            const screen = document.getElementById('catching-screen');
            if (screen) screen.style.display = 'none';
            
            // Restore main game elements
            const gameContainer = document.querySelector('.game-container');
            const topBar = document.querySelector('.top-bar');
            if (gameContainer) gameContainer.style.visibility = 'visible';
            if (topBar) topBar.style.visibility = 'visible';

            if (model) {
              // Reset model styles for next time
              model.style.transition = 'none';
              model.style.transform = 'translateX(-50%)';
              model.style.opacity = '1';
            }
            this.newTarget();
          }, 2000);
        }
      });
      if (area) area.appendChild(card);
    });
  }

  fireCapturePower(animal) {
    this.playSFX('click');
    const btn = document.getElementById('shoot-power-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

    const content = document.getElementById('catching-content');
    if (content) {
      content.style.opacity = '0';
      content.style.pointerEvents = 'none';
    }

    const modelViewer = document.getElementById('catch-model');
    const avatarViewer = document.getElementById('catching-player-avatar');
    
    // 1. Channeling stance (facing forward/up towards the wild animal)
    if (avatarViewer) {
      avatarViewer.setAttribute('camera-orbit', '0deg 75deg 5m');
      avatarViewer.animationName = 'Walk'; // Hands forward/active
      avatarViewer.classList.add('anim-power');
    }

    this.playSFX('correct');
    if (modelViewer) {
      modelViewer.animate([
        { filter: 'brightness(1)', transform: 'translateX(-50%) scale(1)' },
        { filter: 'brightness(3.5) contrast(0.6)', transform: 'translateX(-50%) scale(1.15)', offset: 0.15 },
        { filter: 'brightness(1)', transform: 'translateX(-50%) scale(1)' }
      ], { duration: 600 });
    }

    // Transition immediately to the vortex swirl
    setTimeout(() => {
      this.wrapTreasureInSwirl(animal, modelViewer, avatarViewer);
    }, 400);
  }

  wrapTreasureInSwirl(animal, modelViewer, avatarViewer) {
    const rect = modelViewer.getBoundingClientRect();
    const aRect = avatarViewer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const container = document.getElementById('catching-screen');
    const theme = this.captureTheme || { grad: 'linear-gradient(to bottom, #ffffff, #7dd3fc)', glow: 'rgba(125, 211, 252, 0.6)' };

    // 1. FREEZE AND DISAPPEAR QUICKLY
    modelViewer.style.filter = 'brightness(3) contrast(0.5)';
    setTimeout(() => { modelViewer.style.opacity = '0'; }, 50);

    // 2. CREATE SHAPE PIXELS (100 particles - smooth 60fps on mobile)
    const particles = [];
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'snow-soul';
      p.style.background = theme.grad;
      p.style.boxShadow = `0 0 10px #fff, 0 0 18px ${theme.glow || '#7dd3fc'}`;

      const rx = (Math.random() - 0.5) * rect.width * 0.7;
      const ry = (Math.random() - 0.5) * rect.height * 0.7;
      p.style.left = `${centerX + rx}px`;
      p.style.top = `${centerY + ry}px`;
      const size = 4 + Math.random() * 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      container.appendChild(p);
      particles.push(p);
    }

    // 3. VERTICAL VORTEX FUNNEL (Downward from animal at top to avatar at bottom)
    const pocketX = aRect.left + aRect.width * 0.5;
    const pocketY = aRect.top + aRect.height * 0.45;

    setTimeout(() => {
      particles.forEach((p, i) => {
        setTimeout(() => {
          const currentX = parseFloat(p.style.left);
          const currentY = parseFloat(p.style.top);
          
          // Funnel spiral geometry:
          const angle = (i / particleCount) * Math.PI * 6 + (Math.random() * 0.5);
          const swirlRadius = 45 + Math.random() * 40;
          const burstX = centerX + Math.cos(angle) * swirlRadius;
          const burstY = centerY + Math.sin(angle) * (swirlRadius * 0.5) - 15;

          const midRadius = 30 + Math.random() * 25;
          const midX = (centerX + pocketX) * 0.5 + Math.sin(angle * 1.5) * midRadius;
          const midY = centerY + (pocketY - centerY) * 0.52;

          p.animate([
            { left: `${currentX}px`, top: `${currentY}px`, transform: 'scale(1)', opacity: 1 },
            { left: `${burstX}px`, top: `${burstY}px`, transform: 'scale(1.5)', opacity: 1, offset: 0.2 },
            { left: `${midX}px`, top: `${midY}px`, transform: 'scale(1.2)', opacity: 0.95, offset: 0.6 },
            { left: `${pocketX}px`, top: `${pocketY}px`, transform: 'scale(0.1)', opacity: 0 }
          ], {
            duration: 850 + Math.random() * 350,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            fill: 'forwards'
          });
          
          setTimeout(() => p.remove(), 1300);
        }, Math.floor(i / 3) * 16);
      });
    }, 50);

    // 4. FINALIZE (Now much faster - only 2 seconds total)
    setTimeout(() => {
      this.finalizeCapture(animal, avatarViewer);
    }, 2000);
  }

  finalizeCapture(animal, avatarViewer) {
    const mysteryOverlay = document.getElementById('catch-mystery-overlay');
    if (mysteryOverlay) mysteryOverlay.style.display = 'none';
    
    // Reset Avatar Pose & Rotation
    if (avatarViewer) {
      avatarViewer.setAttribute('camera-orbit', '0deg 75deg 5m');
      avatarViewer.animationName = 'Idle';
      avatarViewer.classList.remove('anim-power');
    }

    const content = document.getElementById('catching-content');
    if (content) {
      content.style.opacity = '1';
      content.style.pointerEvents = 'auto';
    }

    setTimeout(() => {
      const screen = document.getElementById('catching-screen');
      if (screen) screen.style.display = 'none';
      
      // Clear glow after transition
      if (avatarViewer) avatarViewer.classList.remove('anim-power');

      // Restore main game elements
      const gameContainer = document.querySelector('.game-container');
      const topBar = document.querySelector('.top-bar');
      if (gameContainer) gameContainer.style.visibility = 'visible';
      if (topBar) topBar.style.visibility = 'visible';

      const model = document.getElementById('catch-model');
      if (model) {
        model.style.opacity = '1';
        model.style.transform = 'translateX(-50%)';
      }
      
      const usedNames = this.unlockedAnimals.map(u => u.petName), availableNames = PET_NAMES.filter(n => !usedNames.includes(n));
      const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${animal.name} #${this.unlockedAnimals.length + 1}`;
      this.unlockedAnimals.push({ animalName: animal.name, petName: petName, level: this.level });
      this.updateQuestProgress('capture_animal', 1);
      this.updateCollectionButton(); this.saveProfile();      
      const chest = document.getElementById('chest-container');
      if (chest) {
        chest.style.transform = 'scale(1.5) rotate(15deg)';
        setTimeout(() => { 
          chest.style.transform = 'scale(1) rotate(0deg)'; 
          const badge = document.getElementById('chest-badge'); 
          if (badge) { badge.style.display = 'block'; badge.textContent = this.unlockedAnimals.length; } 
          this.playSFX('correct');
        }, 500);
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
    content.innerHTML = `
      <h2 style="font-size:2.5em;margin-bottom:10px; font-family:'Outfit'; color:var(--primary);">My Animals</h2>
      
      <div id="rarity-filter-bar" style="display:flex; gap:5px; overflow-x:auto; padding:10px 0; margin-bottom:15px; border-bottom:1px solid #e2e8f0;">
        <button class="filter-btn active" data-rarity="All" style="font-size:0.7rem; padding:8px 12px; width:auto; border-radius:10px;">All</button>
        <button class="filter-btn" data-rarity="Ordinary" style="font-size:0.7rem; padding:8px 12px; width:auto; border-radius:10px;">Ordinary Animals</button>
        <button class="filter-btn" data-rarity="Mythical" style="font-size:0.7rem; padding:8px 12px; width:auto; border-radius:10px;">Mythical Creatures</button>
      </div>

      <div id="collection-list" style="text-align:left; display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px; margin-bottom:30px; max-height:55vh; overflow-y:auto; padding:10px;"></div>
      <button id="close-collection-btn" class="primary" style="border-radius:20px; padding:15px 40px; width:auto; margin:0 auto;">Close Animals</button>
    `;

    const list = document.getElementById('collection-list');
    
    const renderList = (filter = 'All') => {
      list.innerHTML = '';
      const filtered = this.unlockedAnimals.filter(ua => {
        if (filter === 'All') return true;
        const data = ANIMALS.find(a => a.name === ua.animalName);
        if (!data) return false;
        if (filter === 'Ordinary') return data.rarity === 'Common' || data.rarity === 'Uncommon';
        if (filter === 'Mythical') return data.rarity === 'Rare' || data.rarity === 'Epic' || data.rarity === 'Legendary' || data.rarity === 'Mythic';
        return true;
      });

      if (filtered.length === 0) {
        list.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-light); padding:20px;">No ${filter === 'All' ? '' : filter} creatures yet!</p>`;
        return;
      }

      filtered.reverse().forEach(ua => {
        const data = ANIMALS.find(a => a.name === ua.animalName);
        if (!data) return;
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.style.cursor = 'pointer';
        card.style.padding = '10px';
        card.style.background = data.bg || 'white';

        let extraContent = '';
        if (data.name === 'Mystery Box') {
          extraContent = `<button class="accent open-box-btn" style="margin-top:5px; padding:5px 15px; font-size:0.7rem; width:auto; border-radius:10px; z-index:10;">📦 OPEN</button>`;
        }

        const rarityHtml = data.name === 'Mystery Box' ? '' : `<div class="rarity-display rarity-${data.rarity.toLowerCase()}" style="font-size:0.6rem; padding:3px 8px; margin-bottom:2px; border-width:2px;">${data.rarity}</div>`;
        const mysteryOverlay = data.name === 'Mystery Box' ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:2rem; pointer-events:none; text-shadow: 0 0 5px white; z-index:5;">❓</div>' : '';

        card.innerHTML = `
          ${rarityHtml}
          <div style="font-weight:800; color:var(--primary); font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; text-align:center;">${ua.petName}</div>
          <div style="height:80px; width:100%; position:relative;">
            ${mysteryOverlay}
            <model-viewer src="${data.model}" shadow-intensity="1" camera-orbit="0deg 75deg auto" disable-zoom interaction-prompt="none" style="width:100%; height:100%; filter: ${data.name === 'Mystery Box' ? 'sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.6) drop-shadow(0 0 5px white)' : 'drop-shadow(0 0 5px white) drop-shadow(0 0 2px white)'};"></model-viewer>
          </div>
          <div style="font-weight:700; font-size:0.7rem; text-transform:uppercase; color:var(--text);">${data.name}</div>
          ${extraContent}
        `;
        
        if (data.name === 'Mystery Box') {
          const openBtn = card.querySelector('.open-box-btn');
          if (openBtn) {
            openBtn.onclick = (e) => {
              e.stopPropagation();
              this.performOpenBox(ua);
            };
          }
        }

        card.addEventListener('click', () => this.showTreasureDetail(ua));
        list.appendChild(card);
      });
    };

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderList(e.target.dataset.rarity);
      };
    });

    renderList('All');
    document.getElementById('close-collection-btn').addEventListener('click', () => { this.playSFX('click'); document.getElementById('animal-collection-screen').style.display = 'none'; });
    document.getElementById('animal-collection-screen').style.display = 'flex';
  }

  performOpenBox(ua) {
    const idx = this.unlockedAnimals.indexOf(ua);
    if (idx === -1) return;
    
    this.playSFX('levelUp');
    this.unlockedAnimals.splice(idx, 1); // Remove the box
    
    // Loot logic: Coins, XP, or Common/Uncommon treasures
    const roll = Math.random();
    let rewardText = "";
    if (roll < 0.4) {
      const coins = 100 + Math.floor(Math.random() * 300);
      this.coins += coins;
      rewardText = `🪙 ${coins} DyslexiCoins!`;
    } else if (roll < 0.7) {
      const xp = 25 + Math.floor(Math.random() * 50);
      this.xp += xp;
      if (this.xp >= this.maxXP) this.levelUp();
      rewardText = `✨ ${xp} XP!`;
    } else {
      const pool = ANIMALS.filter(a => a.rarity === 'Common' || a.rarity === 'Uncommon');
      const prize = pool[Math.floor(Math.random() * pool.length)];
      const availableNames = PET_NAMES.filter(n => !this.unlockedAnimals.some(u => u.petName === n));
      const petName = availableNames[Math.floor(Math.random() * availableNames.length)] || `${prize.name} Jr`;
      this.unlockedAnimals.push({ petName: petName, animalName: prize.name, level: 1 });
      rewardText = `🎁 A new ${prize.rarity} treasure: ${petName} (${prize.name})!`;
    }
    
    this.saveProfile();
    this.updateStats();
    alert(`Mystery Box Opened!\n\nYou found: ${rewardText}`);
    this.showCollectionScreen();
  }

  showTreasureDetail(userAnimal) {
    this.playSFX('click');
    const animalData = ANIMALS.find(a => a.name === userAnimal.animalName);
    if (!animalData) return;
    const modal = document.getElementById('treasure-detail-screen');
    const container = modal.querySelector('.unlock-animal-container');
    if (container) container.style.background = animalData.bg || 'white';
    
    const rarityEl = document.getElementById('detail-rarity');
    if (animalData.name === 'Mystery Box') {
      rarityEl.style.display = 'none';
    } else {
      rarityEl.style.display = 'inline-block';
      rarityEl.textContent = animalData.rarity;
      rarityEl.className = `rarity-display rarity-${animalData.rarity.toLowerCase()}`;
    }

    document.getElementById('detail-pet-name').textContent = userAnimal.petName;
    document.getElementById('detail-animal-name').textContent = animalData.name === 'Mystery Box' ? 'The Mystery Box' : `The ${animalData.name}`;
    document.getElementById('detail-model').src = animalData.model;
    document.getElementById('detail-story').textContent = animalData.story || "Mysterious treasure.";
    document.getElementById('detail-powers').textContent = animalData.powers || "Magic properties.";

    // Show Rarity-based stats
    const stats = RARITY_STATS[animalData.rarity] || RARITY_STATS.Common;
    const hpEl = document.getElementById('detail-hp');
    const dmgEl = document.getElementById('detail-dmg');
    if (hpEl) hpEl.textContent = stats.hp;
    if (dmgEl) dmgEl.textContent = `${stats.dmg}x`;
    
    const equipBtn = document.getElementById('equip-pet-btn');
    if (equipBtn) {
      if (animalData.name === 'Mystery Box') {
        equipBtn.style.display = 'none';
      } else {
        equipBtn.style.display = 'block';
        const isEquipped = this.equippedPets.some(p => p.petName === userAnimal.petName);
        equipBtn.textContent = isEquipped ? 'Unequip Pet ✕' : 'Equip as Pet ✨';
        equipBtn.onclick = () => {
          this.playSFX('correct');
          if (isEquipped) {
            this.equippedPets = this.equippedPets.filter(p => p.petName !== userAnimal.petName);
          } else {
            this.equippedPets.push(userAnimal);
          }
          this.saveProfile();
          this.updateGameplayVisuals();
          this.showTreasureDetail(userAnimal);
        };
      }
    }

    const renameBtn = document.getElementById('rename-pet-btn');
    if (renameBtn) {
      if (animalData.name === 'Mystery Box') {
        renameBtn.style.display = 'none';
      } else {
        renameBtn.style.display = 'block';
        renameBtn.onclick = () => {
          const newName = prompt(`What would you like to name your ${userAnimal.animalName}?`, userAnimal.petName);
          if (newName && newName.trim() !== "") {
            userAnimal.petName = newName.trim();
            this.saveProfile();
            this.showTreasureDetail(userAnimal);
          }
        };
      }
    }

    document.getElementById('close-detail-btn').onclick = () => { this.playSFX('click'); modal.style.display = 'none'; };
    modal.style.display = 'flex';
  }

  setLang(l) {
    this.isFrench = (l === 'fr');
    this.saveProfile();
    this.populateVoiceList();
    document.getElementById('new-player-en')?.classList.toggle('active', !this.isFrench);
    document.getElementById('new-player-fr')?.classList.toggle('active', this.isFrench);
    document.getElementById('english-btn')?.classList.toggle('active', !this.isFrench);
    document.getElementById('french-btn')?.classList.toggle('active', this.isFrench);
    this.newTarget();
  }
  setMode(m) {
    this.isTalkMode = (m === 'talk');
    this.saveProfile();
    document.getElementById('mode-listen')?.classList.toggle('active', !this.isTalkMode);
    document.getElementById('mode-talk')?.classList.toggle('active', this.isTalkMode);
    this.newTarget();
  }
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
    document.getElementById('back-to-avatar-btn')?.addEventListener('click', () => {
      this.playSFX('click');
      document.getElementById('create-step-2').style.display = 'none';
      document.getElementById('create-step-avatar').style.display = 'block';
    });
    document.getElementById('show-new-profile-btn')?.addEventListener('click', () => { 
      this.playSFX('click'); 
      this.gender = 'male';
      this.avatarModel = AVATAR_MODELS.male;
      const step1Preview = document.getElementById('name-step-avatar-preview');
      if (step1Preview) step1Preview.src = this.avatarModel;
      
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
    document.getElementById('mode-listen')?.addEventListener('click', () => this.setMode('listen'));
    document.getElementById('mode-talk')?.addEventListener('click', () => this.setMode('talk'));
    document.getElementById('notif-btn')?.addEventListener('click', () => this.showNotificationsScreen());
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      this.playSFX('click');
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('sidebar-overlay').style.display = 'block';
    });
    document.getElementById('sidebar-close')?.addEventListener('click', () => {
      this.playSFX('click');
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').style.display = 'none';
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').style.display = 'none';
    });
    document.getElementById('new-game')?.addEventListener('click', () => { if(confirm("Reset progress?")) this.reset(); });
    document.getElementById('delete-profile-btn')?.addEventListener('click', () => this.deleteCurrentProfile());
    document.getElementById('store-btn')?.addEventListener('click', () => this.showStoreScreen());
    document.getElementById('quests-btn-top')?.addEventListener('click', () => this.showQuestsScreen());
    document.getElementById('quests-btn')?.addEventListener('click', () => this.showQuestsScreen());
    document.getElementById('font-standard-btn')?.addEventListener('click', () => this.setFont(false));
    document.getElementById('font-dyslexic-btn')?.addEventListener('click', () => this.setFont(true));
    document.getElementById('music-on-btn')?.addEventListener('click', () => { this.playSFX('click'); this.setMusic(true); });
    document.getElementById('music-off-btn')?.addEventListener('click', () => { this.playSFX('click'); this.setMusic(false); });
    document.getElementById('song-selector')?.addEventListener('change', (e) => {
      this.playSFX('click');
      this.setSong(parseInt(e.target.value));
    });
    document.getElementById('close-quests-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('quests-screen').style.display = 'none'; });
    document.getElementById('shop-btn')?.addEventListener('click', () => this.showShopScreen());
    document.getElementById('shop-btn-sidebar')?.addEventListener('click', () => this.showShopScreen());
    document.getElementById('close-shop-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('shop-screen').style.display = 'none'; });
    document.getElementById('close-store-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('store-screen').style.display = 'none'; });
    document.getElementById('english-btn')?.addEventListener('click', () => this.setLang('en'));
    document.getElementById('french-btn')?.addEventListener('click', () => this.setLang('fr'));
    document.getElementById('voice-select')?.addEventListener('change', (e) => {
      this.selectedVoiceURI = e.target.value;
      this.saveProfile();
    });
    document.getElementById('test-voice-btn')?.addEventListener('click', () => {
      this.playSFX('click');
      this.speak("Testing, one two three.");
    });
    document.getElementById('speak-btn')?.addEventListener('click', () => { this.playSFX('click'); this.speak(); });
    document.getElementById('catch-speak-btn')?.addEventListener('click', () => { this.playSFX('click'); this.speak(); });
    document.getElementById('battle-speak-btn')?.addEventListener('click', () => { this.playSFX('click'); this.speak(); });
    
    // Arena Button - Robust Listener
    const arenaBtn = document.getElementById('battle-btn');
    if (arenaBtn) {
      arenaBtn.onclick = () => {
        this.playSFX('click');
        // Close sidebar if open
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').style.display = 'none';
        this.startBattleSequence('pet'); 
      };
    }

    document.getElementById('close-battle-mode-btn')?.addEventListener('click', () => {
      this.playSFX('click');
      document.getElementById('battle-mode-screen').style.display = 'none';
    });
    document.getElementById('flee-battle-btn')?.addEventListener('click', () => { document.getElementById('defeat-select-screen').style.display = 'none'; document.getElementById('battle-screen').style.display = 'none'; this.newTarget(); });
    document.getElementById('close-battle-btn')?.addEventListener('click', () => { 
      this.playSFX('click'); 
      document.getElementById('battle-screen').style.display = 'none'; 
      document.getElementById('battle-player-avatar').style.display = 'block';
      document.getElementById('battle-enemy-avatar').style.display = 'block';
      this.newTarget(); 
    });
    document.getElementById('mic-btn')?.addEventListener('click', () => this.startListening(false));
    document.getElementById('chest-container')?.addEventListener('click', () => { this.playSFX('click'); this.showCollectionScreen(); });
    document.getElementById('collection-btn')?.addEventListener('click', () => { this.playSFX('click'); this.showCollectionScreen(); });
    document.getElementById('continue-btn')?.addEventListener('click', () => { this.playSFX('click'); document.getElementById('level-up-modal').style.display = 'none'; this.checkAnimalUnlock(); });
  }
}

const game = new Game();
window.addEventListener('load', () => game.start());
