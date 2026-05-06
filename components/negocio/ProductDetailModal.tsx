'use client'

import { Product } from '@/types/product'

interface Props {
  product: Product
  onClose: () => void
  onAdd: (p: Product) => void
}

export default function ProductDetailModal({ product: p, onClose, onAdd }: Props) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
    >
      <div style={{ background: 'var(--bg)', borderRadius: '16px 16px 0 0', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>

        {/* Imagen */}
        <div style={{ width: '100%', height: '200px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
          {p.image_url
            ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${p.image_focal_x ?? 50}% ${p.image_focal_y ?? 50}%` }} />
            : '💊'
          }
        </div>

        <div style={{ padding: '20px 16px 32px' }}>

          {/* Badge disponible */}
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '10px',
            background: p.available ? 'var(--green-light)' : '#FCEBEB',
            color: p.available ? 'var(--green)' : '#A32D2D',
            marginBottom: '10px', display: 'inline-block'
          }}>
            {p.available ? 'Disponible' : 'Agotado'}
          </span>

          {/* Nombre */}
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '8px 0 6px' }}>
            {p.name}
          </h2>

          {/* Categoría */}
          <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '12px' }}>
            {p.category}
          </div>

          {/* Precio */}
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green)', marginBottom: '16px' }}>
            ${p.price.toLocaleString('es-CO')}
          </div>

          {/* Descripción */}
          {p.description && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                Descripción
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                {p.description}
              </p>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer', color: 'var(--text2)' }}
            >
              Cerrar
            </button>
            <button
              onClick={() => { onAdd(p); onClose() }}
              disabled={!p.available}
              style={{
                flex: 2, padding: '12px', border: 'none', borderRadius: 'var(--radius-sm)',
                fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
                cursor: p.available ? 'pointer' : 'not-allowed',
                background: p.available ? 'var(--green)' : 'var(--gray-light)',
                color: p.available ? '#fff' : 'var(--text3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              🛒 Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}