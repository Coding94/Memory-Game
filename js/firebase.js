// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// Your config
const firebaseConfig = {
  apiKey: "AIzaSyCglvnmMX7iPzVgbiQsGaGn6f0N5XGANWA",
  authDomain: "memory-game-a8a17.firebaseapp.com",
  projectId: "memory-game-a8a17",
  storageBucket: "memory-game-a8a17.firebasestorage.app",
  messagingSenderId: "786555569445",
  appId: "1:786555569445:web:ca5b955d5d321058a786cc",
  measurementId: "G-W76EJ9SK62"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Example saveScore function
export async function saveScore(name, time) {
  try {
    await addDoc(collection(db, "scores"), { name, time, timestamp: Date.now() });
    console.log("Score saved!");
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

// Example displayScores function
export async function displayScores() {
  const scoreList = document.getElementById("high-scores");
  scoreList.innerHTML = "";
  try {
    const q = query(collection(db, "scores"), orderBy("time"), limit(10));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      const data = doc.data();
      li.textContent = `${data.name}: ${data.time} sec`;
      scoreList.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching scores:", err);
  }
}


