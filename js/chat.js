// Chat state
let currentUser = null;
let currentChat = null;
let messageListener = null;

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const contactsList = document.getElementById('contactsList');
    const newChatBtn = document.getElementById('newChatBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Auth state observer
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            document.getElementById('userName').textContent = user.displayName;
            if (user.photoURL) {
                document.getElementById('userAvatar').src = user.photoURL;
            }
            await loadAllUsers();
        } else {
            window.location.href = '../pages/login.html';
        }
    });

    // Verzend bericht
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message && currentChat) {
            await sendMessage(message);
        }
    });

    // Nieuwe chat starten
    newChatBtn.addEventListener('click', async () => {
        try {
            const usersSnapshot = await db.collection('users')
                .where(firebase.firestore.FieldPath.documentId(), '!=', currentUser.uid)
                .get();
            
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            
            showUserSelectionDialog(users);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    });

    // Uitloggen
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });
});

// Toon gebruikersselectie dialoog
function showUserSelectionDialog(users) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog">
            <h3>Selecteer een gebruiker</h3>
            <div class="users-list">
                ${users.map(user => `
                    <div class="user-item" data-uid="${user.id}">
                        <img src="${user.photoURL || '../images/default-avatar.png'}" alt="Profile">
                        <span>${user.name}</span>
                    </div>
                `).join('')}
            </div>
            <button class="button button-accent" onclick="this.parentElement.parentElement.remove()">Sluiten</button>
        </div>
    `;

    dialog.querySelectorAll('.user-item').forEach(item => {
        item.addEventListener('click', async () => {
            const selectedUserId = item.dataset.uid;
            await startNewChatWithUser(selectedUserId);
            dialog.remove();
        });
    });

    document.body.appendChild(dialog);
}

// Start nieuwe chat met gebruiker
async function startNewChatWithUser(userId) {
    try {
        const chatId = await startNewChat(userId);
        if (chatId) {
            currentChat = chatId;
            startMessageListener(chatId);
            
            // Update UI
            const userDoc = await db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            document.getElementById('currentChatName').textContent = userData.name;
        }
    } catch (error) {
        console.error('Error starting chat:', error);
    }
}

// Selecteer chat
function selectChat(chatId, userData) {
    currentChat = chatId;
    
    // Update UI
    document.getElementById('currentChatName').textContent = userData.name;
    document.getElementById('currentChatAvatar').src = userData.photoURL || '../images/default-avatar.png';
    document.getElementById('messageInput').disabled = false;
    document.getElementById('messageForm').querySelector('button').disabled = false;

    // Start message listener
    startMessageListener(chatId);
}

// Start message listener
function startMessageListener(chatId) {
    // Stop vorige listener
    if (messageListener) {
        messageListener();
    }

    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';  // Maak berichtenlijst leeg

    // Enable input velden
    document.getElementById('messageInput').disabled = false;
    document.getElementById('messageForm').querySelector('button').disabled = false;

    // Start nieuwe listener
    messageListener = db.collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const messageData = change.doc.data();
                    displayMessage(messageData);
                }
            });
        });
}

// Display message
function displayMessage(messageData) {
    const messagesList = document.getElementById('messagesList');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageData.senderId === currentUser.uid ? 'own-message' : ''}`;
    
    messageElement.innerHTML = `
        <div class="message-content">
            <span class="sender">${messageData.senderId === currentUser.uid ? 'Jij' : messageData.senderName}</span>
            <p>${messageData.text}</p>
            <span class="timestamp">${formatTimestamp(messageData.timestamp)}</span>
        </div>
    `;
    
    messagesList.appendChild(messageElement);
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Helper functie voor timestamp formatting
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Laad alle gebruikers
async function loadAllUsers() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        usersSnapshot.forEach(doc => {
            // Voeg alleen andere gebruikers toe (niet de huidige gebruiker)
            if (doc.id !== currentUser.uid) {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            }
        });

        // Update contactenlijst
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = ''; // Maak lijst leeg

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'contact-item';
            userElement.innerHTML = `
                <img src="${user.photoURL || '../images/default-avatar.png'}" alt="Profile">
                <div class="contact-info">
                    <h4>${user.name}</h4>
                    <p class="status">${user.online ? 'Online' : 'Offline'}</p>
                </div>
            `;
            userElement.addEventListener('click', () => startNewChatWithUser(user.id));
            contactsList.appendChild(userElement);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function sendMessage(text) {
    if (!currentChat || !currentUser) return;

    try {
        await db.collection('chats')
            .doc(currentChat)
            .collection('messages')
            .add({
                text: text,
                senderId: currentUser.uid,
                senderName: currentUser.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        // Clear input after successful send
        document.getElementById('messageInput').value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
} 
