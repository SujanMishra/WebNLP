document.addEventListener('DOMContentLoaded', function () {
    const elements = {
        llmStatusIcon: document.querySelector('#LlmServerStatusIcon'),
        updateButton: document.querySelector('#UpdateButton'),
        saveSettingButton: document.querySelector('#SaveSettingButton'),
        loadSettingButton: document.querySelector('#LoadSettingButton'),
    };

    const autoSavedElements = {
        llmServerInput: document.querySelector('.llm-input#CustomLLMServerInput'),
        llmChatEndpointInput: document.querySelector('#CustomLLMChatEndpointInput'),
        llmUpdateEndpointInput: document.querySelector('#CustomLLMUpdateEndpointInput'),
        llmModelInput: document.querySelector('#CustomLLMModelInput'),
    };

    let settingsValue = {

        llmServer: autoSavedElements.llmServerInput.value,
        llmChatEndpoint: autoSavedElements.llmChatEndpointInput.value,
        llmUpdateEndpoint: autoSavedElements.llmUpdateEndpointInput.value,
        llmModel: autoSavedElements.llmModelInput.value,
    };


    let db;

    elements.saveSettingButton.addEventListener('click', saveSettings);
    elements.loadSettingButton.addEventListener('click', loadSettings);
    elements.updateButton.addEventListener('click', updateModels);

    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'logMessage') {
            const message = event.data.message;
            const isError = event.data.isError || false;
            logMessage(message, isError);
        } else if (event.data && event.data.type === 'saveDataToDb') {
            const key = event.data.key;
            const data = event.data.data;
            saveDataToDb(key, data).then(r => {

            });
        } else if (event.data && event.data.type === 'updateTopicName') {
            const id = event.data.id; // Assuming the ID is directly in the event data
            const newName = event.data.newName; // Assuming the new name is also provided directly
            const topics =event.data.topics;
            updateTopicNameInApp(id, newName,topics);
        } else if (event.data && event.data.type === 'setupAutoSave') {
            const data = event.data.data;
            const key = event.data.key;
            const valuesToUpdate = event.data.valuesToUpdate;
            setupAutoSave(data, valuesToUpdate, key);
        } else if (event.data && event.data.type === 'loadDataFromDb') {
            const key = event.data.key;
            loadDataFromDb(key).then((data) => {
                // Sending back data to the caller tab through postMessage
                window.postMessage({type: 'dataLoadedFromDb', key: key, data: data}, '*');
            }).catch((error) => {
                logMessage(`Error loading data from DB: ${error}`, true);
            });
        }
    });

    // Open database
    let request = window.indexedDB.open("data", 1);

    request.onsuccess = async function (event) {
        db = event.target.result;

        // Load settings now that the db is ready
        try {
            await loadDataFromDb('settings', autoSavedElements);
            await setupAutoSave(autoSavedElements, settingsValue, 'settings');
        } catch (err) {
            logMessage('Error loading settings: ' + err.message, true);
        }
    };

    request.onerror = function (event) {
        logMessage('Error opening database: ' + event.target.error, true);
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        db.createObjectStore("data");
    };

    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function () {
            // Get the closest settingsContent for the current toggle
            const settingsContent = this.closest('.llm-settings').querySelector('.settings-content');

            // Prevent turning off the current switch
            if (!this.checked) {
                this.checked = true;
                return; // Do not hide the settingsContent in this case
            }

            // Turn off all other toggles and hide their settingsContent
            document.querySelectorAll('.switch input').forEach(otherToggle => {
                if (otherToggle !== this) {
                    otherToggle.checked = false;
                    const otherSettingsContent = otherToggle.closest('.llm-settings').querySelector('.settings-content');
                    otherSettingsContent.style.display = 'none';
                }
            });

            // Show the settingsContent for the current toggle
            settingsContent.style.display = 'block';

            if (window.httpService) {
                window.httpService.updateRequestHandler();
            }
        });
    });

