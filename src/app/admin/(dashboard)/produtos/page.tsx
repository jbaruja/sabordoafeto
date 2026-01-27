'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'

type Product = {
  id: string
  slug: string
  name: string
  description: string
  short_description: string
  price: number
  compare_at_price: number | null
  category: string
  tags: string[]
  stock_quantity: number
  is_available: boolean
  images: string[]
  featured_image: string
  ingredients: string[]
  allergens: string[]
  created_at: string
  updated_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .update({ is_available: !currentStatus })
        .eq('id', id)

      if (error) throw error

      // Atualizar estado local
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_available: !currentStatus } : p
        )
      )
    } catch (error: any) {
      console.error('Erro ao atualizar disponibilidade:', error)
      alert('Erro ao atualizar produto: ' + error.message)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('products').delete().eq('id', deleteId)

      if (error) throw error

      // Remover do estado local
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (error: any) {
      console.error('Erro ao deletar produto:', error)
      alert('Erro ao deletar produto: ' + error.message)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-secondary-rose border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-secondary text-text-secondary">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com busca e botão novo */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <Input
            type="text"
            placeholder="Buscar por nome, categoria ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-2"
          />
        </div>
        <Link href="/admin/produtos/novo">
          <Button
            className="bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </Link>
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

      {/* Lista de produtos */}
      {filteredProducts.length === 0 ? (
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h3 className="font-primary text-xl text-text-primary mb-2">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="font-secondary text-text-secondary mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Comece criando seu primeiro produto'}
            </p>
            {!searchTerm && (
              <Link href="/admin/produtos/novo">
                <Button
                  className="bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Produto
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float transition-all duration-300 rounded-modern-lg overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Imagem */}
                  <div className="w-full lg:w-32 h-32 bg-glass-cream rounded-modern overflow-hidden flex-shrink-0">
                    {product.featured_image ? (
                      <img
                        src={product.featured_image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-text-light" />
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-primary text-xl font-light text-text-primary mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="font-secondary text-sm text-text-secondary line-clamp-2">
                          {product.short_description || product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-secondary font-medium bg-primary-sage-light/20 text-primary-sage border border-primary-sage/20">
                        {product.category}
                      </span>
                      {product.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-secondary font-medium bg-glass-cream text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                      {product.tags?.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-secondary font-medium bg-glass-cream text-text-secondary">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm font-secondary text-text-secondary">
                      <span>
                        Estoque: <strong>{product.stock_quantity}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-secondary text-secondary-rose font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <>
                          <span className="line-through text-text-light">
                            {formatPrice(product.compare_at_price)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex lg:flex-col gap-2 justify-end">
                    <Button
                      size="sm"
                      variant={product.is_available ? 'default' : 'outline'}
                      onClick={() =>
                        toggleAvailability(product.id, product.is_available)
                      }
                      className={
                        product.is_available
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 border-0'
                          : 'border-2 border-text-light text-text-secondary'
                      }
                    >
                      {product.is_available ? (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Inativo
                        </>
                      )}
                    </Button>
                    <Link href={`/admin/produtos/${product.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(product.id)}
                      className="border-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de confirmação de delete */}
      {deleteId && (
        <div className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft-lg rounded-modern-lg max-w-md w-full">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-modern">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-primary text-xl font-light text-text-primary mb-2">
                    Confirmar exclusão
                  </h3>
                  <p className="font-secondary text-text-secondary">
                    Tem certeza que deseja deletar este produto? Esta ação não pode ser
                    desfeita.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  className="border-2"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Sim, deletar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
