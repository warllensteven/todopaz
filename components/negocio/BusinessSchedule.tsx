'use client'
 
import { Business } from '@/types/business'
import { isOpenNow, formatDays, formatHour } from '@/lib/businessUtils'
 
interface Props {
  biz: Business
}
 
export default function BusinessSchedule({ biz }: Props) {
  const open = isOpenNow(biz)
 
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px 18px' }}>
 
      {/* Título + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Horario
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', background: open ? '#1D9E75' : '#E53E3E', boxShadow: open ? '0 0 0 3px rgba(29,158,117,0.2)' : '0 0 0 3px rgba(229,62,62,0.2)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: open ? '#1D9E75' : '#E53E3E' }}>
            {open ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
      </div>
 
      {/* Días */}
      {biz.schedule_days?.length > 0 && (
        <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
          {formatDays(biz.schedule_days)}
        </div>
      )}
 
      {/* Franja mañana */}
      {biz.schedule_open1 && (
        <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '2px' }}>
          {formatHour(biz.schedule_open1)} – {formatHour(biz.schedule_close1)}
        </div>
      )}
 
      {/* Franja tarde */}
      {biz.schedule_open2 && (
        <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '2px' }}>
          {formatHour(biz.schedule_open2)} – {formatHour(biz.schedule_close2)}
        </div>
      )}
 
      {/* Nota especial */}
      {biz.schedule_note && (
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '6px', fontStyle: 'italic' }}>
          * {biz.schedule_note}
        </div>
      )}
 
      {/* Fallback campo legacy */}
      {!biz.schedule_days?.length && biz.schedule && (
        <div style={{ fontSize: '14px', color: 'var(--text2)' }}>{biz.schedule}</div>
      )}
    </div>
  )
}