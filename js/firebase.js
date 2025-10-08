// Firebase configuration (replace with your own from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCglvnmMX7iPzVgbiQsGaGn6f0N5XGANWA",
  authDomain: "memory-game-a8a17.firebaseapp.com",
  projectId: "memory-game-a8a17",
  storageBucket: "memory-game-a8a17.firebasestorage.app",
  messagingSenderId: "786555569445",
  appId: "1:786555569445:web:ca5b955d5d321058a786cc"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
