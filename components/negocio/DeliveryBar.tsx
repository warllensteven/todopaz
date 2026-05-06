'use client'

interface Props {
  deliveryTime?: string
  deliveryFee?: string
  deliveryNote?: string
}

export default function DeliveryBar({
  deliveryTime = '20–35 min',
  deliveryFee = 'Gratis',
  deliveryNote = 'pedidos +$20.000',
}: Props) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>
      <div style={{ flex: 1, padding: '10px 16px', borderRight: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>Entrega</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{deliveryTime}</div>
      </div>
      <div style={{ flex: 1, padding: '10px 16px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>Tarifa</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{deliveryFee}</div>
        {deliveryNote && (
          <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: '1px' }}>{deliveryNote}</div>
        )}
      </div>
    </div>
  )
}