// Background script - Gerencia o toggle do overlay e update
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extensão instalada");
});

// Escuta mensagens do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reload_extension") {
    chrome.runtime.reload();
  } else if (message.action === "get_user_email") {
    chrome.identity.getProfileUserInfo((userInfo) => {
      sendResponse({ email: userInfo.email || "user@local.com" });
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggle_overlay" });
});
