// Choix aléatoire d'une couleur pour les messages du client
const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
console.log('Couleur du client :', color);

const carre = document.getElementsByClassName('carre');
carre[0].style.backgroundColor = color;

// Connexion au serveur WebSocket
const socket = new WebSocket("ws://172.16.119.2:16843");

// Lors de la connexion
socket.onopen = function () {
  console.log('Connecté au serveur WebSocket');
};

// Fonction pour vérifier si un message existe déjà
function messageExists(message, color, ip) {
  const messagesDiv = document.getElementById("messages");
  const existingMessages = messagesDiv.getElementsByClassName("message");
  for (let i = 0; i < existingMessages.length; i++) {
    if (existingMessages[i].textContent === `${ip} : ${message}`) {
      return true;
    }
  }
  return false;
}

// Fonction pour afficher un message avec IP, message et couleur
function displayMessage(message, msgColor, ip) {
  if (!message || !msgColor || !ip) return; // Ne rien faire si les données sont invalides

  const messagesDiv = document.getElementById("messages");
  const newMessage = document.createElement("p");
  newMessage.setAttribute("class", "message");
  newMessage.textContent = `${ip} : ${message}`;

  if (msgColor === color) {
    newMessage.style.textAlign = "right";
    newMessage.style.marginLeft = "auto";
    newMessage.style.backgroundColor = msgColor + "20"; 
  } else {
    newMessage.style.textAlign = "left";
    newMessage.style.backgroundColor = msgColor + "20"; 
  }

  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll automatique vers le bas

  // Sauvegarder le message dans le localStorage
  saveMessageToLocalStorage(message, msgColor, ip);
}

// Afficher les messages reçus
socket.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.type === 'clear') {
    // Efface le contenu du div messages et supprime l'historique dans le localStorage
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = ''; // Supprime tous les messages affichés
    localStorage.removeItem("chatMessages"); // Efface les messages du localStorage

  } else if (data.type === 'history') {
    // Affiche tous les messages de l'historique sans duplication
    data.messages.forEach(msg => {
      if (msg.message && msg.color && msg.ip && !messageExists(msg.message, msg.color, msg.ip)) {
        displayMessage(msg.message, msg.color, msg.ip);
      }
    });

  } else {
    // Affiche les messages normaux
    if (data.message && data.color && data.ip && !messageExists(data.message, data.color, data.ip)) {
      displayMessage(data.message, data.color, data.ip);
    }
  }
};

// Fonction pour sauvegarder un message dans le localStorage
function saveMessageToLocalStorage(message, color, ip) {
  let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  messages.push({ message: message, color: color, ip: ip });
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Charger l'historique des messages du localStorage lors du chargement de la page
function loadMessagesFromLocalStorage() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  messages.forEach(msg => {
    if (!messageExists(msg.message, msg.color, msg.ip)) {
      displayMessage(msg.message, msg.color, msg.ip);
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

// Fonction pour envoyer la commande "clear" au serveur
function clearMessages() {
  socket.send(JSON.stringify({ type: 'clear' }));
}

// Récupérer le champ de saisie du message
const input = document.getElementById("messageInput");

// Ajouter un écouteur d'événements pour la touche "Enter"
input.addEventListener("keypress", function(event) {
  // Vérifier si la touche pressée est "Enter"
  if (event.key === "Enter") {
    event.preventDefault(); // Empêcher le comportement par défaut (soumission du formulaire)
    sendMessage(); // Appeler la fonction pour envoyer le message
  }
});

// Fonction pour envoyer un message
function sendMessage() {
  const message = input.value.trim(); // Suppression des espaces en début et fin
  if (message) {
    console.log("Envoi du message : '", message, "' avec la couleur", color);
    socket.send(JSON.stringify({ message: message, color: color })); // Assurez-vous que `color` est défini
    input.value = ''; // Réinitialiser le champ de saisie
  }
}