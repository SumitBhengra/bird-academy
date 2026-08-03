// ==========================================
// 0. THE AUDIO ENGINE
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPopSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.1);
}

function playWrongSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.type = 'sawtooth'; 
  oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.2);
}
let currentBirdAudio = null;
const birdCallBtn = document.getElementById("bird-call-btn");

// Function to stop any active audio playback
function stopBirdCall() {
  if (currentBirdAudio) {
    currentBirdAudio.pause();
    currentBirdAudio.currentTime = 0;
    currentBirdAudio = null;
  }
  if (birdCallBtn) {
    birdCallBtn.innerText = "🔊 Listen to Bird Call";
  }
}

// ==========================================
// 1. QUIZ DATA
// ==========================================
const birdQuizData = [
  {
    question: "Which vibrant Australian parrot features a bright blue head, green wings, and a red-orange beak and chest?",
    options: ["Golden Pheasant", "Rainbow Lorikeet", "Atlantic Puffin", "Hoopoe"],
    correctAnswer: "Rainbow Lorikeet",
    hint: "It is famous for its multicolored plumage and lively personality.",
    hintImage: ""
  },
  {
    question: "Which striking gamebird is famous for its unmistakable golden crest and bright red body?",
    options: ["Golden Pheasant", "Wild Turkey", "Himalayan Monal", "Common Pheasant"],
    correctAnswer: "Golden Pheasant",
    hint: "The males display an elaborate golden fan around their necks during courtship.",
    hintImage: ""
  },
  {
    question: "Which sacred, long-tailed bird of Mesoamerica features dazzling metallic green and red plumage?",
    options: ["Resplendent Quetzal", "Quetzal", "Macaw", "Superb Bird-of-Paradise"],
    correctAnswer: "Resplendent Quetzal",
    hint: "Ancient civilizations treasured its long, flowing tail feathers.",
    hintImage: ""
  },
  {
    question: "Which distinctive bird is known for its prominent crown-like crest of feathers, zebra-striped wings, and a long curved bill?",
    options: ["Peacock", "Hoopoe", "Secretarybird", "Crowned Crane"],
    correctAnswer: "Hoopoe",
    hint: "It uses its slender bill to probe the ground for insects.",
    hintImage: ""
  },
  {
    question: "Which charming seabird, often nicknamed the 'clown of the sea', is famous for its colorful, parrot-like bill?",
    options: ["Albatross", "Atlantic Puffin", "Penguin", "Pelican"],
    correctAnswer: "Atlantic Puffin",
    hint: "Its bill turns a brilliant bright orange during the summer breeding season.",
    hintImage: ""
  },
  {
    question: "Which majestic, ground-dwelling bird is famous for the male's massive, iridescent blue-and-green eyespot train?",
    options: ["Turkey", "Peacock", "Pheasant", "Cassowary"],
    correctAnswer: "Peacock",
    hint: "It fans out its gorgeous tail feathers to attract mates.",
    hintImage: ""
  },
  {
    question: "Which North American songbird has brilliant crimson plumage and a distinct black face mask around its bill?",
    options: ["Northern Cardinal", "Scarlet Tanager", "Red Crossbill", "Cedar Waxwing"],
    correctAnswer: "Northern Cardinal",
    hint: "Unlike many songbird species, both the males and females are strong singers.",
    hintImage: ""
  },
  {
    question: "Which massive scavenging bird of prey native to North America is one of the rarest birds in the world?",
    options: ["Bald Eagle", "California Condor", "Andean Condor", "Vulture"],
    correctAnswer: "California Condor",
    hint: "It boasts an enormous wingspan and a bald head adapted for scavenging.",
    hintImage: ""
  },
  {
    question: "Which unique African raptor walks great distances across grasslands and has long, leg-like feathers that resemble quill pens?",
    options: ["Secretarybird", "Bateleur", "Osprey", "Harpy Eagle"],
    correctAnswer: "Secretarybird",
    hint: "It hunts snakes on foot by stomping on them with powerful legs.",
    hintImage: ""
  },
  {
    question: "Which prehistoric-looking swamp bird stands completely still in wetlands and features a massive, clog-shaped bill?",
    options: ["Marabou Stork", "Shoebill", "Grey Heron", "Great Blue Heron"],
    correctAnswer: "Shoebill",
    hint: "Its unique bill helps it catch fish and small aquatic prey in muddy waters.",
    hintImage: ""
  },
  {
    question: "Which iconic rainforest bird is recognized instantly by its enormous, brightly colored orange-and-black bill?",
    options: ["Keel-billed Toucan", "Toco Toucan", "Hornbill", "Ara Macaw"],
    correctAnswer: "Toco Toucan",
    hint: "Despite its large size, its bill is surprisingly light because it is mostly hollow.",
    hintImage: ""
  },
  {
    question: "Which massive, flightless bird is the largest living bird on Earth and can outrun most predators?",
    options: ["Emu", "Cassowary", "Ostrich", "Rhea"],
    correctAnswer: "Ostrich",
    hint: "It has large eyes that are actually bigger than its brain.",
    hintImage: ""
  },
  {
    question: "Which unmistakable water bird is known for its curved neck, pink plumage, and habit of standing on one leg?",
    options: ["Roseate Spoonbill", "Flamingo", "Scarlet Ibis", "Cormorant"],
    correctAnswer: "Flamingo",
    hint: "Their vibrant color comes directly from the specialized pigments in their diet.",
    hintImage: ""
  },
  {
    question: "Which stunning, cobalt-blue parrot known as the largest flying parrot species features striking bright yellow patches around its beak and eyes?",
    options: ["Scarlet Macaw", "Hyacinth Macaw", "Blue-winged Macaw", "Eclectus Parrot"],
    correctAnswer: "Hyacinth Macaw",
    hint: "It is a magnificent large parrot found in South America.",
    hintImage: ""
  },
  {
    question: "Which recognizable, intelligent pet bird is famous for its expressive head crest and social nature?",
    options: ["Cockatiel", "Cockatoo", "African Grey", "Parakeet"],
    correctAnswer: "Cockatoo",
    hint: "They love attention and can raise or lower their head crests to show emotion.",
    hintImage: ""
  },
  {
    question: "Which graceful water bird known for its long, curved neck and pure white plumage is famous for mating for life?",
    options: ["Pelican", "Swan", "Crane", "Goose"],
    correctAnswer: "Swan",
    hint: "Two of them can form a heart shape with their long necks when facing each other.",
    hintImage: ""
  },
  {
    question: "Which drumming forest bird uses its reinforced skull and chisel-like bill to find insects hidden in wood?",
    options: ["Woodpecker", "Nuthatch", "Treecreeper", "Kingfisher"],
    correctAnswer: "Woodpecker",
    hint: "You can often hear them tapping rapidly against tree trunks.",
    hintImage: ""
  },
  {
    question: "Which critically endangered shorebird sweeps its unique flat, spoon-like bill side-to-side in shallow water to find food?",
    options: ["Sandpiper", "Spoon-billed Sandpiper", "Curlew", "Lapwing"],
    correctAnswer: "Spoon-billed Sandpiper",
    hint: "It is a tiny migratory wader with a very unusual bill shape.",
    hintImage: ""
  },
  {
    question: "Which flightless, nocturnal bird native to New Zealand has hair-like feathers and nostrils at the very tip of its long bill?",
    options: ["Emu", "Cassowary", "Northern Brown Kiwi", "Takahe"],
    correctAnswer: "Northern Brown Kiwi",
    hint: "It is a proud national symbol of New Zealand.",
    hintImage: ""
  },
  {
    question: "Which large Asian hornbill with a prominent yellow-and-black casque on its head is often called the 'lord of the forest'?",
    options: ["Rhinoceros Hornbill", "Great Hornbill", "Helmeted Hornbill", "Oriental Pied Hornbill"],
    correctAnswer: "Great Hornbill",
    hint: "It is one of the largest members of the hornbill family.",
    hintImage: ""
  },
  {
    question: "Which raptor is known as the fastest animal on Earth, capable of diving at speeds over 320 km/h?",
    options: ["Golden Eagle", "Peregrine Falcon", "Bald Eagle", "Osprey"],
    correctAnswer: "Peregrine Falcon",
    hint: "It spots its prey from high above before executing a lightning-fast high-speed dive.",
    hintImage: ""
  },
  {
    question: "Which magnificent seabird spends years flying over the open ocean without ever touching land?",
    options: ["Albatross", "Seagull", "Pelican", "Petrel"],
    correctAnswer: "Albatross",
    hint: "It has the largest wingspan of any living bird.",
    hintImage: ""
  },
  {
    question: "Which famous North American bird of prey has a striking white feathered head and a bright yellow beak?",
    options: ["Golden Eagle", "Bald Eagle", "Harpy Eagle", "Red-tailed Hawk"],
    correctAnswer: "Bald Eagle",
    hint: "It serves as the national bird and symbol of the United States.",
    hintImage: ""
  },
  {
    question: "Which species of duck is famous for the male's breathtakingly colorful, intricate patterned plumage?",
    options: ["Mallard", "Mandarin Duck", "Wood Duck", "Canvasback"],
    correctAnswer: "Mandarin Duck",
    hint: "Originating in East Asia, they are often symbols of love and good fortune.",
    hintImage: ""
  },
  {
    question: "Which extraordinary Australian bird is world-famous for its ability to perfectly mimic man-made sounds like camera shutters and chainsaws?",
    options: ["Mockingbird", "Superb Lyrebird", "Parrot", "Bowerbird"],
    correctAnswer: "Superb Lyrebird",
    hint: "Its elegant tail feathers resemble an ancient stringed musical instrument.",
    hintImage: ""
  },
  {
    question: "Which nocturnal bird of prey is instantly recognizable by its distinct, pale, heart-shaped face?",
    options: ["Barn Owl", "Snowy Owl", "Great Horned Owl", "Little Owl"],
    correctAnswer: "Barn Owl",
    hint: "Instead of hooting like other owls, they make a distinct screeching sound at night.",
    hintImage: ""
  },
  {
    question: "Which tall wading bird stands quietly in shallow water and folds its long neck into a distinct 'S' shape?",
    options: ["Flamingo", "Great Blue Heron", "Stork", "Crane"],
    correctAnswer: "Great Blue Heron",
    hint: "It has long legs and a sharp dagger-like bill for spearing fish.",
    hintImage: ""
  },
  {
    question: "Which clever bird belongs to the crow family, is known for making and using tools, and can even recognize individual human faces?",
    options: ["Pigeon", "Crow", "Parrot", "Woodpecker"],
    correctAnswer: "Crow",
    hint: "They are part of the smart corvid family and have an incredible memory!",
    hintImage: ""
  },
  {
    question: "Which tiny, buzzing bird is the only one in the world that can fly forward, backward, and even hover in place?",
    options: ["Eagle", "Hummingbird", "Sparrow", "Finch"],
    correctAnswer: "Hummingbird",
    hint: "Its wings beat so fast they create a visible blur and a humming sound.",
    hintImage: ""
  },
  {
    question: "Which penguin species is famous for enduring the freezing Antarctic winter on foot while balancing a single egg on its feet?",
    options: ["Emperor Penguin", "Macaroni Penguin", "Rockhopper Penguin", "Little Blue Penguin"],
    correctAnswer: "Emperor Penguin",
    hint: "They are the tallest and heaviest of all living penguin species.",
    hintImage: ""
  },
  {
    question: "Which small, cheerful parrot is one of the most popular household pet birds in the world?",
    options: ["Macaw", "Budgerigar (Budgie)", "Cockatoo", "African Grey Parrot"],
    correctAnswer: "Budgerigar (Budgie)",
    hint: "They are highly social, colorful, and can even learn to mimic words.",
    hintImage: ""
  },
  {
    question: "Which nocturnal bird of prey has giant eyes and can rotate its head almost all the way around?",
    options: ["Owl", "Hawk", "Falcon", "Eagle"],
    correctAnswer: "Owl",
    hint: "Because their eyes can't move in their sockets, they have to turn their entire head to look around.",
    hintImage: ""
  },
  {
    question: "Which flightless bird native to Australia features shaggy, hair-like feathers and long, powerful legs built for sprinting?",
    options: ["Ostrich", "Emu", "Cassowary", "Rhea"],
    correctAnswer: "Emu",
    hint: "It is the second-tallest bird in the world after the ostrich.",
    hintImage: ""
  },
  {
    question: "Which clever African bird works together with humans by guiding them to wild beehives in exchange for a sweet treat?",
    options: ["Honeyguide", "Bee-eater", "Weaverbird", "Sunbird"],
    correctAnswer: "Honeyguide",
    hint: "It chatters loudly to catch people's attention and lead them straight to honey.",
    hintImage: ""
  },
  {
    question: "Which water bird has a stretchy throat pouch that it uses like a fishing net to scoop up fish?",
    options: ["Pelican", "Seagull", "Cormorant", "Swan"],
    correctAnswer: "Pelican",
    hint: "They often glide gracefully in a line right above the ocean waves.",
    hintImage: ""
  },
  {
    question: "Which fast-running desert bird is famous for zipping across roads instead of flying?",
    options: ["Ostrich", "Greater Roadrunner", "Emu", "Quail"],
    correctAnswer: "Greater Roadrunner",
    hint: "It has a long tail and can run fast enough to outrun a human footprint!",
    hintImage: ""
  },
  {
    question: "Which sneaky bird is famous for laying its eggs in the nests of other unsuspecting bird species instead of building its own?",
    options: ["Cuckoo", "Sparrow", "Robin", "Crow"],
    correctAnswer: "Cuckoo",
    hint: "They trick other birds into raising their chicks for them.",
    hintImage: ""
  },
  {
    question: "Which coastal seabird is famous for the male inflating a giant, bright red balloon pouch on its chest to attract a mate?",
    options: ["Pelican", "Magnificent Frigatebird", "Albatross", "Seagull"],
    correctAnswer: "Magnificent Frigatebird",
    hint: "They have deeply forked tails and an incredible soaring flight style.",
    hintImage: ""
  },
  {
    question: "Which high-flying bird spends almost its entire life airborne—eating, drinking, and even sleeping while flying without ever landing?",
    options: ["Swallow", "Common Swift", "Albatross", "Peregrine Falcon"],
    correctAnswer: "Common Swift",
    hint: "They only ever land on the ground when it is time to build a nest and raise chicks.",
    hintImage: ""
  },
  {
    question: "Which bird was historically used to carry urgent messages across long distances because of its incredible navigation and homing skills?",
    options: ["Parrot", "Homing Pigeon", "Crow", "Hawk"],
    correctAnswer: "Homing Pigeon",
    hint: "They can find their way back home from thousands of miles away.",
    hintImage: ""
  },
  {
    question: "Which brightly colored, highly social rainforest parrot is famous for gathering at riverbanks to eat clay?",
    options: ["Cockatiel", "Macaw", "Budgerigar", "Canary"],
    correctAnswer: "Macaw",
    hint: "Eating the special clay helps neutralize natural toxins from the seeds they eat.",
    hintImage: ""
  },
  {
    question: "Which massive, powerful rainforest eagle of Central and South America has dual crests of feathers and talons as large as a grizzly bear's claws?",
    options: ["Golden Eagle", "Harpy Eagle", "Bald Eagle", "Philippine Eagle"],
    correctAnswer: "Harpy Eagle",
    hint: "It is one of the strongest and most formidable raptors in the world.",
    hintImage: ""
  },
  {
    question: "Which Australian bird is famous for building decorated display grounds ('bowers') and collecting bright blue objects to attract a mate?",
    options: ["Weaverbird", "Satin Bowerbird", "Lyrebird", "Sunbird"],
    correctAnswer: "Satin Bowerbird",
    hint: "The males love collecting blue bottle caps, feathers, and berries.",
    hintImage: ""
  },
  {
    question: "Which flightless bird native to New Zealand lays an astonishingly huge egg that can weigh up to twenty percent of its own body weight?",
    options: ["Kiwi", "Kakapo", "Takahe", "Pukeko"],
    correctAnswer: "Kiwi",
    hint: "It is a nocturnal bird with a long bill and hair-like feathers.",
    hintImage: ""
  },
  {
    question: "Which bird of paradise is famous for the male expanding its brilliant iridescent blue-and-black chest feathers into a striking oval shape during an elaborate dance?",
    options: ["Resplendent Quetzal", "Wilson's Bird-of-Paradise", "Superb Bird-of-Paradise", "King Bird-of-Paradise"],
    correctAnswer: "Superb Bird-of-Paradise",
    hint: "Its courtship dance transforms its look into a bizarre, smiling black ellipse.",
    hintImage: ""
  },
  {
    question: "Which stocky, nocturnal, and critically endangered flightless parrot from New Zealand smells like sweet, musty flowers and can live for decades?",
    options: ["Kea", "Kakapo", "Kaka", "Budgerigar"],
    correctAnswer: "Kakapo",
    hint: "It is the only flightless parrot in the entire world.",
    hintImage: ""
  },
  {
    question: "Which mischievous, high-altitude alpine parrot of New Zealand is famous for its intelligence and curiosity, often investigating and pulling rubber seals off parked cars?",
    options: ["Kea", "Kakapo", "Kaka", "Rosella"],
    correctAnswer: "Kea",
    hint: "It is considered one of the most playful and mischievous birds alive.",
    hintImage: ""
  },
  {
    question: "Which shorebird has a long bill curved downward like a sickle, which it uses to probe mud for hidden crabs and worms?",
    options: ["Curlew", "Heron", "Sandpiper", "Flamingo"],
    correctAnswer: "Curlew",
    hint: "It is well known for its haunting, bubbling whistle call across coastal fields.",
    hintImage: ""
  },
  {
    question: "Listen to the call! Which bird species produces this distinct vocalization?",
    options: ["Northern Cardinal", "Peregrine Falcon", "Cuckoo", "Barn Owl"],
    correctAnswer: "Northern Cardinal",
    hint: "Both male and female cardinals sing clear, whistled songs.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Bird_singing.ogg"
  },
  {
    question: "Listen to this nocturnal call! Which bird of prey is known for this unique face and screech?",
    options: ["Barn Owl", "Snowy Owl", "Eagle", "Hawk"],
    correctAnswer: "Barn Owl",
    hint: "It has a distinct heart-shaped face.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Costa_Rican_Pygmy_Owl_%28Glaucidium_costaricanum%29_call.ogg"
  }
];
// Add or append these audio questions to your birdQuizData array in app.js:

