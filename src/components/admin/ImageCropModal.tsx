'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Check, RotateCw } from 'lucide-react'

type Area = {
  x: number
  y: number
  width: number
  height: number
}

type ImageCropModalProps = {
  image: string
  isOpen: boolean
  onClose: () => void
  onSave: (croppedImage: Blob) => void
}

export function ImageCropModal({
  image,
  isOpen,
  onClose,
  onSave,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        }
      }, 'image/jpeg', 0.9)
    })
  }

  const handleSave = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation)
      onSave(croppedImage)
      onClose()
    } catch (error) {
      console.error('Erro ao fazer crop:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-glass-white backdrop-blur-lg border-0 shadow-soft-lg rounded-modern-lg max-w-3xl w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-primary text-2xl font-light text-text-primary">
              Ajustar Imagem
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Crop */}
          <div className="relative w-full h-96 bg-neutral-snow rounded-modern overflow-hidden mb-6">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Controles */}
          <div className="space-y-4 mb-6">
            {/* Zoom */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-glass-cream rounded-lg appearance-none cursor-pointer accent-secondary-rose"
              />
            </div>

            {/* Rotação */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotação
              </label>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-glass-cream rounded-lg appearance-none cursor-pointer accent-secondary-rose"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
            >
              <Check className="w-4 h-4 mr-2" />
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
