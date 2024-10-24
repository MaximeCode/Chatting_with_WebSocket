// Choix aléatoire d'une couleur pour les messages du client
const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
console.log('Couleur du client :', color);

const carre = document.getElementsByClassName('carre');
carre[0].style.backgroundColor = color;

// Connexion au serveur WebSocket
const socket = new WebSocket("ws://localhost:8080")

// Lors de la connexion
socket.onopen = function () {
  console.log("Connexion WebSocket établie.")
}

// Afficher les messages reçus
socket.onmessage = function (event) {
  const messagesDiv = document.getElementById("messages")
  const newMessage = document.createElement("p")
  newMessage.setAttribute("class", "message")
  const data = JSON.parse(event.data)
  newMessage.textContent = data.message

  if (data.color === color) { // Si le message est du client
    newMessage.style.textAlign = "right"
    newMessage.style.marginLeft = "auto"
    newMessage.style.backgroundColor = color + "20"
  } else { // Si le message est d'un autre client
    newMessage.style.textAlign = "left"
    newMessage.style.backgroundColor = data.color + "20"
  }

  console.log("Message reçu sur le client :", data.message)
  messagesDiv.appendChild(newMessage)
}

// Fonction pour envoyer un message
function sendMessage() {
  const input = document.getElementById("messageInput")
  const message = input.value
  console.log("Envoi du message :", message, "avec la couleur", color)
  socket.send(JSON.stringify({ message: message, color: color }));
  input.value = '';
}