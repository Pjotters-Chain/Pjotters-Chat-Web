document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const avatarInput = document.getElementById('avatarInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    
    // Laad huidige profiel data
    loadProfileData();
    
    // Avatar wijzigen
    changeAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', handleAvatarChange);
    
    // Profiel updaten
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateProfile();
    });
});

async function loadProfileData() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    document.getElementById('displayName').value = userData.name || '';
    document.getElementById('status').value = userData.status || '';
    document.getElementById('bio').value = userData.bio || '';
    document.getElementById('profileAvatar').src = userData.photoURL || '../images/default-avatar.png';
}

async function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`avatars/${firebase.auth().currentUser.uid}`);
        await fileRef.put(file);
        const photoURL = await fileRef.getDownloadURL();
        
        await updatePhotoURL(photoURL);
        document.getElementById('profileAvatar').src = photoURL;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Fout bij het uploaden van de foto');
    }
}

async function updateProfile() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        const newName = document.getElementById('displayName').value;
        const newStatus = document.getElementById('status').value;
        const newBio = document.getElementById('bio').value;

        // Update Firestore
        await db.collection('users').doc(user.uid).update({
            name: newName,
            status: newStatus,
            bio: newBio,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update Firebase Auth profile
        await user.updateProfile({
            displayName: newName
        });

        // Update UI
        document.getElementById('userName').textContent = newName;

        alert('Profiel bijgewerkt!');
        
        // Refresh de pagina om alle wijzigingen door te voeren
        window.location.reload();
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Fout bij het bijwerken van het profiel');
    }
}

async function updatePhotoURL(photoURL) {
    const user = firebase.auth().currentUser;
    if (!user) return;

    try {
        await Promise.all([
            user.updateProfile({ photoURL }),
            db.collection('users').doc(user.uid).update({ photoURL })
        ]);
    } catch (error) {
        console.error('Error updating photo URL:', error);
    }
} 
