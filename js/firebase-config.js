// Import de benodigde Firebase functies
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore,
    doc,
    setDoc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exporteer alles wat we nodig hebben in andere bestanden
export {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    doc,
    setDoc,
    serverTimestamp
};
