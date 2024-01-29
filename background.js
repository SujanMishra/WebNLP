
chrome.action.onClicked.addListener((tab) => {
    // Check if the current tab's URL is one where the extension should not run
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('https://chrome.google.com/webstore')) {
        // Redirect to a default webpage and remember this tab ID
        chrome.tabs.update(tab.id, {url: 'https://www.google.com/'}).then(r =>{});
        chrome.storage.local.set({pendingTabId: tab.id}).then(r =>{});
    } else {
        // Toggle the state and execute the appropriate function based on the new state
        chrome.storage.local.get('isExtensionOn', (data) => {
            let currentState = data.isExtensionOn || false;
            let newState = !currentState;
            chrome.storage.local.set({isExtensionOn: newState}).then(r =>{});
            console.log("Sending message to tab:", tab.id);
            chrome.tabs.sendMessage(tab.id, {text: 'toggle'}).then(r =>{});

        });
    }
});

// Listener for messages from content scripts



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.storage.local.get(['pendingTabId'], function (result) {
            if (result.pendingTabId === tabId) {
                // This is the tab we were waiting for
                // It's now fully loaded, so run the extension
                chrome.tabs.sendMessage(tabId, {text: 'toggle'}).then(r =>{});
                chrome.storage.local.remove(['pendingTabId']).then(r => {});
            }
        });
    }

    if (changeInfo.status === 'loading') {
        removeIFrame(tabId);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === 'is_extension_on') {
        chrome.storage.local.get('isExtensionOn', (data) => {
            sendResponse({ status: data.isExtensionOn || false });
        });
        return true; // Indicates response will be sent asynchronously
    }
});

function removeIFrame(tabId) {
    chrome.tabs.sendMessage(tabId, {message: 'remove_iframe'}).then(r =>{});
    chrome.storage.local.set({isExtensionOn: false}).then(r =>{});
}

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.get('isExtensionOn', (data) => {
        if (data.isExtensionOn) {
            removeIFrame(tabId);
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendRequest") {
        const requestHandler = new RequestHandler(request.requestData.llmSetting);
        requestHandler.sendRequest(request.requestData.question)
            .then(response => {
                sendResponse({ data: response });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });

        return true;
    }
});
// this needs to be in background
class RequestHandler {
    constructor(config) {
        this.endpoint = config.endpoint;
        this.ApiKey = config.ApiKey;
        this.timeoutDelay = 100;
    }

    timeout(delay, msg) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error(msg)), delay);
        });
    }

    sendRequest(question) {
        let headers = {"Content-Type": "application/json,charset=UTF-8"};
        if (this.ApiKey) {
            headers["Authorization"] = `Bearer ${this.ApiKey}`;
        }
        this.updateRules(this.endpoint, headers);

        return Promise.race([
            fetch(this.endpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({'prompt': question})
            }),
            this.timeout(this.timeoutDelay, "LLM Chat Endpoint response timeout")
        ])
            .then(response => {
                return response.json().then(data => {
                    if (!response.ok) {
                        // Handle non-ok responses with valid data
                        return { error: true, data: data, status: response.status };
                    }
                    // Handle ok responses
                    return { error: false, data: data };
                }).catch(error => {
                    // Handle cases where the response cannot be parsed as JSON
                    if (!response.ok) {
                        // send log 
                    }

                });
            });
    }

    updateRules(url, additionalHeaders) {
        let rules = [
            {
                "id": 1,
                "priority": 1,
                "action": {
                    "type": "modifyHeaders",
                    "requestHeaders": [
                        ...this.createHeaderRules(additionalHeaders),
                        {
                            "header": "Access-Control-Allow-Origin",
                            "operation": "set",
                            "value": "*"
                        }
                    ]
                },
                "condition": {
                    "urlFilter": url,
                    "resourceTypes": ["main_frame", "xmlhttprequest"]
                }
            }
        ];

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1],
            addRules: rules
        });
    }

    createHeaderRules(headers) {
        return Object.keys(headers).map(key => ({
            "header": key,
            "operation": "set",
            "value": headers[key]
        }));
    }

}