'use client'

import { Product } from '@/types/product'

interface Props {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (id: string) => void
  onToggleAvailable: (p: Product) => void
}

export default function ProductListItem({ product: p, onEdit, onDelete, onToggleAvailable }: Props) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>

      {/* Imagen o placeholder */}
      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'var(--bg2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
        {p.image_url
          ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '📦'
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text)' }}>{p.name}</div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
          ${p.price.toLocaleString('es-CO')}
        </div>
      </div>

      {/* Toggle disponible */}
      <button
        onClick={() => onToggleAvailable(p)}
        style={{
          padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
          border: 'none', cursor: 'pointer',
          background: p.available ? 'var(--green-light)' : '#FCEBEB',
          color: p.available ? 'var(--green)' : '#A32D2D',
        }}
      >
        {p.available ? 'Disponible' : 'Agotado'}
      </button>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => onEdit(p)}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(p.id)}
          style={{ background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}