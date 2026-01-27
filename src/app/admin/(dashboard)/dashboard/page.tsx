'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Eye,
  Plus,
  ExternalLink,
  Calendar,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Metrics = {
  totalProducts: number
  recentCarts: number
  conversionRate: number
  totalViews: number
}

type RecentCart = {
  id: string
  short_code: string
  created_at: string
  status: string
  cart_data: {
    subtotal: number
    items: any[]
  }
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalProducts: 0,
    recentCarts: 0,
    conversionRate: 0,
    totalViews: 0,
  })
  const [recentCarts, setRecentCarts] = useState<RecentCart[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Buscar produtos ativos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true)

      // Buscar carrinhos dos últimos 7 dias
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: carts, count: cartsCount } = await supabase
        .from('shared_carts')
        .select('*', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      // Calcular taxa de conversão
      const convertedCarts = carts?.filter(
        (cart) => cart.status === 'converted'
      ).length || 0
      const conversionRate = cartsCount
        ? (convertedCarts / cartsCount) * 100
        : 0

      // Somar visualizações
      const totalViews = carts?.reduce((sum, cart) => sum + cart.views, 0) || 0

      setMetrics({
        totalProducts: productsCount || 0,
        recentCarts: cartsCount || 0,
        conversionRate,
        totalViews,
      })

      // Pegar os 5 últimos carrinhos
      setRecentCarts((carts || []).slice(0, 5))
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-secondary-rose border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-secondary text-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Produtos */}
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float transition-all duration-300 rounded-modern-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-secondary text-sm text-text-secondary">
                  Produtos Ativos
                </p>
                <p className="font-primary text-4xl font-bold text-text-primary">
                  {metrics.totalProducts}
                </p>
              </div>
              <div className="p-3 bg-primary-sage-light/20 rounded-modern">
                <Package className="w-6 h-6 text-primary-sage" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carrinhos Recentes */}
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float transition-all duration-300 rounded-modern-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-secondary text-sm text-text-secondary">
                  Carrinhos (7 dias)
                </p>
                <p className="font-primary text-4xl font-bold text-text-primary">
                  {metrics.recentCarts}
                </p>
              </div>
              <div className="p-3 bg-secondary-rose-light/30 rounded-modern">
                <ShoppingCart className="w-6 h-6 text-secondary-rose" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float transition-all duration-300 rounded-modern-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-secondary text-sm text-text-secondary">
                  Taxa de Conversão
                </p>
                <p className="font-primary text-4xl font-bold text-text-primary">
                  {metrics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-modern">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualizações */}
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float transition-all duration-300 rounded-modern-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-secondary text-sm text-text-secondary">
                  Visualizações
                </p>
                <p className="font-primary text-4xl font-bold text-text-primary">
                  {metrics.totalViews}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-modern">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links rápidos */}
      <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
        <CardContent className="p-6">
          <h2 className="font-primary text-2xl font-light text-text-primary mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/produtos/novo">
              <Button
                className="w-full bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Produto
              </Button>
            </Link>
            <Link href="/admin/produtos">
              <Button
                variant="outline"
                className="w-full border-2 border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white"
                size="lg"
              >
                <Package className="w-5 h-5 mr-2" />
                Ver Produtos
              </Button>
            </Link>
            <Link href="/admin/carrinhos">
              <Button
                variant="outline"
                className="w-full border-2 border-primary-sage text-primary-sage hover:bg-primary-sage hover:text-white"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ver Carrinhos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Carrinhos recentes */}
      <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-primary text-2xl font-light text-text-primary">
              Carrinhos Recentes
            </h2>
            <Link href="/admin/carrinhos">
              <Button variant="ghost" size="sm">
                Ver todos
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {recentCarts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-text-light mx-auto mb-3" />
              <p className="font-secondary text-text-secondary">
                Nenhum carrinho criado nos últimos 7 dias
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCarts.map((cart) => (
                <div
                  key={cart.id}
                  className="flex items-center justify-between p-4 bg-glass-cream rounded-modern hover:shadow-soft transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="font-secondary text-sm font-mono text-secondary-rose bg-secondary-rose-light/20 px-2 py-1 rounded">
                        #{cart.short_code}
                      </code>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-secondary font-medium border ${getStatusColor(
                          cart.status
                        )}`}
                      >
                        {getStatusLabel(cart.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-secondary text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(cart.created_at), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                      <span>
                        {cart.cart_data.items.length}{' '}
                        {cart.cart_data.items.length === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-secondary text-lg font-bold text-secondary-rose">
                      {formatPrice(cart.cart_data.subtotal)}
                    </span>
                    <Link href={`/admin/carrinhos/${cart.id}`}>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
