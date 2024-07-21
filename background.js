chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // if (changeInfo.status === 'complete' && tab.active && !tab.url.startsWith('chrome://')) {
    //     chrome.scripting.executeScript({
    //         target: { tabId: tabId },
    //         files: ['content.js']
    //     });
    // }
});