const audioBirdQuestions = [
  {
    question: "Listen closely! Which famous bird makes this iconic 'coo-coo' vocalization?",
    options: ["Cuckoo", "Pigeon", "Mourning Dove", "Owl"],
    correctAnswer: "Cuckoo",
    hint: "It is famous for laying eggs in other birds' nests and making cuckoo clocks tick!",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Cuculus_canorus.ogg"
  },
  {
    question: "Listen to this haunting, ethereal call! Which aquatic bird produces this haunting sound on lakes?",
    options: ["Common Loon", "Albatross", "Pelican", "Mallard Duck"],
    correctAnswer: "Common Loon",
    hint: "It is famous for its striking black-and-white pattern and eerie wilderness call.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Loon_call.ogg"
  },
  {
    question: "Listen to the cheerful song! Which classic North American songbird is singing here?",
    options: ["American Robin", "Blue Jay", "Crow", "Sparrow"],
    correctAnswer: "American Robin",
    hint: "It has a reddish-orange breast and is often seen pulling worms from lawns.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/American_Robin_Yellowstone_National_Park.ogg"
  },
  {
    question: "Listen to these rapid, cheerful chirps! Which popular pet bird is making this sound?",
    options: ["Budgerigar (Budgie)", "Cockatoo", "Macaw", "Canary"],
    correctAnswer: "Budgerigar (Budgie)",
    hint: "It is a small, highly social Australian parrot popular in homes worldwide.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Budgerigar_chirping.ogg"
  },
  {
    question: "Listen to this high-pitched whistle call! Which small nocturnal owl produces this sound?",
    options: ["Costa Rican Pygmy Owl", "Barn Owl", "Great Horned Owl", "Snowy Owl"],
    correctAnswer: "Costa Rican Pygmy Owl",
    hint: "Despite being an owl, it is tiny and hunts during the day and twilight.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Costa_Rican_Pygmy_Owl_%28Glaucidium_costaricanum%29_call.ogg"
  },
  {
    question: "Listen to this soft, resonant call! Which sacred Mesoamerican bird of paradise makes this sound?",
    options: ["Resplendent Quetzal", "Toucan", "Flamingo", "Hornbill"],
    correctAnswer: "Resplendent Quetzal",
    hint: "It features long, metallic green tail feathers and a bright red chest.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Resplendent_Quetzal_song_%28Pharomachrus_mocinno%29.ogg"
  },
  {
    question: "Listen to this deep trumpet-like call! Which striking waterfowl species is calling?",
    options: ["Black Swan", "Flamingo", "Pelican", "Puffin"],
    correctAnswer: "Black Swan",
    hint: "Native to Australia, it has dark feathers and a bright red bill.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Black_Swan_call_%28Cygnus_atratus%29.ogg"
  },
  {
    question: "Listen to this harsh, croaking call! Which tall, elegant wading bird makes this sound in wetlands?",
    options: ["Great Egret", "Flamingo", "Swan", "Seagull"],
    correctAnswer: "Great Egret",
    hint: "It has pure white plumage, long black legs, and a sharp yellow bill.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Great_Egret_%28Ardea_alba_alba%29_call.ogg"
  },
  {
    question: "Listen to this rich, melodic song! Which widespread European songbird is performing here?",
    options: ["Common Blackbird", "Woodpecker", "Peregrine Falcon", "Cuckoo"],
    correctAnswer: "Common Blackbird",
    hint: "Males are all black with a bright yellow bill and ring around their eyes.",
    hintImage: "",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Common_Blackbird_song_%28Turdus_merula%29.ogg"
  }
];
// 👇 PUSH THE MATCHING VARIABLE NAME HERE:
birdQuizData.push(...audioBirdQuestions);

