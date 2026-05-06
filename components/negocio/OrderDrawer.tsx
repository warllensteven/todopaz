'use client'

import { Product } from '@/types/product'

interface OrderItem {
  product: Product
  quantity: number
}

interface Props {
  items: OrderItem[]
  phone: string
  businessName: string
  onClose: () => void
  onIncrement: (productId: string) => void
  onDecrement: (productId: string) => void
}

export default function OrderDrawer({ items, phone, businessName, onClose, onIncrement, onDecrement }: Props) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  function buildWhatsAppMessage() {
    const lines = items.map(i => `• ${i.product.name} x${i.quantity} — $${(i.product.price * i.quantity).toLocaleString('es-CO')}`)
    const msg = [
      `Hola, quiero hacer un pedido desde TodoPaz:`,
      '',
      ...lines,
      '',
      `*Total: $${total.toLocaleString('es-CO')}*`,
    ].join('\n')
    return encodeURIComponent(msg)
  }

  const cleanPhone = phone.replace(/\D/g, '')

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
    >
      <div style={{ background: 'var(--bg)', borderRadius: '16px 16px 0 0', padding: '24px 16px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>
            Tu pedido
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text3)' }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {items.map(({ product: p, quantity }) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

              {/* Imagen */}
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'var(--bg2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '💊'
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>
                  ${(p.price * quantity).toLocaleString('es-CO')}
                </div>
              </div>

              {/* Cantidad */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onDecrement(p.id)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
                <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => onIncrement(p.id)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'var(--green)', cursor: 'pointer', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--border)', marginBottom: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Total</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
            ${total.toLocaleString('es-CO')}
          </span>
        </div>

        {/* Botón confirmar */}
        <a
          href={`https://wa.me/${cleanPhone}?text=${buildWhatsAppMessage()}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px', background: 'var(--green)', color: '#fff', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 600, fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.52 2 2.06 6.46 2.06 11.98c0 1.92.5 3.8 1.46 5.47L2 22l4.72-1.46a9.94 9.94 0 005.32 1.53h.01c5.52 0 9.98-4.46 9.98-9.98S17.56 2 12.04 2zm5.73 14.39c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.14.1-1.84-.13-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.15-.2-1.19-1.58-1.19-3.01 0-1.43.75-2.14 1.01-2.43.27-.3.58-.37.77-.37.2 0 .39 0 .56.01.18.01.43-.07.67.51.24.57.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.32.38-.45.51-.15.15-.3.32-.13.63.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.3.15.47.13.64-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.71.8 2 .94.3.15.5.22.57.34.07.13.07.75-.17 1.43z"/>
          </svg>
          Confirmar pedido por WhatsApp
        </a>
      </div>
    </div>
  )
}