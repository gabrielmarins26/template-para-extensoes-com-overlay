// Overlay.js - Gerencia o banco de textos
window.OverlayManager = {
  overlayVisible: false,
  currentTextId: null,

  // Inicializa a extensão
  init: function () {
    console.log("Banco de Textos initialized");
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

      // Carrega dados iniciais
      this.loadInitialData(shadowRoot);

      this.overlayVisible = true;
      console.log("Overlay do Banco de Textos criado e exibido");
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

  // Carrega dados iniciais
  loadInitialData: function (shadowRoot) {
    this.loadTexts(shadowRoot);
    this.loadSettings(shadowRoot);
    this.updateUserEmailDisplay(shadowRoot);
  },

  // Atualiza exibição do email do usuário
  updateUserEmailDisplay: function (shadowRoot) {
    const emailInput = shadowRoot.querySelector("#user-email");
    if (emailInput && this.currentUserEmail) {
      emailInput.value = this.currentUserEmail;
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

    // Eventos da aba de textos
    this.setupTextsTabEvents(shadowRoot);

    // Eventos da aba configurações
    this.setupSettingsTabEvents(shadowRoot);
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

        // Carrega logs se necessário
        if (targetTab === "settings") {
          this.updateLogsDisplay(shadowRoot);
        }
      });
    });
  },

  // Eventos da aba de textos
  setupTextsTabEvents: function (shadowRoot) {
    const textSelect = shadowRoot.querySelector("#text-select");
    const saveBtn = shadowRoot.querySelector("#save-text-btn");
    const deleteBtn = shadowRoot.querySelector("#delete-text-btn");
    const clearBtn = shadowRoot.querySelector("#clear-form-btn");

    if (textSelect) {
      textSelect.addEventListener("change", (e) => {
        this.loadSelectedText(e.target.value, shadowRoot);
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        this.saveText(shadowRoot);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        this.deleteText(shadowRoot);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearForm(shadowRoot);
      });
    }
  },

  // Eventos da aba configurações
  setupSettingsTabEvents: function (shadowRoot) {
    const saveSettingsBtn = shadowRoot.querySelector("#save-settings-btn");
    const clearLogsBtn = shadowRoot.querySelector("#clear-logs-btn");
    const storeLogsCheckbox = shadowRoot.querySelector("#store-logs-checkbox");

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", () => {
        this.saveSettings(shadowRoot);
      });
    }

    if (clearLogsBtn) {
      clearLogsBtn.addEventListener("click", () => {
        this.clearLogs(shadowRoot);
      });
    }

    if (storeLogsCheckbox) {
      storeLogsCheckbox.addEventListener("change", () => {
        this.updateLogsDisplay(shadowRoot);
      });
    }
  },

  // Carrega textos do storage
  loadTexts: function (shadowRoot) {
    const texts = window.StorageUtils.load("texts", this.currentUserEmail, []);
    this.updateTextSelect(texts, shadowRoot);
  },

  // Atualiza o select com os textos
  updateTextSelect: function (texts, shadowRoot) {
    const textSelect = shadowRoot.querySelector("#text-select");
    if (!textSelect) return;

    // Limpa options existentes
    textSelect.innerHTML =
      '<option value="">Selecione um texto ou crie novo</option>';

    // Adiciona options dos textos
    texts.forEach((text) => {
      const option = document.createElement("option");
      option.value = text.id;
      option.textContent = text.title;
      textSelect.appendChild(option);
    });
  },

  // Carrega texto selecionado
  loadSelectedText: function (textId, shadowRoot) {
    if (!textId) {
      this.clearForm(shadowRoot);
      return;
    }

    const texts = window.StorageUtils.load("texts", this.currentUserEmail, []);
    const selectedText = texts.find((text) => text.id === textId);

    if (selectedText) {
      const titleInput = shadowRoot.querySelector("#text-title");
      const contentTextarea = shadowRoot.querySelector("#text-content");

      if (titleInput) titleInput.value = selectedText.title;
      if (contentTextarea) contentTextarea.value = selectedText.content;

      this.currentTextId = textId;
    }
  },

  // Salva texto
  saveText: function (shadowRoot) {
    const titleInput = shadowRoot.querySelector("#text-title");
    const contentTextarea = shadowRoot.querySelector("#text-content");

    if (!titleInput || !contentTextarea) return;

    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();

    if (!title) {
      this.showFeedback("Digite um título para o texto", shadowRoot, "warning");
      return;
    }

    if (!content) {
      this.showFeedback("Digite o conteúdo do texto", shadowRoot, "warning");
      return;
    }

    const texts = window.StorageUtils.load("texts", this.currentUserEmail, []);
    const now = new Date().toISOString();

    if (this.currentTextId) {
      // Atualiza texto existente
      const textIndex = texts.findIndex(
        (text) => text.id === this.currentTextId
      );
      if (textIndex !== -1) {
        texts[textIndex].title = title;
        texts[textIndex].content = content;
        texts[textIndex].updated = now;
      }
    } else {
      // Cria novo texto
      const newText = {
        id: window.GeneratorUtils.generateId("text"),
        title: title,
        content: content,
        created: now,
        updated: now,
      };
      texts.push(newText);
      this.currentTextId = newText.id;
    }

    // Salva no storage
    window.StorageUtils.save("texts", texts, this.currentUserEmail);

    // Atualiza interface
    this.updateTextSelect(texts, shadowRoot);

    // Seleciona o texto atual no select
    const textSelect = shadowRoot.querySelector("#text-select");
    if (textSelect) {
      textSelect.value = this.currentTextId;
    }

    // Registra log
    this.logAction("save", title, shadowRoot);

    this.showFeedback("Texto salvo com sucesso!", shadowRoot, "success");
  },

  // Apaga texto
  deleteText: function (shadowRoot) {
    if (!this.currentTextId) {
      this.showFeedback(
        "Selecione um texto para apagar",
        shadowRoot,
        "warning"
      );
      return;
    }

    if (!confirm("Tem certeza que deseja apagar este texto?")) {
      return;
    }

    const texts = window.StorageUtils.load("texts", this.currentUserEmail, []);
    const textToDelete = texts.find((text) => text.id === this.currentTextId);

    if (!textToDelete) {
      this.showFeedback("Texto não encontrado", shadowRoot, "error");
      return;
    }

    // Remove o texto
    const filteredTexts = texts.filter(
      (text) => text.id !== this.currentTextId
    );

    // Salva no storage
    window.StorageUtils.save("texts", filteredTexts, this.currentUserEmail);

    // Registra log
    this.logAction("delete", textToDelete.title, shadowRoot);

    // Limpa formulário e atualiza interface
    this.clearForm(shadowRoot);
    this.updateTextSelect(filteredTexts, shadowRoot);

    this.showFeedback("Texto apagado com sucesso!", shadowRoot, "success");
  },

  // Limpa formulário
  clearForm: function (shadowRoot) {
    const titleInput = shadowRoot.querySelector("#text-title");
    const contentTextarea = shadowRoot.querySelector("#text-content");
    const textSelect = shadowRoot.querySelector("#text-select");

    if (titleInput) titleInput.value = "";
    if (contentTextarea) contentTextarea.value = "";
    if (textSelect) textSelect.value = "";

    this.currentTextId = null;
  },

  // Registra ação nos logs
  logAction: function (action, textTitle, shadowRoot) {
    const settings = window.StorageUtils.load(
      "settings",
      this.currentUserEmail,
      { storeLogs: false }
    );

    if (!settings.storeLogs) return;

    const logs = window.StorageUtils.load("logs", this.currentUserEmail, []);
    const newLog = {
      id: window.GeneratorUtils.generateId("log"),
      action: action,
      textTitle: textTitle,
      timestamp: new Date().toISOString(),
      email: this.currentUserEmail,
    };

    logs.push(newLog);
    window.StorageUtils.save("logs", logs, this.currentUserEmail);

    // Atualiza exibição dos logs se estiver na aba de configurações
    this.updateLogsDisplay(shadowRoot);
  },

  // Carrega configurações
  loadSettings: function (shadowRoot) {
    const settings = window.StorageUtils.load(
      "settings",
      this.currentUserEmail,
      { storeLogs: false }
    );
    const storeLogsCheckbox = shadowRoot.querySelector("#store-logs-checkbox");

    if (storeLogsCheckbox) {
      storeLogsCheckbox.checked = settings.storeLogs;
    }

    this.updateLogsDisplay(shadowRoot);
  },

  // Salva configurações
  saveSettings: function (shadowRoot) {
    const storeLogsCheckbox = shadowRoot.querySelector("#store-logs-checkbox");

    const settings = {
      storeLogs: storeLogsCheckbox ? storeLogsCheckbox.checked : false,
    };

    window.StorageUtils.save("settings", settings, this.currentUserEmail);
    this.updateLogsDisplay(shadowRoot);

    this.showFeedback("Configurações salvas!", shadowRoot, "success");
  },

  // Atualiza exibição dos logs
  updateLogsDisplay: function (shadowRoot) {
    const settings = window.StorageUtils.load(
      "settings",
      this.currentUserEmail,
      { storeLogs: false }
    );
    const logsSection = shadowRoot.querySelector("#logs-section");
    const logsDisplay = shadowRoot.querySelector("#logs-display");

    if (!logsSection || !logsDisplay) return;

    if (settings.storeLogs) {
      logsSection.style.display = "block";

      const logs = window.StorageUtils.load("logs", this.currentUserEmail, []);

      if (logs.length === 0) {
        logsDisplay.textContent = "Nenhum log registrado ainda.";
      } else {
        // Ordena logs por data (mais recente primeiro)
        const sortedLogs = logs.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        logsDisplay.textContent = sortedLogs
          .map(
            (log) =>
              `${window.GeneratorUtils.formatDate(
                log.timestamp
              )} - ${log.action.toUpperCase()}: "${log.textTitle}"`
          )
          .join("\n");
      }
    } else {
      logsSection.style.display = "none";
    }
  },

  // Limpa logs
  clearLogs: function (shadowRoot) {
    if (!confirm("Tem certeza que deseja limpar todos os logs?")) {
      return;
    }

    window.StorageUtils.save("logs", [], this.currentUserEmail);
    this.updateLogsDisplay(shadowRoot);

    this.showFeedback("Logs limpos!", shadowRoot, "info");
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
