'use client'
 
import { Business } from '@/types/business'
 
interface Props {
  biz: Business
}
 
export default function BusinessContact({ biz }: Props) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px 18px' }}>
 
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
        Teléfono
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
        +{biz.phone}
      </div>
 
      {biz.address && (
        <>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '12px' }}>
            Dirección
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
            {biz.address}
          </div>
        </>
      )}
    </div>
  )
}
 