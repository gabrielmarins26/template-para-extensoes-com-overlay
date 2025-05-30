chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('www.google.com')) {
    chrome.tabs.sendMessage(tab.id, {
      action: "toggle_overlay"
    });
  } else {
    console.log('Extensão só funciona no domínio configurado');
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reload_extension") {
    chrome.runtime.reload();
  }
  else if (message.action === "get_user_email") {
    chrome.identity.getProfileUserInfo((userInfo) => {
      sendResponse({ email: userInfo.email || 'user@local.com' });
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }
});