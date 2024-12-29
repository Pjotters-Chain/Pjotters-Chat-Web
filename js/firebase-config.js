// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyDGPRGVGHtGZGXEtLGQJtPvxNHiXXBPVGE",
    authDomain: "pjotters-chat.firebaseapp.com",
    projectId: "pjotters-chat",
    storageBucket: "pjotters-chat.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123def456"
};

// Wacht tot het document geladen is
document.addEventListener('DOMContentLoaded', () => {
    // Initialiseer Firebase als het nog niet is geïnitialiseerd
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase succesvol geïnitialiseerd');
    }
});

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Globale variabelen
window.auth = auth;
window.db = db;
window.firebase = firebase;

// Exports voor modules die imports gebruiken
export {
    auth,
    db,
    firebase
};
