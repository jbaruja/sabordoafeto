-- Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_categories_name ON product_categories(name);

-- Inserir categorias padrão
INSERT INTO product_categories (name, slug, description) VALUES
  ('Bolos', 'bolos', 'Bolos artesanais e personalizados'),
  ('Tortas', 'tortas', 'Tortas doces e salgadas'),
  ('Doces', 'doces', 'Doces finos e brigadeiros gourmet'),
  ('Salgados', 'salgados', 'Salgados para festas e eventos'),
  ('Pães', 'paes', 'Pães artesanais e especiais'),
  ('Bebidas', 'bebidas', 'Bebidas e acompanhamentos'),
  ('Outros', 'outros', 'Outros produtos especiais')
ON CONFLICT (slug) DO NOTHING;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_categories_updated_at
BEFORE UPDATE ON product_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Atualizar constraint da tabela products para usar foreign key
-- (caso você queira manter relacionamento forte)
-- ALTER TABLE products
-- ADD COLUMN category_id UUID REFERENCES product_categories(id);