// ==========================================
// 2. THE APPLICATION STATE & TIMERS
// ==========================================
let gameState = {
  playerName: "",
  currentQuestionIndex: 0,
  score: 0,
  correctCount: 0
};

let gameScore = 0;
let timeLeft = 15;
let birdMoverInterval;
let timerInterval;

let currentQuizMode = "classic"; // 'classic' or 'speed'
let quizTimerInterval = null;
let quizTimeLeft = 10;
let streakCount = 0;
let scoreMultiplier = 1;

// ==========================================
// LOCAL STORAGE & HIGH SCORE HELPERS
// ==========================================
function getQuizHighScore() {
  try {
    return parseInt(localStorage.getItem("birdQuizHighScore")) || 0;
  } catch (e) {
    return 0;
  }
}

function getGameHighScore() {
  try {
    return parseInt(localStorage.getItem("birdGameHighScore")) || 0;
  } catch (e) {
    return 0;
  }
}

function updateDashboardHighScores() {
  const quizHigh = getQuizHighScore();
  const gameHigh = getGameHighScore();

  let hsContainer = document.getElementById("dashboard-high-scores");
  if (!hsContainer) {
    hsContainer = document.createElement("div");
    hsContainer.id = "dashboard-high-scores";
    hsContainer.style.cssText = "margin: 10px 0 20px 0; font-size: 15px; color: #facc15; font-weight: 600; background: rgba(0,0,0,0.25); padding: 10px 18px; border-radius: 20px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2);";
    
    const btnChooseQuiz = document.getElementById("btn-choose-quiz");
    if (welcomeScreen && btnChooseQuiz) {
      welcomeScreen.insertBefore(hsContainer, btnChooseQuiz);
    }
  }
  
  if (hsContainer) {
    hsContainer.innerHTML = `🏆 Best Quiz: <strong>${quizHigh} pts</strong> | Best Taps: <strong>${gameHigh} birds</strong>`;
  }
}

