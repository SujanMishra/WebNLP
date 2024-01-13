// logger.js


let logContainer;
let toggleButton;
let saveLogButton;
let clearLogButton;
let messageHolder;
function toggleLogContainer() {
    const isLogVisible = messageHolder.style.display !== 'none';

    if (isLogVisible) {
        messageHolder.style.display = 'none';
        toggleButton.textContent = 'Show Log';
        clearLogButton.style.display = 'none';
        saveLogButton.style.display = 'none';
    } else {
        messageHolder.style.display = 'block';
        toggleButton.textContent = 'Hide Log';
        clearLogButton.style.display = 'inline-block';
        saveLogButton.style.display = 'inline-block';
    }
}

function logMessage(message, isError = false) {
    // Get the stack trace
    const stackTrace = new Error().stack;

    // Parse the stack trace to extract the line number and function name
    const stackLines = stackTrace.split('\n');
    let lineNumber = '';
    let functionName = '';

    if (stackLines.length >= 3) {
        const callerLine = stackLines[2].trim();
        const lineParts = callerLine.match(/(\d+):\d+\)$/);

        if (lineParts && lineParts.length > 1) {
            lineNumber = lineParts[1];
        }

        const functionParts = callerLine.match(/at (.+)/);
        if (functionParts && functionParts.length > 1) {
            functionName = functionParts[1];
        }
    }

    // Create the log message with line number and function name
    const logMessage = `[${functionName}:${lineNumber}] ${message}`;

    createLogUI();

    const messageElement = document.createElement('p');
    messageElement.innerHTML = logMessage.replace(/\n/g, '<br>');
    messageElement.style.color = isError ? 'red' : 'green';
    messageElement.style.margin = '5px';

    messageHolder.appendChild(messageElement);

    const lastMessage = messageHolder.lastElementChild;
    if (lastMessage && lastMessage.style.color === 'red') {
        toggleButton.style.color = 'red';
    } else {
        toggleButton.style.color = '';
    }

    saveLogButton.style.display = 'block';

    adjustMessageHolderHeight();
}

function createLogUI() {
    if (!logContainer) {
        const tweaksTab = document.getElementById('Tweaks'); // Adjust ID if necessary

        // Logger wrapper
        logContainer = document.createElement('div');
        logContainer.className = 'logger-wrapper';
        tweaksTab.appendChild(logContainer);

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'logger-buttons-container';
        logContainer.appendChild(buttonsContainer);

        // Toggle, clear, save buttons
        toggleButton = createButton('Show Log', 'toggle-log');
        clearLogButton = createButton('Clear Log', 'clear-log', true);
        saveLogButton = createButton('Save Log', 'save-log', true);

        buttonsContainer.appendChild(toggleButton);
        buttonsContainer.appendChild(clearLogButton);
        buttonsContainer.appendChild(saveLogButton);

        // Message holder
        messageHolder = document.createElement('div');
        messageHolder.className = 'logger-message-holder';
        logContainer.appendChild(messageHolder);

        toggleButton.addEventListener('click', toggleLogContainer);
        clearLogButton.addEventListener('click', clearLog);
        saveLogButton.addEventListener('click', saveLog);
    }
}

function createButton(text, className, hidden = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    if (hidden) button.style.display = 'none';
    return button;
}


function adjustMessageHolderHeight() {

    messageHolder.style.maxHeight = '600px';
    messageHolder.style.overflowY = 'scroll';
    messageHolder.style.overflowX = 'scroll';

}

function clearLog() {
    messageHolder.innerHTML = '';
    saveLogButton.style.display = 'none';
}

function saveLog() {
    const logContent = Array.from(messageHolder.children)
        .map(messageElement => messageElement.textContent)
        .join('\n');

    const fileData = new Blob([logContent], { type: 'text/plain' });

    const handle = window.showSaveFilePicker({
        suggestedName: 'log.txt',
        types: [
            {
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                }
            }
        ]
    });

    handle.then(fileHandle => {
        return fileHandle.createWritable();
    }).then(writableStream => {
        writableStream.write(fileData);
        writableStream.close();
    }).then(() => {
        logMessage('Log saved successfully.', false);
    }).catch(err => {
        logMessage('Error saving log: ' + err, true);
    });
}
