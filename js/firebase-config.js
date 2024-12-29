// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyA1HZbOAfP1b5OwSuqNVGgZ6LiqCm029LU",
    authDomain: "pjotters-chat-web.firebaseapp.com",
    databaseURL: "https://pjotters-chat-web.firebaseio.com",
    projectId: "pjotters-chat-web",
    storageBucket: "pjotters-chat-web.appspot.com",
    messagingSenderId: "650802421900",
    appId: "1:650802421900:web:faa7e4b24cb80f48ce5ba9"
};

// Direct initialiseren
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase succesvol geïnitialiseerd');
    }
} catch (error) {
    console.error('Firebase initialisatie error:', error);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Globale variabelen
window.firebase = firebase;
window.auth = auth;window.db = db;
