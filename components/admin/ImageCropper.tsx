'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface Props {
  imageSrc: string
  onComplete: (croppedBlob: Blob) => void
  onCancel: () => void
}

// Genera la imagen recortada como Blob a partir del canvas
async function getCroppedImage(imageSrc: string, cropArea: CropArea): Promise<Blob> {
  const image = await createImageBitmap(await fetch(imageSrc).then(r => r.blob()))
  const canvas = document.createElement('canvas')
  canvas.width = cropArea.width
  canvas.height = cropArea.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height)
  return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.92))
}

export default function ImageCropper({ imageSrc, onComplete, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleConfirm() {
    if (!croppedAreaPixels) return
    setProcessing(true)
    const blob = await getCroppedImage(imageSrc, croppedAreaPixels)
    onComplete(blob)
    setProcessing(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700 }}>
          Ajustar imagen
        </span>
        <button
          onClick={onCancel}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Área de recorte — cuadrado 1:1 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: 'transparent' },
            cropAreaStyle: { borderRadius: '8px' },
          }}
        />
      </div>

      {/* Control de zoom */}
      <div style={{ padding: '16px 24px 8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>−</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--green)' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>+</span>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '10px', padding: '12px 16px 28px' }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer' }}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={processing}
          style={{ flex: 2, padding: '12px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer' }}
        >
          {processing ? 'Procesando...' : 'Confirmar recorte'}
        </button>
      </div>
    </div>
  )
}