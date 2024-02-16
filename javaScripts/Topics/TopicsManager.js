 class TopicsManager {
    static #instance = null;
    #topics = [];
    #currentTopic = null;
    get currentTopic() {
        return this.#currentTopic;
    }
    set currentTopic(topic) {

        if (this.#topics.includes(topic)) {
            this.#currentTopic = topic;
        } else {
            console.error("The topic does not exist in the topics list.");

        }
    }
    
    get topics() {
        return this.#topics;
    }
    set topics(newTopics) {
        if (Array.isArray(newTopics) && newTopics.every(topic => topic instanceof Topic)) {
            this.#topics = newTopics;
        } else {
            console.error("Invalid topics array provided.");
        }
    }


    static get Instance() {
        if (!TopicsManager.#instance) {
            TopicsManager.#instance = new TopicsManager();
        }
        return TopicsManager.#instance;
    }
    listeners = {};
    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(data));
        }
    }


    serialize() {
        return JSON.stringify({
            topics: this.#topics.map(topic => topic.serialize()), 
            currentTopicId: this.#currentTopic ? this.#currentTopic.id : null, 
        });
    }

    static deserialize(topicsData) {
        const instance = this.Instance;
        instance.#topics = topicsData.topics.map(topicData => Topic.deserialize(topicData)); 
        const currentTopicId = topicsData.currentTopicId;
        
        if (currentTopicId !== null) {
            const currentTopic = instance.#topics.find(topic => topic.id === currentTopicId);
            if (currentTopic) {
                instance.currentTopic = currentTopic; 
            } else {
                console.warn("Deserialized currentTopicId does not match any loaded topic.");
            }
        }
    }



    createTopic(topicName = "") {
        const topic = new Topic(topicName);
        this.#currentTopic = topic;
        this.#topics.push(topic);
        this.saveTopicToDb(topic)
        this.emit('topicCreated', topic);
        return topic;
    }


    updateTopicNameInDb(topic) {

        const updateMessage = {
            type: 'updateTopicName',
            id: topic.id,
            newName: topic.name,
            topics: this.#topics
        };

        window.postMessage(updateMessage, '*');
    }





    saveTopic(topicId) {

        const topic = this.#topics.find(t => t.id === topicId);
        if (!topic) {
            console.error(`Topic with ID ${topicId} not found.`);
            return;
        }

        this.saveTopicToDb(topic);
    }

    saveTopicToDb(topic) {
        const message = {
            type: 'updateTopicInDB',
            topicId: topic.id,
            data: topic.serialize()
        };
        window.postMessage(message, '*');
    }

    saveDataToDb() {
        const serializedData = this.serialize();
        const message = {
            type: 'saveDataToDB',
            key: 'topics',
            data: serializedData
        };
        window.postMessage(message, '*');
    }

    loadDataFromDb(key) {
        const message = {
            type: 'loadDataFromDB',
            key: key,
        };
        window.postMessage(message, '*');

    }

    init() {
        this.loadDataFromDb('topics');
    }
}
