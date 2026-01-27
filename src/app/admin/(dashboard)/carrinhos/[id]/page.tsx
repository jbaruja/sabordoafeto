'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  Eye,
  User,
  Phone,
  FileText,
  Package,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type SharedCart = {
  id: string
  short_code: string
  created_at: string
  status: string
  views: number
  cart_data: {
    subtotal: number
    items: {
      id: string
      name: string
      price: number
      quantity: number
      image?: string
    }[]
  }
  customer_name: string | null
  customer_phone: string | null
  notes: string | null
  expires_at: string
}

export default function CartDetailPage() {
  const router = useRouter()
  const params = useParams()
  const cartId = params.id as string

  const [cart, setCart] = useState<SharedCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCart()
  }, [cartId])

  const fetchCart = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('shared_carts')
        .select('*')
        .eq('id', cartId)
        .single()

      if (error) throw error
      setCart(data)
    } catch (error: any) {
      console.error('Erro ao buscar carrinho:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!cart) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shared_carts')
        .update({ status: newStatus })
        .eq('id', cartId)

      if (error) throw error

      setCart({ ...cart, status: newStatus })
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status: ' + error.message)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'contacted':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'expired':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      contacted: 'Contactado',
      converted: 'Convertido',
      expired: 'Expirado',
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-secondary-rose border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-secondary text-text-secondary">Carregando carrinho...</p>
        </div>
      </div>
    )
  }

  if (error || !cart) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/carrinhos">
            <Button variant="outline" size="sm" className="border-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <Card className="bg-red-50 border-2 border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-primary text-xl text-red-700 mb-2">
              Erro ao carregar carrinho
            </h3>
            <p className="font-secondary text-red-600">
              {error || 'Carrinho não encontrado'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/carrinhos">
            <Button variant="outline" size="sm" className="border-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="font-primary text-3xl font-light text-text-primary">
              Carrinho #{cart.short_code}
            </h1>
            <p className="font-secondary text-sm text-text-secondary">
              ID: {cart.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal - Itens do carrinho */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itens */}
          <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3 mb-4">
                Itens do Carrinho ({cart.cart_data.items.length})
              </h2>

              <div className="space-y-4">
                {cart.cart_data.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-glass-cream rounded-modern"
                  >
                    {/* Imagem do produto */}
                    <div className="w-20 h-20 bg-neutral-snow rounded-modern overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-text-light" />
                        </div>
                      )}
                    </div>

                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-secondary text-base font-medium text-text-primary truncate">
                        {item.name}
                      </h3>
                      <p className="font-secondary text-sm text-text-secondary">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="font-secondary text-sm text-secondary-rose font-bold">
                        {formatPrice(item.price)} cada
                      </p>
                    </div>

                    {/* Subtotal do item */}
                    <div className="text-right">
                      <p className="font-secondary text-sm text-text-secondary">
                        Subtotal
                      </p>
                      <p className="font-secondary text-lg font-bold text-text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-primary-sage/10">
                <div className="flex items-center justify-between">
                  <p className="font-primary text-xl font-light text-text-primary">
                    Total do Pedido
                  </p>
                  <p className="font-primary text-3xl font-bold text-secondary-rose">
                    {formatPrice(cart.cart_data.subtotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - Informações do carrinho */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
                Status
              </h2>

              <div className="flex items-center justify-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-modern text-sm font-secondary font-medium border ${getStatusColor(
                    cart.status
                  )}`}
                >
                  {getStatusLabel(cart.status)}
                </span>
              </div>

              <div className="space-y-2">
                {cart.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus('contacted')}
                    className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                  >
                    Marcar como Contactado
                  </Button>
                )}
                {cart.status === 'contacted' && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus('converted')}
                    className="w-full bg-green-100 text-green-700 hover:bg-green-200 border-0"
                  >
                    Marcar como Convertido
                  </Button>
                )}
                {cart.status === 'converted' && (
                  <div className="text-center py-2">
                    <p className="font-secondary text-sm text-green-600">
                      ✓ Pedido convertido com sucesso!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
                Informações do Cliente
              </h2>

              {cart.customer_name ? (
                <>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-text-light mt-0.5" />
                    <div>
                      <p className="font-secondary text-xs text-text-secondary">Nome</p>
                      <p className="font-secondary text-sm text-text-primary">
                        {cart.customer_name}
                      </p>
                    </div>
                  </div>

                  {cart.customer_phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-text-light mt-0.5" />
                      <div>
                        <p className="font-secondary text-xs text-text-secondary">
                          Telefone
                        </p>
                        <p className="font-secondary text-sm text-text-primary">
                          {cart.customer_phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {cart.notes && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-text-light mt-0.5" />
                      <div>
                        <p className="font-secondary text-xs text-text-secondary">
                          Observações
                        </p>
                        <p className="font-secondary text-sm text-text-primary">
                          {cart.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="font-secondary text-sm text-text-secondary">
                    Cliente não forneceu informações de contato
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Carrinho */}
          <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
                Detalhes
              </h2>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-text-light mt-0.5" />
                <div>
                  <p className="font-secondary text-xs text-text-secondary">
                    Criado em
                  </p>
                  <p className="font-secondary text-sm text-text-primary">
                    {format(new Date(cart.created_at), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-text-light mt-0.5" />
                <div>
                  <p className="font-secondary text-xs text-text-secondary">
                    Expira em
                  </p>
                  <p className="font-secondary text-sm text-text-primary">
                    {format(new Date(cart.expires_at), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-text-light mt-0.5" />
                <div>
                  <p className="font-secondary text-xs text-text-secondary">
                    Visualizações
                  </p>
                  <p className="font-secondary text-sm text-text-primary">
                    {cart.views} {cart.views === 1 ? 'visualização' : 'visualizações'}
                  </p>
                </div>
              </div>

              {/* Link do carrinho */}
              <div className="pt-4 border-t border-primary-sage/10">
                <p className="font-secondary text-xs text-text-secondary mb-2">
                  Link para compartilhar
                </p>
                <div className="flex gap-2">
                  <code className="flex-1 font-mono text-xs bg-glass-cream px-3 py-2 rounded text-text-primary break-all">
                    {window.location.origin}/carrinho/{cart.short_code}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/carrinho/${cart.short_code}`
                      )
                      alert('Link copiado!')
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
