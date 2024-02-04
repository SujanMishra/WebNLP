

chrome.runtime.onInstalled.addListener(() => {


});

chrome.action.onClicked.addListener((tab) => {
    // This will open the side panel on the current tab.
    chrome.sidePanel.open({ tabId: tab.id }).then(() => {
        chrome.sidePanel.setOptions({
            tabId: tab.id,
            path: 'html/main.html',
            enabled: true
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel') {
        // This will open the panel in all the pages on the current window.
        chrome.sidePanel.open({ windowId: tab.windowId });
    }
});

chrome.runtime.onMessage.addListener((message, sender) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {
        if (message.type === 'open_side_panel') {
            // This will open a tab-specific side panel only on the current tab.
            await chrome.sidePanel.open({ tabId: sender.tab.id });
            await chrome.sidePanel.setOptions({
                tabId: sender.tab.id,
                path: 'main.html',
                enabled: true
            });
        }
    })();
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