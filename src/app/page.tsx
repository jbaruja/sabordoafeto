'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'

export default function Home() {
  // Produtos em destaque (mock - depois vamos buscar do Supabase)
  const featuredProducts = [
    {
      id: '1',
      name: 'Cesta Gourmet Premium',
      description: 'Seleção especial de produtos artesanais',
      price: 189.0,
    },
    {
      id: '2',
      name: 'Brownie Artesanal',
      description: 'Feito com chocolate belga premium',
      price: 45.0,
    },
    {
      id: '3',
      name: 'Kit Café da Manhã',
      description: 'Perfeito para momentos especiais',
      price: 120.0,
    },
    {
      id: '4',
      name: 'Cesta Romântica',
      description: 'Tudo para surpreender quem você ama',
      price: 159.0,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-neutral-snow py-32 md:py-48 overflow-hidden">
        {/* Mesh Gradients - Manchas de cor suaves */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-sage opacity-[0.08] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-rose opacity-[0.06] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-glass-white backdrop-blur-md rounded-full text-sm font-secondary text-secondary-rose font-medium shadow-soft">
                <Heart className="w-4 h-4 fill-current" />
                Presentes Artesanais com Muito Afeto
              </span>
            </div>

            <h1 className="font-primary text-5xl md:text-7xl font-light text-text-primary">
              Transforme afeto em{' '}
              <span className="text-secondary-rose font-normal">sabor</span>
            </h1>

            <p className="font-secondary text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              Presentes artesanais únicos e personalizados que levam carinho,
              cuidado e sabor para quem você ama.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/produtos">
                <Button
                  size="lg"
                  className="bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white text-lg px-8 py-6 shadow-soft-lg"
                >
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://wa.me/5547991044121?text=Olá! Gostaria de fazer um pedido"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white text-lg px-8 py-6"
                >
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-10 z-10">
          <Sparkles className="w-12 h-12 text-primary-sage" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 z-10">
          <Gift className="w-16 h-16 text-primary-sage" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-40 bg-white relative">
        {/* Linha sutil de separação */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-primary text-4xl md:text-5xl font-light text-text-primary mb-4">
              Produtos em Destaque
            </h2>
            <p className="font-secondary text-lg text-text-secondary max-w-2xl mx-auto">
              Conheça alguns dos nossos produtos mais queridos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href="/produtos">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white"
              >
                Ver Todos os Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-40 bg-neutral-cream relative">
        {/* Linha sutil de separação */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="aspect-square bg-primary-sage-light/20 rounded-modern-lg flex items-center justify-center shadow-soft-lg">
                  <Heart className="w-32 h-32 text-primary-sage/30 fill-current" />
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="font-primary text-4xl md:text-5xl font-light text-text-primary">
                  Feito com carinho, entregue com afeto
                </h2>
                <p className="font-secondary text-lg text-text-secondary">
                  Cada produto é cuidadosamente preparado de forma artesanal,
                  pensando em transmitir o seu afeto através de sabores únicos e
                  embalagens especiais.
                </p>
                <p className="font-secondary text-lg text-text-secondary">
                  Mais do que presentes, criamos experiências que aquecem o
                  coração e fortalecem laços.
                </p>
                <Link href="/sobre">
                  <Button
                    size="lg"
                    className="bg-primary-sage hover:bg-primary-sage-dark text-white"
                  >
                    Conheça Nossa História
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
