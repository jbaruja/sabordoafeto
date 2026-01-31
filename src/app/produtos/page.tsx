'use client'

import { useState, useEffect } from 'react'
import { Gift, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'
import { createClient } from '@/lib/supabase-browser'

type Product = {
  id: string
  name: string
  description: string
  short_description: string
  price: number
  category: string
  featured_image: string
  is_available: boolean
}

type Category = {
  id: string
  name: string
  slug: string
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Buscar produtos disponíveis
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, description, short_description, price, category, featured_image, is_available')
        .eq('is_available', true)
        .order('name', { ascending: true })

      if (productsError) throw productsError

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (categoriesError) throw categoriesError

      setProducts(productsData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar produtos por categoria e busca
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'todos' || product.category === selectedCategory
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-neutral-snow">
      {/* Header da Página */}
      <section className="bg-neutral-snow py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="font-primary text-4xl md:text-6xl font-light text-text-primary">
              Nossos Produtos
            </h1>
            <p className="font-secondary text-lg text-text-secondary">
              Presentes artesanais feitos com carinho e ingredientes selecionados
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="border-b bg-white sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categorias */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                onClick={() => setSelectedCategory('todos')}
                variant={selectedCategory === 'todos' ? 'default' : 'outline'}
                className={
                  selectedCategory === 'todos'
                    ? 'bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft'
                    : 'border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white'
                }
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  className={
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft'
                      : 'border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white'
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Produtos */}
      <section className="py-24 bg-white relative">
        {/* Linha sutil de separação */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary-rose animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.short_description || product.description}
                    price={product.price}
                    category={product.category}
                    image={product.featured_image}
                  />
                ))}
              </div>

              {/* Mensagem se não houver produtos */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <Gift className="w-16 h-16 text-text-light mx-auto mb-4" />
                  <p className="font-secondary text-text-secondary text-lg">
                    Nenhum produto encontrado
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA de Contato */}
      <section className="bg-neutral-cream py-32 relative">
        {/* Linha sutil de separação */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-primary text-3xl md:text-4xl font-light text-text-primary mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="font-secondary text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
            Entre em contato conosco! Podemos criar presentes personalizados
            especialmente para você.
          </p>
          <a
            href="https://wa.me/5547991044121?text=Olá! Gostaria de fazer um pedido personalizado"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-primary-sage hover:bg-primary-sage-dark text-white"
            >
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