// ==========================================
// 3. UI CONNECTORS
// ==========================================
const loginScreen = document.getElementById("login-screen");
const playerNameInput = document.getElementById("player-name");
const startGameBtn = document.getElementById("start-game-btn");
const displayPlayerName = document.getElementById("display-player-name");

const welcomeScreen = document.getElementById("welcome-screen");
const welcomeText = document.getElementById("welcome-text");
const btnChooseQuiz = document.getElementById("btn-choose-quiz");
const btnChooseGame = document.getElementById("btn-choose-game");

const gameModeMenu = document.getElementById("game-mode-menu");
const homeModeMenu = document.getElementById("home-mode-menu");

const quizScreen = document.getElementById("quiz-screen");
const timerContainerWrapper = document.getElementById("timer-container-wrapper");
const timerBar = document.getElementById("timer-bar");
const hudScore = document.getElementById("hud-score");
const multiplierBadge = document.getElementById("multiplier-badge");
const questionTimer = document.getElementById("question-timer");

const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const hintBtn = document.getElementById("hint-btn");
const hintDrawer = document.getElementById("hint-drawer");
const hintText = document.getElementById("hint-text");
const hintImage = document.getElementById("hint-image");

const btnPlayQuizAgain = document.getElementById("btn-play-quiz-again");
const exitQuizComplete = document.getElementById("exit-quiz-complete");
const exitGame = document.getElementById("exit-game");

