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

    serialize() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            messages: this.messages.map(message => message.serialize()), 
            metadata: this.metadata,
           
        });
    }

    static deserialize(topicData) {
        const topic = new Topic(topicData.name, topicData.messages.map(messageData => Message.deserialize(messageData)));        
        topic.id = topicData.id;       
        topic.DetectLang = new DetectLanguage();
        return topic;
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

 
}