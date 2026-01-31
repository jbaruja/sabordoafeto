'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Upload,
    X,
    Loader2,
    Image as ImageIcon,
    Star,
    AlertCircle,
} from 'lucide-react'

type ImageData = {
    id: string
    preview: string
    url?: string
    uploading: boolean
    error?: string
}

type SimpleImageUploaderProps = {
    images: string[]
    featuredImage?: string
    onChange: (images: string[], featuredImage?: string) => void
    maxImages?: number
}

export function SimpleImageUploader({
    images = [],
    featuredImage,
    onChange,
    maxImages = 5,
}: SimpleImageUploaderProps) {
    const [imageList, setImageList] = useState<ImageData[]>(
        images.map((url, index) => ({
            id: `existing-${index}`,
            preview: url,
            url,
            uploading: false,
        }))
    )
    const [pendingFeatured, setPendingFeatured] = useState<string | undefined>(featuredImage)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Notificar o componente pai das mudanças
    useEffect(() => {
        const urls = imageList.filter((img) => img.url && !img.uploading).map((img) => img.url!)
        const currentFeatured = pendingFeatured || urls[0]
        if (urls.length > 0 || images.length > 0) {
            onChange(urls, currentFeatured)
        }
    }, [imageList, pendingFeatured])

    // Redimensionar imagem para economizar memória (iOS friendly)
    const resizeImage = (file: File, maxSize: number = 1024): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            // Criar URL para preview sem carregar em memória como base64
            const url = URL.createObjectURL(file)
            const img = new Image()

            img.onload = () => {
                URL.revokeObjectURL(url)

                // Se imagem pequena, retornar original
                if (img.width <= maxSize && img.height <= maxSize) {
                    resolve(file)
                    return
                }

                // Calcular escala
                const scale = Math.min(maxSize / img.width, maxSize / img.height)
                const width = Math.floor(img.width * scale)
                const height = Math.floor(img.height * scale)

                // Criar canvas e redimensionar
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    resolve(file)
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob)
                        } else {
                            resolve(file)
                        }
                    },
                    'image/jpeg',
                    0.85
                )
            }

            img.onerror = () => {
                URL.revokeObjectURL(url)
                reject(new Error('Erro ao carregar imagem'))
            }

            img.src = url
        })
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (imageList.length + files.length > maxImages) {
            alert(`Você pode adicionar no máximo ${maxImages} imagens`)
            return
        }

        // Processar arquivos
        for (const file of files) {
            const id = `new-${Date.now()}-${Math.random().toString(36).slice(2)}`

            // Criar preview usando URL.createObjectURL (mais eficiente que base64)
            const previewUrl = URL.createObjectURL(file)

            // Adicionar à lista com estado de uploading
            setImageList((prev) => [
                ...prev,
                {
                    id,
                    preview: previewUrl,
                    uploading: true,
                },
            ])

            // Fazer upload
            try {
                const resizedBlob = await resizeImage(file)
                await uploadImage(id, resizedBlob)
            } catch (error) {
                console.error('Erro ao processar imagem:', error)
                setImageList((prev) =>
                    prev.map((img) =>
                        img.id === id ? { ...img, uploading: false, error: 'Erro ao processar' } : img
                    )
                )
            }
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const uploadImage = async (imageId: string, blob: Blob) => {
        try {
            const supabase = createClient()
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
            const filePath = `products/${fileName}`

            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, blob, {
                    contentType: 'image/jpeg',
                    upsert: false,
                })

            if (error) throw error

            // Obter URL pública
            const {
                data: { publicUrl },
            } = supabase.storage.from('product-images').getPublicUrl(data.path)

            // Atualizar lista com URL
            setImageList((prev) =>
                prev.map((img) =>
                    img.id === imageId ? { ...img, url: publicUrl, uploading: false } : img
                )
            )
        } catch (error: any) {
            console.error('Erro ao fazer upload:', error)
            setImageList((prev) =>
                prev.map((img) =>
                    img.id === imageId
                        ? { ...img, uploading: false, error: error.message || 'Erro no upload' }
                        : img
                )
            )
        }
    }

    const handleRemove = (imageId: string) => {
        const removedImage = imageList.find((img) => img.id === imageId)

        // Revogar URL de preview se for blob
        if (removedImage?.preview.startsWith('blob:')) {
            URL.revokeObjectURL(removedImage.preview)
        }

        // Atualizar featured se necessário
        if (removedImage?.url === pendingFeatured) {
            const remaining = imageList.filter((img) => img.id !== imageId && img.url)
            setPendingFeatured(remaining[0]?.url)
        }

        setImageList((prev) => prev.filter((img) => img.id !== imageId))
    }

    const handleSetFeatured = (imageUrl: string) => {
        setPendingFeatured(imageUrl)
    }

    const handleRetry = async (imageId: string) => {
        const image = imageList.find((img) => img.id === imageId)
        if (!image) return

        // Buscar arquivo original do preview
        try {
            const response = await fetch(image.preview)
            const blob = await response.blob()

            setImageList((prev) =>
                prev.map((img) =>
                    img.id === imageId ? { ...img, uploading: true, error: undefined } : img
                )
            )

            await uploadImage(imageId, blob)
        } catch (error) {
            console.error('Erro ao tentar novamente:', error)
        }
    }

    return (
        <div className="space-y-4">
            {/* Grid de Imagens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageList.map((image) => (
                    <Card
                        key={image.id}
                        className={`relative aspect-square overflow-hidden rounded-modern border-2 ${image.url === pendingFeatured
                                ? 'border-secondary-rose shadow-soft'
                                : image.error
                                    ? 'border-red-400'
                                    : 'border-primary-sage/20'
                            }`}
                    >
                        {/* Preview da imagem */}
                        <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay com ações */}
                        {!image.uploading && !image.error && (
                            <div className="absolute inset-0 bg-text-primary/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {image.url && image.url !== pendingFeatured && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleSetFeatured(image.url!)}
                                        className="bg-white text-secondary-rose hover:bg-secondary-rose hover:text-white"
                                    >
                                        <Star className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleRemove(image.id)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Badge de imagem destacada */}
                        {image.url === pendingFeatured && (
                            <div className="absolute top-2 left-2 bg-secondary-rose text-white px-2 py-1 rounded text-xs font-secondary font-medium flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Destaque
                            </div>
                        )}

                        {/* Loading overlay */}
                        {image.uploading && (
                            <div className="absolute inset-0 bg-text-primary/70 flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                <span className="text-white text-xs mt-2 font-secondary">Enviando...</span>
                            </div>
                        )}

                        {/* Error overlay */}
                        {image.error && (
                            <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center p-2">
                                <AlertCircle className="w-6 h-6 text-white mb-1" />
                                <span className="text-white text-xs text-center font-secondary mb-2">
                                    {image.error}
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRetry(image.id)}
                                        className="bg-white text-red-600 hover:bg-red-50 text-xs px-2 py-1 h-auto"
                                    >
                                        Tentar
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRemove(image.id)}
                                        className="bg-red-700 text-white hover:bg-red-800 text-xs px-2 py-1 h-auto"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}

                {/* Botão para adicionar mais imagens */}
                {imageList.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-primary-sage/30 rounded-modern bg-glass-cream hover:bg-primary-sage-light/10 transition-colors flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-secondary-rose"
                    >
                        <Upload className="w-8 h-8" />
                        <span className="font-secondary text-xs text-center">
                            Adicionar
                            <br />
                            Imagem
                        </span>
                    </button>
                )}
            </div>

            {/* Input file escondido */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Informação */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="font-secondary text-sm text-blue-700">
                    <p className="font-medium mb-1">Dicas para melhores fotos:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use imagens de alta qualidade</li>
                        <li>A primeira imagem será a imagem de destaque</li>
                        <li>Clique na estrela para definir outra como destaque</li>
                        <li>Máximo de {maxImages} imagens por produto</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
