// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- Firestore
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCglvnmMX7iPzVgbiQsGaGn6f0N5XGANWA",
  authDomain: "memory-game-a8a17.firebaseapp.com",
  projectId: "memory-game-a8a17",
  storageBucket: "memory-game-a8a17.firebasestorage.app",
  messagingSenderId: "786555569445",
  appId: "1:786555569445:web:ca5b955d5d321058a786cc",
  measurementId: "G-W76EJ9SK62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

