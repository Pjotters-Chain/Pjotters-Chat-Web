// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyA1HZbOAfP1b5OwSuqNVGgZ6LiqCm029LU",
    authDomain: "pjotters-chat.firebaseapp.com",
    projectId: "pjotters-chat",
    storageBucket: "pjotters-chat.appspot.com",
    messagingSenderId: "1066800578443",
    appId: "1:1066800578443:web:c0a5c9b2e7d3b8f3b8d3b8"
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
