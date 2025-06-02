chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reload_extension") {
    chrome.runtime.reload();
    return true;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggle_overlay" });
});
