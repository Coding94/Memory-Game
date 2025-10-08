 displayScores();

// Select the game board
const board = document.querySelector(".game-board");

// Arrays to track flipped and matched cards
let flippedCards = [];
let matchedCards = [];

// Shuffle function: randomizes the order of cards
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Create shuffled deck for the first game
let shuffledCards = shuffle([...cardsArray, ...cardsArray]);

// Function to create the board
function createBoard(cards) {
  board.innerHTML = ""; // clear previous cards
  flippedCards = []; // Reset flipped cards array for the new board
  matchedCards = [];// Reset matched cards array for the new board

  cards.forEach((cardData) => {
    const card = document.createElement("div"); // Create a div element for this card
    card.classList.add("card"); // Add the "card" CSS class for styling
    card.dataset.name = cardData.name; // Store the card's name in a data attribute for matching

    // Back image
    const backImg = document.createElement("img");
    backImg.src = "images/leaf.png";
    backImg.alt = "Card Back";
    backImg.classList.add("back");

    // Front image
    const frontImg = document.createElement("img");
    frontImg.src = cardData.img;
    frontImg.alt = cardData.name;
    frontImg.classList.add("front");

    card.appendChild(backImg);
    card.appendChild(frontImg);

    // Flip card on click
    card.addEventListener("click", () => flipCard(card));

    board.appendChild(card);
  });
}

// Initial board setup
createBoard(shuffledCards);

// Shuffle function
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Flip card function
function flipCard(card) {

    if (!timerStarted) startTimer(); // Start timer on first click

  if (
    flippedCards.length < 2 &&
    !card.classList.contains("flipped") &&
    !matchedCards.includes(card)
  ) {
    card.classList.add("flipped");
    flippedCards.push(card);

      // Play flip sound
      flipSound.pause();
      flipSound.currentTime = 0;
      flipSound.play();

    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 600);
    }
  }
}


// RESET GAME
function resetGame() {
  resetTimer(); // <-- reset timer first

  // Shuffle new cards for the new game (local variable)
  const newShuffledCards = shuffle([...cardsArray, ...cardsArray]);

  // Recreate the board with the new shuffled cards
  createBoard(newShuffledCards);
}

//MATCHING ANIMATION FUNCTION

function checkForMatch() {
  const [cardOne, cardTwo] = flippedCards;

  if (cardOne.dataset.name === cardTwo.dataset.name) {
    // Add matched class for animation
    cardOne.classList.add("matched");
    cardTwo.classList.add("matched");

    // Add to matchedCards array
    matchedCards.push(cardOne, cardTwo);
    console.log(matchedCards);

      // Play match sound
      matchSound.pause();
      matchSound.currentTime = 0;
      matchSound.play();

    // Hide cards after animation, keep grid layout intact
    setTimeout(() => {
      cardOne.style.visibility = "hidden";
      cardTwo.style.visibility = "hidden";
    }, 600); // match CSS animation duration
  } else {
    // Flip back non-matching cards
    cardOne.classList.remove("flipped");
    cardTwo.classList.remove("flipped");

      flipBackSound.pause();
      flipBackSound.currentTime = 0;
      flipBackSound.play();
  }

  // Reset flipped cards array
  flippedCards = [];

// Check for win
if (matchedCards.length === 30) {
    // Play done sound
    doneSound.play();
        stopTimer();

  setTimeout(() => {
  alert(`You finished in ${formatTime(seconds)}!`);
  // Ask for player's name
  const playerName = prompt("You won! 🎉 Enter your name:");
  if (playerName) {
    saveScore(playerName, seconds);
  }
    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
      resetGame();
    }
  }, 500);
}}


// TIMER

// ===== TIMER =====
let seconds = 0;
let timerInterval;
let timerStarted = false;

// Get the timer element from HTML
const timerElement = document.getElementById("timer");

// Format seconds to HH:MM:SS
function formatTime(sec) {
  const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const secs = String(sec % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

// Update the timer display in HTML
function updateTimer() {
  timerElement.textContent = `Time: ${formatTime(seconds)}`;
}

// Start the timer
function startTimer() {
  timerStarted = true;
  seconds = 0;
  updateTimer(); // update HTML immediately
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer(); // update HTML every second
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// ===== RESET TIMER FUNCTION =====
function resetTimer() {
  clearInterval(timerInterval);                  // Stop any running timer
  seconds = 0;                                   // Reset seconds counter
  timerStarted = false;                          // Allow timer to start again on first flip
  timerElement.textContent = "Time: 00:00:00";   // Reset display in HTML
}

// STORAGE

// Save best time if it's better than previous
function saveBestTime(seconds) {
  const currentBest = localStorage.getItem("bestTime");
  if (!currentBest || seconds < currentBest) {
    localStorage.setItem("bestTime", seconds);
  }
}


// Call this when the game ends
function gameEnded() {
  stopTimer();

  // Ask for player's name
  const playerName = prompt("You won! 🎉 Enter your name:");
  if (playerName) {
    saveScore(playerName, seconds);
  }

  setTimeout(() => {
    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
      resetTimer();
      createBoard(shuffle([...cardsArray, ...cardsArray]));
    }
  }, 500);
}


// SCORE

// ===== HIGH SCORES =====

// Display scores
function renderScores(scores) {
  const scoreList = document.getElementById("high-scores");
  scores.forEach((s, index) => {
    const li = document.createElement("li");

    const indexSpan = document.createElement("span");
    indexSpan.classList.add("score-index");
    indexSpan.textContent = `${index + 1}.`;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("score-time");
    timeSpan.textContent = formatTime(s.time);

    li.appendChild(indexSpan);
    li.appendChild(document.createTextNode(` ${s.name}`));
    li.appendChild(timeSpan);

    scoreList.appendChild(li);
  });
}

async function displayScores() {
  const scoreList = document.getElementById("high-scores");
  scoreList.innerHTML = "";

  try {
    const snapshot = await db.collection("scores")
      .orderBy("time")
      .limit(10)
      .get();

    const globalScores = snapshot.docs.map(doc => doc.data());

    globalScores.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s.name}: ${formatTime(s.time)}`;
      scoreList.appendChild(li);
    });

  } catch (err) {
    console.error("Using local scores (offline):", err);
    const localScores = JSON.parse(localStorage.getItem("highScores")) || [];
    localScores.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s.name}: ${formatTime(s.time)}`;
      scoreList.appendChild(li);
    });
  }
}




// Add new score
// Save score both locally and to Firebase
function saveScore(name, time) {
  const score = { name, time, date: new Date() };

  // 1️⃣ Save to LocalStorage (fallback)
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push(score);
  highScores.sort((a, b) => a.time - b.time);
  highScores = highScores.slice(0, 10); // keep top 10
  localStorage.setItem("highScores", JSON.stringify(highScores));

  // 2️⃣ Save to Firebase (universal)
  db.collection("scores").add(score)
    .then(() => console.log("Score saved to Firebase"))
    .catch(err => console.error("Error saving to Firebase:", err));

  // 3️⃣ Update leaderboard display
  displayScores();
}
  











