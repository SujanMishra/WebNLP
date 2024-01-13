/* global chrome */
const SenderType = {
    USER: 'user',
    SERVER: 'server'
};

class Topic {
    constructor(name) {
        this.name = name;
        this.messages = [];
        this.metadata = {};
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

    const newTopicButton = document.getElementById("newTopicButton");
    const topicContainer = document.querySelector(".topic-container");
    const topicList = document.querySelector(".topic-list");
    const scrollLeftButton = document.getElementById("scrollLeftButton");
    const scrollRightButton = document.getElementById("scrollRightButton");
    const topicOptions = document.getElementById("topicOptions");
    const createTopicButton = document.getElementById("createTopicButton");
    const topicNameInput = document.getElementById("topicNameInput");
    const chatContainer = document.getElementById("chatContainer");
    const historyContainer = document.getElementById("historyContainer");
    const ask = document.getElementById("ask");
    const askInput = document.getElementById("askInput");
    const sendButtonQuestion = document.getElementById("sendButtonQuestion");
    const timeoutDelay = 500;

    // Topics array to store all the Topic instances
    let topics = [];
    let currentTopic = null;
    let fsHandle; // File System Handle

    // Event Listeners
    newTopicButton.addEventListener("click", openTopicOptions);
    scrollLeftButton.addEventListener("click", scrollTopicListLeft);
    scrollRightButton.addEventListener("click", scrollTopicListRight);
    createTopicButton.addEventListener("click", createTopic);
    sendButtonQuestion.addEventListener("click", sendQuestion);
    askInput.addEventListener("keydown", sendQuestion);

    // Open Topic Options
    function openTopicOptions() {
        topicOptions.style.display = "block";
    }


    // Create New Topic
    function createTopic() {
        const topicName = topicNameInput.value.trim();
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
            topicList.prepend(topicBox);
        }

        const topicButton = document.createElement("button");
        topicButton.classList.add("topic-button");
        topicButton.textContent = topicName;
        topicButton.addEventListener("click", function () {
            handleTopicClick();
        });

        topicBox.prepend(topicButton);

        topicNameInput.value = "";
        topicOptions.style.display = "none";

        // Save the new topic to the database
        saveDataToDb('topics', topics);
    }

    // Populate the topic list with loaded topics
    function populateTopicList(topics) {
        topics.forEach(topic => {
            const topicBox = document.createElement("div");
            topicBox.classList.add("topicBox");
            topicList.prepend(topicBox);

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
            currentTopic.display(historyContainer);
        } else {
            console.log("No topic currently selected");
        }
    }

    // Send Question
    function sendQuestion(event) {
        var error = '';

        if ((event.key === "Enter" && !event.shiftKey) || event.target === sendButtonQuestion) {
            event.preventDefault();
            const question = askInput.value.trim();
            if (question === "") {
                return;
            }

            if (!currentTopic) {
                logMessage(getCallerInfo("Please select a topic before sending a message."), true);
                return;
            }

            currentTopic.addMessage(question, SenderType.USER);
            currentTopic.display(historyContainer);

            askInput.value = "";

            const llmServer = llmServerInput.value.trim();
            const llmChatEndpoint = llmChatEndpointInput.value.trim();

            if (!llmServer) {

                logMessage(getCallerInfo("LLM Server is not defined."), true);

                return;
            }

            if (!llmChatEndpoint) {

                logMessage(getCallerInfo("LLM Chat Endpoint is not defined."), true);

                return;
            }

            const endpoint = `http://${llmServer}/${llmChatEndpoint}`;

            Promise.race([
                fetch(endpoint),
                timeout(timeoutDelay, "LLM Server response timeout")
            ])
                .then(response => {
                    if (!response.ok) {
                        throw new Error("LLM Server response was not ok.");
                    }
                    return Promise.race([
                        fetch(endpoint, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({question})
                        }),

                        timeout(timeoutDelay, "LLM Chat Endpoint response timeout")

                    ]);
                })
                .then(response => {
                    if (!response.ok) {

                        logMessage(getCallerInfo("LLM Chat Endpoint response was not successful."), true);
                    }
                    return response.json();
                })
                .then(data => {
                   
                    currentTopic.addMessage(data.response, SenderType.SERVER);
                    currentTopic.display(historyContainer);

                })
                .catch(error => {

                    logMessage(getCallerInfo(error), true);
                });
        }
    }
    function getCallerInfo(error) {
        if (error instanceof Error) {
            // Get the stack trace and split it into lines
            const stackLines = error.stack.split("\n");

            // The first line of the stack trace is "Error: <error message>"
            // The second line contains the file name, line number, and column number
            const errorInfo = stackLines[1];

            // Combine the error message with the error info
            return `${error.message} \n ${errorInfo}`;
        } else {
            // When "error" is not an instance of Error, treat it as a message string
            const newError = new Error(error);  // Create a new Error for stack trace
            // Get the stack trace and split it into lines
            const stackLines = newError.stack.split("\n");

            const errorInfo = stackLines[1];
            
            return `${newError.message} \n ${errorInfo}`;
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
            historyContainer.appendChild(notification);
        }
    }

