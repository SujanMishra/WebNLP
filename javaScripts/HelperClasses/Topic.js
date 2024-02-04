/* global chrome */
const SenderType = {
    USER: 'user',
    SERVER: 'server'
};

class Topic {
    constructor(name) {
        this.name = name;
        this.messages = [];
        this.metadata = {
            name: name
        };
        this.DetectLang = new DetectLanguage();
    }

    addMessage(message, type) {
        const newMessage = {
            text: message,
            type: type // 'user' or 'server'
        }

        this.messages.push(newMessage);
    }

    // Method to generate a message bubble

    generateMessageBubble(message) {
        const messageDiv = document.createElement("div");

        // Apply different styles based on the sender
        if (message.type === SenderType.USER) {
            messageDiv.classList.add('user-message-blob');
        } else if (message.type === SenderType.SERVER) {
            messageDiv.classList.add('server-message-blob');
        }

        this.DetectLang.splitIntoLanguageChunks(message.text).then(chunks => {
            chunks.forEach(chunk => {
                if (chunk.language !== 'Unknown' && chunk.language !== 'noncode') {
                    const codeContainer = document.createElement("div");
                    codeContainer.classList.add('code-container');

                    const titleBar = document.createElement("div");
                    titleBar.classList.add('message-blob-title-bar');

                    const languageLabel = document.createElement("span");
                    languageLabel.textContent = chunk.language;
                    languageLabel.classList.add('language-label');
                    titleBar.appendChild(languageLabel);

                    const copyButton = document.createElement("button");
                    copyButton.classList.add('copy-button');
                    const icon = document.createElement("i");
                    icon.classList.add('fas', 'fa-copy');
                    const buttonText = document.createTextNode(" Copy Code");
                    copyButton.appendChild(icon);
                    copyButton.appendChild(buttonText);


                    copyButton.addEventListener("click", () => {
                        const textToCopy = codeText.textContent;
                        navigator.clipboard.writeText(textToCopy)
                            .then(() => console.log("Text copied successfully"))
                            .catch(err => console.error("Failed to copy text", err));
                    });


                    titleBar.appendChild(copyButton);
                    codeContainer.appendChild(titleBar);

                    const codeBlock = document.createElement("pre");
                    codeBlock.classList.add('code-block');

                    const codeText = document.createElement("code");
                    codeText.textContent = chunk.text.trim();
                    codeText.classList.add(chunk.language);
                    hljs.highlightElement(codeText);

                    codeBlock.appendChild(codeText);
                    codeContainer.appendChild(codeBlock);
                    messageDiv.appendChild(codeContainer);
                } else {
                    const messageText = document.createElement("p");
                    messageText.classList.add('plain-text');
                    messageText.innerHTML = chunk.text.replace(/\n/g, '<br>');
                    messageDiv.appendChild(messageText);
                }
            });
        });

        return messageDiv;
    }


    // Method to display an entire topic in history container
    display(historyContainer) {
        historyContainer.textContent = ""; // Clear the history container
        this.messages.forEach(message => {
            const messageBubble = this.generateMessageBubble(message);
            historyContainer.appendChild(messageBubble);
        });
    }

    // Update topic 
    updateTopic(newName) {
        this.name = newName;
    }
}