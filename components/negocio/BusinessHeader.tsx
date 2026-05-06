'use client'

import { useRouter } from 'next/navigation'
import { Business } from '@/types/business'

import { CATS_META } from '@/constants/categories'

interface Props {
  biz: Business
}

export default function BusinessHeader({ biz }: Props) {
  const router = useRouter()
  const meta = CATS_META[biz.category] ?? CATS_META['Otro']

  return (
    <div style={{ background: 'var(--green)', padding: '16px' }}>

      {/* Botón atrás + nombre + categoría */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer' }}
        >
          ←
        </button>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{biz.name}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{biz.category}</div>
        </div>
      </div>

      {/* Imagen o emoji fallback */}
      <div style={{ width: '100%', height: '180px', borderRadius: '12px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {biz.image_url ? (
          <img src={biz.image_url} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${biz.image_focal_x ?? 50}% ${biz.image_focal_y ?? 50}%` }} />
        ) : (
          <span style={{ fontSize: '56px' }}>{meta.emoji}</span>
        )}
      </div>
    </div>
  )
}