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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Handige referenties
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

// Exporteer voor gebruik in andere bestanden
window.firebaseInstance = {
    auth,
    db,
    storage,
    analytics
};
