// 0. THE AUDIO ENGINE
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
  
  // A 'sawtooth' wave sounds buzzy, perfect for errors
  oscillator.type = 'sawtooth'; 
  
  // Starts at a low 300Hz and drops quickly to 50Hz
  oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.2);
}

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
    correctAnswer: "Quetzal",
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
  }
];



// 2. THE APPLICATION STATE
let gameState = {
  playerName: "", // NEW: Store the student's name
  currentQuestionIndex: 0,
  score: 0
};

let gameScore = 0;
let timeLeft = 15;
let birdMoverInterval;
let timerInterval;

// 3. UI CONNECTORS
const loginScreen = document.getElementById("login-screen");
const playerNameInput = document.getElementById("player-name");
const startGameBtn = document.getElementById("start-game-btn");
const displayPlayerName = document.getElementById("display-player-name");
// New Welcome Screen Connectors
const welcomeScreen = document.getElementById("welcome-screen");
const welcomeText = document.getElementById("welcome-text");
const btnChooseQuiz = document.getElementById("btn-choose-quiz");
const btnChooseGame = document.getElementById("btn-choose-game");

const quizScreen = document.getElementById("quiz-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const hintBtn = document.getElementById("hint-btn");
const hintDrawer = document.getElementById("hint-drawer");
const hintText = document.getElementById("hint-text");

const btnQuitGame = document.getElementById("btn-quit-game");
const btnPlayQuizAgain = document.getElementById("btn-play-quiz-again");
const exitQuizComplete = document.getElementById("exit-quiz-complete");
const exitGame = document.getElementById("exit-game");

const homeQuiz = document.getElementById("home-quiz");
const homeQuizComplete = document.getElementById("home-quiz-complete");
const homeGame = document.getElementById("home-game");

const exitWelcome = document.getElementById("exit-welcome");
const exitGameOver = document.getElementById("exit-gameover");

// New Quiz Complete Connectors
const quizCompleteScreen = document.getElementById("quiz-complete-screen");
const btnStartGameAfterQuiz = document.getElementById("btn-start-game-after-quiz");
const btnQuitAfterQuiz = document.getElementById("btn-quit-after-quiz"); // Make sure this line exists!
// ==========================================
// ROUTING & MENU LOGIC
// ==========================================

// 1. The Login Button
startGameBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  
  if (name === "") {
    gameState.playerName = "Student";
  } else {
    gameState.playerName = name;
  }
  
  playPopSound(); 
  
  // Update the Welcome Text dynamically
  welcomeText.innerText = `Welcome, ${gameState.playerName}!`;
  
  // Shift to the Welcome Dashboard
  loginScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
});

// 2. The "Start Quiz" Button
btnChooseQuiz.addEventListener("click", () => {
  playPopSound();
  
  welcomeScreen.classList.remove("active");
  quizScreen.classList.add("active");
  
  renderQuiz(); // Boot up the quiz engine
});

// Play Quiz Again Button Logic
btnPlayQuizAgain.addEventListener("click", () => {
  playPopSound();
  
  // Reset quiz progress, keep player name
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  
  quizCompleteScreen.classList.remove("active");
  quizScreen.classList.add("active");
  renderQuiz();
});

// Exit from Quiz Complete Bridge
exitQuizComplete.addEventListener("click", () => {
  playPopSound();
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.playerName = "";
  playerNameInput.value = "";
  
  quizCompleteScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

// Exit from Mini-Game Screen (Safely clears timers)
exitGame.addEventListener("click", () => {
  playPopSound();
  
  clearInterval(birdMoverInterval);
  clearInterval(timerInterval);
  
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.playerName = "";
  playerNameInput.value = "";
  
  gameScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

// 3. The "Play Game" Button
btnChooseGame.addEventListener("click", () => {
  playPopSound();
  
  welcomeScreen.classList.remove("active");
  gameScreen.classList.add("active");
  
  startMiniGame(); // Boot up the game engine directly
});
// 4. The "Start Game After Quiz" Button
btnStartGameAfterQuiz.addEventListener("click", () => {
  playPopSound();
  
  quizCompleteScreen.classList.remove("active");
  gameScreen.classList.add("active");
  
  startMiniGame(); // Now the bird timer starts!
});

// 4. THE QUIZ ENGINE
function renderQuiz() {
  optionsContainer.innerHTML = "";
  hintDrawer.classList.remove("visible");

  let currentData = birdQuizData[gameState.currentQuestionIndex];
  questionText.innerText = currentData.question;
  hintText.innerText = currentData.hint;

  currentData.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.addEventListener("click", () => handleAnswerSubmit(option, currentData.correctAnswer, button));
    optionsContainer.appendChild(button);
  });
}

const hintImage = document.getElementById("hint-image");

hintBtn.addEventListener("click", () => {
  hintDrawer.classList.add("visible");
  
  // Grab current question data
  let currentData = birdQuizData[gameState.currentQuestionIndex];
  
  // If the question has a hint image, load it and show it; otherwise hide it
  if (currentData.hintImage) {
    hintImage.src = currentData.hintImage;
    hintImage.style.display = "block";
  } else {
    hintImage.style.display = "none";
  }
});

function handleAnswerSubmit(selectedOption, correctAnswer, clickedButton) {
  // Lock buttons so they can't double-click
  const allButtons = optionsContainer.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);

  if (selectedOption === correctAnswer) {
    // Play the happy pop for the right answer
    playPopSound(); 
    
    gameState.score++;
    clickedButton.style.background = "linear-gradient(135deg, #00b09b, #96c93d)";
  } else {
    // Play the low buzz for the wrong answer
    playWrongSound(); 
    
    clickedButton.style.background = "linear-gradient(135deg, #ff416c, #ff4b2b)";
    
    // Highlight the correct one in green
    allButtons.forEach(btn => {
      if (btn.innerText === correctAnswer) {
        btn.style.background = "linear-gradient(135deg, #00b09b, #96c93d)";
      }
    });
  }
  
  // Pause before moving on
  // Pause before moving on
  setTimeout(() => {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex < birdQuizData.length) {
      renderQuiz(); 
    } else {
      // 1. Inject the final quiz score
      document.getElementById("quiz-score-display").innerText = gameState.score;
      document.getElementById("quiz-total-display").innerText = birdQuizData.length;

      // 2. Generate dynamic encouragement based on the score
      const encouragementDisplay = document.getElementById("quiz-encouragement-text");
      const scorePercentage = gameState.score / birdQuizData.length;
      
      if (scorePercentage === 1) {
        encouragementDisplay.innerText = "Flawless victory! You are a true bird expert! 🦉";
      } else if (scorePercentage >= 0.5) {
        encouragementDisplay.innerText = "Great job! You really know your feathers! 🦅";
      } else {
        encouragementDisplay.innerText = "Good effort! Every expert starts as a beginner! 🐣";
      }

      // 3. Shift to the bridge screen
      quizScreen.classList.remove("active");
      quizCompleteScreen.classList.add("active"); 
    }
  }, 1200);
}

