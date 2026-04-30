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
  'Restaurante':      { emoji: '🍽', bg: '#E1F5EE' },
  'Panadería':        { emoji: '🥐', bg: '#FAEEDA' },
  'Barbería':         { emoji: '✂️', bg: '#EEEDFE' },
  'Supermercado':     { emoji: '🛒', bg: '#FAECE7' },
  'Estética':         { emoji: '💅', bg: '#FDE8F5' },
  'Accesorios':       { emoji: '💍', bg: '#FEF9E7' },
  'Servicio':         { emoji: '🔧', bg: '#E6F1FB' },
  'Farmacia':         { emoji: '💊', bg: '#EAF3DE' },
  'Ropa':             { emoji: '👕', bg: '#EAF0FB' },
  'Calzado':          { emoji: '👟', bg: '#FFF3E0' },
  'Tienda Naturista': { emoji: '🌿', bg: '#E8F5E9' },
  'Bar':              { emoji: '🍺', bg: '#FFF8E1' },
  'Otro':             { emoji: '📦', bg: '#F1EFE8' },
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


  // Funcion open/close
  function isOpenNow(biz: Business): boolean {
  if (!biz.schedule_days?.length) return false
  const now = new Date()
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const today = days[now.getDay()]
  if (!biz.schedule_days.includes(today)) return false

  const currentTime = now.getHours() * 60 + now.getMinutes()

  const [open1H, open1M] = (biz.schedule_open1 || '').split(':').map(Number)
  const [close1H, close1M] = (biz.schedule_close1 || '').split(':').map(Number)
  const open1 = open1H * 60 + open1M
  const close1 = close1H * 60 + close1M
  if (currentTime >= open1 && currentTime < close1) return true

  if (biz.schedule_open2 && biz.schedule_close2) {
    const [open2H, open2M] = biz.schedule_open2.split(':').map(Number)
    const [close2H, close2M] = biz.schedule_close2.split(':').map(Number)
    const open2 = open2H * 60 + open2M
    const close2 = close2H * 60 + close2M
    if (currentTime >= open2 && currentTime < close2) return true
  }

  return false
}

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
  background: isOpenNow(biz) ? 'var(--green-light)' : 'var(--red-light)',
color: isOpenNow(biz) ? 'var(--green)' : 'var(--red)',
  fontSize: '11px', fontWeight: 500, padding: '2px 8px',
  borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px',
}}>
  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
  {isOpenNow(biz) ? 'Abierto' : 'Cerrado'}
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