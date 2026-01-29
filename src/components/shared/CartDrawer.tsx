'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Plus, Minus, Trash2, Loader2 } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
    clearCart,
  } = useCartStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Evitar erro de hidratação
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const handleSendWhatsApp = async () => {
    setIsSubmitting(true)

    try {
      // Criar carrinho compartilhável
      const response = await fetch('/api/cart/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerInfo: null, // Sem info do cliente
          subtotal: getSubtotal(),
        }),
      })

      if (!response.ok) throw new Error('Erro ao criar carrinho')

      const { url } = await response.json()

      // Montar mensagem do WhatsApp
      const message = `Olá! Gostaria de fazer um pedido

*Meu carrinho:*
${items.map((item) => `- ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`).join('\n')}

*Total:* ${formatPrice(getSubtotal())}

*Ver carrinho completo:*
${url}

Pode me ajudar a finalizar?`

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/5547991044121?text=${encodeURIComponent(
        message
      )}`
      window.open(whatsappUrl, '_blank')

      // Limpar carrinho e fechar drawer
      clearCart()
      closeCart()
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      alert('Erro ao enviar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Não renderizar nada até montar (evita hidratação)
  if (!isMounted) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col h-screen max-h-screen overflow-hidden p-0 bg-white">
        <SheetHeader className="shrink-0 p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 font-primary text-2xl font-light text-secondary-rose">
            <ShoppingBag className="w-6 h-6" />
            Seu Carrinho ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pb-20">
            <ShoppingBag className="w-16 h-16 text-text-light" />
            <p className="font-secondary text-text-secondary">
              Seu carrinho está vazio
            </p>
            <Button
              onClick={closeCart}
              variant="outline"
              className="border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Items Area */}
            <div className="flex-1 overflow-y-auto space-y-4 px-6 pt-2 min-h-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-glass-cream backdrop-blur-md rounded-modern shadow-soft"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 bg-primary-sage-light/20 rounded-modern flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-8 h-8 text-primary-sage/40" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-secondary font-semibold text-text-primary text-sm mb-1">
                      {item.name}
                    </h4>
                    <p className="font-secondary text-secondary-rose font-bold text-sm mb-2">
                      {formatPrice(item.price)}
                    </p>

                    {item.customization && (
                      <p className="font-secondary text-xs text-text-secondary mb-2">
                        {item.customization}
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-secondary font-medium text-sm min-w-[2ch] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-text-light hover:text-red-500 shrink-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {/* Espaço extra no final para garantir que nada fique escondido */}
              <div className="h-4" />
            </div>

            {/* Footer with Subtotal and Checkout - Fixed at bottom */}
            <div className="shrink-0 space-y-3 px-6 pt-4 pb-14 border-t bg-white shadow-soft-lg">
              <div className="flex justify-between items-center">
                <span className="font-secondary font-semibold text-text-primary">
                  Subtotal:
                </span>
                <span className="font-primary text-2xl font-bold text-secondary-rose">
                  {formatPrice(getSubtotal())}
                </span>
              </div>

              <p className="font-secondary text-xs text-text-secondary text-center">
                Você enviará este pedido via WhatsApp para finalizar
              </p>

              <Button
                size="lg"
                className="w-full bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
                onClick={handleSendWhatsApp}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar via WhatsApp'
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
