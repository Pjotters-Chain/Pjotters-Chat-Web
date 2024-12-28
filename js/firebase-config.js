// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyA1HZbOAfP1b5OwSuqNVGgZ6LiqCm029LU",
    authDomain: "pjotters-chat-web.firebaseapp.com",
    projectId: "pjotters-chat-web",
    storageBucket: "pjotters-chat-web.firebasestorage.app",
    messagingSenderId: "650802421900",
    appId: "1:650802421900:web:faa7e4b24cb80f48ce5ba9",
    measurementId: "G-KJ0RQNNJS0"
};

// Initialize Firebase met de nieuwe Firebase 10.7.1 syntax
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

const app = initializeApp(firebaseConfig);

// Handige referenties
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Exporteer voor gebruik in andere bestanden
window.firebaseInstance = {
    auth,
    db,
    storage,
    analytics
};
