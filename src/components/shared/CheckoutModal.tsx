'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^[\d\s()+-]+$/, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getSubtotal, clearCart, closeCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)

    try {
      // Criar carrinho compartilhável
      const response = await fetch('/api/cart/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerInfo: data,
          subtotal: getSubtotal(),
        }),
      })

      if (!response.ok) throw new Error('Erro ao criar carrinho')

      const { shortCode, url } = await response.json()

      // Montar mensagem do WhatsApp
      const message = `Olá! Gostaria de fazer um pedido

*Meu carrinho:*
${items.map((item) => `- ${item.name} (${item.quantity}x)`).join('\n')}

*Total:* ${formatPrice(getSubtotal())}${data.deliveryDate ? `\n*Data desejada:* ${data.deliveryDate}` : ''}${data.notes ? `\n*Observações:* ${data.notes}` : ''}

*Ver carrinho completo:*
${url}

Pode me ajudar a finalizar?`

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/5547991044121?text=${encodeURIComponent(
        message
      )}`
      window.open(whatsappUrl, '_blank')

      // Limpar carrinho e fechar modais
      clearCart()
      closeCart()
      onClose()
      reset()
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      alert('Erro ao enviar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-primary text-2xl text-secondary-rose">
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription className="font-secondary">
            Preencha seus dados para enviar o pedido via WhatsApp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="name" className="font-secondary">
              Nome completo *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Seu nome"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="phone" className="font-secondary">
              Telefone/WhatsApp *
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="(41) 99999-9999"
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="font-secondary">
              Email (opcional)
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="seu@email.com"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Data de Entrega */}
          <div>
            <Label htmlFor="deliveryDate" className="font-secondary">
              Data de entrega desejada (opcional)
            </Label>
            <Input
              id="deliveryDate"
              type="date"
              {...register('deliveryDate')}
              className="mt-1"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes" className="font-secondary">
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Alguma observação especial?"
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Resumo */}
          <div className="bg-neutral-cream p-4 rounded-lg space-y-2">
            <div className="flex justify-between font-secondary text-sm">
              <span className="text-text-secondary">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
              <span className="font-bold text-secondary-rose">
                {formatPrice(getSubtotal())}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary-rose hover:bg-secondary-rose-dark text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar WhatsApp
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
