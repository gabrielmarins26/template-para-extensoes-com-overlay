// Overlay.js - Gerencia o overlay básico
window.OverlayManager = {
  overlayVisible: false,

  // Inicializa a extensão
  init: function () {
    console.log("Overlay initialized");
    this.setupMessageListener();
  },

  // Escuta mensagens do background script
  setupMessageListener: function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "toggle_overlay") {
        this.toggleOverlay();
        sendResponse({ success: true });
      }
    });
  },

  // Mostra/esconde o overlay
  toggleOverlay: function () {
    if (this.overlayVisible) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  },

  // Cria e mostra o overlay
  showOverlay: async function () {
    if (document.getElementById("extension-overlay")) {
      document.getElementById("extension-overlay").style.display = "block";
      this.overlayVisible = true;
      return;
    }

    try {
      // Cria o container principal
      const container = document.createElement("div");
      container.id = "extension-overlay";

      // Cria Shadow DOM
      const shadowRoot = container.attachShadow({ mode: "open" });

      // Carrega HTML e CSS
      const [htmlContent, cssContent] = await Promise.all([
        this.loadOverlayHTML(),
        this.loadOverlayCSS(),
      ]);

      // Injeta CSS e HTML no Shadow DOM
      shadowRoot.innerHTML = `
        <style>${cssContent}</style>
        ${htmlContent}
      `;

      // Adiciona ao body
      document.body.appendChild(container);

      // Configura eventos
      this.setupOverlayEvents(shadowRoot);

      this.overlayVisible = true;
      console.log("Overlay criado e exibido");
    } catch (error) {
      console.error("Erro ao criar overlay:", error);
    }
  },

  // Esconde o overlay
  hideOverlay: function () {
    const overlay = document.getElementById("extension-overlay");
    if (overlay) {
      overlay.style.display = "none";
      this.overlayVisible = false;
    }
  },

  // Carrega o HTML do overlay
  loadOverlayHTML: async function () {
    const htmlFilePath = chrome.runtime.getURL("templates/overlay.html");
    const response = await fetch(htmlFilePath);
    const fullHTML = await response.text();

    // Extrai apenas o conteúdo do body
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullHTML, "text/html");
    return doc.body.innerHTML;
  },

  // Carrega o CSS do overlay
  loadOverlayCSS: async function () {
    const cssFilePath = chrome.runtime.getURL("templates/overlay.css");
    const response = await fetch(cssFilePath);
    return await response.text();
  },

  // Reload da extensão
  handleUpdate: function () {
    this.showFeedback("Recarregando...", null, "info");

    let reloadConfirmation = confirm(
      "Tem certeza que deseja recarregar a extensão e a página?"
    );

    if (reloadConfirmation) {
      chrome.runtime.sendMessage({ action: "reload_extension" });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  },

  // Configura eventos do overlay
  setupOverlayEvents: function (shadowRoot) {
    if (!shadowRoot) return;

    // Configura sistema de abas
    this.setupTabSystem(shadowRoot);

    // Botão fechar
    const closeBtn = shadowRoot.querySelector("#close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hideOverlay());
    }

    const updateBtn = shadowRoot.querySelector("#update-btn");
    if (updateBtn) {
      updateBtn.addEventListener("click", () => this.handleUpdate());
    }
  },

  // Configura sistema de abas
  setupTabSystem: function (shadowRoot) {
    const tabButtons = shadowRoot.querySelectorAll(".tab-btn");
    const tabContents = shadowRoot.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const targetTab = e.target.getAttribute("data-tab");

        // Remove active de todos os botões e conteúdos
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Adiciona active ao botão clicado
        e.target.classList.add("active");

        // Mostra o conteúdo correspondente
        const targetContent = shadowRoot.querySelector(`#${targetTab}-tab`);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      });
    });
  },

  // Mostra feedback
  showFeedback: function (message, shadowRoot, type = "success") {
    if (!shadowRoot) {
      const container = document.getElementById("extension-overlay");
      shadowRoot = container ? container.shadowRoot : null;
    }

    if (!shadowRoot) return;

    const feedback = shadowRoot.querySelector("#feedback");
    if (feedback) {
      feedback.textContent = message;
      feedback.className = `feedback show ${type}`;

      setTimeout(() => {
        feedback.classList.remove("show");
      }, 3000);
    }
  },
};

// Inicializa quando a página carrega
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.OverlayManager.init();
  });
} else {
  window.OverlayManager.init();
}
