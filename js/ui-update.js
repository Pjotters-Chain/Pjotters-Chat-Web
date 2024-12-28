// UI Update Functions
const UI = {
    // Chat UI Updates
    updateChatsUI(chats) {
        const chatsList = document.getElementById('chatsList');
        chatsList.innerHTML = '';
        
        chats.forEach(chat => {
            const chatElement = createChatElement(chat);
            chatsList.appendChild(chatElement);
        });
    },

    addMessageToUI(message, scrollToBottom = true) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);

        if (scrollToBottom) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    updateUserStatus(userId, status) {
        const statusElement = document.querySelector(`[data-user-id="${userId}"] .user-status`);
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `user-status ${status === 'online' ? 'online' : ''}`;
        }
    },

    // Profile UI Updates
    updateProfileUI(userData) {
        document.getElementById('username').value = userData.username || '';
        document.getElementById('status').value = userData.status || '';
        document.getElementById('email').value = userData.email || '';
        
        if (userData.profileImageUrl) {
            document.getElementById('profileImage').src = userData.profileImageUrl;
        }
    },

    // Search Results UI
    updateSearchResults(users) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        users.forEach(user => {
            const userElement = createUserSearchElement(user);
            searchResults.appendChild(userElement);
        });
    },

    // Show/Hide Auth Elements
    updateAuthUI(isLoggedIn) {
        document.querySelectorAll('.auth-required').forEach(el => {
            el.style.display = isLoggedIn ? 'block' : 'none';
        });
        document.querySelectorAll('.auth-not-required').forEach(el => {
            el.style.display = isLoggedIn ? 'none' : 'block';
        });
    },

    // Show Alert Message
    showAlert(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
};

// Helper Functions
function createChatElement(chat) {
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.dataset.chatId = chat.id;
    
    const lastMessageTime = chat.lastMessageTime ? formatTime(chat.lastMessageTime) : '';
    
    div.innerHTML = `
        <img src="${chat.profileImageUrl || 'images/default-avatar.png'}" alt="" class="chat-avatar">
        <div class="chat-info">
            <h4>${chat.username}</h4>
            <p class="last-message">${chat.lastMessage || 'Geen berichten'}</p>
        </div>
        <span class="chat-time">${lastMessageTime}</span>
        ${chat.unreadCount ? `<span class="unread-count">${chat.unreadCount}</span>` : ''}
    `;
    
    return div;
}

function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.senderID === auth.currentUser.uid ? 'sent' : 'received'}`;
    
    div.innerHTML = `
        <div class="message-content">
            <p>${message.text}</p>
            <span class="message-time">${formatTime(message.timestamp)}</span>
            ${message.senderID === auth.currentUser.uid ? 
                `<span class="message-status">
                    <i class="fas ${message.isRead ? 'fa-check-double' : 'fa-check'}"></i>
                </span>` : ''}
        </div>
    `;
    
    return div;
}

function createUserSearchElement(user) {
    const div = document.createElement('div');
    div.className = 'user-search-item';
    
    div.innerHTML = `
        <img src="${user.profileImageUrl || 'images/default-avatar.png'}" alt="" class="user-avatar">
        <div class="user-info">
            <h4>${user.username}</h4>
            <p>${user.status || 'Hey, ik gebruik Pjotters Chat!'}</p>
        </div>
        <button class="add-contact-btn" data-user-id="${user.id}">
            <i class="fas fa-user-plus"></i>
        </button>
    `;
    
    return div;
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
}

function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function loadUserData(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            const userData = doc.data();
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userAvatar').src = userData.photoURL || '../images/default-avatar.png';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Export voor gebruik in andere bestanden
window.UI = UI;
