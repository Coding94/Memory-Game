// main.js

// Import Firebase setup and Firestore functions
import { db, collection, getDocs, addDoc, query, orderBy, limit } from './firebase.js';

// Card data array (replace with your actual cards)
import { cardsArray } from './data.js';

// AUDIO
const flipSound = document.getElementById("flipSound");
const flipBackSound = document.getElementById("flipBackSound");
const matchSound = document.getElementById("matchSound");
const doneSound = document.getElementById("doneSound");

// TIMER
let seconds = 0;
let timerInterval;
let timerStarted = false;
const timerElement = document.getElementById("timer");

function formatTime(sec) {
  const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const secs = String(sec % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function updateTimer() {
  timerElement.textContent = `Time: ${formatTime(seconds)}`;
}

function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    seconds = 0;
    updateTimer();
    timerInterval = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  timerStarted = false;
  timerElement.textContent = "Time: 00:00:00";
}

// GAME LOGIC
const board = document.querySelector(".game-board");
let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

let shuffledCards = shuffle([...cardsArray, ...cardsArray]);

function createBoard(cards) {
  board.innerHTML = "";
  flippedCards = [];
  matchedCards = [];

  cards.forEach(cardData => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = cardData.name;

    const backImg = document.createElement("img");
    backImg.src = "images/leaf.png";
    backImg.classList.add("back");

    const frontImg = document.createElement("img");
    frontImg.src = cardData.img;
    frontImg.classList.add("front");

    card.appendChild(backImg);
    card.appendChild(frontImg);

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

createBoard(shuffledCards);

function flipCard(card) {
  if (!timerStarted) startTimer();

  if (
    flippedCards.length < 2 &&
    !card.classList.contains("flipped") &&
    !matchedCards.includes(card)
  ) {
    card.classList.add("flipped");
    flippedCards.push(card);

    flipSound.pause();
    flipSound.currentTime = 0;
    flipSound.play();

    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 600);
    }
  }
}

function checkForMatch() {
  const [cardOne, cardTwo] = flippedCards;

  if (cardOne.dataset.name === cardTwo.dataset.name) {
    cardOne.classList.add("matched");
    cardTwo.classList.add("matched");
    matchedCards.push(cardOne, cardTwo);

    matchSound.pause();
    matchSound.currentTime = 0;
    matchSound.play();

    setTimeout(() => {
      cardOne.style.visibility = "hidden";
      cardTwo.style.visibility = "hidden";
    }, 600);
  } else {
    cardOne.classList.remove("flipped");
    cardTwo.classList.remove("flipped");

    flipBackSound.pause();
    flipBackSound.currentTime = 0;
    flipBackSound.play();
  }

  flippedCards = [];

  if (matchedCards.length === cardsArray.length * 2) {
    doneSound.play();
    stopTime
