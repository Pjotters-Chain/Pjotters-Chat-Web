// Auth State Observer
auth.onAuthStateChanged(user => {
    if (user) {
        UI.updateAuthUI(true);
        loadUserData(user.uid);
        startChatListeners(user.uid);
        updateOnlineStatus(true);
    } else {
        UI.updateAuthUI(false);
    }
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            document.getElementById('loginModal').style.display = 'none';
        } catch (error) {
            UI.showAlert(error.message);
        }
    });

    // Register
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = e.target.username.value;
        
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(result.user.uid).set({
                username: username.toLowerCase(),
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: "Hey, ik gebruik Pjotters Chat!"
            });
            document.getElementById('registerModal').style.display = 'none';
        } catch (error) {
            UI.showAlert(error.message);
        }
    });

    // Profile Update
    document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            username: e.target.username.value,
            status: e.target.status.value
        };
        
        try {
            await db.collection('users').doc(auth.currentUser.uid).update(data);
            UI.showAlert('Profiel bijgewerkt!', 'success');
        } catch (error) {
            UI.showAlert(error.message);
        }
    });

    // Send Message
    document.getElementById('messageForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = e.target.message.value;
        const chatId = e.target.dataset.chatId;
        
        if (!text.trim() || !chatId) return;
        
        try {
            await db.collection('messages').add({
                text: text,
                chatId: chatId,
                senderID: auth.currentUser.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                isRead: false
            });
            e.target.reset();
        } catch (error) {
            UI.showAlert(error.message);
        }
    });
});

// Helper Functions
async function loadUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            UI.updateProfileUI(doc.data());
        }
    } catch (error) {
        UI.showAlert(error.message);
    }
}

function startChatListeners(userId) {
    // Listen to chats
    db.collection('chats')
        .where('users', 'array-contains', userId)
        .onSnapshot(snapshot => {
            const chats = [];
            snapshot.forEach(doc => {
                chats.push({ id: doc.id, ...doc.data() });
            });
            UI.updateChatsUI(chats);
        });
}

function updateOnlineStatus(online) {
    if (!auth.currentUser) return;
    
    db.collection('users').doc(auth.currentUser.uid).update({
        online: online,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Window events voor online status
window.addEventListener('beforeunload', () => {
    updateOnlineStatus(false);
});

window.addEventListener('focus', () => {
    updateOnlineStatus(true);
});

window.addEventListener('blur', () => {
    updateOnlineStatus(false);
});