const homeQuiz = document.getElementById("home-quiz");
const homeQuizComplete = document.getElementById("home-quiz-complete");
const homeGame = document.getElementById("home-game");

const exitWelcome = document.getElementById("exit-welcome");
const exitGameOver = document.getElementById("exit-gameover");

const quizCompleteScreen = document.getElementById("quiz-complete-screen");
const btnStartGameAfterQuiz = document.getElementById("btn-start-game-after-quiz");

const quizNavContainer = document.getElementById("quiz-nav-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// ==========================================
// 4. ROUTING & MENU LOGIC
// ==========================================
startGameBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  gameState.playerName = name === "" ? "Student" : name;
  
  playPopSound(); 
  welcomeText.innerText = `Welcome, ${gameState.playerName}!`;
  updateDashboardHighScores();
  
  loginScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
});

btnChooseQuiz.addEventListener("click", () => {
  playPopSound();
  welcomeScreen.classList.remove("active");
  gameModeMenu.classList.add("active");
});

homeModeMenu.addEventListener("click", returnToDashboard);
// Fisher-Yates shuffle algorithm to randomize questions
function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
let activeQuizData = [];

function startQuizWithMode(mode) {
  playPopSound();
  currentQuizMode = mode;
  streakCount = 0;
  scoreMultiplier = 1;
  gameState.score = 0;
  gameState.correctCount = 0;
  gameState.currentQuestionIndex = 0;

  activeQuizData = shuffleArray(birdQuizData)
  
  gameModeMenu.classList.remove("active");
  quizScreen.classList.add("active");

  if (currentQuizMode === "speed") {
    timerContainerWrapper.style.display = "block";
    questionTimer.style.display = "inline";
    if (quizNavContainer) quizNavContainer.style.display = "none"; // 👈 Hide Nav in Speed Mode
  } else {
    timerContainerWrapper.style.display = "none";
    questionTimer.style.display = "none";
    if (quizNavContainer) quizNavContainer.style.display = "flex"; // 👈 Show Nav in Classic Mode
  }

  renderQuiz();
}

