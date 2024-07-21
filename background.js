chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});