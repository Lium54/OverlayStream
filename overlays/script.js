// Fonction pour récupérer les paramètres de l'URL
// Exemple d'utilisation dans OBS : overlay.html?scene=brb
function updateOverlay() {
    const urlParams = new URLSearchParams(window.location.search);
    const scene = urlParams.get('scene');

    const mainTitle = document.getElementById('main-title');
    const subTitle = document.getElementById('sub-title');

    // Configuration des différents textes
    const contents = {
        'soon': {
            main: 'Ca va commencer',
            sub: 'Le stream va commencer'
        },
        'brb': {
            main: 'Je reviens',
            sub: 'Petite pause'
        },
        'end': {
            main: 'Fin du Stream',
            sub: 'Merci de votre soutien'
        },
        'default': {
            main: 'Live Stream',
            sub: 'Bienvenue sur la chaîne'
        }
    };

    // Application du texte en fonction de la scène
    const config = contents[scene] || contents['default'];
    
    mainTitle.innerText = config.main;
    subTitle.innerText = config.sub;
}

// Lancer la fonction au chargement
window.onload = updateOverlay;
