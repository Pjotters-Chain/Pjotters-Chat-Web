// Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyDGPRGVGHtGZGXEtLGQJtPvxNHiXXBPVGE",
    authDomain: "pjotters-chat.firebaseapp.com",
    projectId: "pjotters-chat",
    storageBucket: "pjotters-chat.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123def456"
};

// Initialiseer Firebase
if (!firebase.apps?.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Maak de Firebase services beschikbaar in het window object
window.auth = auth;
window.db = db;
window.firebase = firebase;

// Exports voor modules die imports gebruiken
export {
    auth,
    db,
    firebase
};
