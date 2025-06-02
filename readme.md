# Chrome Overlay Base

Uma base simples para extensões Chrome com overlay e sistema de abas.

## 📁 Estrutura de Arquivos

```
.
├── manifest.json          # Configuração da extensão
├── README.md              # Este arquivo
├── src/
│   ├── background.js      # Service Worker (toggle e update)
│   └── overlay.js         # Gerenciador do overlay e abas
└── templates/
    ├── overlay.html       # Interface do overlay (header, abas e feedback)
    └── overlay.css        # Estilos básicos do overlay e abas
```

## 🚀 Funcionalidades

- Overlay modal com Shadow DOM
- Header com título, botão de atualizar e fechar
- Sistema de abas simples (2 abas de exemplo)
- Área de feedback para mensagens rápidas

## 🛠️ Como Usar

1. **Instale a extensão no Chrome:**

   - Baixe ou clone este repositório
   - Acesse `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação" e selecione a pasta do projeto

2. **Personalize:**

   - Edite `overlay.html` para mudar o conteúdo das abas
   - Edite `overlay.css` para alterar o visual
   - Edite `manifest.json` para mudar nome, descrição ou domínios permitidos

3. **Atalho de teclado:**
   - Configure um atalho em `chrome://extensions/shortcuts` para abrir/fechar o overlay

## ✂️ O que foi removido nesta versão

- Utilitários de texto, storage, validação, formatação, etc.
- Lógica de gerenciamento de textos, configurações e logs
- Responsividade avançada e estilos complexos

## 💡 Dicas

- Para adicionar novas abas, basta replicar o botão e o conteúdo no HTML seguindo o padrão existente.
- O CSS está enxuto, focado apenas no overlay e abas. Adicione seus próprios estilos conforme necessário.
