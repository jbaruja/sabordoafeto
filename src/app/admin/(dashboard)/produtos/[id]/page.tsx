'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

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
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    price: '',
    compare_at_price: '',
    category: '',
    tags: '',
    stock_quantity: '0',
    is_available: true,
    featured_image: '',
    ingredients: '',
    allergens: '',
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          short_description: data.short_description || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          compare_at_price: data.compare_at_price?.toString() || '',
          category: data.category || '',
          tags: data.tags?.join(', ') || '',
          stock_quantity: data.stock_quantity?.toString() || '0',
          is_available: data.is_available ?? true,
          featured_image: data.featured_image || '',
          ingredients: data.ingredients?.join(', ') || '',
          allergens: data.allergens?.join(', ') || '',
        })
      }
    } catch (error: any) {
      console.error('Erro ao buscar produto:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const supabase = createClient()

      // Validações
      if (!formData.name || !formData.slug || !formData.price || !formData.category) {
        throw new Error('Preencha todos os campos obrigatórios')
      }

      // Preparar dados
      const productData = {
        name: formData.name,
        slug: formData.slug,
        short_description: formData.short_description || null,
        description: formData.description || null,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price
          ? parseFloat(formData.compare_at_price)
          : null,
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        is_available: formData.is_available,
        featured_image: formData.featured_image || null,
        images: formData.featured_image ? [formData.featured_image] : [],
        ingredients: formData.ingredients
          ? formData.ingredients.split(',').map((i) => i.trim()).filter(Boolean)
          : [],
        allergens: formData.allergens
          ? formData.allergens.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Produto atualizado com sucesso:', data)
      router.push('/admin/produtos')
    } catch (error: any) {
      console.error('❌ Erro ao atualizar produto:', error)
      setError(error.message || 'Erro ao atualizar produto')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-secondary-rose border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-secondary text-text-secondary">Carregando produto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/produtos">
          <Button variant="outline" size="sm" className="border-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="font-primary text-3xl font-light text-text-primary">
          Editar Produto
        </h1>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
              Informações Básicas
            </h2>

            {/* Nome */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Nome do Produto <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={generateSlug}
                placeholder="Ex: Bolo de Chocolate Artesanal"
                className="h-12 border-2"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Slug (URL amigável) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="bolo-de-chocolate-artesanal"
                  className="h-12 border-2"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  className="border-2"
                >
                  Gerar
                </Button>
              </div>
              <p className="font-secondary text-xs text-text-secondary">
                Gerado automaticamente a partir do nome
              </p>
            </div>

            {/* Descrição Curta */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Descrição Curta
              </label>
              <Input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Uma linha sobre o produto (máx 500 caracteres)"
                maxLength={500}
                className="h-12 border-2"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Descrição Completa
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição detalhada do produto..."
                rows={4}
                className="w-full px-4 py-3 rounded-modern border-2 border-input bg-background font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-secondary-rose"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
              Preço e Estoque
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preço */}
              <div className="space-y-2">
                <label className="font-secondary text-sm font-medium text-text-primary">
                  Preço <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="h-12 border-2"
                  required
                />
              </div>

              {/* Preço Comparativo */}
              <div className="space-y-2">
                <label className="font-secondary text-sm font-medium text-text-primary">
                  Preço Original (opcional)
                </label>
                <Input
                  type="number"
                  name="compare_at_price"
                  value={formData.compare_at_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="h-12 border-2"
                />
                <p className="font-secondary text-xs text-text-secondary">
                  Para mostrar desconto
                </p>
              </div>

              {/* Quantidade em Estoque */}
              <div className="space-y-2">
                <label className="font-secondary text-sm font-medium text-text-primary">
                  Quantidade em Estoque
                </label>
                <Input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="h-12 border-2"
                />
              </div>

              {/* Disponibilidade */}
              <div className="space-y-2">
                <label className="font-secondary text-sm font-medium text-text-primary">
                  Disponibilidade
                </label>
                <div className="flex items-center gap-3 h-12">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-input text-secondary-rose focus:ring-secondary-rose"
                  />
                  <span className="font-secondary text-sm text-text-secondary">
                    Produto disponível para venda
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
              Categorização
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria */}
              <div className="space-y-2">
                <label className="font-secondary text-sm font-medium text-text-primary">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-modern border-2 border-input bg-background font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-secondary-rose"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="bolos">Bolos</option>
                  <option value="tortas">Tortas</option>
                  <option value="doces">Doces</option>
                  <option value="salgados">Salgados</option>
                  <option value="paes">Pães</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="font-secondary text-sm font-medium text-text-primary">
                  Tags
                </label>
                <Input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="chocolate, festa, aniversário"
                  className="h-12 border-2"
                />
                <p className="font-secondary text-xs text-text-secondary">
                  Separadas por vírgula
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <h2 className="font-primary text-xl font-light text-text-primary border-b border-primary-sage/10 pb-3">
              Imagens e Detalhes
            </h2>

            {/* Imagem Destacada */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                URL da Imagem Destacada
              </label>
              <Input
                type="url"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="h-12 border-2"
              />
              {formData.featured_image && (
                <div className="mt-4 w-full max-w-xs">
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-modern border-2 border-primary-sage/10"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      e.currentTarget.alt = 'Erro ao carregar imagem'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Ingredientes */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Ingredientes
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="farinha, açúcar, ovos, chocolate"
                rows={3}
                className="w-full px-4 py-3 rounded-modern border-2 border-input bg-background font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-secondary-rose"
              />
              <p className="font-secondary text-xs text-text-secondary">
                Separados por vírgula
              </p>
            </div>

            {/* Alérgenos */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Alérgenos
              </label>
              <Input
                type="text"
                name="allergens"
                value={formData.allergens}
                onChange={handleChange}
                placeholder="glúten, lactose, ovos"
                className="h-12 border-2"
              />
              <p className="font-secondary text-xs text-text-secondary">
                Separados por vírgula
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/produtos">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-2"
              disabled={saving}
            >
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
