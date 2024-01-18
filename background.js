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