btnPlayQuizAgain.addEventListener("click", () => {
  playPopSound();
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.correctCount = 0;
  streakCount = 0;
  scoreMultiplier = 1;
  updateMultiplierBadge();
  
  quizCompleteScreen.classList.remove("active");
  quizScreen.classList.add("active");
  renderQuiz();
});

exitQuizComplete.addEventListener("click", () => {
  playPopSound();
  resetAllData();
  quizCompleteScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

exitGame.addEventListener("click", () => {
  playPopSound();
  clearInterval(birdMoverInterval);
  clearInterval(timerInterval);
  resetAllData();
  gameScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

btnChooseGame.addEventListener("click", () => {
  playPopSound();
  welcomeScreen.classList.remove("active");
  gameScreen.classList.add("active");
  startMiniGame();
});

btnStartGameAfterQuiz.addEventListener("click", () => {
  playPopSound();
  quizCompleteScreen.classList.remove("active");
  gameScreen.classList.add("active");
  startMiniGame();
});

// ==========================================
// 5. THE QUIZ ENGINE & TIMERS
// ==========================================
function renderQuiz() {
  optionsContainer.innerHTML = "";
  hintDrawer.classList.remove("visible");
  clearInterval(quizTimerInterval);

  stopBirdCall();
  
  let currentData = activeQuizData[gameState.currentQuestionIndex];
  questionText.innerText = currentData.question;
  hintText.innerText = currentData.hint;

  hudScore.innerText = `Score: ${gameState.score}`;

  // Update Previous / Next button controls
  if (prevBtn) {
    prevBtn.disabled = gameState.currentQuestionIndex === 0;
    prevBtn.style.opacity = gameState.currentQuestionIndex === 0 ? "0.4" : "1";
    prevBtn.style.cursor = gameState.currentQuestionIndex === 0 ? "not-allowed" : "pointer";
  }

  if (nextBtn) {
    if (gameState.currentQuestionIndex === activeQuizData.length - 1) {
      nextBtn.innerText = "Finish 🏁";
    } else {
      nextBtn.innerText = "Next ➡️";
    }
  }
  // Handle Audio Button Visibility & Click Event
  if (currentData.audioUrl && currentData.audioUrl !== "") {
    birdCallBtn.style.display = "inline-block";
    birdCallBtn.onclick = () => playBirdCall(currentData.audioUrl);
  } else {
    birdCallBtn.style.display = "none";
  }
  
  currentData.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.addEventListener("click", () => handleAnswerSubmit(option, currentData.correctAnswer, button));
    optionsContainer.appendChild(button);
  });

  if (currentQuizMode === "speed") {
    startSpeedQuizTimer();
  }
}
// Function to handle playing and pausing bird calls
function playBirdCall(url) {
  if (currentBirdAudio && !currentBirdAudio.paused) {
    stopBirdCall();
    return;
  }

  stopBirdCall(); // Clean reset
  currentBirdAudio = new Audio(url);
  birdCallBtn.innerText = "⏸️ Pause Bird Call";

  currentBirdAudio.play().catch(e => console.log("Audio play blocked:", e));

  currentBirdAudio.onended = () => {
    birdCallBtn.innerText = "🔊 Listen to Bird Call";
  };
}

hintBtn.addEventListener("click", () => {
  hintDrawer.classList.add("visible");
  let currentData = activeQuizData[gameState.currentQuestionIndex];
  
  if (currentData.hintImage) {
    hintImage.src = currentData.hintImage;
    hintImage.style.display = "block";
  } else {
    hintImage.style.display = "none";
  }
});

function startSpeedQuizTimer() {
  quizTimeLeft = 10;
  timerBar.style.width = "100%";
  timerBar.style.background = "#10b981";
  questionTimer.innerText = `⏱️ ${quizTimeLeft}s`;

  quizTimerInterval = setInterval(() => {
    quizTimeLeft--;
    questionTimer.innerText = `⏱️ ${quizTimeLeft}s`;
    
    const percentage = (quizTimeLeft / 10) * 100;
    timerBar.style.width = `${percentage}%`;

    if (quizTimeLeft <= 3) {
      timerBar.style.background = "#ef4444";
    }

    if (quizTimeLeft <= 0) {
      clearInterval(quizTimerInterval);
      handleQuizTimeOut();
    }
  }, 1000);
}

function handleQuizTimeOut() {
  playWrongSound();
  streakCount = 0;
  scoreMultiplier = 1;
  updateMultiplierBadge();

  const allButtons = optionsContainer.querySelectorAll("button");
  let currentData = activeQuizData[gameState.currentQuestionIndex];
  
  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === currentData.correctAnswer) {
      btn.style.background = "linear-gradient(135deg, #00b09b, #96c93d)";
    }
  });

  setTimeout(() => {
    proceedToNextQuestion();
  }, 1200);
}

