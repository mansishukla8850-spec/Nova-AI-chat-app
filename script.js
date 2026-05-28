const chatBox = document.getElementById('chatBox');
const inputForm = document.getElementById('inputForm');
const promptInput = document.getElementById('prompt');
const clearBtn = document.getElementById('clearBtn');
const themeToggle = document.getElementById('themeToggle');


// ================= OPENROUTER API KEY =================

const API_KEY = "YOUR_OPENROUTER_API_KEY";


// ================= CREATE MESSAGE =================

function createMessage(text, type) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (type === "user") {

        messageDiv.classList.add("user-message");

    } else {

        messageDiv.classList.add("ai-message");

    }

    messageDiv.innerHTML = `
        <div class="avatar">${type === "user" ? "You" : "Nova"}</div>
        <div class="message-content">${text}</div>
    `;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}


// ================= OPENROUTER AI =================

async function generateReply(userText) {

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Authorization": `Bearer ${API_KEY}`,

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    model: "openai/gpt-3.5-turbo",

                    messages: [
                        {
                            role: "user",
                            content: userText
                        }
                    ]

                })

            }
        );

        const data = await response.json();

        console.log(data);

        // Error handling
        if (data.error) {

            return "API Error: " + data.error.message;

        }

        // Safe response handling
        if (
            data.choices &&
            data.choices[0] &&
            data.choices[0].message
        ) {

            return data.choices[0].message.content;

        } else {

            return "No response from AI.";

        }

    }
    catch (error) {

        console.log(error);

        return "Error getting AI response.";

    }

}


// ================= FORM SUBMIT =================

inputForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const userText = promptInput.value.trim();

    if (userText === "") return;

    // User Message
    createMessage(userText, "user");

    promptInput.value = "";

    // Typing Message
    const typingMessage = createMessage("Typing...", "ai");

    // AI Response
    const aiReply = await generateReply(userText);

    // Replace typing text
    typingMessage.querySelector(".message-content").textContent = aiReply;

});


// ================= CLEAR CHAT =================

clearBtn.addEventListener("click", function () {

    chatBox.innerHTML = "";

    createMessage("Hello 👋 I am Nova AI. Ask me anything.", "ai");

});


// ================= THEME TOGGLE =================

themeToggle.addEventListener("click", function () {

    const isLight =
        document.body.getAttribute("data-theme") === "light";

    if (isLight) {

        document.body.removeAttribute("data-theme");

        themeToggle.textContent = "🌙";

    }
    else {

        document.body.setAttribute("data-theme", "light");

        themeToggle.textContent = "☀️";

    }

});


// ================= AUTO FOCUS =================

window.addEventListener("load", function () {

    promptInput.focus();

});


// ================= ESC CLEAR INPUT =================

window.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        promptInput.value = "";

    }

});
