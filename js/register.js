document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase === 'undefined') {
        console.error('Firebase is niet geladen!');
        return;
    }

    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
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
            console.log('Start registratie...');
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            console.log('Gebruiker aangemaakt:', userCredential);
            
            await userCredential.user.updateProfile({
                displayName: displayName
            });

            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                name: displayName,
                email: email,
                photoURL: null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            window.location.href = 'chat.html';
        } catch (error) {
            console.error('Registratie error:', error);
            alert('Registratie mislukt: ' + error.message);
        }
    });
}); 