// 5. THE MINI-GAME ENGINE
function startMiniGame() {
  gameScore = 0;
  timeLeft = 15;
  
  const birdTarget = document.getElementById("bird-target");
  const scoreDisplay = document.getElementById("game-score");
  const timeDisplay = document.getElementById("time-display");
  
  scoreDisplay.innerText = gameScore;
  timeDisplay.innerText = timeLeft;

  // Helper function to keep the bird safely below the header text and buttons
  function repositionBird() {
    const maxX = window.innerWidth - 90;
    const maxY = window.innerHeight - 100;
    const minTop = 180; // Leaves the top 180px completely clear of text/icons
    
    const x = Math.max(20, Math.floor(Math.random() * maxX));
    // Generates a random Y position strictly between minTop and maxY
    const y = Math.floor(Math.random() * (maxY - minTop)) + minTop;
    
    birdTarget.style.left = `${x}px`;
    birdTarget.style.top = `${y}px`;
  }

  // Move the bird automatically every 800ms
  birdMoverInterval = setInterval(repositionBird, 800);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Move the bird instantly when tapped
  birdTarget.addEventListener("pointerdown", (event) => {
    playPopSound();
    gameScore++;
    scoreDisplay.innerText = gameScore;
    repositionBird();
  });
}

// 6. GAME OVER ENGINE
function endGame() {
  clearInterval(birdMoverInterval);
  clearInterval(timerInterval);

  gameScreen.classList.remove("active");
  gameOverScreen.classList.add("active");
  document.getElementById("final-score").innerText = gameScore;
  document.getElementById("display-player-name").innerText = gameState.playerName;
}

// Play Again Button Logic
// Play Again Button: Returns to Welcome Screen keeping the student's name
document.getElementById("restart-btn").addEventListener("click", () => {
  playPopSound();
  
  // Reset scores, but keep gameState.playerName intact!
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  
  // Refresh the greeting text with their stored name
  welcomeText.innerText = `Welcome, ${gameState.playerName}!`;
  
  gameOverScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
});
// Helper Function: Safely returns user to the dashboard keeping their name
function returnToDashboard() {
  playPopSound();
  
  // Stop active game timers if they were playing the game
  clearInterval(birdMoverInterval);
  clearInterval(timerInterval);
  
  // Reset progress data, but keep gameState.playerName intact!
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  
  // Refresh welcome text with their name
  welcomeText.innerText = `Welcome, ${gameState.playerName}!`;
  
  // Hide all screens and show the welcome dashboard
  quizScreen.classList.remove("active");
  quizCompleteScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
}

// Attach listeners to all Home buttons
homeQuiz.addEventListener("click", returnToDashboard);
homeQuizComplete.addEventListener("click", returnToDashboard);
homeGame.addEventListener("click", returnToDashboard);
// Exit from Welcome Dashboard
exitWelcome.addEventListener("click", () => {
  playPopSound();
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.playerName = "";
  playerNameInput.value = "";
  
  welcomeScreen.classList.remove("active");
  loginScreen.classList.add("active");
});
// Exit from Game Over Screen
exitGameOver.addEventListener("click", () => {
  playPopSound();
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.playerName = "";
  playerNameInput.value = "";
  
  gameOverScreen.classList.remove("active");
  loginScreen.classList.add("active");
});

// 7. KICK OFF THE APP
renderQuiz();
