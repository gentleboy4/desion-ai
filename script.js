let messages = JSON.parse(localStorage.getItem("messages")) || [];
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

// PUT YOUR API KEY HERE
const API_KEY = "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";

async function sendMessage() {
    let message = userInput.value.trim();

    if (message === "") return;

    // USER MESSAGE
    let userMessage = document.createElement("div");

userMessage.classList.add("message-wrapper", "user-wrapper");

userMessage.innerHTML = `

<div class="message user-message">
${message}
</div>

<div class="avatar user-avatar">
U
</div>

`;

chatBox.appendChild(userMessage);
    userInput.value = "";

    scrollToBottom();

    // TYPING MESSAGE
    let typing = document.createElement("div");
    typing.classList.add("message", "ai-message");
    typing.innerHTML = `
    <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
    </div>
    `;
    chatBox.appendChild(typing);

    scrollToBottom();

    try {

        messages.push({
            role: "user",
            content: message
        });

        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages
            })
        });

        const data = await response.json();
        messages.push({
            role: "assistant",
            content: data.reply
        });

        localStorage.setItem(
            "messages",
            JSON.stringify(messages)
        );

typing.remove();

let aiMessage = document.createElement("div");

aiMessage.classList.add("message-wrapper");

aiMessage.innerHTML = `

<div class="avatar ai-avatar">
AI
</div>

<div class="message ai-message">
${marked.parse(data.reply)}
</div>

`;

chatBox.appendChild(aiMessage);

scrollToBottom();
    } catch (error) {
                typing.remove();

        let errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "ai-message");

        errorMessage.innerText = "Error connecting to AI.";

        chatBox.appendChild(errorMessage);

    }

}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ENTER KEY
userInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
        sendMessage();
    }

});

function newChat() {

    messages = [];

    localStorage.removeItem("messages");

    chatBox.innerHTML = `

    <div class="message ai-message">
        New chat started 🚀
    </div>

    `;

}
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

function startVoice(){

    const recognition = new webkitSpeechRecognition();

    recognition.onresult = function(event){
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    }

    recognition.start();
}

function loadMessages() {

    messages.forEach(msg => {

    let wrapper = document.createElement("div");

    if (msg.role === "user") {

        wrapper.classList.add(
            "message-wrapper",
            "user-wrapper"
        );

        wrapper.innerHTML = `

        <div class="message user-message">
        ${msg.content}
        </div>

        <div class="avatar user-avatar">
        U
        </div>

        `;

    }

    else {

        wrapper.classList.add("message-wrapper");

        wrapper.innerHTML = `

        <div class="avatar ai-avatar">
        AI
        </div>

        <div class="message ai-message">
        ${marked.parse(msg.content)}
        </div>

        `;

    }

    chatBox.appendChild(wrapper);

});

    scrollToBottom();

}

loadMessages();