// Initial state setup
    window.addEventListener('load', () => {
        document.querySelectorAll('.switch input').forEach(toggle => {
            const settingsContent = toggle.closest('.llm-settings').querySelector('.settings-content');
            settingsContent.style.display = toggle.checked ? 'block' : 'none';
        });
    });

    function updateTopicNameInApp(id, newName,topics) {
        // Find the topic by ID
        const topicIndex = topics.findIndex(topic => topic.id === id);
        if (topicIndex !== -1) {
            // Update the topic's name
            topics[topicIndex].name = newName;

            // Optionally, save the updated topics list to the database
            saveDataToDb('topics', topics).then(() => {
                console.log('Topic name updated successfully');
            }).catch(error => {
                console.error('Failed to update topic name in DB', error);
            });

        } else {
            console.error('Topic not found for ID:', id);
        }
    }

    async function saveSettings() {
        const missingFields = Object.keys(settingsValue).filter(key => {
            return settingsValue[key] === null || settingsValue[key] === '';
        });

        if (missingFields.length > 0) {
            logMessage('Please fill in the following fields before saving settings:\n' + missingFields.join('\n'), true);
            return;
        }

        try {
            // Export the settings from the database
            const settingsFromDb = await loadDataFromDb('settings', autoSavedElements);

            // Wrap settings in an array and attach the key
            const exportData = [{
                key: 'settings',
                value: settingsFromDb
            }];

            // Use the downloads API instead of the File System Access API
            if (chrome && chrome.downloads) {
                const blob = new Blob([JSON.stringify(exportData)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);

                chrome.downloads.download({
                    url: url,
                    filename: 'settings.json', // suggest a file name
                    saveAs: true // this will prompt the user where to save the file
                }, () => {
                    URL.revokeObjectURL(url);
                });
            } else {
                // Fallback: Save the settings using the File API
                const blob = new Blob([JSON.stringify(exportData)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'settings.json';
                a.click();
                URL.revokeObjectURL(url);
            }

            logMessage('Settings saved and exported successfully.', false);
        } catch (err) {
            logMessage('Error saving settings: ' + err.message, true);
        }
    }


    function setupAutoSave(elements, settingsValue, key) {
        const values = {};

        // Load data from IndexedDB on page load
        const transaction = db.transaction(['data'], 'readonly');
        const objectStore = transaction.objectStore('data');
        const request = objectStore.get(key);

        request.onsuccess = function (e) {
            if (request.result) {
                const data = request.result; // Retrieve the stored data directly
                Object.assign(values, data);
                updateInputValues(elements, data);
                Object.assign(settingsValue, data);
                logMessage(`Data loaded successfully under key: ${key}. Data: ${JSON.stringify(data, null, 2)}`, false);
            } else {
                logMessage(`No data saved under key: ${key}.`, false);
            }
        };

        request.onerror = function (e) {
            logMessage(`Error loading data from key: ${key}. Error: ${e.target.error}`, true);
        };

        // Add event listeners to save all values together when any input changes
        Object.entries(elements).forEach(([name, inputElement]) => {
            if (inputElement instanceof HTMLInputElement) {
                inputElement.addEventListener('input', () => {
                    values[name.replace('Input', '')] = inputElement.value; // Update the value in the values object
                    settingsValue[name.replace('Input', '')] = inputElement.value; // Update the corresponding property in settingsValue
                    saveDataToDb(key, values).then(r => {

                    }); // Save all values together
                    logMessage(`Value saved successfully. Field: ${name}, Value: ${inputElement.value}`, false);
                });
            }
        });

        // Save all values together on page unload
        window.addEventListener('beforeunload', () => {
            saveDataToDb(key, values).then(r => {

            });
        });
    }

    function updateInputValues(elements, data) {
        Object.entries(elements).forEach(([name, inputElement]) => {
            if (inputElement instanceof HTMLInputElement) {
                inputElement.value = data[name.replace('Input', '')] || '';
            }
        });
    }


    function saveDataToDb(key, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readwrite');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.put(data, key);

            request.onsuccess = async function (e) {
                logMessage(`Data saved successfully under key: ${key}. Data: ${JSON.stringify(data, null, 2)}`, false);
                await logAllDataFromDb();
                resolve();
            };

            request.onerror = function (e) {
                logMessage(`Error saving data under key: ${key}. Error: ${e.target.error}`, true);
                reject(`Error saving data under key: ${key}. Error: ${e.target.error}`);
            };
        });
    }

    async function logAllDataFromDb() {
        const transaction = db.transaction(['data'], 'readonly');
        const objectStore = transaction.objectStore('data');
        const request = objectStore.getAll();

        request.onsuccess = function (e) {
            const data = e.target.result;
            logMessage(`Data in IndexedDB: ${JSON.stringify(data, null, 2)}`, false);
        };

        request.onerror = function (e) {
            logMessage('Error retrieving data from IndexedDB.', true);
        };
    }

    async function loadDataFromDb(key, autoSavedElements) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readonly');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.get(key);

            request.onsuccess = function (e) {
                if (request.result) {
                    const data = request.result; // Retrieve the stored data directly

                    // Update the corresponding input elements
                    for (const prop in data) {
                        if (autoSavedElements.hasOwnProperty(prop + 'Input')) {
                            autoSavedElements[prop + 'Input'].value = data[prop];
                        }
                    }

                    logMessage(`Data loaded successfully under key: ${key}. Data: ${JSON.stringify(data, null, 2)}`, false);
                    resolve(data);
                } else {
                    logMessage(`No data saved under key: ${key}.`, false);
                    resolve();
                }
            };

            request.onerror = function (e) {
                logMessage(`Error loading data from key: ${key}. Error: ${e.target.error}`, true);
                reject(`Error loading data from key: ${key}. Error: ${e.target.error}`);
            };
        });
    }

    async function loadSettings() {
        try {
            await importDataFromFile();
            await loadDataFromDb('settings', autoSavedElements);
        } catch (err) {
            logMessage('Error loading settings: ' + err.message, true);
        }
    }

    async function importDataFromFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';

            input.addEventListener('change', function (evt) {
                const file = evt.target.files[0];
                if (!file) {
                    logMessage('No file selected', true);
                    reject('No file selected');
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function (e) {
                    try {
                        const contents = e.target.result;
                        const data = JSON.parse(contents);

                        if (!Array.isArray(data)) {
                            logMessage('Imported data is not an array.', true);
                            reject('Imported data is not an array.');
                            return;
                        }

                        const transaction = db.transaction(['data'], 'readwrite');
                        const objectStore = transaction.objectStore('data');

                        const clearRequest = objectStore.clear();
                        clearRequest.onsuccess = function () {
                            for (const item of data) {
                                if (!('key' in item) || !('value' in item)) {
                                    logMessage('An item in the imported data does not have a key or value.', true);
                                    continue; // Skip this item and go to the next one
                                }

                                const request = objectStore.put(item.value, item.key);

                                request.onerror = function (e) {
                                    logMessage(`Error saving data under key: ${item.key}. Error: ${e.target.error}`, true);
                                };
                            }

                            transaction.oncomplete = function () {
                                logMessage('Data imported successfully.', false);
                                resolve();
                            };

                            transaction.onerror = function (e) {
                                logMessage('Error importing data: ' + e.target.error, true);
                                reject('Error importing data: ' + e.target.error);
                            };
                        };

                        clearRequest.onerror = function (e) {
                            logMessage('Error clearing object store: ' + e.target.error, true);
                            reject('Error clearing object store: ' + e.target.error);
                        };
                    } catch (err) {
                        logMessage('Error reading file: ' + err.message, true);
                        reject('Error reading file: ' + err.message);
                    }
                };

                reader.onerror = function () {
                    logMessage('Error reading file: ' + reader.error, true);
                    reject('Error reading file: ' + reader.error);
                };

                reader.readAsText(file);
            });

            input.click();
        });
    }

    function updateModels() {
        const llmModel = elements.llmModelInput.value;

        // Send requests  to llmUpdateEndpointInput
        const llmServer = elements.llmServerInput.value;

        const llmUpdateEndpoint = elements.llmUpdateEndpointInput.value;


        const llmUpdateRequest = llmServer && llmUpdateEndpoint ?
            fetch(llmUpdateEndpoint, {
                method: 'POST',
                body: JSON.stringify({llmModel}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }) : Promise.resolve();

        Promise.all([llmUpdateRequest])
            .then(responses => {
                const llmUpdateResponse = responses[1];

                const llmUpdateSuccess = llmUpdateResponse && llmUpdateResponse.ok;

                if (llmUpdateSuccess) {
                    logMessage('Models updated successfully!', false);
                } else {
                    logMessage('Failed to update models.', true);
                }
            })
            .catch(error => {
                logMessage('Error updating models: ' + error.message, true);
            });
    }


});
