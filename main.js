//! htmlden gelenler
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");
let userText = null;
//! fonksiyonlar
const creatElement = (html, className) => {
  const chatDiv = document.createElement("div");

  chatDiv.classList.add("chat", className);

  chatDiv.innerHTML = html;

  return chatDiv;
};
const getChatResponse = async (incomingChatDiv) => {
  chatInput.value = null;
  const pElement = document.createElement("p");
  const url = "https://chatgpt-42.p.rapidapi.com/geminipro";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "ea669ca93bmsh43ae66e51841c73p116cedjsn4eea6e398e5a",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${userText}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    pElement.innerText = data.result;
  } catch (error) {
    console.log(error);
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  saveChatHistory();
};
const showTypingAnimation = () => {
  const html = ` <div class="chat-content">
                <div class="chat-details">
                    <img src="images/chatbot.jpg" alt="chatbot">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
            </div>`;
  const incomingChatDiv = creatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};
const handleOutGoingchat = () => {
  userText = chatInput.value.trim();

  if (!userText) {
    alert("Lütfen bir veri giriniz!");
    return;
  }

  const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="images/user.jpg" alt="user">
                    <p>react nedir?</p>
                </div>
            </div>`;
  const outGoingChatDiv = creatElement(html, "outgoing");
  defaultText.remove();
  outGoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outGoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};

//! olay izleyicileri
sendButton.addEventListener("click", handleOutGoingchat);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleOutGoingchat();
  }
});
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeBtn.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});
const defaultText = document.querySelector(".default-text");
console.log(defaultText);

deleteBtn.addEventListener("click", () => {
  if (confirm("Tüm sohbeti silmek istediğinizden emin misiniz?")) {
    chatContainer.remove();
    localStorage.removeItem("chatHistory");

    const defaultText = `<div class="default-text">
        <h1>ChatGPT Clone</h1>
    </div>
    <div class="chat-container">
    </div>
    <div class="typing-container">
        <div class="typing-content">
            <div class="typing-textarea">
                <textarea id="chat-input" placeholder="Aramak istediğiniz veriyi giriniz"></textarea>
                <span class="material-symbols-outlined" id="send-btn">
                    send
                </span>
            </div>
            <div class="typing-controls">
                <span class="material-symbols-outlined" id="theme-btn">
                    light_mode
                </span>
                <span class="material-symbols-outlined" id="delete-btn">
                    delete
                </span>

            </div>
        </div>
    </div>`;
    document.body.innerHTML = defaultText;
  }
});

const saveChatHistory = () => {
  localStorage.setItem("chatHistory", chatContainer.innerHTML);
};
const loadChatContainer = () => {
  const chatHistory = localStorage.getItem("chatHistory");
  if (chatHistory) {
    chatContainer.innerHTML = chatHistory;
    defaultText.remove();
  }
};
document.addEventListener("DOMContentLoaded", loadChatContainer);
