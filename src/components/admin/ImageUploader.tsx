'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageCropModal } from './ImageCropModal'
import {
  Upload,
  X,
  Edit,
  Loader2,
  Image as ImageIcon,
  Star,
} from 'lucide-react'

type ImageData = {
  id: string
  file?: File
  blob?: Blob
  preview: string
  url?: string
  uploading: boolean
}

type ImageUploaderProps = {
  images: string[]
  featuredImage?: string
  onChange: (images: string[], featuredImage?: string) => void
  maxImages?: number
}

export function ImageUploader({
  images = [],
  featuredImage,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [imageList, setImageList] = useState<ImageData[]>(
    images.map((url, index) => ({
      id: `existing-${index}`,
      preview: url,
      url,
      uploading: false,
    }))
  )
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropImageId, setCropImageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Função para redimensionar imagem antes do crop (evita problemas de memória no iOS)
  const resizeImageForCrop = (file: File, maxSize: number = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Se a imagem for pequena o suficiente, retorna original
          if (img.width <= maxSize && img.height <= maxSize) {
            resolve(e.target?.result as string)
            return
          }

          // Calcula escala mantendo proporção
          const scale = Math.min(maxSize / img.width, maxSize / img.height)
          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(img.width * scale)
          canvas.height = Math.floor(img.height * scale)

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(e.target?.result as string)
            return
          }

          // Desenha imagem redimensionada
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Converte para base64
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        img.onerror = () => reject(new Error('Falha ao carregar imagem'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (imageList.length + files.length > maxImages) {
      alert(`Você pode adicionar no máximo ${maxImages} imagens`)
      return
    }

    // Processar apenas o primeiro arquivo por vez para evitar problemas de memória
    for (const file of files) {
      try {
        const id = `new-${Date.now()}-${Math.random()}`

        // Redimensionar imagem antes de abrir o crop (evita travamento no iOS)
        const preview = await resizeImageForCrop(file)

        setImageList((prev) => [
          ...prev,
          {
            id,
            file,
            preview,
            uploading: false,
          },
        ])

        // Abrir modal de crop automaticamente para nova imagem
        setCropImage(preview)
        setCropImageId(id)

        // Processar uma imagem por vez
        break
      } catch (error) {
        console.error('Erro ao processar imagem:', error)
        alert('Erro ao processar a imagem. Tente outra.')
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCropSave = async (croppedBlob: Blob) => {
    if (!cropImageId) return

    // Atualizar preview local
    const previewUrl = URL.createObjectURL(croppedBlob)

    setImageList((prev) =>
      prev.map((img) =>
        img.id === cropImageId
          ? { ...img, blob: croppedBlob, preview: previewUrl }
          : img
      )
    )

    // Fazer upload imediatamente
    await uploadImage(cropImageId, croppedBlob)

    setCropImage(null)
    setCropImageId(null)
  }

  const uploadImage = async (imageId: string, blob: Blob) => {
    try {
      setImageList((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, uploading: true } : img))
      )

      const supabase = createClient()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
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
      setImageList((prev) => {
        const updated = prev.map((img) =>
          img.id === imageId
            ? { ...img, url: publicUrl, uploading: false }
            : img
        )

        // Notificar mudança
        const urls = updated.filter((img) => img.url).map((img) => img.url!)
        const currentFeatured = featuredImage || urls[0]
        onChange(urls, currentFeatured)

        return updated
      })
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem: ' + error.message)

      setImageList((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, uploading: false } : img))
      )
    }
  }

  const handleRemove = (imageId: string) => {
    setImageList((prev) => {
      const updated = prev.filter((img) => img.id !== imageId)
      const urls = updated.filter((img) => img.url).map((img) => img.url!)

      // Se removeu a imagem destacada, seleciona a primeira
      let newFeatured = featuredImage
      if (prev.find((img) => img.id === imageId)?.url === featuredImage) {
        newFeatured = urls[0]
      }

      onChange(urls, newFeatured)
      return updated
    })
  }

  const handleEdit = (image: ImageData) => {
    setCropImage(image.preview)
    setCropImageId(image.id)
  }

  const handleSetFeatured = (imageUrl: string) => {
    onChange(imageList.filter((img) => img.url).map((img) => img.url!), imageUrl)
  }

  return (
    <div className="space-y-4">
      {/* Grid de Imagens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageList.map((image) => (
          <Card
            key={image.id}
            className={`relative aspect-square overflow-hidden rounded-modern border-2 ${image.url === featuredImage
                ? 'border-secondary-rose shadow-soft'
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
            <div className="absolute inset-0 bg-text-primary/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                onClick={() => handleEdit(image)}
                className="bg-white text-text-primary hover:bg-glass-cream"
                disabled={image.uploading}
              >
                <Edit className="w-4 h-4" />
              </Button>
              {image.url && image.url !== featuredImage && (
                <Button
                  size="sm"
                  onClick={() => handleSetFeatured(image.url!)}
                  className="bg-white text-secondary-rose hover:bg-secondary-rose hover:text-white"
                >
                  <Star className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => handleRemove(image.id)}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={image.uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Badge de imagem destacada */}
            {image.url === featuredImage && (
              <div className="absolute top-2 left-2 bg-secondary-rose text-white px-2 py-1 rounded text-xs font-secondary font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Destaque
              </div>
            )}

            {/* Loading overlay */}
            {image.uploading && (
              <div className="absolute inset-0 bg-text-primary/70 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </Card>
        ))}

        {/* Botão para adicionar mais imagens */}
        {imageList.length < maxImages && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-primary-sage/30 rounded-modern bg-glass-cream hover:bg-primary-sage-light/10 transition-colors flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-secondary-rose"
          >
            <Upload className="w-8 h-8" />
            <span className="font-secondary text-xs">
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
            <li>Use imagens de alta qualidade (mínimo 800x600px)</li>
            <li>A primeira imagem será a imagem de destaque</li>
            <li>Clique na estrela para definir outra como destaque</li>
            <li>Você pode editar e ajustar cada imagem antes de salvar</li>
            <li>Máximo de {maxImages} imagens por produto</li>
          </ul>
        </div>
      </div>

      {/* Modal de Crop */}
      {cropImage && (
        <ImageCropModal
          image={cropImage}
          isOpen={!!cropImage}
          onClose={() => {
            setCropImage(null)
            setCropImageId(null)
          }}
          onSave={handleCropSave}
        />
      )}
    </div>
  )
}
