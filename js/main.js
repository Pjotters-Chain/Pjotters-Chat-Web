let currentUser = null;
let currentChat = null;

// Auth state observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData(user.uid);
        startChatListeners(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

// Chat functionaliteit
async function sendMessage(message) {
    if (!currentChat || !currentUser) return;

    try {
        await db.collection('chats').doc(currentChat).collection('messages').add({
            text: message,
            senderId: currentUser.uid,
            senderName: currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Start een nieuwe chat
async function startNewChat(otherUserId) {
    try {
        const chatRef = await db.collection('chats').add({
            users: [currentUser.uid, otherUserId],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update gebruikers' chat lijst
        await db.collection('users').doc(currentUser.uid).update({
            chats: firebase.firestore.FieldValue.arrayUnion(chatRef.id)
        });
        
        await db.collection('users').doc(otherUserId).update({
            chats: firebase.firestore.FieldValue.arrayUnion(chatRef.id)
        });
        
        return chatRef.id;
    } catch (error) {
        console.error('Error starting new chat:', error);
    }
}

// Luister naar berichten in huidige chat
function listenToMessages(chatId) {
    return db.collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    displayMessage(change.doc.data());
                }
            });
        });
}

// Update gebruikers online status
function updateOnlineStatus(online) {
    if (!currentUser) return;
    
    db.collection('users').doc(currentUser.uid).update({
        online: online,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Event listeners voor online status
window.addEventListener('beforeunload', () => updateOnlineStatus(false));
window.addEventListener('focus', () => updateOnlineStatus(true));
window.addEventListener('blur', () => updateOnlineStatus(false));

// UI updates
function displayMessage(messageData) {
    const messagesDiv = document.getElementById('messagesList');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Voeg extra klasse toe voor eigen berichten
    if (messageData.senderId === currentUser.uid) {
        messageElement.classList.add('own-message');
    }
    
    messageElement.innerHTML = `
        <div class="message-content">
            <span class="sender">${messageData.senderName}</span>
            <p>${messageData.text}</p>
            <span class="timestamp">${formatTimestamp(messageData.timestamp)}</span>
        </div>
    `;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
