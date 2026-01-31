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
  images: string[]
  is_available: boolean
}

type Category = {
  id: string
  name: string
  slug: string
  description?: string
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  // Handle hash anchor scrolling after data loads
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        // Small delay to ensure DOM is rendered
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            const headerOffset = 160
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }, [loading])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Buscar produtos disponíveis
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, description, short_description, price, category, featured_image, images, is_available')
        .eq('is_available', true)
        .order('name', { ascending: true })

      if (productsError) throw productsError

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('id, name, slug, description')
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

  // Filtrar produtos por busca
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Agrupar produtos por categoria
  const getProductsByCategory = (categorySlug: string) => {
    return filteredProducts.filter((product) => product.category === categorySlug)
  }

  // Categorias que têm produtos
  const categoriesWithProducts = categories.filter(
    (category) => getProductsByCategory(category.slug).length > 0
  )

  // Scroll para categoria
  const scrollToCategory = (slug: string) => {
    const element = document.getElementById(`category-${slug}`)
    if (element) {
      const headerOffset = 160
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

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

      {/* Filtros e Navegação por Categoria */}
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

            {/* Navegação por Categorias */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categoriesWithProducts.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => scrollToCategory(category.slug)}
                  variant="outline"
                  className="border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seções de Produtos por Categoria */}
      <div className="bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-secondary-rose animate-spin" />
          </div>
        ) : categoriesWithProducts.length > 0 ? (
          categoriesWithProducts.map((category, index) => {
            const categoryProducts = getProductsByCategory(category.slug)

            return (
              <section
                key={category.id}
                id={`category-${category.slug}`}
                className={`py-16 md:py-24 relative ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-snow'
                  }`}
              >
                {/* Linha sutil de separação */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>

                <div className="container mx-auto px-4">
                  {/* Header da Categoria */}
                  <div className="text-center mb-12">
                    <h2 className="font-primary text-3xl md:text-4xl font-light text-text-primary mb-3">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="font-secondary text-text-secondary max-w-2xl mx-auto">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 w-20 h-1 bg-gradient-to-r from-secondary-rose to-primary-sage mx-auto rounded-full"></div>
                  </div>

                  {/* Grid de Produtos da Categoria */}
                  <div className={`${categoryProducts.length < 4
                      ? 'flex flex-wrap justify-center gap-6'
                      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    }`}>
                    {categoryProducts.map((product) => (
                      <div key={product.id} className={categoryProducts.length < 4 ? 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[300px]' : ''}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          description={product.short_description || product.description}
                          price={product.price}
                          image={product.featured_image}
                          images={product.images}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          })
        ) : (
          <div className="text-center py-32">
            <Gift className="w-16 h-16 text-text-light mx-auto mb-4" />
            <p className="font-secondary text-text-secondary text-lg">
              Nenhum produto encontrado
            </p>
          </div>
        )}
      </div>

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
