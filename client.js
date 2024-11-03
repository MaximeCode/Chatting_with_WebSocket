// Choix aléatoire d'une couleur pour les messages du client
const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
console.log('Couleur du client :', color);

const carre = document.getElementsByClassName('carre');
carre[0].style.backgroundColor = color;

// Connexion au serveur WebSocket
const socket = new WebSocket("ws://localhost:8080");

// Lors de la connexion
socket.onopen = function () {
  console.log("Connexion WebSocket établie.");
};

// Afficher les messages reçus
socket.onmessage = function (event) {
  const data = JSON.parse(event.data);

  // Vérifie si c'est un historique de messages
  if (data.type === 'history') {
    // Affiche tous les messages de l'historique sans duplication
    data.messages.forEach(msg => {
      // Assure-toi que le message n'est pas déjà affiché
      if (!messageExists(msg.message, msg.color)) {
        displayMessage(msg.message, msg.color);
      }
    });
  } else {
    // Afficher le message normal
    if (!messageExists(data.message, data.color)) {
      displayMessage(data.message, data.color);
    }
  }
};

// Fonction pour vérifier si un message existe déjà
function messageExists(message, color) {
  const messagesDiv = document.getElementById("messages");
  const existingMessages = messagesDiv.getElementsByClassName("message");
  for (let i = 0; i < existingMessages.length; i++) {
    if (existingMessages[i].textContent === message) {
      return true;
    }
  }
  return false;
}

// Fonction pour afficher un message
function displayMessage(message, msgColor) {
  const messagesDiv = document.getElementById("messages");
  const newMessage = document.createElement("p");
  newMessage.setAttribute("class", "message");
  newMessage.textContent = message;

  if (msgColor === color) {
    newMessage.style.textAlign = "right";
    newMessage.style.marginLeft = "auto";
    newMessage.style.backgroundColor = color + "20"; 
  } else {
    newMessage.style.textAlign = "left";
    newMessage.style.backgroundColor = msgColor + "20"; 
  }

  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll automatique vers le bas

  // Sauvegarder le message dans le localStorage
  saveMessageToLocalStorage(message, msgColor);
}

// Fonction pour sauvegarder un message dans le localStorage
function saveMessageToLocalStorage(message, color) {
  let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  messages.push({ message: message, color: color });
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Charger l'historique des messages du localStorage lors du chargement de la page
function loadMessagesFromLocalStorage() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  messages.forEach(msg => {
    if (!messageExists(msg.message, msg.color)) {
      displayMessage(msg.message, msg.color);
    }
  });
}

// Appeler la fonction pour charger les messages lors de l'ouverture de la page
loadMessagesFromLocalStorage();

// Fonction pour envoyer un message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim(); // Suppression des espaces en début et fin
  if (message) {
    console.log("Envoi du message : '", message, "' avec la couleur", color);
    socket.send(JSON.stringify({ message: message, color: color }));
    input.value = '';
  }
}
