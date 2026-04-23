// ─── TARJETA DE NEGOCIO (BizCard) ────────────────────────────────
// Este componente representa UNA unidad del marketplace.
// Es lo que el usuario ve en el Home (lista de negocios).
// 👉 Es clave porque conecta descubrimiento → detalle.

import Link from 'next/link'
// Permite navegación entre páginas sin recargar (SPA behavior)

import { Business } from '@/types/business'
// Tipado del negocio → asegura estructura correcta de datos


// ─── METADATA DE CATEGORÍAS ──────────────────────────────────────
const CATS_META: Record<string, { emoji: string; bg: string }> = {
  'Restaurante': { emoji: '🍽', bg: '#E1F5EE' },
  'Panadería':   { emoji: '🥐', bg: '#FAEEDA' },
  'Barbería':    { emoji: '✂️', bg: '#EEEDFE' },
  'Tienda':      { emoji: '🛒', bg: '#FAECE7' },
  'Servicio':    { emoji: '🔧', bg: '#E6F1FB' },
  'Farmacia':    { emoji: '💊', bg: '#EAF3DE' },
  'Otro':        { emoji: '📦', bg: '#F1EFE8' },
}
// Mapa que define:
// - emoji visual
// - color de fondo
// según la categoría del negocio


// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function BizCard({ biz }: { biz: Business }) {

  const meta = CATS_META[biz.category] ?? CATS_META['Otro']
  // Obtiene metadata de la categoría
  // Si no existe → usa "Otro" como fallback (seguridad)


  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <Link
      href={`/negocio/${biz.id}`}
      // Navega al detalle del negocio
      // 👉 conecta Home → Detail

      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'var(--bg)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '14px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'all .2s',
      }}>

        {/* ─── IMAGEN / ICONO ───────────────────────────── */}
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-sm)',
          background: meta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          flexShrink: 0,
        }}>
          {biz.image_url
            ? (
              // Si el negocio tiene imagen → mostrarla
              <img
                src={biz.image_url}
                alt={biz.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
            )
            : (
              // Si no tiene imagen → mostrar emoji
              meta.emoji
            )
          }
        </div>


        {/* ─── INFORMACIÓN ─────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Nombre + estado */}
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            color: 'var(--text)',
          }}>
            {biz.name}

            {/* Badge de estado */}
            <span style={{
              background: 'var(--green-light)',
              color: 'var(--green)',
              fontSize: '11px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--green)',
                display: 'inline-block'
              }} />
              Abierto
            </span>
          </div>

          {/* Categoría */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text3)',
            marginBottom: '4px'
          }}>
            {biz.category}
          </div>

          {/* Descripción (truncate) */}
          <div style={{
            fontSize: '13px',
            color: 'var(--text2)',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {biz.description}
          </div>
        </div>
      </div>
    </Link>
  )
}