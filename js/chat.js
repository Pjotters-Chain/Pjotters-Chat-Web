// Chat state
let currentUser = null;
let currentChat = null;
let messageListener = null;

// Initialize chat functionality
document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const contactsList = document.getElementById('contactsList');
    const newChatBtn = document.getElementById('newChatBtn');

    // Auth state observer
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadUserChats();
            loadAllUsers();
        } else {
            window.location.href = '../pages/login.html';
        }
    });

    // Verzend bericht
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message && currentChat) {
            await sendMessage(message);
            messageInput.value = '';
        }
    });

    // Nieuwe chat starten
    newChatBtn.addEventListener('click', async () => {
        const users = await loadAvailableUsers();
        showUserSelectionDialog(users);
    });
});

// Laad gebruiker's chats
async function loadUserChats() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';

    const chatsSnapshot = await db.collection('chats')
        .where('users', 'array-contains', currentUser.uid)
        .get();

    chatsSnapshot.forEach(async (doc) => {
        const chatData = doc.data();
        const otherUserId = chatData.users.find(uid => uid !== currentUser.uid);
        const userDoc = await db.collection('users').doc(otherUserId).get();
        const userData = userDoc.data();

        const chatElement = createChatElement(doc.id, userData);
        contactsList.appendChild(chatElement);
    });
}

// Maak chat element
function createChatElement(chatId, userData) {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
        <img src="${userData.photoURL || '../images/default-avatar.png'}" alt="Profile">
        <div class="contact-info">
            <h4>${userData.name}</h4>
            <p class="last-message">Start een gesprek...</p>
        </div>
    `;

    div.addEventListener('click', () => selectChat(chatId, userData));
    return div;
}

// Selecteer chat
async function selectChat(chatId, userData) {
    currentChat = chatId;
    
    // Update UI
    document.getElementById('currentChatName').textContent = userData.name;
    document.getElementById('currentChatAvatar').src = userData.photoURL || '../images/default-avatar.png';
    document.getElementById('messageInput').disabled = false;
    document.getElementById('messageForm').querySelector('button').disabled = false;

    // Laad berichten
    loadMessages(chatId);
}

// Laad berichten
function loadMessages(chatId) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';

    // Stop vorige listener
    if (messageListener) messageListener();

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

// Verstuur bericht
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
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Toon bericht in UI
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

// Laad alle beschikbare gebruikers
async function loadAvailableUsers() {
    try {
        const usersSnapshot = await db.collection('users')
            .where('uid', '!=', currentUser.uid)
            .get();
        
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return users;
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

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

    // Event listeners voor gebruikersselectie
    dialog.querySelectorAll('.user-item').forEach(item => {
        item.addEventListener('click', async () => {
            const selectedUserId = item.dataset.uid;
            const chatId = await startNewChat(selectedUserId);
            if (chatId) {
                const userDoc = await db.collection('users').doc(selectedUserId).get();
                const userData = userDoc.data();
                selectChat(chatId, userData);
                dialog.remove();
            }
        });
    });

    document.body.appendChild(dialog);
}

// Voeg deze helper functie toe voor timestamp formatting
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
} 
