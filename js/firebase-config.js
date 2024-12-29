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
firebase.initializeApp(firebaseConfig);

// Export Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export voor gebruik in andere bestanden
export { auth, db, storage };
