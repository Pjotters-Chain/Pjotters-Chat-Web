document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.getElementById('googleLogin');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            window.location.href = 'chat.html';
        } catch (error) {
            alert('Login mislukt: ' + error.message);
        }
    });

    googleBtn.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            await firebase.firestore().collection('users').doc(result.user.uid).set({
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
