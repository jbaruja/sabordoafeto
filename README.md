# Sabor do Afeto 🎁

Site institucional e e-commerce para presentes artesanais.

## Stack

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Shadcn/UI
- **Backend:** Supabase (PostgreSQL + Storage)
- **State Management:** Zustand
- **Deploy:** Vercel

---

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase. Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções detalhadas.

### 3. Iniciar desenvolvimento

**Modo otimizado (recomendado):**
```bash
./start-dev.sh
```

**Modo padrão:**
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Painel administrativo
│   │   ├── login/         # Autenticação
│   │   └── (dashboard)/   # Dashboard, produtos, carrinhos
│   ├── api/               # API routes
│   ├── c/[code]/          # Carrinho compartilhado
│   ├── produtos/          # Catálogo público
│   ├── sobre/             # Página institucional
│   └── contato/           # Contato
├── components/
│   ├── ui/                # Componentes Shadcn/UI
│   ├── admin/             # Componentes admin
│   ├── layout/            # Header, Footer
│   └── shared/            # Reutilizáveis
├── lib/                   # Cliente Supabase e utils
├── stores/                # Zustand stores (cartStore)
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

---

## 🎨 Design System

### Paleta de Cores
- **Primary:** Sage Verde (#7E9690)
- **Secondary:** Rose (#e2bbbe)
- **Neutral:** Snow, Cream, White
- **Text:** Escala de cinzas

### Tipografia
- **Títulos:** Cormorant Garamond (serif elegante)
- **Corpo:** Inter (sans-serif moderna)
- **Tamanhos:** 12px a 48px padronizados

### Componentes UI (Shadcn/UI)
Button, Card, Dialog, Input, Label, Select, Separator, Sheet, Textarea

---

## 📝 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
./start-dev.sh       # Modo otimizado (limpa cache, 4GB heap)
```

### Build e Deploy
```bash
npm run build        # Build de produção
npm run start        # Executar build localmente
npm run lint         # Verificar código
```

### Adicionar Componentes Shadcn/UI
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

---

## ⚡ Performance e Otimizações

O projeto está configurado com otimizações agressivas de performance:

### Next.js Config
- ✅ Compilador SWC (Rust - ultra-rápido)
- ✅ Source maps desabilitados em dev
- ✅ Cache filesystem (1 semana)
- ✅ Telemetria desabilitada
- ✅ OptimizePackageImports para libs pesadas

### Script Otimizado (`start-dev.sh`)
- Mata todos os processos Node
- Limpa caches (.next, node_modules/.cache)
- Aloca 4GB de heap para Node.js

### Performance Esperada
- **Primeira inicialização:** 8-12 segundos
- **Hot reload:** < 1 segundo
- **Build completo:** 15-20 segundos

### ⚠️ Importante para WSL
O projeto está em `/mnt/c/...` (sistema Windows montado).

**Para melhor performance, considere mover para o filesystem nativo do WSL:**
```bash
cp -r /mnt/c/Users/lucia/Projetos/Clientes/SABORDOAFETO ~/SABORDOAFETO
cd ~/SABORDOAFETO
```
Acesso via `/mnt/c/` é 10x mais lento.

---

## 🛠️ Troubleshooting

### Servidor lento ou travado
```bash
# Matar processos Node
pkill -9 node
# ou
ps aux | grep node  # Encontrar PID
kill -9 <PID>

# Limpar cache completo
rm -rf .next node_modules/.cache
./start-dev.sh
```

### Porta 3000 em uso
```bash
npx kill-port 3000
# ou usar porta alternativa
npm run dev -- -p 3001
```

### node_modules corrompido
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas com Supabase
Verifique em `http://localhost:3000/test` (após configurar credenciais).

---

## 🔐 Variáveis de Ambiente

Crie `.env.local` com:
```env
NEXT_PUBLIC_SUPABASE_URL=seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções completas.

---

## 📚 Documentação Adicional

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Setup completo do backend
- **[CATEGORIES_TABLE.sql](./CATEGORIES_TABLE.sql)** - Script SQL para categorias

---

## 🚀 Deploy (Vercel)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático a cada push

---

## 🧩 Git & Desenvolvimento

```bash
# Ver status
git status

# Commit
git add .
git commit -m "sua mensagem"
git push

# Ver diferenças
git diff
```

---

## 💡 Dicas de Desenvolvimento

### VS Code no WSL
```bash
code .
```

### Acessar do Windows
- Browser: `http://localhost:3000`
- Explorer: `\\wsl$\Ubuntu\mnt\c\Users\lucia\Projetos\Clientes\SABORDOAFETO`

### Atalhos durante `npm run dev`
- `Ctrl + C` - Parar servidor
- `R` - Reload manual
- `O` - Abrir no navegador

---

**Status:** ✅ Em desenvolvimento ativo | 📦 Pronto para deploy
