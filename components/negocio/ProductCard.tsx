'use client'

import { useState } from 'react'
import { Product } from '@/types/product'
import ProductDetailModal from '@/components/negocio/ProductDetailModal'

interface Props {
  product: Product
  onSelect: (p: Product) => void
}

export default function ProductCard({ product: p, onSelect }: Props) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <>
      <div style={{ width: '140px', flexShrink: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg)', opacity: p.available ? 1 : 0.6, cursor: 'pointer', transition: 'all .2s' }}>

        {/* Imagen — abre el modal */}
        <div
          onClick={() => setShowDetail(true)}
          style={{ width: '100%', aspectRatio: '1/1', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', overflow: 'hidden' }}
        >
          {p.image_url
            ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${p.image_focal_x ?? 50}% ${p.image_focal_y ?? 50}%` }} />
            : '💊'
          }
        </div>

        {/* Info — abre el modal */}
        <div onClick={() => setShowDetail(true)} style={{ padding: '8px 10px 6px' }}>

          {/* Nombre */}
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.3, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.name}
          </div>

          {/* Precio + badge en la misma fila */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
              ${p.price.toLocaleString('es-CO')}
            </div>
            <span style={{
              fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px', whiteSpace: 'nowrap',
              background: p.available ? 'var(--green-light)' : '#FCEBEB',
              color: p.available ? 'var(--green)' : '#A32D2D',
            }}>
              {p.available ? 'Disponible' : 'Agotado'}
            </span>
          </div>
        </div>

        {/* Botón carrito */}
        <button
          onClick={() => p.available && onSelect(p)}
          disabled={!p.available}
          style={{
            width: '100%', padding: '7px', border: 'none', borderTop: '1px solid var(--border)',
            background: p.available ? 'var(--green)' : 'var(--bg2)',
            color: p.available ? '#fff' : 'var(--text3)',
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600,
            cursor: p.available ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          }}
        >
          🛒 Agregar
        </button>
      </div>

      {showDetail && (
        <ProductDetailModal
          product={p}
          onClose={() => setShowDetail(false)}
          onAdd={onSelect}
        />
      )}
    </>
  )
}