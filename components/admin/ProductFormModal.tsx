'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import ImageCropper from '@/components/admin/ImageCropper'
import { uploadImage } from '@/lib/uploadImage'

interface Props {
  product: Product | null
  businessId: string
  onSave: (form: Omit<Product, 'id' | 'created_at'>) => void
  onClose: () => void
}

const emptyForm = {
  business_id: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  image_url: '',
  image_focal_x: 50,  // ← agregar
  image_focal_y: 50,  // ← agregar
  available: true,
}

const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px', outline: 'none', color: 'var(--text)',
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 500 as const,
  color: 'var(--text3)', textTransform: 'uppercase' as const,
  letterSpacing: '.3px', marginBottom: '6px',
}

export default function ProductFormModal({ product, businessId, onSave, onClose }: Props) {
  const [form, setForm] = useState({ ...emptyForm, business_id: businessId })
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        business_id: product.business_id,
  name: product.name,
  description: product.description ?? '',
  price: product.price,
  category: product.category,
  image_url: product.image_url ?? '',
  image_focal_x: product.image_focal_x ?? 50,  // ← agregar
  image_focal_y: product.image_focal_y ?? 50,  // ← agregar
  available: product.available,
      })
    } else {
      setForm({ ...emptyForm, business_id: businessId })
    }
  }, [product, businessId])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleCropComplete(blob: Blob) {
    setCropSrc(null)
    setUploading(true)
    try {
      const url = await uploadImage(blob, 'products')
      setForm(f => ({ ...f, image_url: url }))
    } catch {
      alert('Error subiendo imagen')
    }
    setUploading(false)
  }

  function handleSave() {
    if (!form.name) return alert('El nombre es requerido')
    if (!form.category) return alert('La categoría es requerida')
    if (!form.price) return alert('El precio es requerido')
    onSave(form)
  }

  return (
    <>
      {/* Cropper — se muestra encima del modal si hay imagen seleccionada */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <div style={{ background: 'var(--bg)', borderRadius: '16px 16px 0 0', padding: '24px 20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>

          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h3>

          {/* Nombre */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Nombre</label>
            <input placeholder="Ej: Acetaminofén 500mg x10" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          </div>

          {/* Categoría y Precio */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Categoría</label>
              <input placeholder="Ej: Analgésicos" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Precio ($)</label>
              <input type="number" placeholder="0" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} style={inputStyle} />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Descripción <span style={{ fontSize: '11px', fontWeight: 400 }}>(opcional)</span></label>
            <textarea placeholder="Descripción breve del producto" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
          </div>

          {/* Toggle disponible */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', marginBottom: '14px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Disponible</span>
            <button
              onClick={() => setForm(f => ({ ...f, available: !f.available }))}
              style={{ width: '44px', height: '24px', background: form.available ? 'var(--green-mid)' : 'var(--gray-light)', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}
            >
              <span style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: form.available ? '23px' : '3px', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'block' }} />
            </button>
          </div>

          {/* Imagen con cropper */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Foto del producto <span style={{ fontSize: '11px', fontWeight: 400 }}>(opcional)</span></label>

            {form.image_url && (
              <div style={{ marginBottom: '10px', position: 'relative', width: '80px', height: '80px' }}>
                <img src={form.image_url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                <button
                  onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                  style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#A32D2D', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px dashed var(--green)', borderRadius: 'var(--radius-sm)', cursor: uploading ? 'not-allowed' : 'pointer', color: 'var(--green)', fontSize: '14px', fontWeight: 500 }}>
              {uploading ? 'Subiendo...' : '📷 Seleccionar y recortar imagen'}
              <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={handleFileSelect} />
            </label>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)' }}>
              Cancelar
            </button>
            <button onClick={handleSave} style={{ flex: 1, padding: '10px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#fff' }}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}