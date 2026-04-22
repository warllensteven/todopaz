'use client'

type Props = {
  phone: string
  message?: string
}

export default function WhatsAppButton({ phone, message }: Props) {
  if (!phone) return null

  const waMsg = encodeURIComponent(
    message || 'Hola, vi tu negocio en TodoPaz y me gustaría obtener más información.'
  )

  const cleanPhone = phone.replace(/\D/g, '')

  return (
    <a
      href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-btn"
    >
<svg className="wa-icon" viewBox="0 0 24 24">
  <path d="M12.04 2C6.52 2 2.06 6.46 2.06 11.98c0 1.92.5 3.8 1.46 5.47L2 22l4.72-1.46a9.94 9.94 0 005.32 1.53h.01c5.52 0 9.98-4.46 9.98-9.98S17.56 2 12.04 2zm5.73 14.39c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.14.1-1.84-.13-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.15-.2-1.19-1.58-1.19-3.01 0-1.43.75-2.14 1.01-2.43.27-.3.58-.37.77-.37.2 0 .39 0 .56.01.18.01.43-.07.67.51.24.57.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.32.38-.45.51-.15.15-.3.32-.13.63.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.3.15.47.13.64-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.71.8 2 .94.3.15.5.22.57.34.07.13.07.75-.17 1.43z"/>
</svg>

      Contactar por WhatsApp

      <style jsx>{`
        .wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 15px;
          margin-top: 20px;
          background: var(--green);
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .wa-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        /* 🔥 Hover (desktop) */
        .wa-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        /* 🔥 Click / tap */
        .wa-btn:active {
          filter: brightness(0.9);
          transform: scale(0.98);
        }
      `}</style>
    </a>
  )
}