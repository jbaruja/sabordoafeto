'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ShoppingCart,
  Search,
  ExternalLink,
  Calendar,
  Eye,
  AlertCircle,
  Filter,
} from 'lucide-react'
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
    items: any[]
  }
  customer_name: string | null
  customer_phone: string | null
  notes: string | null
}

export default function CarrinhosPage() {
  const [carts, setCarts] = useState<SharedCart[]>([])
  const [filteredCarts, setFilteredCarts] = useState<SharedCart[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCarts()
  }, [])

  useEffect(() => {
    let filtered = carts

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (cart) =>
          cart.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cart.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cart.customer_phone?.includes(searchTerm)
      )
    }

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((cart) => cart.status === statusFilter)
    }

    setFilteredCarts(filtered)
  }, [searchTerm, statusFilter, carts])

  const fetchCarts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('shared_carts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCarts(data || [])
      setFilteredCarts(data || [])
    } catch (error: any) {
      console.error('Erro ao buscar carrinhos:', error)
      setError(error.message)
    } finally {
      setLoading(false)
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

  const updateStatus = async (cartId: string, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shared_carts')
        .update({ status: newStatus })
        .eq('id', cartId)

      if (error) throw error

      // Atualizar estado local
      setCarts((prev) =>
        prev.map((cart) =>
          cart.id === cartId ? { ...cart, status: newStatus } : cart
        )
      )
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-secondary-rose border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-secondary text-text-secondary">Carregando carrinhos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
              <Input
                type="text"
                placeholder="Buscar por código, nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2"
              />
            </div>

            {/* Filtro de Status */}
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-modern border-2 border-input bg-background font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-secondary-rose appearance-none"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="contacted">Contactado</option>
                <option value="converted">Convertido</option>
                <option value="expired">Expirado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-4 text-center">
            <p className="font-secondary text-sm text-text-secondary mb-1">Total</p>
            <p className="font-primary text-3xl font-bold text-text-primary">
              {carts.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-4 text-center">
            <p className="font-secondary text-sm text-text-secondary mb-1">Pendentes</p>
            <p className="font-primary text-3xl font-bold text-yellow-600">
              {carts.filter((c) => c.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-4 text-center">
            <p className="font-secondary text-sm text-text-secondary mb-1">
              Convertidos
            </p>
            <p className="font-primary text-3xl font-bold text-green-600">
              {carts.filter((c) => c.status === 'converted').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-4 text-center">
            <p className="font-secondary text-sm text-text-secondary mb-1">
              Visualizações
            </p>
            <p className="font-primary text-3xl font-bold text-blue-600">
              {carts.reduce((sum, cart) => sum + cart.views, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error message */}
      {error && (
        <Card className="bg-red-50 border-2 border-red-200">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="font-secondary text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Lista de carrinhos */}
      {filteredCarts.length === 0 ? (
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h3 className="font-primary text-xl text-text-primary mb-2">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhum carrinho encontrado'
                : 'Nenhum carrinho compartilhado'}
            </h3>
            <p className="font-secondary text-text-secondary">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Os carrinhos compartilhados aparecerão aqui'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCarts.map((cart) => (
            <Card
              key={cart.id}
              className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float transition-all duration-300 rounded-modern-lg overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Informações principais */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <code className="font-secondary text-lg font-mono text-secondary-rose bg-secondary-rose-light/20 px-3 py-1 rounded">
                        #{cart.short_code}
                      </code>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-secondary font-medium border ${getStatusColor(
                          cart.status
                        )}`}
                      >
                        {getStatusLabel(cart.status)}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-secondary text-text-secondary">
                        <Eye className="w-4 h-4" />
                        {cart.views} {cart.views === 1 ? 'visualização' : 'visualizações'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm font-secondary text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Criado em{' '}
                          {format(new Date(cart.created_at), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {cart.customer_name && (
                        <div>
                          <strong>Cliente:</strong> {cart.customer_name}
                        </div>
                      )}

                      {cart.customer_phone && (
                        <div>
                          <strong>Telefone:</strong> {cart.customer_phone}
                        </div>
                      )}

                      {cart.notes && (
                        <div>
                          <strong>Observações:</strong> {cart.notes}
                        </div>
                      )}

                      <div>
                        <strong>Itens:</strong> {cart.cart_data.items.length}{' '}
                        {cart.cart_data.items.length === 1 ? 'produto' : 'produtos'}
                      </div>
                    </div>
                  </div>

                  {/* Valor e ações */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4">
                    <div className="text-right">
                      <p className="font-secondary text-sm text-text-secondary mb-1">
                        Valor total
                      </p>
                      <p className="font-secondary text-2xl font-bold text-secondary-rose">
                        {formatPrice(cart.cart_data.subtotal)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/admin/carrinhos/${cart.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </Link>

                      {/* Ações rápidas de status */}
                      {cart.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(cart.id, 'contacted')}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                        >
                          Marcar como Contactado
                        </Button>
                      )}
                      {cart.status === 'contacted' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(cart.id, 'converted')}
                          className="bg-green-100 text-green-700 hover:bg-green-200 border-0"
                        >
                          Marcar como Convertido
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
