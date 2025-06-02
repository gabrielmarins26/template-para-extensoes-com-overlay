# Template para Extensões Chrome com Overlay

Este é um template base para desenvolvimento de extensões Chrome que inclui um sistema de overlay com abas. O template fornece uma estrutura pronta para uso, permitindo que você foque no desenvolvimento das funcionalidades específicas da sua extensão.

## Funcionalidades

- **Sistema de Overlay**: Interface flutuante que pode ser aberta/fechada em qualquer página
- **Sistema de Abas**: Organização do conteúdo em abas para melhor navegação
- **Feedback Visual**: Sistema de notificações para feedback ao usuário
- **Atualização**: Botão para recarregar a extensão e a página atual

## Como Usar

1. **Instalação**

   - Clone este repositório
   - Abra o Chrome e vá para `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação" e selecione a pasta do projeto

2. **Personalização**

   - Modifique o arquivo `manifest.json` para ajustar as permissões e URLs onde a extensão funcionará
   - Edite `templates/overlay.html` para personalizar a interface do overlay
   - Ajuste `templates/overlay.css` para modificar o estilo visual
   - Implemente suas funcionalidades em `src/overlay.js`

3. **Estrutura de Arquivos**
   - `src/overlay.js`: Gerencia o overlay e suas funcionalidades
   - `src/background.js`: Script de background da extensão
   - `templates/overlay.html`: Template HTML do overlay
   - `templates/overlay.css`: Estilos do overlay
   - `manifest.json`: Configurações da extensão

## Desenvolvimento

### Sistema de Abas

O template inclui um sistema de abas pronto para uso. Para adicionar novas abas:

1. Adicione o botão da aba em `templates/overlay.html`:

```html
<button class="tab-btn" data-tab="novaAba">Nova Aba</button>
```

2. Adicione o conteúdo da aba:

```html
<div class="tab-content" id="novaAba-tab">
  <h2>Conteúdo da Nova Aba</h2>
  <p>Seu conteúdo aqui</p>
</div>
```

### Feedback ao Usuário

Para mostrar mensagens de feedback:

```javascript
window.OverlayManager.showFeedback("Sua mensagem", shadowRoot, "success");
```

Tipos de feedback disponíveis: "success", "error", "info"

### Atualização

O template inclui um botão de atualização que permite recarregar a extensão e a página atual. Use-o durante o desenvolvimento para testar alterações.
