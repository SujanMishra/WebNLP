
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
        ask: document.querySelector("#Ask"), // Only ID selector as there's no class
        askInput: document.querySelector("#AskInput"),
        sendButtonQuestion: document.querySelector("#SendButtonQuestion"),
        banner:document.querySelector("#banner")
    };
  
    let topicManager = TopicsManager.Instance;
    topicManager.init();

    // Event Listeners
    elements.newTopicButton.addEventListener("click", openTopicOptions);
    elements.scrollLeftButton.addEventListener("click", scrollTopicListLeft);
    elements.scrollRightButton.addEventListener("click", scrollTopicListRight);
    elements.createTopicButton.addEventListener("click", createTopicFromUI);
    elements.sendButtonQuestion.addEventListener("click", sendQuestion);
    elements.askInput.addEventListener("keydown", sendQuestion);

    // Open Topic Options
    function openTopicOptions() {
        elements.topicOptions.style.display = "block";
    }

    function createTopicFromUI() {
        const topicName = elements.topicNameInput.value.trim();

        if (topicName === "") {
            Swal.fire({
                title: 'Oops...',
                text: 'Please enter a topic name.',
                background: '#333', // Dark background
                color: '#ccc',
                confirmButtonColor: '#3085d6',
                width: '400px',
                padding: '1rem',
            });

            return;
        }

        const topicExists = topicManager.topics.some(topic => topic.name === topicName);
        if (topicExists) {
            Swal.fire({

                title: 'Duplicate Topic',
                text: 'Please enter new topic name. Previous topic Exists',
                background: '#333',
                color: '#ccc',
                confirmButtonColor: '#3085d6',
                width: '400px',
                padding: '1rem',
            });
            return;
        }

        const topic = topicManager.createTopic(topicName);
        if (topic) {
            elements.topicNameInput.value = "";
            elements.topicOptions.style.display = "none";
        }
    }

    topicManager.on('topicCreated', topic => {
        updateUITopicList(topic);
    });



    function updateUITopicList(topic) {
        const topicBoxes = document.querySelectorAll(".topicBox");
        let topicBox = topicBoxes[0];

        if (!topicBox || topicBox.childElementCount >= 3) {
            topicBox = document.createElement("div");
            topicBox.classList.add("topicBox");
            elements.topicList.prepend(topicBox);
        }

        // Create the topic button
        const topicButton = document.createElement("button");
        topicButton.classList.add("topic-button");
        topicButton.textContent = topic.name;
        topicButton.style.position = 'relative'; // Enable absolute positioning inside

        // Create the edit button
        const editButton = document.createElement("span");
        editButton.textContent = "edit";
        editButton.classList.add("edit-button");
        editButton.style.cssText = "position: absolute; top: 0; right: 0; font-size: small; cursor: pointer;";
        editButton.onclick = function (e) {
            e.stopPropagation(); // Prevent topic button click
            initiateEdit(topic, topicButton);
        };

        topicButton.appendChild(editButton);

        topicButton.addEventListener("click", function () {
            handleTopicClick(topic.name);
        });

        topicBox.prepend(topicButton);
    }

    function initiateEdit(topic, topicButton) {
        // Clear existing content, but save the edit button
        const editButton = topicButton.querySelector('.edit-button');
        const originalText = topic.name; // Directly use the topic name
        topicButton.innerHTML = ''; // Clear the button content, removing the edit button for now

        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = originalText;
        inputField.style.width = "calc(100% - 40px)"; // Adjust width to make space for the OK button and edit button

        topicButton.appendChild(inputField);
        inputField.focus();

        // Function to confirm the edit and reset the button
        const confirmEdit = function () {
            const newName = inputField.value.trim();
            if (newName && newName !== originalText) {
                topic.name = newName; // Update the topic object
                // Reconstruct the button with the new name and append the edit button
                topicButton.textContent = newName;
                topicButton.appendChild(editButton); // Re-add edit button
                topicManager.updateTopicNameInDb(topic);
            } else {
                topicButton.textContent = originalText; // Revert if no change
                topicButton.appendChild(editButton); // Re-add edit button
            }
        };

        // Confirm on Enter key
        inputField.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                confirmEdit();
            }
        });

        // Optional: Confirm with OK button
        const okButton = document.createElement("button");
        okButton.textContent = "OK";
        okButton.style.cssText = "margin-left: 5px;"; // Space it a bit from the input field
        okButton.onclick = function () {
            confirmEdit();
            // Stop propagation to prevent topic click event
            event.stopPropagation();
        };

        // Adjust topicButton content for editing
        topicButton.innerHTML = ''; // Clear to ensure no duplicate elements
        topicButton.appendChild(inputField);
        topicButton.appendChild(okButton);
        // Re-append the edit button, but keep it hidden or disabled until editing is done
        editButton.style.display = 'none';
        topicButton.appendChild(editButton);

        // Focus back to input and select text
        inputField.focus();
        inputField.select();

        // After editing is confirmed, show the edit button again
        inputField.addEventListener('blur', function () {
            editButton.style.display = 'inline'; // Or adjust as needed for your layout
        });
    }




    // Populate the topic list with loaded topics
    function populateTopicList() {
        topicManager.topics.forEach(topic => {
            updateUITopicList(topic);
        });
    }


    // Handle Topic Click
    function handleTopicClick(topicName) {
        topicManager.currentTopic = topicManager.topics.find(topic => topic.name === topicName);
        if (topicManager.currentTopic) {
            topicManager.currentTopic.display(elements.historyContainer);
        } else {
            logMessage(`No topic currently selected ${topicManager.topics.length}`);
        }
    }

    // Send Question
    function sendQuestion(event) {
        // console.log('sendQuestion triggered by:', event.type);


        let isEnterPressed = event.key === "Enter";
        let isShiftPressed = event.shiftKey;
        let isClickOnSendButton = event.type === "click" && event.target === elements.sendButtonQuestion;

        // console.log("Is Enter pressed:", isEnterPressed);
        // console.log("Is Shift pressed:", isShiftPressed);
        // console.log("Is Click on Send Button:", isClickOnSendButton);
        if (isShiftPressed) {

            return;
        }
        if (isEnterPressed || isClickOnSendButton) {

            event.preventDefault();
            const question = elements.askInput.value.trim();
            console.log('Question:', question);


            if (question === "") {
                // console.log('No question entered');
                return;
            }

            if (topicManager.topics.length > 0) {
                topicManager.currentTopic = topicManager.topics[topicManager.topics.length - 1];
                // console.log('Last active topic selected:', topicManager.currentTopic);
                logMessage("You should have selected a topic for this question, question is added to last active topic!", false);
            } else {
                const topic = topicManager.createTopic(Utils.createUniqueTopicName(topicManager.topics));
                // console.log('New topic created with GUID:', topic);
                logMessage("Please add a topic name, a random topic was generated for this question!", false);

                topicManager.currentTopic = topic;
            }

            // console.log('Adding message to topic:', topicManager.currentTopic);
            topicManager.currentTopic.addMessage(question, SenderType.USER, elements.historyContainer);

            elements.ask.style.height = 'auto';
            elements.askInput.style.height = 'auto';
            elements.askInput.value = "";

            // console.log('Sending HTTP request with topic and question');
            window.httpService.sendHttpRequest(topicManager.currentTopic, question);
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
        elements.topicList.style.transform = `translateX(-${newScroll}px)`;
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

    elements.askInput.addEventListener('input', function () {
        // Calculate the scroll height of the ask input element
        const scrollHeight = this.scrollHeight;

        // Set the height of the ask div and ask-input to be the minimum of scroll height and the maximum height
        const maxHeight = 150; // Change this to your desired maximum height
        const newHeight = Math.min(scrollHeight, maxHeight) + 'px';
        elements.ask.style.height = newHeight;
        elements.askInput.style.height = newHeight;
    });


    function adjustContainerHeights() {
        // Assuming you have a way to access your elements, like a 'elements' object
        const windowHeight = window.innerHeight;
        const bannerHeight = elements.banner ? elements.banner.offsetHeight : 0; // Include the banner height in the calculation
        const newTopicButtonHeight = elements.newTopicButton.offsetHeight;
        const topicContainerHeight = elements.topicContainer.offsetHeight;
        const askHeight = elements.ask.offsetHeight;

        // Now include the bannerHeight in the total subtraction to get the remaining container height
        const containerHeight = windowHeight - (bannerHeight + newTopicButtonHeight + topicContainerHeight + askHeight);
        const adjustedContainerHeight = containerHeight - (containerHeight * 0.4); // Adjust the container height as per the logic
        elements.chatContainer.style.height = `${adjustedContainerHeight}px`;

        // The historyContainer should take the remaining height after adjusting for the ask element
        const historyContainerHeight = adjustedContainerHeight - askHeight;
        elements.historyContainer.style.height = `${historyContainerHeight}px`;

        // Calculate the width for horizontal scrolling if needed
        const topicContainerWidth = elements.topicContainer.offsetWidth;
        const topicListWidth = elements.topicList.offsetWidth;
        const scrollButtonsWidth = elements.scrollLeftButton.offsetWidth + elements.scrollRightButton.offsetWidth;

        // Check if horizontal scrolling is necessary
        if (topicListWidth > topicContainerWidth) {
            elements.topicContainer.classList.add("scrollable");
            const availableWidth = topicContainerWidth - scrollButtonsWidth;
            const maxScroll = topicListWidth - availableWidth;
            elements.topicList.style.maxWidth = `${topicListWidth}px`;
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

  
    adjustContainerHeights();
  

    // Load topics on page load
    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'dataLoadedFromDb') {
            const key = event.data.key;
            const data = event.data.data;

            if (key === 'topics') {

                populateTopicList();
            }
        }
    });

    if (!window.httpService) {
        window.httpService = new HttpService();
    }

});