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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const GoogleProvider = firebase.auth.GoogleAuthProvider;

// Export functies
const createUserWithEmailAndPassword = (email, password) => 
    auth.createUserWithEmailAndPassword(email, password);
const signInWithEmailAndPassword = (email, password) => 
    auth.signInWithEmailAndPassword(email, password);
const signInWithPopup = (provider) => 
    auth.signInWithPopup(provider);

// Exports
export {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleProvider,
    serverTimestamp
};
