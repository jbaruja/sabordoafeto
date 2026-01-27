'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Save, Loader2 } from 'lucide-react'

type Category = {
  id?: string
  name: string
  slug: string
  description: string
}

type CategoryModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category?: Category | null
}

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      })
    } else {
      setFormData({ name: '', slug: '', description: '' })
    }
  }, [category, isOpen])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      if (!formData.name || !formData.slug) {
        throw new Error('Nome é obrigatório')
      }

      if (category?.id) {
        // Atualizar categoria existente
        const { error } = await supabase
          .from('product_categories')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
          })
          .eq('id', category.id)

        if (error) throw error
      } else {
        // Criar nova categoria
        const { error } = await supabase.from('product_categories').insert([
          {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
          },
        ])

        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error)
      setError(error.message || 'Erro ao salvar categoria')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft-lg rounded-modern-lg max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-primary text-2xl font-light text-text-primary">
              {category ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Nome <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Ex: Bolos Especiais"
                className="h-12 border-2"
                required
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Slug (URL)
              </label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="bolos-especiais"
                className="h-12 border-2"
                disabled={loading}
              />
              <p className="font-secondary text-xs text-text-secondary">
                Gerado automaticamente a partir do nome
              </p>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Breve descrição da categoria..."
                rows={3}
                className="w-full px-4 py-3 rounded-modern border-2 border-input bg-background font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-secondary-rose"
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-secondary text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
