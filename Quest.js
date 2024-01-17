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
        messageDiv.textContent = message.text;

        // Apply different styles based on the sender
        if (message.type === SenderType.USER) {
            messageDiv.classList.add('user-message-blob');
        } else if (message.type === SenderType.SERVER) {
            messageDiv.classList.add('server-message-blob');
        }
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

document.addEventListener('DOMContentLoaded', function () {
    // Global Variables

    const elements = {
        newTopicButton: document.querySelector("#NewTopicButton"),
        topicContainer: document.querySelector("#TopicContainer"), 
        topicList: document.querySelector("#TopicList"), 
        scrollLeftButton: document.querySelector("#ScrollLeftButton"),
        scrollRightButton: document.querySelector("#ScrollRightButton"),
        topicOptions: document.querySelector("#TopicOptions"),
        createTopicButton: document.querySelector("#CreateTopicButton"),
        topicNameInput: document.querySelector("#TopicNameInput"),
        chatContainer: document.querySelector("#ChatContainer"), 
        historyContainer: document.querySelector("#HistoryContainer"),
        ask: document.querySelector(".Container#Ask"), // Only ID selector as there's no class
        askInput: document.querySelector("#AskInput"),
        sendButtonQuestion: document.querySelector("#SendButtonQuestion")
    };


    const timeoutDelay = 500;

    // Topics array to store all the Topic instances
    let topics = [];
    let currentTopic = null;
    let fsHandle; // File System Handle
    
    // Event Listeners
    elements.newTopicButton.addEventListener("click", openTopicOptions);
    elements.scrollLeftButton.addEventListener("click", scrollTopicListLeft);
    elements. scrollRightButton.addEventListener("click", scrollTopicListRight);
    elements.createTopicButton.addEventListener("click", createTopic);
    elements.sendButtonQuestion.addEventListener("click", sendQuestion);
    elements.askInput.addEventListener("keydown", sendQuestion);

    // Open Topic Options
    function openTopicOptions() {
        elements.topicOptions.style.display = "block";
    }


    // Create New Topic
    function createTopic() {
        const topicName = elements.topicNameInput.value.trim();
        if (topicName === "") {
            alert("Please enter a topic name.");
            return;
        }

        // Create topic object with metadata
        const topic = new Topic(topicName);

        // Add topic to the topics array
        topics.push(topic);

        const topicBoxes = document.querySelectorAll(".topicBox");
        let topicBox = topicBoxes[0];

        if (!topicBox || topicBox.childElementCount >= 3) {
            topicBox = document.createElement("div");
            topicBox.classList.add("topicBox");
            elements.topicList.prepend(topicBox);
        }

        const topicButton = document.createElement("button");
        topicButton.classList.add("topic-button");
        topicButton.textContent = topicName;
        topicButton.addEventListener("click", function () {
            handleTopicClick(topic.name);
        });

        topicBox.prepend(topicButton);

        elements.topicNameInput.value = "";
        elements.topicOptions.style.display = "none";

        // Save the new topic to the database
        saveDataToDb('topics', topics);
    }

    // Populate the topic list with loaded topics
    function populateTopicList(topics) {
        topics.forEach(topic => {
            const topicBox = document.createElement("div");
            topicBox.classList.add("topicBox");
            elements.topicList.prepend(topicBox);

            const topicButton = document.createElement("button");
            topicButton.classList.add("topic-button");
            topicButton.textContent = topic.name;
            topicButton.addEventListener("click", function () {
                handleTopicClick(topic.text);
            });

            topicBox.prepend(topicButton);
        });
    }


    // Handle Topic Click
    function handleTopicClick(topicName) {
        currentTopic = topics.find(topic => topic.name === topicName);
        if (currentTopic) {
            currentTopic.display(elements.historyContainer);
        } else {
            logMessage(`No topic currently selected ${topics.length}`);
        }
    }

    // Send Question
    function sendQuestion(event) {
      
        if ((event.key === "Enter" && !event.shiftKey) || event.target === elements.sendButtonQuestion) {
            event.preventDefault();
            const question = elements.askInput.value.trim();
            if (question === "") {
                return;
            }

            if (!currentTopic) {
                if (topics.length > 0) {
                    // select the last topic if the topics array is not empty
                    currentTopic = topics[topics.length - 1];
                    logMessage("You should have  selected a topic for this question , question is added to last active topic!.", false);
                } else {
                    // create a new topic with a guid value if the topics array is empty
                    const guid = function() {
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    };

                    currentTopic = new Topic(guid());
                    logMessage("Please add a topic name a random topic was generated for this question !.", false);
                    topics.push(currentTopic);
                }
               
                return;
            }

            currentTopic.addMessage(question, SenderType.USER);
            currentTopic.display(elements.historyContainer);

            elements.askInput.value = "";
 
            window.httpService.sendHttpRequest(currentTopic, question);

        }
    }

    function logMessage(message, isError = false) {
        const logMessageData = {
            eventIdentifier: 'Quest',
            type: "logMessage",
            message: message,
            isError: isError
        };

        window.postMessage(logMessageData, "*");

        if (isError) {
            const notification = document.createElement("div");
            notification.textContent = "Check Log! @'Tweaks'";
            notification.style.backgroundColor = "#ffcccc";
            notification.style.color = "#ff0000";
            elements.historyContainer.appendChild(notification);
        }
    }

    // Adjust container heights on window resize
    window.addEventListener("resize", adjustContainerHeights);

    // Scroll Topic List Left
    function scrollTopicListLeft() {
        if (elements.scrollLeftButton.classList.contains("disabled")) {
            return;
        }
        const currentScroll = elements.topicList.style.transform.match(/translateX\(-(\d+)px\)/);
        const scrollAmount = currentScroll ? parseInt(currentScroll[1], 10) : 0;
        const availableWidth = elements.topicContainer.offsetWidth - (elements.scrollLeftButton.offsetWidth + elements.scrollRightButton.offsetWidth);
        const maxScroll = elements.topicList.offsetWidth - availableWidth;
        const newScroll = Math.max(scrollAmount - availableWidth, 0);
        elements. topicList.style.transform = `translateX(-${newScroll}px)`;
        if (newScroll === 0) {
            elements.scrollLeftButton.classList.add("disabled");
        }
        elements.scrollRightButton.classList.remove("disabled");
    }

    // Scroll Topic List Right
    function scrollTopicListRight() {
        if (elements.scrollRightButton.classList.contains("disabled")) {
            return;
        }
        const currentScroll = elements.topicList.style.transform.match(/translateX\(-(\d+)px\)/);
        const scrollAmount = currentScroll ? parseInt(currentScroll[1], 10) : 0;
        const availableWidth = elements.topicContainer.offsetWidth - (elements.scrollLeftButton.offsetWidth + elements.scrollRightButton.offsetWidth);
        const maxScroll = elements.topicList.offsetWidth - availableWidth;
        const newScroll = Math.min(scrollAmount + availableWidth, maxScroll);
        elements.topicList.style.transform = `translateX(-${newScroll}px)`;
        if (newScroll === maxScroll) {
            elements.scrollRightButton.classList.add("disabled");
        }
        elements.scrollLeftButton.classList.remove("disabled");
    }

    // Adjust Container Heights
    function adjustContainerHeights() {
        const windowHeight = window.innerHeight;
        const newTopicButtonHeight = elements.newTopicButton.offsetHeight;
        const topicContainerHeight = elements.topicContainer.offsetHeight;
        const askHeight = elements.ask.offsetHeight;

        const containerHeight = windowHeight - (newTopicButtonHeight + askHeight + topicContainerHeight);
        const adjustedContainerHeight = containerHeight - containerHeight * 0.4;
        elements. chatContainer.style.height = adjustedContainerHeight + "px";

        const historyContainerHeight = adjustedContainerHeight - askHeight;
        elements.historyContainer.style.height = historyContainerHeight + "px";

        const topicContainerWidth = elements.topicContainer.offsetWidth;
        const topicListWidth = elements.topicList.offsetWidth;
        const scrollButtonsWidth = elements.scrollLeftButton.offsetWidth + elements.scrollRightButton.offsetWidth;

        if (topicListWidth > topicContainerWidth) {
            elements.topicContainer.classList.add("scrollable");
            const availableWidth = topicContainerWidth - scrollButtonsWidth;
            const maxScroll = topicListWidth - availableWidth;
            elements.topicList.style.maxWidth = topicListWidth + "px";
            elements.topicList.style.transform = `translateX(-${maxScroll}px)`;
            elements.scrollLeftButton.classList.remove("disabled");
            elements.scrollRightButton.classList.add("disabled");
        } else {
            elements.topicContainer.classList.remove("scrollable");
            elements.topicList.style.maxWidth = "none";
            elements.topicList.style.transform = "translateX(0)";
            elements.scrollLeftButton.classList.add("disabled");
            elements.scrollRightButton.classList.add("disabled");
        }
    }


    // Initial adjustment of container heights
    adjustContainerHeights();

    // Load topics from file when the DOM content is loaded
    // loadTopicsFromFile();

    function saveDataToDb(key, data) {
        const message = {
            type: 'saveDataToDB',
            key: key,
            data: data
        };
        try {
            window.postMessage(message, '*');
        } catch (error) {

            logMessage((error), true);
        }

    }

    // Sending tab
    const dataToAutoSave = {

        // ... 
    };

    const message = {
        type: 'setupAutoSave',
        data: dataToAutoSave
    };

    
    function loadDataFromDb(key) {
        const message = {
            type: 'loadDataFromDB',
            key: key,
        };
        window.postMessage(message, '*');
    }
    
    loadDataFromDb('topics');
   
    // Load topics on page load
    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'dataLoadedFromDb') {
            const key = event.data.key;
            const data = event.data.data;

            if (key === 'topics') {
               
                populateTopicList(data);
            }
        }
    });
    
    if (!window.httpService){
        window.httpService = new HttpService();
    }

});