    // Adjust container heights on window resize
    window.addEventListener("resize", adjustContainerHeights);

    // Scroll Topic List Left
    function scrollTopicListLeft() {
        if (scrollLeftButton.classList.contains("disabled")) {
            return;
        }
        const currentScroll = topicList.style.transform.match(/translateX\(-(\d+)px\)/);
        const scrollAmount = currentScroll ? parseInt(currentScroll[1], 10) : 0;
        const availableWidth = topicContainer.offsetWidth - (scrollLeftButton.offsetWidth + scrollRightButton.offsetWidth);
        const maxScroll = topicList.offsetWidth - availableWidth;
        const newScroll = Math.max(scrollAmount - availableWidth, 0);
        topicList.style.transform = `translateX(-${newScroll}px)`;
        if (newScroll === 0) {
            scrollLeftButton.classList.add("disabled");
        }
        scrollRightButton.classList.remove("disabled");
    }

    // Scroll Topic List Right
    function scrollTopicListRight() {
        if (scrollRightButton.classList.contains("disabled")) {
            return;
        }
        const currentScroll = topicList.style.transform.match(/translateX\(-(\d+)px\)/);
        const scrollAmount = currentScroll ? parseInt(currentScroll[1], 10) : 0;
        const availableWidth = topicContainer.offsetWidth - (scrollLeftButton.offsetWidth + scrollRightButton.offsetWidth);
        const maxScroll = topicList.offsetWidth - availableWidth;
        const newScroll = Math.min(scrollAmount + availableWidth, maxScroll);
        topicList.style.transform = `translateX(-${newScroll}px)`;
        if (newScroll === maxScroll) {
            scrollRightButton.classList.add("disabled");
        }
        scrollLeftButton.classList.remove("disabled");
    }

    // Adjust Container Heights
    function adjustContainerHeights() {
        const windowHeight = window.innerHeight;
        const newTopicButtonHeight = newTopicButton.offsetHeight;
        const topicContainerHeight = topicContainer.offsetHeight;
        const askHeight = ask.offsetHeight;

        const containerHeight = windowHeight - (newTopicButtonHeight + askHeight + topicContainerHeight);
        const adjustedContainerHeight = containerHeight - containerHeight * 0.4;
        chatContainer.style.height = adjustedContainerHeight + "px";

        const historyContainerHeight = adjustedContainerHeight - askHeight;
        historyContainer.style.height = historyContainerHeight + "px";

        const topicContainerWidth = topicContainer.offsetWidth;
        const topicListWidth = topicList.offsetWidth;
        const scrollButtonsWidth = scrollLeftButton.offsetWidth + scrollRightButton.offsetWidth;

        if (topicListWidth > topicContainerWidth) {
            topicContainer.classList.add("scrollable");
            const availableWidth = topicContainerWidth - scrollButtonsWidth;
            const maxScroll = topicListWidth - availableWidth;
            topicList.style.maxWidth = topicListWidth + "px";
            topicList.style.transform = `translateX(-${maxScroll}px)`;
            scrollLeftButton.classList.remove("disabled");
            scrollRightButton.classList.add("disabled");
        } else {
            topicContainer.classList.remove("scrollable");
            topicList.style.maxWidth = "none";
            topicList.style.transform = "translateX(0)";
            scrollLeftButton.classList.add("disabled");
            scrollRightButton.classList.add("disabled");
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

            logMessage(getCallerInfo(error), true);
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

    // window.postMessage(message, '*');

    function loadDataFromDb(key) {
        const message = {
            type: 'loadDataFromDB',
            key: key,
        };
        window.postMessage(message, '*');
    }

    // Load topics on page load
    window.addEventListener('DOMContentLoaded', (event) => {
        loadDataFromDb('topics');
    });

    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'dataLoadedFromDb') {
            const key = event.data.key;
            const data = event.data.data;

            if (key === 'topics') {
                // Assuming 'data' is an array of topics
                populateTopicList(data);
            }
        }
    });


});