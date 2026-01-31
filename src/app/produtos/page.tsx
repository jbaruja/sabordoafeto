'use client'

import { Gift, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shared/ProductCard'

export default function ProdutosPage() {
  // Mock de produtos - depois vamos buscar do Supabase
  const products = [
    {
      id: '1',
      name: 'Cesta Gourmet Premium',
      description: 'Seleção especial de produtos artesanais com vinhos, queijos e frutas secas',
      price: 189.0,
      category: 'Cestas',
      image: '',
    },
    {
      id: '2',
      name: 'Brownie Artesanal',
      description: 'Feito com chocolate belga premium e nozes selecionadas',
      price: 45.0,
      category: 'Doces',
      image: '',
    },
    {
      id: '3',
      name: 'Kit Café da Manhã',
      description: 'Perfeito para momentos especiais com pães, geleia, café e suco',
      price: 120.0,
      category: 'Kits',
      image: '',
    },
    {
      id: '4',
      name: 'Cesta Romântica',
      description: 'Tudo para surpreender quem você ama com chocolates e flores',
      price: 159.0,
      category: 'Cestas',
      image: '',
    },
    {
      id: '5',
      name: 'Cookies Artesanais',
      description: 'Caixa com 12 cookies de diversos sabores',
      price: 35.0,
      category: 'Doces',
      image: '',
    },
    {
      id: '6',
      name: 'Cesta Gourmet Deluxe',
      description: 'Nossa cesta mais completa com importados premium',
      price: 289.0,
      category: 'Cestas',
      image: '',
    },
    {
      id: '7',
      name: 'Kit Presente Corporativo',
      description: 'Ideal para presentear clientes e parceiros',
      price: 149.0,
      category: 'Kits',
      image: '',
    },
    {
      id: '8',
      name: 'Bolo no Pote',
      description: 'Delicioso bolo em camadas no pote individual',
      price: 25.0,
      category: 'Doces',
      image: '',
    },
  ]

  const categories = ['Todos', 'Cestas', 'Doces', 'Kits']

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
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
              />
            </div>

            {/* Categorias */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'Todos' ? 'default' : 'outline'}
                  className={
                    category === 'Todos'
                      ? 'bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft'
                      : 'border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white'
                  }
                >
                  {category}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                category={product.category}
                image={product.image}
              />
            ))}
          </div>

          {/* Mensagem se não houver produtos */}
          {products.length === 0 && (
            <div className="text-center py-20">
              <Gift className="w-16 h-16 text-text-light mx-auto mb-4" />
              <p className="font-secondary text-text-secondary text-lg">
                Nenhum produto encontrado
              </p>
            </div>
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
