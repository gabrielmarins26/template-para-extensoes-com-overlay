# Chrome Extension Base

Uma base genérica para desenvolvimento de extensões Chrome com overlay, sistema de abas e funcionalidades utilitárias.

## 📁 Estrutura de Arquivos

```
C:.
├── manifest.json          # Configuração da extensão
├── README.md              # Este arquivo
├── src/
│   ├── background.js      # Service Worker
│   ├── overlay.js         # Gerenciador de overlay e abas
│   └── utils.js           # Funções utilitárias
└── templates/
    ├── overlay.html       # Interface do overlay
    └── overlay.css        # Estilos do overlay
```

## 🚀 Funcionalidades Incluídas

### Overlay com Shadow DOM

- Interface modal que ocupa 90% da tela
- Isolamento via Shadow DOM para evitar conflitos de CSS
- Sistema responsivo

### Sistema de Abas

- Navegação entre diferentes seções
- Fácil adição de novas abas
- Interface intuitiva

### Utilitários Incluídos

- **TextUtils**: Análise e manipulação de texto
- **StorageUtils**: Gerenciamento de dados (localStorage + fallback)
- **DOMUtils**: Manipulação de elementos DOM
- **ValidationUtils**: Validação de dados (email, CPF, URL, etc.)
- **FormatUtils**: Formatação de dados (moeda, telefone, data, etc.)
- **GeneratorUtils**: Geração de IDs, strings, cores, números aleatórios

## 🛠️ Como Usar Esta Base

### 1. Instalação

1. Clone ou baixe os arquivos
2. Abra Chrome → Configurações → Extensões
3. Ative "Modo do desenvolvedor"
4. Clique "Carregar sem compactação"
5. Selecione a pasta da extensão

### 2. Personalização Básica

#### Alterar Domínio de Funcionamento

No `manifest.json`, modifique:

```json
"matches": ["*://seudominio.com/*"]
```

No `background.js`, modifique:

```javascript
if (tab.url.includes('seudominio.com')) {
```

#### Personalizar Nome e Descrição

No `manifest.json`:

```json
"name": "Sua Extensão",
"description": "Descrição da sua extensão"
```

### 3. Adicionando Nova Aba

#### 1. HTML (`overlay.html`)

Adicione botão na seção tabs-header:

```html
<button class="tab-btn" data-tab="nova-aba">Nova Aba</button>
```

Adicione conteúdo da aba:

```html
<div id="nova-aba-tab" class="tab-content">
  <div class="content-section">
    <h4 class="section-title">Título da Nova Aba</h4>
    <!-- Seu conteúdo aqui -->
  </div>
</div>
```

#### 2. JavaScript (`overlay.js`)

Adicione função de configuração de eventos:

```javascript
// Dentro de setupOverlayEvents
this.setupNovaAbaEvents(shadowRoot);

// Nova função
setupNovaAbaEvents: function (shadowRoot) {
  // Seus event listeners aqui
}
```

### 4. Classes CSS Disponíveis

#### Containers

- `.content-section` - Seção principal de conteúdo
- `.form-group` - Grupo de formulário

#### Formulários

- `.form-label` - Labels de formulário
- `.form-input` - Campos de texto
- `.form-textarea` - Áreas de texto
- `.form-range` - Sliders
- `.checkbox-label` - Labels de checkbox

#### Botões

- `.btn` + `.btn-primary` - Botão primário (azul)
- `.btn` + `.btn-secondary` - Botão secundário (cinza)
- `.btn` + `.btn-success` - Botão de sucesso (verde)
- `.btn` + `.btn-warning` - Botão de aviso (laranja)
- `.btn` + `.btn-danger` - Botão de perigo (vermelho)
- `.btn` + `.btn-info` - Botão informativo (azul claro)

#### Feedback

- `.feedback` - Container de feedback
- `.feedback.show` - Mostra feedback
- `.feedback.error` - Feedback de erro
- `.feedback.warning` - Feedback de aviso
- `.feedback.info` - Feedback informativo

### 5. Usando os Utilitários

#### Análise de Texto

```javascript
const stats = window.TextUtils.analyzeText("Seu texto aqui");
console.log(stats.words); // Número de palavras
```

#### Storage de Dados

```javascript
// Salvar
window.StorageUtils.save("chave", { dados: "valor" });

// Carregar
const dados = window.StorageUtils.load("chave", valorPadrao);
```

#### Validações

```javascript
if (window.ValidationUtils.isValidEmail(email)) {
  // Email válido
}

if (window.ValidationUtils.isValidCPF(cpf)) {
  // CPF válido
}
```

#### Formatação

```javascript
const moeda = window.FormatUtils.formatCurrency(1500.5); // R$ 1.500,50
const cpf = window.FormatUtils.formatCPF("12345678901"); // 123.456.789-01
```

#### Geradores

```javascript
const id = window.GeneratorUtils.generateId("usuario"); // usuario_1234567890_abc123def
const cor = window.GeneratorUtils.generateRandomColor(); // #ff5733
```

## 🎨 Personalização Visual

### Cores Principais

Modifique no `overlay.css`:

```css
:root {
  --primary-color: #2196f3;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --danger-color: #f44336;
}
```

### Tamanho do Overlay

Modifique no CSS:

```css
.overlay-container {
  top: 5%; /* Margem superior */
  left: 5%; /* Margem esquerda */
  width: 90%; /* Largura */
  height: 90%; /* Altura */
}
```

## 📱 Responsividade

A base inclui breakpoints para dispositivos móveis:

- Tablets: Ajustes de espaçamento
- Mobile: Layout vertical para botões, abas flexíveis

## 🔧 Dicas de Desenvolvimento

### Debug

Use o console do Chrome para debugar:

```javascript
console.log("Extension Base initialized");
```

### Recarregar Extensão

Após mudanças, vá em Chrome → Extensões → Recarregar

### Shadow DOM

Todos os elementos estão isolados no Shadow DOM. Para acessar:

```javascript
const container = document.getElementById("extension-overlay");
const shadowRoot = container.shadowRoot;
const elemento = shadowRoot.querySelector(".sua-classe");
```

### Performance

- Evite operações pesadas no overlay
- Use debounce para eventos frequentes
- Minimize manipulações DOM

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique a documentação
2. Teste em modo de desenvolvimento
3. Use o console do Chrome para debug
4. Abra uma issue no repositório

---

**Estrutura criada para facilitar o desenvolvimento de extensões Chrome funcionais e organizadas.** 🚀
