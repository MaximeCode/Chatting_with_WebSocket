const WebSocket = require('ws');

// Créer un serveur WebSocket sur le port 16843
const wss = new WebSocket.Server({ port: 16843 });

// Tableau pour stocker l'historique des messages
let messages = [];

const pseudos = [
  "Sett",
  "CyberNinja",
  "NebulaKnight",
  "SilentWave",
  "ShadowSpectre",
  "SolarEclipse",
  "QuantumQuokka",
  "StellarTiger",
  "CosmicDolphin",
  "MysticPhoenix",
  "ThunderLion",
  "FrostWolf",
  "CrimsonFalcon",
  "NovaWhale",
  "AstroPenguin",
  "RocketHawk",
  "BlazeBear",
  "AquaStingray",
  "LunarCheetah",
  "EchoViper"
];

const ips = ["::ffff:172.16.119.32","::ffff:172.16.119.42","::ffff:172.16.119.10","::ffff:172.16.119.22", "::ffff:172.16.119.3", "::ffff:172.16.119.31", "::ffff:172.16.119.14"];

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`Un client est connecté depuis l'adresse IP: ${ip}`);

  // Envoyer l'historique des messages au nouveau client
  ws.send(JSON.stringify({ type: 'history', messages }));

  // Lorsque le serveur reçoit un message de l'un des clients
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'clear') {
        // Vérification de l'IP de l'utilisateur
        if (ip === '::ffff:172.16.119.18') {
            // Si l'IP est correcte, vider le tableau des messages
            messages = [];
            console.log('Historique des messages effacé par un client.');
    
            // Informer tous les clients que l'historique a été effacé
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'clear' }));
                }
            });
        } else {
            console.log(`Tentative d'effacement des messages par un client non autorisé : ${ip}`);
        }
    } else {
      // Gérer un message normal avec couleur et IP
      const messageWithIP = {
        type: 'message',       // Ajout du type "message"
        message: data.message,
        color: data.color,
        ip: ip
      }
      if (ip == "::ffff:172.16.119.42"){
        messageWithIP.color = "#40096D"
      }
      if (ip != "::ffff:172.16.119.18"){
        messageWithIP.ip = pseudos[ips.indexOf(ip)]
        }
      
      messages.push(messageWithIP);

      // Diffuser le message à tous les clients connectés
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageWithIP));
        }
      });
    }
  });

  // Envoyer un message de bienvenue au nouveau client
  ws.send(JSON.stringify({ type: 'welcome', message: 'Bienvenue dans le chat WebSocket !' }));
});

console.log('Serveur WebSocket en écoute sur ws://localhost:16843');