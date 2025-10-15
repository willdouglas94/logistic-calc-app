# 📦 App Calculadora Logística

Aplicativo SaaS gratuito para cálculo de tempos de operações logísticas, desenvolvido com tecnologias modernas e responsivo para todos os dispositivos.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **React Router DOM** - Navegação entre páginas
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos
- **Sonner** - Toast notifications elegantes

### Armazenamento
- **localStorage** - Armazenamento local no navegador (autenticação e dados)

### Design System
- Cores: Azul corporativo (#2563eb), Cinza neutro, Amarelo dourado (#fbbf24)
- Tema logístico com ícones de caminhões, caixas e operações
- Suporte a modo escuro
- Design responsivo e moderno

## 📱 Funcionalidades

### 1. Autenticação
- **Login** - Entre com e-mail e senha
- **Cadastro** - Crie uma conta com nome, e-mail e senha
- Dados armazenados localmente no navegador

### 2. Calculadora
- Insira o nome do fornecedor
- Insira a quantidade de paletes
- Informe a hora inicial (opcional)
- Cálculos automáticos:
  - **Descarregamento**: (paletes × 71) / 60 minutos
  - **Etiquetagem**: (paletes × 106) / 60 minutos
  - **Conferência**: (paletes × 55) / 60 minutos
  - **Guarda**: (paletes × 170) / 60 minutos
- Visualização dos tempos em horas e minutos
- Botão para salvar o cálculo

### 3. Histórico
- Lista todos os cálculos salvos
- Filtros por:
  - Nome do fornecedor
  - Data do cálculo
- Tabela detalhada com todas as etapas
- Visualização do tempo total

## 🛠️ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passo a passo

1. **Clone o repositório**
```bash
git clone [seu-repositorio]
cd logistic-calc-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

## 🌐 Deploy no Vercel

### Deploy Automático

1. **Conecte seu repositório no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório do GitHub
   - O Vercel detectará automaticamente as configurações

2. **Configurações do Projeto**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build
   - Acesse sua URL personalizada

### Deploy via CLI

```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel
```

## 📱 PWA - Instalável no Android

O app é um Progressive Web App (PWA) e pode ser instalado no Android:

1. Abra o site no Chrome/Edge no Android
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. O app será instalado como um aplicativo nativo

### Configurações PWA
- Ícones em `/public/manifest.json`
- Tema color: `#2563eb` (azul corporativo)
- Modo standalone (sem barra do navegador)
- Orientação portrait

## 🎨 Tema e Design

### Paleta de Cores
- **Primária**: `hsl(214, 84%, 38%)` - Azul corporativo
- **Secundária**: `hsl(210, 15%, 92%)` - Cinza claro
- **Acento**: `hsl(45, 100%, 51%)` - Amarelo dourado
- **Background**: `hsl(210, 20%, 98%)` - Off-white

### Modo Escuro
- Ativação automática baseada nas preferências do sistema
- Cores ajustadas para melhor contraste

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este app usa localStorage para demonstração. Para uso em produção, considere:
- Implementar backend seguro
- Usar autenticação JWT
- Criptografar dados sensíveis
- Implementar HTTPS obrigatório

## 📂 Estrutura do Projeto

```
src/
├── components/ui/      # Componentes shadcn/ui
├── pages/
│   ├── Auth.tsx       # Página de login/cadastro
│   ├── Calculator.tsx # Calculadora logística
│   └── History.tsx    # Histórico de cálculos
├── lib/
│   ├── auth.ts        # Lógica de autenticação
│   └── utils.ts       # Funções utilitárias
├── App.tsx            # Rotas principais
├── index.css          # Design system
└── main.tsx           # Entry point

public/
├── manifest.json      # Configuração PWA
└── robots.txt         # SEO

```

## 🚀 Próximos Passos (Melhorias Futuras)

- [ ] Adicionar backend (Supabase/Firebase)
- [ ] Implementar sincronização na nuvem
- [ ] Exportar relatórios em PDF
- [ ] Gráficos de análise de tempo
- [ ] Notificações push
- [ ] Integração com sistemas ERP
- [ ] Múltiplas unidades de medida
- [ ] Cálculos customizáveis por cliente

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando Lovable e tecnologias modernas.

---

Para suporte ou dúvidas, abra uma issue no repositório.
