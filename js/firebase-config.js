// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyA1HZbOAfP1b5OwSuqNVGgZ6LiqCm029LU",
    authDomain: "pjotters-chat-web.firebaseapp.com",
    projectId: "pjotters-chat-web",
    storageBucket: "pjotters-chat-web.appspot.com",
    messagingSenderId: "650802421900",
    appId: "1:650802421900:web:your-app-id-here"
};

// Direct initialiseren
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase succesvol geïnitialiseerd');
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Globale variabelen
window.firebase = firebase;
window.auth = auth;
window.db = db;
