# 🎮 Twitch Overlay System

Ce système permet d'afficher un chat et des alertes personnalisables sur OBS via WebSocket et Python.

## 🚀 Installation

1. **Prérequis** : Installez Python 3.9+ 
2. **Dépendances** : Installez les bibliothèques nécessaires :
   ```bash
   pip install twitchio websockets
   ```
3. **Token Twitch** : Générez un token sur [TwitchTokenGenerator.com](https://twitchtokengenerator.com/) (Bot Chat Token).

## ⚙️ Configuration (`config.json`)

- `TWITCH_TOKEN` : Votre token OAuth.
- `CHANNELS` : Votre nom de chaîne Twitch (entre crochets).
- `OVERLAY_CONFIG` :
    - `colors` : Modifiez les couleurs hexadécimales (Primary = Rose, Secondary = Violet).
    - `positions` : Ajustez les valeurs CSS (`top`, `bottom`, `left`, `right`) pour placer le chat ou les alertes où vous voulez. 
        - *Exemple* : Pour mettre le chat en haut à droite, utilisez `"top": "50px", "right": "50px", "bottom": "auto", "left": "auto"`.

## 📦 Version Logiciel (Optionnel)
Si vous voulez transformer le serveur en un fichier `.exe` :
1. Installez PyInstaller : `pip install pyinstaller`
2. Compilez : `pyinstaller --onefile --name TwitchServer server.py`
3. Votre logiciel se trouve dans le dossier `dist/`. 
**Note :** N'oubliez pas de copier `config.json` à côté du fichier `.exe` pour qu'il fonctionne.

## �️ Utilisation

1. Lancez le serveur : `python server.py`
2. Dans OBS, créez une **Source Navigateur**.
3. Sélectionnez le fichier `index.html` (ou `main-overlay.html`).
4. Définissez la taille sur **1920x1080**.

## 🧪 Tester l'overlay
Tapez `!test` dans votre propre chat Twitch pour simuler une alerte et un message de chat.

---
*Développé pour un stream stylé en Pink & Black.*
