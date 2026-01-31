'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tags,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Loader2,
    AlertCircle,
} from 'lucide-react'

type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    created_at: string
}

export default function AjustesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Estado do formulário
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            setCategories(data || [])
        } catch (error: any) {
            console.error('Erro ao buscar categorias:', error)
            setError('Erro ao carregar categorias')
        } finally {
            setLoading(false)
        }
    }

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
            slug: editingId ? formData.slug : generateSlug(name),
        })
    }

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '' })
        setIsEditing(false)
        setEditingId(null)
        setError('')
    }

    const handleEdit = (category: Category) => {
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        })
        setEditingId(category.id)
        setIsEditing(true)
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSaving(true)

        try {
            const supabase = createClient()

            if (!formData.name.trim()) {
                throw new Error('Nome é obrigatório')
            }

            const categoryData = {
                name: formData.name.trim(),
                slug: formData.slug.trim() || generateSlug(formData.name),
                description: formData.description.trim() || null,
            }

            if (editingId) {
                // Atualizar
                const { error } = await supabase
                    .from('product_categories')
                    .update(categoryData)
                    .eq('id', editingId)

                if (error) throw error
                setSuccess('Categoria atualizada com sucesso!')
            } else {
                // Criar
                const { error } = await supabase
                    .from('product_categories')
                    .insert([categoryData])

                if (error) throw error
                setSuccess('Categoria criada com sucesso!')
            }

            resetForm()
            fetchCategories()
        } catch (error: any) {
            console.error('Erro ao salvar categoria:', error)
            setError(error.message || 'Erro ao salvar categoria')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
            return
        }

        setError('')
        setSuccess('')

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('product_categories')
                .delete()
                .eq('id', id)

            if (error) throw error

            setSuccess('Categoria excluída com sucesso!')
            fetchCategories()
        } catch (error: any) {
            console.error('Erro ao excluir categoria:', error)
            setError('Erro ao excluir categoria. Verifique se não há produtos usando esta categoria.')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-primary text-3xl font-light text-text-primary">
                        Ajustes
                    </h1>
                    <p className="font-secondary text-text-secondary mt-1">
                        Gerencie as configurações do sistema
                    </p>
                </div>
            </div>

            {/* Mensagens */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-modern-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="font-secondary text-red-700">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-modern-lg">
                    <p className="font-secondary text-green-700">{success}</p>
                </div>
            )}

            {/* Seção de Categorias */}
            <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary-sage/10">
                        <div className="w-10 h-10 bg-primary-sage/10 rounded-full flex items-center justify-center">
                            <Tags className="w-5 h-5 text-primary-sage" />
                        </div>
                        <div>
                            <h2 className="font-primary text-xl font-light text-text-primary">
                                Categorias de Produtos
                            </h2>
                            <p className="font-secondary text-sm text-text-secondary">
                                Organize seus produtos em categorias
                            </p>
                        </div>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                                <label className="font-secondary text-sm font-medium text-text-primary">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    placeholder="Ex: Linha Café"
                                    className="h-12 border-2"
                                    disabled={saving}
                                />
                            </div>

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
                                    placeholder="linha-cafe"
                                    className="h-12 border-2"
                                    disabled={saving}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-secondary text-sm font-medium text-text-primary">
                                    Descrição
                                </label>
                                <Input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Descrição opcional"
                                    className="h-12 border-2"
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={saving || !formData.name.trim()}
                                className="bg-gradient-to-b from-primary-sage to-primary-sage-dark hover:from-primary-sage-dark hover:to-[#6b7a5e] text-white shadow-soft"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : editingId ? (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Atualizar
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar
                                    </>
                                )}
                            </Button>

                            {isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    className="border-2"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Lista de Categorias */}
                    <div className="space-y-2">
                        <h3 className="font-secondary text-sm font-medium text-text-secondary mb-3">
                            Categorias cadastradas ({categories.length})
                        </h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-primary-sage animate-spin" />
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-8 bg-neutral-snow/50 rounded-modern-lg">
                                <Tags className="w-12 h-12 text-text-light mx-auto mb-2" />
                                <p className="font-secondary text-text-secondary">
                                    Nenhuma categoria cadastrada
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`flex items-center justify-between p-4 rounded-modern-lg border-2 transition-colors ${editingId === category.id
                                                ? 'border-primary-sage bg-primary-sage/5'
                                                : 'border-transparent bg-neutral-snow/50 hover:border-primary-sage/20'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-secondary font-medium text-text-primary">
                                                    {category.name}
                                                </h4>
                                                <span className="px-2 py-0.5 bg-primary-sage/10 text-primary-sage text-xs font-secondary rounded">
                                                    {category.slug}
                                                </span>
                                            </div>
                                            {category.description && (
                                                <p className="font-secondary text-sm text-text-secondary mt-1">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(category)}
                                                className="text-primary-sage hover:bg-primary-sage/10"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
