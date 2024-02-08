/* global chrome */
const SenderType = {
    USER: 'user',
    SERVER: 'server'
};

class Utils {
    static createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static createUniqueTopicName() {
        let uniqueName;
        do {
            uniqueName = Utils.createGuid();
        } while (topics.some(topic => topic.name === uniqueName));
        return uniqueName;
    }
}

class Chunk {
    constructor(text, language, isCode) {
        this.text = text;
        this.language = language;
        this.isCode = isCode;
    }
}

class Message {
    constructor(type, chunks = []) {
        this.id = Utils.createGuid();
        this.type = type;
        this.metadata = {
            
        };
        this.chunks = Array.isArray(chunks) ? chunks : [];
    }

    /**
     * Creates a container for code chunks.
     * @param {Chunk} chunk - The chunk that will be displayed as code.
     * @returns {HTMLElement} The container element for the code chunk.
     */
    addChunk(chunk) {
        if (chunk instanceof Chunk) {
            this.chunks.push(chunk);
        } else {
            console.error('Attempted to add a non-Chunk object as a chunk');
        }
    }

    /**
     * Creates a container for code chunks.
     * @returns {HTMLElement} The container element for the code chunk.
     */
    generateMessageDiv() {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(this.type === SenderType.USER ? 'user-message-blob' : 'server-message-blob');

        this.chunks.forEach(chunk => {
            // Condition for chunks that are code or have a recognized language
            if (chunk.isCode || (chunk.language !== 'Unknown' && chunk.language !== 'noncode')) {
                const codeContainer = this.createCodeContainer(chunk);
                messageDiv.appendChild(codeContainer);
            }
            // Condition for all other chunks
            else {
                const textElement = this.createTextElement(chunk);
                messageDiv.appendChild(textElement);
            }
        });

        return messageDiv;
    }

    /**
     * Creates a container for code chunks.
     * @param {Chunk} chunk - The chunk that will be displayed as code.
     * @returns {HTMLElement} The container element for the code chunk.
     */
    createCodeContainer(chunk) {
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
        copyButton.appendChild(icon);
        copyButton.appendChild(document.createTextNode(" Copy Code"));

        copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(chunk.text)
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

        // Apply syntax highlighting if hljs is available
        if (window.hljs) {
            hljs.highlightElement(codeText);
        }

        codeBlock.appendChild(codeText);
        codeContainer.appendChild(codeBlock);

        return codeContainer;
    }

    /**
     * Creates a text element for non-code chunks.
     * @param {Chunk} chunk - The chunk that will be displayed as plain text.
     * @returns {HTMLElement} The text element for the non-code chunk.
     */
    createTextElement(chunk) {
        const messageText = document.createElement("p");
        messageText.classList.add('plain-text');
        messageText.innerHTML = chunk.text.replace(/\n/g, '<br>');
        return messageText;
    }
}

class Topic {
    constructor(name, messages = []) {
        this.id = Utils.createGuid();
        this.name = name;
        this.messages = Array.isArray(messages) ? messages : [];
        this.metadata = {

            name: name
        };
        this.DetectLang = new DetectLanguage();
    }


    addMessage(messageText, type, historyContainer) {
        this.DetectLang.splitIntoLanguageChunks(messageText).then(chunks => {

            let newMessage = new Message(type, []);

            chunks.forEach(chunk => {
                let newChunk = new Chunk(chunk.text, chunk.language, chunk.isCode);
                newMessage.addChunk(newChunk);
            });

            this.messages.push(newMessage);
            let messageDiv = newMessage.generateMessageDiv();
            historyContainer.appendChild(messageDiv);
            historyContainer.scrollTop = historyContainer.scrollHeight;
        }).catch(error => console.error("Error processing language chunks:", error));
    }


    // Method to display an entire topic in history container
    display(historyContainer) {
        historyContainer.textContent = "";
        // console.log("messages:", this.messages.length); 
        this.messages.forEach((message, index) => {
            historyContainer.appendChild(message.generateMessageDiv());
        });
        historyContainer.scrollTop = historyContainer.scrollHeight;
    }

    // Update topic 
    updateTopic(newName) {
        this.name = newName;
    }
}