function handleAnswerSubmit(selectedOption, correctAnswer, clickedButton) {
  clearInterval(quizTimerInterval);
  stopBirdCall(); // Stop bird sound when answer chosen
  
  const allButtons = optionsContainer.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);

  if (selectedOption === correctAnswer) {
    playPopSound(); 
    gameState.correctCount++;
    
    streakCount++;
    if (streakCount >= 5) scoreMultiplier = 3;
    else if (streakCount >= 3) scoreMultiplier = 2;
    else scoreMultiplier = 1;

    let pointsEarned = 1 * scoreMultiplier;
    gameState.score += pointsEarned;
    
    clickedButton.style.background = "linear-gradient(135deg, #00b09b, #96c93d)";
  } else {
    playWrongSound(); 
    streakCount = 0;
    scoreMultiplier = 1;
    
    clickedButton.style.background = "linear-gradient(135deg, #ff416c, #ff4b2b)";
    
    allButtons.forEach(btn => {
      if (btn.innerText === correctAnswer) {
        btn.style.background = "linear-gradient(135deg, #00b09b, #96c93d)";
      }
    });
  }
  
  hudScore.innerText = `Score: ${gameState.score}`;
  updateMultiplierBadge();

  setTimeout(() => {
    proceedToNextQuestion();
  }, 1200);
}

function proceedToNextQuestion() {
  gameState.currentQuestionIndex++;
  
  if (gameState.currentQuestionIndex < activeQuizData.length) {
    renderQuiz(); 
  } else {
    clearInterval(quizTimerInterval);

    // Save & compare high score
    const previousHigh = getQuizHighScore();
    let isNewHigh = false;

    if (gameState.score > previousHigh) {
      try {
        localStorage.setItem("birdQuizHighScore", gameState.score);
        isNewHigh = true;
      } catch (e) {
        console.warn("localStorage not available");
      }
    }

    const currentHigh = Math.max(previousHigh, gameState.score);

    // Display scores
    document.getElementById("quiz-score-display").innerText = `${gameState.score} (${gameState.correctCount} correct)`;
    document.getElementById("quiz-total-display").innerText = activeQuizData.length;

    const encouragementDisplay = document.getElementById("quiz-encouragement-text");
    const scorePercentage = gameState.correctCount / activeQuizData.length;
    
    let baseText = "";
    if (scorePercentage === 1) {
      baseText = "Flawless victory! You are a true bird expert! 🦉";
    } else if (scorePercentage >= 0.5) {
      baseText = "Great job! You really know your feathers! 🦅";
    } else {
      baseText = "Good effort! Every expert starts as a beginner! 🐣";
    }

    // Highlight new high score
    if (isNewHigh && gameState.score > 0) {
      encouragementDisplay.innerHTML = `🌟 <strong>NEW HIGH SCORE: ${gameState.score} pts!</strong> 🌟<br>${baseText}`;
    } else {
      encouragementDisplay.innerHTML = `${baseText}<br><small style="font-size: 14px; opacity: 0.9;">🏆 Personal Best: ${currentHigh} pts</small>`;
    }

    quizScreen.classList.remove("active");
    quizCompleteScreen.classList.add("active"); 
  }
}

