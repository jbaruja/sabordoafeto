'use client'

import { useState, useRef, TouchEvent } from 'react'
import Link from 'next/link'
import { Gift, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
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
  images?: string[]
  onViewDetails?: () => void
  variant?: 'default' | 'featured' | 'personalizados'
}

export function ProductCard({
  id,
  name,
  description,
  price,
  category,
  image,
  images,
  onViewDetails,
  variant = 'default',
}: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Touch swipe support
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 50

  // Combinar imagens: usar o array 'images' se existir, senão usar 'image' como fallback
  const allImages = images && images.length > 0
    ? images
    : image
      ? [image]
      : []

  // Detectar categoria personalizados automaticamente
  const isPersonalizados = variant === 'personalizados' || category === 'personalizados'

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price: isPersonalizados ? 0 : price,
      quantity: 1,
      image: allImages[0] || image,
      customization: isPersonalizados ? 'Sob consulta via WhatsApp' : undefined,
    })
    openCart()
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    )
  }

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  // Touch handlers para swipe
  const onTouchStart = (e: TouchEvent) => {
    touchEndX.current = null
    touchStartX.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && allImages.length > 1) {
      nextImage()
    }
    if (isRightSwipe && allImages.length > 1) {
      prevImage()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Link para a categoria do produto na página de produtos
  const categoryLink = category
    ? `/produtos#category-${category}`
    : '/produtos'

  // WhatsApp link para personalizados
  const whatsappLink = `https://wa.me/5547991044121?text=Olá! Gostaria de saber mais sobre o produto personalizado: ${encodeURIComponent(name)}`

  return (
    <Card className="group bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float hover:-translate-y-2 transition-all duration-300 cursor-pointer rounded-modern-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Imagem do Produto com Carrossel e Swipe */}
        <div
          className="aspect-square bg-primary-sage-light/15 flex items-center justify-center overflow-hidden relative touch-pan-y"
          onClick={onViewDetails}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentImageIndex]}
                alt={`${name} - Imagem ${currentImageIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform pointer-events-none select-none"
                draggable={false}
              />

              {/* Setas de navegação (aparecem apenas se houver mais de 1 imagem) */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-4 h-4 text-text-primary" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-4 h-4 text-text-primary" />
                  </button>

                  {/* Indicadores de pontos */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => goToImage(index, e)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                          ? 'bg-secondary-rose w-4'
                          : 'bg-white/70 hover:bg-white'
                          }`}
                        aria-label={`Ver imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <Gift className="w-24 h-24 text-primary-sage/30 group-hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Informações do Produto */}
        <div className="p-6 space-y-3">
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

          {/* Variante Featured (sem preço, só "Ver mais") */}
          {variant === 'featured' ? (
            <div className="pt-3">
              <Link href={categoryLink}>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
                >
                  Ver mais
                </Button>
              </Link>
            </div>
          ) : isPersonalizados ? (
            /* Variante Personalizados (sem preço, botão WhatsApp) */
            <div className="pt-3 space-y-3">
              <div className="flex items-center gap-2 text-primary-sage">
                <MessageCircle className="w-4 h-4" />
                <span className="font-secondary text-sm font-medium">Valor sob consulta</span>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-b from-primary-sage to-primary-sage-dark hover:from-primary-sage-dark hover:to-[#6b7a5e] text-white shadow-soft"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Personalizar via WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            /* Variante Default (com preço e botões) */
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}
