# 🌿 LimpAção - Aplicação Web de Reportagem de Poluição

Uma plataforma colaborativa para moradores de Florianópolis reportarem áreas poluídas e priorizar limpezas. Estruturada com **Atomic Design Pattern**.

## 👥 Integrantes

- **Lucas Cinigalia**
- **Glauberty Ribeiro**

---

## 📋 Sobre o Projeto

LimpAção é um sistema web que permite que a comunidade de Florianópolis reporte áreas com acúmulo de lixo, indicando urgência e localização. A prefeitura pode priorizar limpezas com base nesses reports, enquanto campanhas educativas conscientizam sobre a importância de manter a cidade limpa.

### ✨ Funcionalidades

✅ **Listar Reports** - Visualizar todos os reports de áreas poluídas  
✅ **Filtrar por Urgência** - Urgente, Média, Baixa  
✅ **Filtrar por Status** - Pendente, Em andamento, Resolvido  
✅ **Busca por Texto** - Encontrar reports por título ou localização  
✅ **Novo Report** - Formulário modal para criar novos reports  
✅ **Dados Mockados** - 6 reports de exemplo com dados realistas  
✅ **Design Responsivo** - Funciona em desktop, tablet e mobile  
✅ **Atomic Design** - Componentes reutilizáveis e bem estruturados  

---

## 🛠 Tecnologias

- **React 18** - Framework UI com Hooks
- **Vite** - Build tool rápido
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Ícones
- **Atomic Design** - Padrão de organização de componentes

---

## 📁 Estrutura do Projeto

O projeto segue a metodologia **Atomic Design** com 5 níveis:

```
src/
├── atoms/        # ⚛️ Componentes básicos (Button, Input, Badge)
├── molecules/    # 🧬 Combinações de atoms (SearchBar, Logo)
├── organisms/    # 🧪 Seções complexas (Header, Modal, Card)
├── templates/    # 📐 Layouts genéricos (MainTemplate)
├── pages/        # 📄 Páginas completas (HomePage)
├── hooks/        # 🎣 Lógica reutilizável (useReports)
├── data/         # 📊 Dados mockados (mockData.js)
├── config/       # ⚙️ Constantes e configurações
├── styles/       # 🎨 Estilos globais
└── App.jsx       # Entry point da app
```

**Leia mais:** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | [ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md)

---

## 🚀 Como Começar

### 1️⃣ Instalação

```bash
# Navegue até a pasta do projeto
cd limpacao

# Instale as dependências
npm install
```

### 2️⃣ Desenvolvimento

```bash
# Inicie o servidor com hot-reload
npm run dev
```

A aplicação abrirá automaticamente em **http://localhost:5173**

### 3️⃣ Build para Produção

```bash
# Compile para produção
npm run build

# Visualize o build localmente
npm run preview
```

**Leia mais:** [QUICKSTART.md](./QUICKSTART.md)

---

## 📊 Dados Mockados

A aplicação inclui 6 reports de exemplo com informações realistas:

| ID | Título | Localização | Urgência | Status | Votos |
|---|---|---|---|---|---|
| 1 | Lixo na Praia da Armação | Praia da Armação | 🔴 Alta | Pendente | 24 |
| 2 | Entulho na Lagoa do Peri | Lagoa do Peri | 🔴 Alta | Em andamento | 31 |
| 3 | Lixo na Praia Central | Lagoa da Conceição | 🟡 Média | ✅ Resolvido | 18 |
| 4 | Sacolas na Trilha | Morro da Cruz | 🟡 Média | Pendente | 12 |
| 5 | Lixo nos equipamentos | Porto da Barra | 🔴 Alta | Em andamento | 27 |
| 6 | Resíduos na Praia | Ribeirão da Ilha | 🔵 Baixa | Pendente | 8 |

---

## 🧬 Componentes do Projeto

### ⚛️ Atoms (8)
Componentes básicos e indivisíveis:
- **Button** - Botão com variantes (primary, secondary, ghost, danger)
- **Input** - Input de texto com validação
- **Badge** - Badge/tag com cores de urgência/status
- **Select** - Dropdown com label
- **Textarea** - Área de texto
- **Icon** - Wrapper de ícones Lucide
- **Heading** - Títulos h1-h6
- **Text** - Parágrafo genérico

### 🧬 Molecules (9)
Combinações funcionais de atoms:
- **SearchBar** - Input + ícone de busca
- **FilterSelect** - Select para filtros
- **StatCard** - Card com estatística
- **ButtonGroup** - Grupo de botões
- **FormField** - Input com label/validação
- **Logo** - Logo + branding
- **ReportHeader** - Urgência + Status
- **LocationField** - Localização com ícone
- **VoteSection** - Contador de votos

### 🧪 Organisms (8)
Seções completas da página:
- **Header** - Navbar com logo e botão
- **StatsPanel** - Dashboard com 3 estatísticas
- **FilterPanel** - Filtros + busca
- **ReportCard** - Card completo de report
- **Modal** - Modal genérico reutilizável
- **Footer** - Rodapé com links
- **EmptyState** - Estado vazio
- **NewReportForm** - Formulário de novo report

### 📐 Templates (1)
Layouts genéricos:
- **MainTemplate** - Template principal (Header + Main + Footer)

### 📄 Pages (1)
Páginas completas:
- **HomePage** - Página principal (composição final)

### 🎣 Hooks (1)
Lógica reutilizável:
- **useReports** - Gerenciamento de reports (estado + filtros)

---

## 💻 Como Usar os Componentes

### Importar Atoms

```jsx
import { Button, Input, Badge, Heading, Text } from '../atoms';

<Button variant="primary" size="md" onClick={handleClick}>
  Clique aqui
</Button>
```

### Importar Molecules

```jsx
import { SearchBar, Logo, ReportHeader } from '../molecules';

<SearchBar value={search} onChange={setSearch} />
```

### Importar Organisms

```jsx
import { Header, Modal, ReportCard } from '../organisms';

<Header onNewReportClick={handleClick} />
```

### Usar Hooks

```jsx
import { useReports } from '../hooks';

const { 
  filteredReports, 
  stats, 
  addReport 
} = useReports();
```

---

## 🎯 Próximos Passos

- [ ] Integração com API real (backend)
- [ ] Autenticação de usuários
- [ ] Upload de fotos reais
- [ ] Mapa interativo (Google Maps/Mapbox)
- [ ] Sistema de comentários
- [ ] Gamificação (pontos/badges)
- [ ] Testes automatizados (Vitest)
- [ ] Dark mode
- [ ] PWA (Progressive Web App)
- [ ] Notificações em tempo real

---

## 📚 Documentação

- **[ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md)** - Guia completo de Atomic Design
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Estrutura detalhada do projeto
- **[QUICKSTART.md](./QUICKSTART.md)** - Guia rápido de setup
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guia de desenvolvimento

---

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### GitHub Pages

```bash
npm run build
# Upload dist/ para gh-pages
```

### Seu servidor

```bash
npm run build
# Upload dist/ para seu servidor
```

---

## 📝 Licença

Este projeto é parte de um projeto de extensão comunitária da Senac SP.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Contato

- **Lucas Cinigalia** - lucas.cinigalia@example.com
- **Glauberty Ribeiro** - glauberty@example.com

---

## 🎉 Missão

> **"Lutar por uma Floripa mais limpa!"** 🌿

---

**Versão**: 1.0.0  
**Última atualização**: Junho 2024  
**Stack**: React + Vite + Tailwind + Atomic Design
