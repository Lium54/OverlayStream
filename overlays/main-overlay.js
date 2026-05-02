const alertContainer = document.getElementById('alert-container');
const latestFollowElement = document.getElementById('latest-follow');
const chatContainer = document.getElementById('chat-container');

// Connexion au serveur Python
function connectChat() {
    const ws = new WebSocket('ws://127.0.0.1:8765');
    
    ws.onopen = () => {
        console.log("✅ Connecté au serveur Python (WebSocket)");
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("📩 Données reçues du serveur :", data);
            
            if (data.type === 'chat') {
                addChatMessage(data.user, data.text, data.color);
            } else if (data.type === 'init_config') {
                applyOverlayConfig(data.config);
            } 
        } catch (e) {
            console.error("❌ Erreur lors de la réception du message:", e);
        }
    };

    ws.onerror = (error) => {
        console.error("⚠️ Erreur WebSocket:", error);
    };

    ws.onclose = () => {
        console.log("Connexion perdue, tentative de reconexion...");
        setTimeout(connectChat, 5000);
    };
}

function applyOverlayConfig(config) {
    if (config.colors) {
        document.documentElement.style.setProperty('--pink-main', config.colors.primary);
        document.documentElement.style.setProperty('--purple-main', config.colors.secondary);
    }
    if (config.positions) {
        const chat = document.querySelector('.chat-container');
        const alerts = document.querySelector('.alert-container');
        if (chat && config.positions.chat) {
            Object.assign(chat.style, config.positions.chat);
        }
        if (alerts && config.positions.alerts) {
            Object.assign(alerts.style, config.positions.alerts);
        }
    }
}

function addChatMessage(user, text, color) {
    const msg = document.createElement('div');
    msg.className = 'chat-message';
    msg.innerHTML = `
        <div class="chat-user" style="color: ${color}">${user}</div>
        <div class="chat-text">${text}</div>
    `;
    chatContainer.appendChild(msg);
    
    // Garder seulement les 12 derniers messages (plus propre pour l'affichage)
    if (chatContainer.children.length > 12) {
        chatContainer.removeChild(chatContainer.children[0]);
    }

    // Optionnel : Faire disparaître le message après 20 secondes pour ne pas encombrer l'écran
    setTimeout(() => {
        msg.style.transition = "opacity 1s";
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 1000);
    }, 20000);
}

// Function to display a new alert
function showAlert(type, username, message = '') {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');

    let icon = '';
    let defaultMessage = '';
    let textColor = '';

    switch (type) {
        case 'follow':
            icon = '❤️'; // Heart icon
            defaultMessage = `vous suit !`;
            textColor = 'var(--purple-main)';
            break;
        case 'cheer':
            icon = '✨'; // Sparkle icon
            defaultMessage = `a fait un cheer avec ${message} bits !`;
            textColor = 'var(--text-white)';
            break;
        case 'raid':
            icon = '🚀'; // Rocket icon
            defaultMessage = `a raidé avec ${message} viewers !`;
            textColor = 'var(--pink-main)';
            break;
        default:
            icon = '🔔'; // Bell icon
            defaultMessage = `a fait quelque chose !`;
            textColor = 'var(--text-white)';
    }

    alertBox.innerHTML = `
        <span class="alert-icon" style="color: ${textColor};">${icon}</span>
        <span class="alert-text">${username} <span style="color: ${textColor};">${defaultMessage}</span></span>
    `;

    alertContainer.prepend(alertBox); // Add to the top

    // Remove alert after animation completes (5.5s total: 0.5s slideIn + 4.5s display + 0.5s fadeOut)
    setTimeout(() => {
        alertBox.remove();
    }, 5500);
}

// Function to update recent events
function updateRecentEvent(type, username) {
    if (type === 'follow') {
        latestFollowElement.innerText = username;
    }
}

// Lancement de la connexion au chargement
window.onload = () => {
    connectChat();
};