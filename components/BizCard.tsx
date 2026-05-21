import Link from 'next/link'
import { Business } from '@/types/business'
import { CATS_META } from '@/constants/categories'
import { isOpenNow } from '@/lib/businessUtils'
 
export default function BizCard({ biz }: { biz: Business }) {
  const meta = CATS_META[biz.category] ?? CATS_META['Otro']
  const open = isOpenNow(biz)
 
  return (
    <Link href={`/negocio/${biz.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '14px', display: 'flex', gap: '14px', alignItems: 'flex-start', cursor: 'pointer', transition: 'all .2s' }}>
 
        {/* Imagen / emoji */}
        <div style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
          {biz.image_url
            ? <img src={biz.image_url} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            : meta.emoji
          }
        </div>
 
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', color: 'var(--text)' }}>
            {biz.name}
            <span style={{ background: open ? 'var(--green-light)' : 'var(--red-light)', color: open ? 'var(--green)' : 'var(--red)', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {open ? 'Abierto' : 'Cerrado'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>{biz.category}</div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {biz.description}
          </div>
        </div>
      </div>
    </Link>
  )
}
 