// Auth functionaliteit
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.getElementById('googleLogin');

    // Email/Password login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            // Na succesvol inloggen, redirect naar chat
            window.location.href = 'chat.html';
        } catch (error) {
            alert('Login mislukt: ' + error.message);
        }
    });

    // Google login
    googleBtn.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            // Maak/update gebruikersprofiel in Firestore
            await db.collection('users').doc(result.user.uid).set({
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            window.location.href = 'chat.html';
        } catch (error) {
            alert('Google login mislukt: ' + error.message);
        }
    });
}); 
