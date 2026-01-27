# Guia de Configuração do Supabase

## Passo 1: Criar Conta e Projeto

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou **"Sign In"**
3. Crie uma conta usando GitHub, Google ou email
4. Após login, clique em **"New Project"**

### Configurações do Projeto:
- **Name:** `sabordoafeto` ou `sabor-do-afeto`
- **Database Password:** Crie uma senha FORTE e guarde (você vai precisar!)
- **Region:** Escolha `South America (São Paulo)` para melhor performance no Brasil
- **Pricing Plan:** Selecione **Free** (suficiente para começar)

5. Clique em **"Create new project"**
6. Aguarde 1-2 minutos enquanto o Supabase provisiona o banco

## Passo 2: Copiar Credenciais

Após o projeto ser criado:

1. No dashboard do projeto, clique em **⚙️ Settings** (menu lateral)
2. Clique em **API**
3. Você verá duas informações importantes:

### Project URL
```
https://[seu-projeto].supabase.co
```

### API Keys
- **anon/public key** - Chave pública (pode ser exposta no frontend)
- **service_role key** - Chave privada (NUNCA exponha! Só use no backend)

4. **COPIE** essas informações, você vai precisar delas!

## Passo 3: Configurar Variáveis de Ambiente

1. No seu projeto, crie o arquivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-anon-key-aqui]
```

2. Substitua os valores com as credenciais que você copiou

⚠️ **IMPORTANTE:**
- O arquivo `.env.local` está no `.gitignore` e NÃO será commitado
- Nunca compartilhe essas chaves publicamente
- Use `NEXT_PUBLIC_` apenas para variáveis que podem ser expostas no browser

## Passo 4: Criar Tabelas do Banco

1. No dashboard do Supabase, clique em **🗂️ Table Editor** (menu lateral)
2. Clique em **SQL Editor** (ícone </>)
3. Clique em **+ New query**
4. Cole o SQL abaixo:

```sql
-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABELA DE PRODUTOS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  featured_image TEXT,
  ingredients TEXT[],
  allergens TEXT[],
  allows_customization BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA DE CARRINHOS COMPARTILHADOS
CREATE TABLE shared_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_code VARCHAR(8) UNIQUE NOT NULL,
  cart_data JSONB NOT NULL,
  customer_info JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Índices para melhorar performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_shared_carts_code ON shared_carts(short_code);
CREATE INDEX idx_shared_carts_status ON shared_carts(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE products IS 'Catálogo de produtos artesanais';
COMMENT ON TABLE shared_carts IS 'Carrinhos compartilháveis via link';
```

5. Clique em **Run** (ou pressione `Ctrl+Enter`)
6. Verifique se aparece a mensagem de sucesso

## Passo 5: Configurar Storage para Imagens

1. No menu lateral, clique em **📦 Storage**
2. Clique em **"Create a new bucket"**
3. Configure:
   - **Name:** `product-images`
   - **Public bucket:** ✅ Marque como público (para as imagens serem acessíveis)
4. Clique em **"Create bucket"**

### Configurar Políticas de Acesso (RLS)

1. Clique no bucket `product-images` que você criou
2. Clique em **Policies** (tab superior)
3. Clique em **"New Policy"**

#### Política 1: Permitir leitura pública
- **Policy name:** `Public Read`
- **Allowed operation:** `SELECT`
- Cole este SQL:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

#### Política 2: Permitir upload autenticado (para admin)
- **Policy name:** `Authenticated Upload`
- **Allowed operation:** `INSERT`
- Cole este SQL:

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
```

## Passo 6: Criar Primeiro Usuário Admin

1. No menu lateral, clique em **🔐 Authentication**
2. Clique em **Users**
3. Clique em **"Add user"** > **"Create new user"**
4. Configure:
   - **Email:** seu-email@exemplo.com
   - **Password:** senha-forte-admin
   - **Auto Confirm User:** ✅ Marque
5. Clique em **"Create user"**

Este usuário será usado para acessar o painel administrativo (Fase 3).

## Passo 7: Verificar se Está Tudo Funcionando

Volte ao **Table Editor** e verifique:
- ✅ Tabela `products` criada
- ✅ Tabela `shared_carts` criada

Vá ao **Storage** e verifique:
- ✅ Bucket `product-images` criado
- ✅ Políticas configuradas

## Próximos Passos

Depois de completar este setup:
1. Confirme que o arquivo `.env.local` está configurado
2. Me avise para testarmos a conexão!

## Troubleshooting

### Erro: "relation already exists"
- Significa que a tabela já foi criada. Tudo bem, pode prosseguir!

### Erro ao criar políticas
- Certifique-se de estar na aba correta (Policies)
- Tente criar usando o SQL Editor em vez da interface

### Não consigo ver as credenciais
- Settings > API > Project API keys

## Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Me avise quando terminar este setup!** 🚀
