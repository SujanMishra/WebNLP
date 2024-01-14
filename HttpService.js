/**
 * this class manages HTTP requests to Language Model (LLM) endpoints
 * based on user-defined settings. It provides methods to send HTTP requests
 * and handles configurations for remote, local, and custom LLM services.
 *
 * RequestHandler class encapsulates the logic for making HTTP requests to
 * LLM endpoints, including handling API keys and timeouts.
 */
class HttpService {
    constructor() {
        this.requestHandler = null;
        this.elements = this.refreshElements();
        this.updateRequestHandler();
        window.httpService = this;
    }

    refreshElements() {
        return {
            historyContainer: document.getElementById("historyContainer"),

            remoteLLMToggle: document.getElementById('remoteLLMToggle').checked,
            remoteServerIP: document.getElementById('RemoteServerIP').value,
            ApiKey: document.getElementById('ApiKey').value,
            remoteLLMService: document.getElementById('RemoteLLMService').value,

            localLLMToggle: document.getElementById('localLLMToggle').checked,
            localLLMServerInput: document.getElementById('LocalLLMServerInput').value,
            localLLMEndpoint: document.getElementById('LocalLLMServerChatEndpoint').value,

            customLLMToggle: document.getElementById('customLLMToggle').checked,
            customLLMChatEndpointInput: document.getElementById('CustomLLMChatEndpointInput').value,
            customLLMServerInput: document.getElementById('CustomLLMServerInput').value,

            RemoteLLMService: document.getElementById('RemoteLLMService').value,
            RemoteServerName: document.getElementById('RemoteServerName').value,
            RemoteServerTokenInput: document.getElementById('RemoteServerTokenInput').value,

            LocalLLMModelInput: document.getElementById('LocalLLMModelInput').value,
            CustomLLMModelInput: document.getElementById('CustomLLMModelInput').value,
            CustomLLMUpdateEndpointInput: document.getElementById('CustomLLMUpdateEndpointInput').value,

            
        };
    }

    updateRequestHandler() {
        this.requestHandler = new RequestHandler(this.getLLMSetting(this.elements));
    }

    getLLMSetting(elements) {
        let endpoint;
        let ApiKey;

        if (!elements.remoteLLMToggle && !elements.localLLMToggle && !elements.customLLMToggle) {
            logMessage("No LLM settings toggle is activated.", true);
            return null;
        }

        if (elements.remoteLLMToggle) {
            if (!elements.remoteServerIP) {
                logMessage(("LLM Server is not defined."), true);
                return null;
            }
            if (!elements.ApiKey) {
                logMessage(("Token is not defined."), true);
                return null;
            }
            endpoint = `https://${elements.remoteServerIP}`;
            ApiKey = elements.ApiKey;
        }

        if (elements.localLLMToggle) {
            if (!elements.localLLMServerInput || !elements.localLLMEndpoint) {
                logMessage(("LLM Server or LLM Chat Endpoint is not defined."), true);
                return null;
            }
            endpoint = `https://${elements.localLLMServerInput}/${elements.localLLMEndpoint}`;
            ApiKey = null;
        }

        if (elements.customLLMToggle) {
            if (!elements.customLLMServerInput || !elements.customLLMChatEndpointInput) {
                logMessage(("LLM Server or LLM Chat Endpoint is not defined."), true);
                return null;
            }
            endpoint = `https://${elements.customLLMServerInput}/${elements.customLLMChatEndpointInput}`;
            ApiKey = null;
        }

        return {endpoint, ApiKey};
    }

    sendHttpRequest(currentTopic, question) {
        if (this.requestHandler) {
            this.requestHandler.sendRequest(question)
                .then(response => {
                    currentTopic.addMessage(response, SenderType.SERVER);
                    currentTopic.display(this.elements.historyContainer);
                })
                .catch(error => {
                    logMessage(error, true);
                });
        } else {
            logMessage("Request handler not initialized.", true);
        }
    }
}

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
        let headers = {"Content-Type": "application/json"};
        if (this.ApiKey) {
            headers["Authorization"] = `Bearer ${this.ApiKey}`;
        }

        return Promise.race([
            fetch(this.endpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({'prompt': question})
            }),
            this.timeout(this.timeoutDelay, "LLM Chat Endpoint response timeout")
        ])
            .then(response => {
                if (!response.ok) {
                    throw new Error("LLM Chat Endpoint response was not successful.");
                }
                return response.json();
            });
    }
}

