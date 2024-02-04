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

        this.elements = this.refreshElements();
        let llmSetting = null;
        this.updateRequestHandler();
        window.httpService = this;
    }

    refreshElements() {
        return {
            historyContainer: document.querySelector('.llm-element#HistoryContainer'),

            remoteLLMToggle: document.querySelector('.llm-input#RemoteLLMToggle'),
            remoteServerIP: document.querySelector('.llm-input#RemoteServerIP'),
            ApiKey: document.querySelector('.llm-input#apiKey'),
            remoteLLMService: document.querySelector('.llm-select#RemoteLLMService'),
            RemoteServerName: document.querySelector('.llm-input#RemoteServerName'),

            localLLMToggle: document.querySelector('.llm-input#LocalLLMToggle'),
            localLLMServerInput: document.querySelector('.llm-input#LocalLLMServerInput'),
            localLLMEndpoint: document.querySelector('.llm-input#LocalLLMEndpoint'),

            customLLMToggle: document.querySelector('.llm-input#CustomLLMToggle'),
            customLLMChatEndpointInput: document.querySelector('.llm-input#CustomLLMChatEndpointInput'),
            customLLMServerInput: document.querySelector('.llm-input#CustomLLMServerInput'),

            LocalLLMModelInput: document.querySelector('.llm-input#LocalLLMModelInput'),
            CustomLLMModelInput: document.querySelector('.llm-input#CustomLLMModelInput'),
            CustomLLMUpdateEndpointInput: document.querySelector('.llm-input#CustomLLMUpdateEndpointInput'),
        };
    }


    updateRequestHandler() {

        this.llmSetting = this.getLLMSetting(this.elements);

    }

    getLLMSetting(elements) {
        let endpoint;
        let ApiKey;

        if (!elements.remoteLLMToggle.checked && !elements.localLLMToggle.checked && !elements.customLLMToggle.checked) {
            logMessage("No LLM settings toggle is activated.", true);
            return null;
        }

        if (elements.remoteLLMToggle.checked) {
            if (!elements.remoteServerIP.value) {
                logMessage(("LLM Server is not defined."), true);
                return null;
            }
            if (!elements.ApiKey.value) {
                logMessage(("Token is not defined."), true);
                return null;
            }
            endpoint = `https://${elements.remoteServerIP.value}`;
            ApiKey = elements.ApiKey.value;
        }

        if (elements.localLLMToggle.checked) {
            if (!elements.localLLMServerInput.value || !elements.localLLMEndpoint.value) {
                logMessage(("LLM Server or LLM Chat Endpoint is not defined."), true);
                return null;
            }
            endpoint = `https://${elements.localLLMServerInput.value}/${elements.localLLMEndpoint.value}`;
            ApiKey = null;
        }

        if (elements.customLLMToggle.checked) {
            if (!elements.customLLMServerInput.value || !elements.customLLMChatEndpointInput.value) {
                logMessage(("LLM Server or LLM Chat Endpoint is not defined."), true);
                return null;
            }
            endpoint = `https://${elements.customLLMServerInput.value}/${elements.customLLMChatEndpointInput.value}`;
            ApiKey = null;
        }

        return {endpoint, ApiKey};
    }

    sendHttpRequest(currentTopic, question) {

        this.updateRequestHandler();
        if (this.llmSetting && this.llmSetting.ApiKey && this.llmSetting.endpoint) {

            chrome.runtime.sendMessage({
                action: "sendRequest",
                requestData: {
                    llmSetting: this.llmSetting,
                    question: question,
                }

            }, response => {
                if (response.error) {
                    logMessage(response.error, true);
                } else {
                    currentTopic.addMessage(response.data, SenderType.SERVER);
                    currentTopic.display(this.elements.historyContainer);
                }
            });
        } else {
            logMessage("LLM settings are not defined.", true);
        }

    }
}



