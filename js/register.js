import { auth, db } from './firebase-config.js';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const displayName = document.getElementById('displayName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Wachtwoorden komen niet overeen');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update gebruikersprofiel
        await user.updateProfile({
            displayName: displayName
        });
        
        // Maak gebruikersdocument aan
        await db.collection('users').doc(user.uid).set({
            displayName: displayName,
            email: email,
            photoURL: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        window.location.href = 'chat.html';
    } catch (error) {
        alert('Registratie mislukt: ' + error.message);
    }
});
