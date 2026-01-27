'use client'

import { Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/stores/cartStore'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  category?: string
  image?: string
  onViewDetails?: () => void
}

export function ProductCard({
  id,
  name,
  description,
  price,
  category,
  image,
  onViewDetails,
}: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
    })
    // Abrir carrinho automaticamente
    openCart()
  }

  return (
    <Card className="group bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-modern-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Imagem do Produto */}
        <div
          className="aspect-square bg-primary-sage-light/15 flex items-center justify-center overflow-hidden"
          onClick={onViewDetails}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <Gift className="w-24 h-24 text-primary-sage/30 group-hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Informações do Produto */}
        <div className="p-6 space-y-3">
          {/* Categoria */}
          {category && (
            <span className="inline-block px-3 py-1 bg-primary-sage-light/20 text-primary-sage text-xs font-secondary font-medium rounded-full">
              {category}
            </span>
          )}

          {/* Nome */}
          <h3
            className="font-primary text-xl font-light text-text-primary group-hover:text-secondary-rose transition-colors line-clamp-2"
            onClick={onViewDetails}
          >
            {name}
          </h3>

          {/* Descrição */}
          <p className="font-secondary text-sm text-text-secondary line-clamp-2">
            {description}
          </p>

          {/* Preço e Ações */}
          <div className="pt-3 space-y-3">
            <p className="font-secondary text-secondary-rose">
              <span className="text-lg font-medium">R$</span>
              <span className="text-3xl font-bold ml-1">
                {price.toFixed(2).replace('.', ',')}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
                onClick={handleAddToCart}
              >
                Adicionar
              </Button>
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white"
                  onClick={onViewDetails}
                >
                  Ver Detalhes
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
