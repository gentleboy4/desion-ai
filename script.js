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

<div class="message-text">
${message}
</div>

<div class="timestamp">
${new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
})}
</div>

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

        const response = await fetch("https://desion-ai-srever.onrender.com", {
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

    

let aiMessage = document.createElement("div");

aiMessage.classList.add("message-wrapper");

aiMessage.innerHTML = `

<div class="avatar ai-avatar">
AI
</div>

<div class="message ai-message">

<div class="message-text" id="typingText">
</div>

<div class="timestamp">
${new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
})}
</div>

</div>

`;


chatBox.appendChild(aiMessage);

scrollToBottom();

const typingText =
document.getElementById("typingText");

await typeText(
    typingText,
    data.reply
);
    } catch (error) {
        console.error(error);
    }
}


speakText(data.reply);

function scrollToBottom() {

    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    });

}

async function typeText(element, text) {

    let i = 0;

    while (i < text.length) {

        element.innerHTML =
            marked.parse(text.substring(0, i));

        i++;

        scrollToBottom();

        await new Promise(resolve =>
            setTimeout(resolve, 10)
        );

    }

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

    const history = document.getElementById("chatHistory");

    let item = document.createElement("div");

    item.classList.add("history-item");

    item.innerText = `Chat ${
        history.children.length + 1
    }`;

    history.appendChild(item);

}
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

function startVoice() {

    const recognition =
        new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.onstart = function() {

        console.log("Voice started");

    };

    recognition.onresult = function(event) {

        const text =
            event.results[0][0].transcript;

        userInput.value = text;

        sendMessage();

    };

    recognition.onerror = function(event) {

        console.log(event.error);

    };

    recognition.start();

}

function speakText(text) {

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(speech);

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