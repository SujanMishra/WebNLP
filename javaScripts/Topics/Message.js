 class Message {
    constructor(type, chunks = []) {
        this.id = Utils.createGuid();
        this.type = type;
        this.metadata = {

        };
        this.chunks = Array.isArray(chunks) ? chunks : [];
    }
    serialize() {
        return JSON.stringify({
            id: this.id,
            type: this.type,
            metadata: this.metadata,
            chunks: this.chunks.map(chunk => chunk.serialize()),
        });
    }

    static deserialize(messageData) {
        const message = new Message(messageData.type, messageData.chunks.map(Chunk.deserialize));
        message.id = messageData.id;
        message.metadata = messageData.metadata;
        return message;
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