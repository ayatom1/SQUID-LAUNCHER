import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSENjFTvS94CNwBKl4owQe7G_aI8Jionc",
    authDomain: "squid-launcher.firebaseapp.com",
    projectId: "squid-launcher",
    storageBucket: "squid-launcher.firebasestorage.app",
    messagingSenderId: "355184421287",
    appId: "1:355184421287:web:404bd4b00a2311d7a3ae82",
    measurementId: "G-00B4S9FLP7"
};

// Initialize Firebase
// Check if apps are already initialized to avoid errors in dev HMR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
