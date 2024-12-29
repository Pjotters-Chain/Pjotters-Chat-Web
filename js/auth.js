import { auth, db } from './firebase-config.js';

// Login formulier handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        window.location.href = 'chat.html';
    } catch (error) {
        alert('Login mislukt: ' + error.message);
    }
});

// Google login handler
document.getElementById('googleLogin').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Update/create user document
        await db.collection('users').doc(user.uid).set({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        window.location.href = 'chat.html';
    } catch (error) {
        alert('Google login mislukt: ' + error.message);
    }
});
