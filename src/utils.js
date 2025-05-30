// Utils.js - Funções utilitárias para o Banco de Textos
window.StorageUtils = {
  // Salva dados no localStorage com prefixo por email
  save: function (key, data, email) {
    try {
      const fullKey = email ? `extension_${key}_${email}` : `extension_${key}`;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(fullKey, JSON.stringify(data));
      } else {
        // Fallback para variável em memória
        if (!window._extensionStorage) {
          window._extensionStorage = {};
        }
        window._extensionStorage[fullKey] = JSON.stringify(data);
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  },

  // Carrega dados do localStorage com prefixo por email
  load: function (key, email, defaultValue = null) {
    try {
      const fullKey = email ? `extension_${key}_${email}` : `extension_${key}`;
      let data = null;

      if (typeof localStorage !== 'undefined') {
        data = localStorage.getItem(fullKey);
      } else {
        // Fallback para variável em memória
        if (window._extensionStorage && window._extensionStorage[fullKey]) {
          data = window._extensionStorage[fullKey];
        }
      }

      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return defaultValue;
    }
  },

  // Remove dados do storage
  remove: function (key, email) {
    try {
      const fullKey = email ? `extension_${key}_${email}` : `extension_${key}`;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(fullKey);
      } else {
        // Fallback para variável em memória
        if (window._extensionStorage) {
          delete window._extensionStorage[fullKey];
        }
      }
      return true;
    } catch (error) {
      console.error('Erro ao remover dados:', error);
      return false;
    }
  }
};

window.GeneratorUtils = {
  // Gera ID único
  generateId: function (prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Formata data brasileira
  formatDate: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  }
};