function updateMultiplierBadge() {
  if (scoreMultiplier > 1) {
    multiplierBadge.style.display = "inline-block";
    multiplierBadge.innerText = `🔥 ${scoreMultiplier}x Multiplier!`;
  } else {
    multiplierBadge.style.display = "none";
  }
}

// ==========================================
// 6. THE MINI-GAME ENGINE
// ==========================================
const birdTarget = document.getElementById("bird-target");

// Move repositionBird to the outer scope so both startMiniGame and the click listener can use it
function repositionBird() {
  const maxX = window.innerWidth - 90;
  const maxY = window.innerHeight - 100;
  const minTop = 180;
  
  const x = Math.max(20, Math.floor(Math.random() * maxX));
  const y = Math.floor(Math.random() * (maxY - minTop)) + minTop;
  
  birdTarget.style.left = `${x}px`;
  birdTarget.style.top = `${y}px`;
}

// Attach event listener ONCE at script startup (outside startMiniGame)
birdTarget.addEventListener("pointerdown", () => {
  if (timeLeft > 0) {
    playPopSound();
    gameScore++;
    document.getElementById("game-score").innerText = gameScore;
    repositionBird();
  }
});

function startMiniGame() {
  gameScore = 0;
  timeLeft = 15;
  
  const scoreDisplay = document.getElementById("game-score");
  const timeDisplay = document.getElementById("time-display");
  
  scoreDisplay.innerText = gameScore;
  timeDisplay.innerText = timeLeft;

  repositionBird(); // Position bird immediately on start

  birdMoverInterval = setInterval(repositionBird, 800);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(birdMoverInterval);
  clearInterval(timerInterval);

  // Save & compare high score
  const previousHigh = getGameHighScore();
  let isNewHigh = false;

  if (gameScore > previousHigh) {
    try {
      localStorage.setItem("birdGameHighScore", gameScore);
      isNewHigh = true;
    } catch (e) {
      console.warn("localStorage not available");
    }
  }

  const currentHigh = Math.max(previousHigh, gameScore);

  gameScreen.classList.remove("active");
  gameOverScreen.classList.add("active");
  
  document.getElementById("final-score").innerText = gameScore;
  document.getElementById("display-player-name").innerText = gameState.playerName;

  // Display High Score Banner on Game Over Screen
  let recordBanner = document.getElementById("game-record-banner");
  if (!recordBanner) {
    recordBanner = document.createElement("p");
    recordBanner.id = "game-record-banner";
    recordBanner.style.cssText = "color: #facc15; font-weight: 600; margin-top: 10px;";
    
    const restartBtn = document.getElementById("restart-btn");
    if (gameOverScreen && restartBtn) {
      gameOverScreen.insertBefore(recordBanner, restartBtn);
    }
  }

  if (recordBanner) {
    if (isNewHigh && gameScore > 0) {
      recordBanner.innerHTML = `🎉 <strong>NEW PERSONAL BEST!</strong> 🎉`;
    } else {
      recordBanner.innerHTML = `🏆 Personal Best: <strong>${currentHigh} birds</strong>`;
    }
  }
}


// ==========================================
// 7. NAVIGATION & HELPERS
// ==========================================
function returnToDashboard() {
  playPopSound();
  stopBirdCall(); // Stop audio when returning home
  
  clearInterval(birdMoverInterval);
  clearInterval(timerInterval);
  clearInterval(quizTimerInterval);
  
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  streakCount = 0;
  scoreMultiplier = 1;
  
  welcomeText.innerText = `Welcome, ${gameState.playerName}!`;
  updateDashboardHighScores();
  
  quizScreen.classList.remove("active");
  gameModeMenu.classList.remove("active");
  quizCompleteScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
}

homeQuiz.addEventListener("click", returnToDashboard);
homeQuizComplete.addEventListener("click", returnToDashboard);
homeGame.addEventListener("click", returnToDashboard);

exitWelcome.addEventListener("click", () => {
  playPopSound();
  resetAllData();
  welcomeScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

exitGameOver.addEventListener("click", () => {
  playPopSound();
  resetAllData();
  gameOverScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

// 👇 PASTE PREV & NEXT LISTENERS HERE 👇
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (gameState.currentQuestionIndex > 0) {
      playPopSound();
      stopBirdCall();
      clearInterval(quizTimerInterval);
      gameState.currentQuestionIndex--;
      renderQuiz();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    playPopSound();
    stopBirdCall();
    clearInterval(quizTimerInterval);
    
    if (gameState.currentQuestionIndex < activeQuizData.length - 1) {
      gameState.currentQuestionIndex++;
      renderQuiz();
    } else {
      // Last question reached - finish quiz
      proceedToNextQuestion();
    }
  });
}

function resetAllData() {
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.playerName = "";
  streakCount = 0;
  scoreMultiplier = 1;
  playerNameInput.value = "";
  
  gameOverScreen.classList.remove("active");
  loginScreen.classList.add("active");
};

// 7. KICK OFF THE APP
renderQuiz();
