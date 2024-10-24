const WebSocket = require('ws');

// Créer un serveur WebSocket sur le port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Un client est connecté.');

  // Lorsque le serveur reçoit un message de l'un des clients
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log(`Message reçu sur le serveur: ${data.message}`);

    // Diffuser le message à tous les clients connectés
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: data.message,
          color: data.color
        }));
        console.log('Message diffusé à tous les clients connectés : ' + data.message);
      }
    });
  });

  // Envoyer un message de bienvenue au client connecté
  ws.send('Bienvenue dans le chat WebSocket !');
});

console.log('Serveur WebSocket en écoute sur ws://localhost:8080');
