import asyncio
import websockets
import json
from twitchio.ext import commands

# --- CONFIGURATION ---
with open('config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

TWITCH_TOKEN = config['TWITCH_TOKEN']
CHANNELS = config['CHANNELS']

class Bot(commands.Bot):
    def __init__(self):
        super().__init__(token=TWITCH_TOKEN, prefix='?', initial_channels=CHANNELS)
        self.connected_clients = set()

    async def event_ready(self):
        print(f'Connecté en tant que | {self.nick}')

    async def broadcast(self, data):
        """Envoie des données à tous les overlays connectés avec gestion d'erreur."""
        if not self.connected_clients:
            return
            
        
        message_json = json.dumps(data)
        for client in list(self.connected_clients):
            try:
                await client.send(message_json)
            except Exception:
                self.connected_clients.remove(client)

    async def event_message(self, message):
        # Ne pas traiter les messages du bot lui-même
        if message.echo:
            return

        print(f"📩 Message reçu de {message.author.name}: {message.content}")
        
        await self.broadcast({
            'type': 'chat',
            'user': message.author.name,
            'text': message.content,
            'color': message.author.color if message.author.color else '#ff2d95'
        })

    async def event_subscription(self, metadata):
        """Déclenché lors d'un nouvel abonnement."""
        user_name = metadata.user.name if metadata.user else "Un viewer"
        print(f"⭐ NOUVEAU SUB : {user_name}")
    async def event_usernotice(self, notice):
        """Déclenché pour les abonnements, resubs et sub-gifts via le chat."""
        user_name = notice.author.name if notice.author else "Un viewer"
        print(f"⭐ ALERTE CHAT : {user_name}")
        await self.broadcast({'type': 'sub', 'user': user_name})

    async def event_resubscription(self, metadata):
        """Déclenché lors d'un ré-abonnement."""
        user_name = metadata.user.name if metadata.user else "Un viewer"
        print(f"⭐ RE-SUB : {user_name}")
        await self.broadcast({'type': 'sub', 'user': user_name})
    @commands.command(name='test')
    async def test_overlay(self, ctx):
        """Tapez !test dans le chat pour vérifier l'overlay."""
        print("🧪 Test de l'overlay demandé...")
        await self.broadcast({'type': 'sub', 'user': 'Testeur_VIP'})
        await self.broadcast({'type': 'chat', 'user': 'Bot', 'text': 'Le test fonctionne !', 'color': '#00ff00'})

    async def ws_handler(self, websocket):
        print("🌐 Nouveau client connecté à l'overlay !")
        
        # Envoyer la configuration actuelle au client lors de la connexion
        await websocket.send(json.dumps({
            'type': 'init_config',
            'config': config.get('OVERLAY_CONFIG', {})
        }))
        
        self.connected_clients.add(websocket)
        try:
            await websocket.wait_closed()
        finally:
            print("X Client déconnecté.")
            self.connected_clients.remove(websocket)

async def main():
    # Lance le serveur WebSocket sur le port 8765
    bot = Bot()
    server = await websockets.serve(bot.ws_handler, "127.0.0.1", 8765)
    print("🚀 Serveur WebSocket démarré sur ws://127.0.0.1:8765")
    await bot.start()

if __name__ == "__main__":
    asyncio.run(main())