const entryScreen = document.getElementById("entryScreen");
const chatScreen = document.getElementById("chatScreen");
const usernameInput = document.getElementById("usernameInput");
const roomInput = document.getElementById("roomInput");
const joinButton = document.getElementById("joinButton");
const chatContainer = document.getElementById("chatContainer");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const usernameLabel = document.getElementById("usernameLabel");
const roomLabel = document.getElementById("roomLabel");

let currentRoom = "";
let currentUser = "";
let lastMessageId = 0;

function appendMessage(text, classes) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${classes}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  messageEl.appendChild(bubble);
  chatContainer.appendChild(messageEl);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function renderMessages(messages) {
  const newMessages = messages.filter((item) => item.id > lastMessageId);
  newMessages.forEach((item) => {
    const isMine = item.username === currentUser;
    appendMessage(`${item.username}: ${item.message}`, isMine ? "mine" : "other");
    lastMessageId = Math.max(lastMessageId, item.id);
  });
}

async function fetchMessages() {
  if (!currentRoom) return;

  try {
    const response = await fetch(`/messages?room=${encodeURIComponent(currentRoom)}`);
    const data = await response.json();
    if (response.ok && Array.isArray(data.messages)) {
      renderMessages(data.messages);
    }
  } catch (error) {
    console.error("Could not fetch messages:", error);
  }
}

function openChat() {
  currentUser = usernameInput.value.trim();
  currentRoom = roomInput.value.trim();

  if (!currentUser || !currentRoom) {
    alert("Please enter both name and room ID.");
    return;
  }

  usernameLabel.textContent = currentUser;
  roomLabel.textContent = currentRoom;
  entryScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  messageInput.focus();

  fetchMessages();
}

joinButton.addEventListener("click", openChat);

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: currentRoom, username: currentUser, message }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      appendMessage(data.error || "Server error", "error");
      return;
    }

    messageInput.value = "";
    await fetchMessages();
  } catch (error) {
    appendMessage("Unable to reach server. Please try again.", "error");
    console.error(error);
  } finally {
    messageInput.focus();
  }
});

setInterval(fetchMessages, 1500);
