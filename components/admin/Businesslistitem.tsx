'use client'
 
import { useRouter } from 'next/navigation'
import { Business } from '@/types/business'
 
interface Props {
  business: Business
  onEdit: (b: Business) => void
  onDelete: (id: string) => void
}
 
export default function BusinessListItem({ business: b, onEdit, onDelete }: Props) {
  const router = useRouter()
 
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
 
      {/* Punto de color: verde si activo, gris si inactivo */}
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.is_active ? 'var(--green-mid)' : 'var(--gray)', flexShrink: 0 }} />
 
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '14px' }}>{b.name}</div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
          {b.category}
          {b.schedule_days?.length > 0
            ? ` · ${b.schedule_days[0]}–${b.schedule_days[b.schedule_days.length - 1]} ${b.schedule_open1}–${b.schedule_close1}${b.schedule_open2 ? ' / ' + b.schedule_open2 + '–' + b.schedule_close2 : ''}`
            : b.schedule ? ` · ${b.schedule}` : ''
          }

          {/* Contador de visitas */}
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    background: 'var(--green-light)', color: 'var(--green)',
    fontSize: '11px', fontWeight: 600,
    padding: '2px 7px', borderRadius: '10px',
  }}>
    👁 {b.visits ?? 0}
  </span>
        </div>
      </div>
 
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => onEdit(b)}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          Editar
        </button>
        <button
          onClick={() => router.push(`/admin/productos/${b.id}`)}
          style={{ background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          Productos
        </button>
        <button
          onClick={() => onDelete(b.id)}
          style={{ background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}