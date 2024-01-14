/**
 This script manages a web page interface for configuring and interacting with various language models services Api. It allows users to:
  * Choose a language model service provider (e.g., OpenAI, Azure, AnyScale, or custom).
  * Add and configure models associated with the selected provider.
  * Store and manage API keys for these providers.
  * Dynamically add new custom providers and models for future
  *  Persistently store and load configuration data from a database.
 */

document.addEventListener('DOMContentLoaded', function () {
    let elements = {

        llmServiceElement: document.getElementById("RemoteLLMService"),
        OkButton: document.getElementById("RemoteServerNameOK"),
        customFieldName: document.getElementById('RemoteServerName'),
        customNameSelector: document.getElementById('CustomNameSelector'),
        remoteModel: document.getElementById('RemoteModel'),
        remoteLLMServerChatEndpoint: document.getElementById('RemoteLLMServerChatEndpoint'),
        ApiKey: document.getElementById('ApiKey'),
    };

    let dynamicModels = {};

// define an object that maps option values to handler functions
    let llmServiceHandlers = {
        openai: handleOpenAI,
        azure: handleAzure,
        anyScale: handleAnyScale,
        custom: handleCustom
    };

    let ApiKeys = {}

// listen for changes on New llm provider 
    elements.OkButton.addEventListener('click', function () {

        try {

            const customFieldValue = elements.customFieldName.value.trim();

            if (!customFieldValue) {
                alert('Please enter a name');
                return;
            }

            if (llmServiceHandlers.hasOwnProperty(customFieldValue)) {
                alert(`The Provider ${customFieldValue} is already in use. Please choose a different provider.`);
                return;
            }
            let newOption = document.createElement("option");
            newOption.text = customFieldValue;
            newOption.value = customFieldValue;
            elements.llmServiceElement.add(newOption);
            elements.llmServiceElement.value = customFieldValue;
            elements.customNameSelector.style.display = 'none';
            llmServiceHandlers[customFieldValue] = handleANewProvider;
            if (window.httpService) {
                window.httpService.updateRequestHandler();
            }
        } catch (e) {
            logMessage((e), true);

        }


    });

    elements.ApiKey.addEventListener('change', function () {
        try {
            const selected = elements.llmServiceElement.value;
            if (selected) {
                AddApiKey(selected, true);
            }
        } catch (e) {
            logMessage((e), true);
        }
    });

// listen for changes on the dropdown
    elements.llmServiceElement.addEventListener('change', function () {

        try {

            // hide the custom field if the selected option is not 'custom'
            elements.customNameSelector.style.display = (this.value === 'custom') ? 'flex' : 'none';
            // call the appropriate handler function based on the selected option
            llmServiceHandlers[this.value]();
        } catch (e) {
            logMessage((e), true);

        }
    });

// handler for OpenAI option

    let OpenAIModels = {
        // GPT-4 Models
        'gpt-4-1106-preview (assistants)': {
            model: 'gpt-4-1106-preview',
            compatibleEndpoint: '/v1/assistants',
            contextWindow: 128000,
        },
        'gpt-4-1106-preview (chat)': {
            model: 'gpt-4-1106-preview',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 128000,
        },
        'gpt-4-vision-preview (chat)': {
            model: 'gpt-4-vision-preview',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 128000,
        },
        'gpt-4 (chat)': {
            model: 'gpt-4',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 8192,
        },
        'gpt-4-32k (chat)': {
            model: 'gpt-4-32k',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 32768,
        },

        // GPT-3.5 Models
        'gpt-3.5-turbo-1106 (assistants)': {
            model: 'gpt-3.5-turbo-1106',
            compatibleEndpoint: '/v1/assistants',
            contextWindow: 16385,
        },
        'gpt-3.5-turbo-1106 (chat)': {
            model: 'gpt-3.5-turbo-1106',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 16385,
        },
        'gpt-3.5-turbo (chat)': {
            model: 'gpt-3.5-turbo',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 4096,
        },
        'gpt-3.5-turbo-16k (chat )': {
            model: 'gpt-3.5-turbo-16k',
            compatibleEndpoint: '/v1/chat/completions',
            contextWindow: 16385,
        },
        'gpt-3.5-turbo-instruct (legacy completions)': {
            model: 'gpt-3.5-turbo-instruct',
            compatibleEndpoint: '/v1/completions',
            contextWindow: 4096,
        },
        // ... other models as needed  i.e dalle etc ...
    };

    function handleOpenAI() {

        try {

            addModelOptionDropdown(OpenAIModels);
            AddApiKey(this.value)
            saveAllDataToDB();
        } catch (e) {
            logMessage((e), true);

        }
    }

    // dynamic model option addition 
    function addModelOptionDropdown(aiModels) {
        try {

            elements.remoteModel.clear();
            Object.entries(aiModels).forEach(([model, details]) => {
                let newOption = document.createElement("ModelOption");
                newOption.text = model;
                newOption.value = JSON.stringify(details);
                elements.remoteModel.add(newOption);
            });


            let newModelOption = document.createElement("option");
            newModelOption.text = 'newModel';
            newModelOption.value = '';
            elements.remoteModel.add(newModelOption);

            elements.remoteModel.addEventListener('change', function () {
                if (this.value !== 'newModel') {
                    let selectedModel = JSON.parse(this.value);
                    elements.remoteLLMServerChatEndpoint = selectedModel.endpoint;

                } else {

                    addNewModel(aiModels);
                }

                if (window.httpService) {
                    window.httpService.updateRequestHandler();
                }
            });
        } catch (e) {
            logMessage((e), true);

        }
    }

// dynamic model addition 
    function addNewModel(aiModels) {

        try {

            // add new div with text inputs for model, compatibleEndpoint, contextWindow
            let newModelDiv = document.createElement("div");
            newModelDiv.innerHTML = `
                  <input id="newModelName" placeholder="Model name">
                  <input id="newModelEndpoint" placeholder="Compatible endpoint">
                  <input id="newModelContextWindow" placeholder="Context window">
                  <button id="newModelAddButton">OK</button>`;

            document.body.appendChild(newModelDiv);

            document.getElementById('newModelAddButton').addEventListener('click', function () {
                let newModelName = document.getElementById('newModelName').value;

                // If a model with the same name already exists, alert the user and return early
                if (aiModels.hasOwnProperty(newModelName)) {
                    alert(`The model ${newModelName} already exists. Please choose a different name.`);
                    return;
                }

                let newModelEndpoint = document.getElementById('newModelEndpoint').value;
                let newModelContextWindow = parseInt(document.getElementById('newModelContextWindow').value, 10);


                // Add new model details to AIModels
                aiModels[newModelName] = {
                    model: newModelName,
                    compatibleEndpoint: newModelEndpoint,
                    contextWindow: newModelContextWindow
                };

                // Add new model to dropdown
                let newOption = document.createElement("option");
                newOption.text = newModelName;
                newOption.value = JSON.stringify(aiModels[newModelName]);
                elements.remoteModel.add(newOption);
                elements.remoteModel.value = newOption.value;
                let event = new Event('change');
                elements.remoteModel.dispatchEvent(event);
                // Remove the form inputs
                document.body.removeChild(newModelDiv);
            });
        } catch (e) {
            logMessage((e), true);

        }
    }


// handler for Azure option

    let AzureAIModels = {
        //  Models

    };

    function handleAzure() {
        try {

            addModelOptionDropdown(AzureAIModels);
            AddApiKey(this.value)
            saveAllDataToDB();
        } catch (e) {
            logMessage((e), true);

        }
    }

// handler for AnyScale option

    let AnyScaleAIModels = {
        //  Models

    };

    function handleAnyScale() {
        try {

            addModelOptionDropdown(AnyScaleAIModels);
            AddApiKey(this.value)
            saveAllDataToDB();
        } catch (e) {
            logMessage((e), true);
        }
    }

// store API Keys

    function AddApiKey(key, override = false) {
        let apiKeyValue = elements.ApiKey && elements.ApiKey.value;
        if (!apiKeyValue || apiKeyValue.trim() === '') {
            alert('API key is empty or null');
            return;
        }
        if (ApiKeys.hasOwnProperty(key) && !override) {
            alert(`API key for ${key} already exists`);
            return;
        }
        ApiKeys[key] = apiKeyValue;
        saveDataToDb('ApiKey', ApiKeys);
    }

// Handler for Custom option , this allows us to not have to add new model or new providers
    function handleCustom() {

        elements.customFieldName.style.display = 'block';

    }

// Handler for the new provider this is used dynamically 
    function handleANewProvider() {
        const newName = elements.llmServiceElement.value;
        addNewModel(dynamicModels, newName);
        AddApiKey(this.value);
        saveAllDataToDB();
    }

    function saveAllDataToDB() {
        saveDataToDb('ApiKey', ApiKeys);
        saveDataToDb('llmServiceHandlers', llmServiceHandlers);
        saveDataToDb('Models', {
            openai: OpenAIModels,
            azure: AzureAIModels,
            anyScale: AnyScaleAIModels,
            dynamic: dynamicModels
        });
    }

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

    window.postMessage({type: 'loadDataFromDb', key: 'llmServiceHandlers'}, '*');
    window.postMessage({type: 'loadDataFromDb', key: 'Models'}, '*');
    window.postMessage({type: 'loadDataFromDb', key: 'ApiKeys'}, '*');


    window.addEventListener('message', function (event) {

        try {
            if (event.data && event.data.type === 'dataLoadedFromDb') {
                const key = event.data.key;
                const data = event.data.data;

                if (!data) {
                    logMessage(' got null data', true);
                    return;
                }

                if (key === 'llmServiceHandlers') {
                    if (data) llmServiceHandlers = {...llmServiceHandlers, ...data};
                }

                if (key === 'Models') {

                    if (key === 'Models') {
                        if (data.openai) OpenAIModels = {...OpenAIModels, ...data.openai};
                        if (data.azure) AzureAIModels = {...AzureAIModels, ...data.azure};
                        if (data.anyScale) AnyScaleAIModels = {...AnyScaleAIModels, ...data.anyScale};
                        if (data.dynamic) dynamicModels = {...dynamicModels, ...data.dynamic};
                    }
                }

                if (key === 'ApiKey') {

                    if (data) {
                        ApiKeys = {...ApiKeys, ...data};
                    }
                }
            }
        } catch (error) {
            logMessage((error), true);
        }


    });

    if (!window.httpService) {
        window.httpService = new HttpService();
    }

});