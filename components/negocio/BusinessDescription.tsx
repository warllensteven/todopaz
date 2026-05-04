'use client'
 
interface Props {
  description: string
}
 
export default function BusinessDescription({ description }: Props) {
  if (!description) return null
 
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
        Descripción
      </div>
      <div style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.6 }}>
        {description}
      </div>
    </div>
  )
}
 