'use client'
// ↑ Este componente se ejecuta en el cliente.
// Necesario porque usamos hooks (useState, useEffect) y navegación dinámica.

// ─── IMPORTACIONES ───────────────────────────────────────────────
import { useEffect, useState } from 'react'
// useState → manejar estado (negocio, loading)
// useEffect → ejecutar lógica al cargar o cambiar el ID

import { useParams, useRouter } from 'next/navigation'
// useParams → obtener el [id] de la URL dinámica (/negocio/123)
// useRouter → navegación programática (ej: volver atrás)

import { supabase } from '@/lib/supabase'
// Cliente para consultar la base de datos

import { Business } from '@/types/business'
// Tipado del objeto negocio

import WhatsAppButton from '@/components/WhatsAppButton'
// Botón reutilizable para contactar por WhatsApp

import NavBar from '@/components/NavBar'
// Barra de navegación global


// ─── CONSTANTES ──────────────────────────────────────────────────
const CATS_META: Record<string, { emoji: string; bg: string }> = {
  // Mapa de categorías → define emoji + color de fondo
  'Restaurante': { emoji: '🍽', bg: '#E1F5EE' },
  'Panadería':   { emoji: '🥐', bg: '#FAEEDA' },
  'Barbería':    { emoji: '✂️', bg: '#EEEDFE' },
  'Tienda':      { emoji: '🛒', bg: '#FAECE7' },
  'Servicio':    { emoji: '🔧', bg: '#E6F1FB' },
  'Farmacia':    { emoji: '💊', bg: '#EAF3DE' },
  'Otro':        { emoji: '📦', bg: '#F1EFE8' },
}

// ⚠️ Este ícono no se usa actualmente (podrías eliminarlo o usarlo en el botón WA)
const WA_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.520..." />
  </svg>
)


// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function DetailPage() {

  // ─── PARAMETROS Y ROUTER ───────────────────────────────────────
  const params = useParams()
  // Obtiene los parámetros dinámicos de la URL

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  // Normaliza el id:
  // Next puede devolver string o string[]
  // Aquí garantizamos que siempre sea string

  const router = useRouter()
  // Permite navegación (ej: router.back())


  // ─── ESTADO ────────────────────────────────────────────────────
  const [biz, setBiz] = useState<Business | null>(null)
  // Guarda el negocio cargado desde la DB

  const [loading, setLoading] = useState(true)
  // Controla estado de carga


  // ─── EFECTO: CARGAR NEGOCIO ────────────────────────────────────
  useEffect(() => {
    if (!id) return
    // Evita ejecutar si aún no hay ID disponible

    async function fetchBiz() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()
      // .single() → esperamos un solo resultado

      if (error) {
        console.error(error)
      } else {
        setBiz(data)
      }

      setLoading(false)
    }

    fetchBiz()
  }, [id])
  // Se ejecuta cuando cambia el ID (ej: navegación entre negocios)


  // ─── RENDER: LOADING ───────────────────────────────────────────
  if (loading) {
    return (
      <>
        <NavBar />
        <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
          Cargando...
        </p>
      </>
    )
  }


  // ─── RENDER: NO ENCONTRADO ─────────────────────────────────────
  if (!biz) {
    return (
      <>
        <NavBar />
        <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
          Negocio no encontrado
        </p>
      </>
    )
  }


  // ─── DATOS DERIVADOS ───────────────────────────────────────────
  const meta = CATS_META[biz.category] ?? CATS_META['Otro']
  // Obtiene estilo visual según categoría

  const waMsg = encodeURIComponent(
    'Hola, vi tu negocio en TodoPaz y me gustaría obtener más información.'
  )
  // Mensaje base para WhatsApp (no se usa directamente aquí,
  // pero podrías pasarlo como prop al botón)


  // nuevo ajuste de horario
  
function formatDays(days: string[]): string {
  // Convierte ['Lun','Mar','Mié','Jue','Vie','Sáb'] → 'Lun – Sáb'
  // en vez de mostrar todos los días separados
  const order = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  if (!days?.length) return ''
  const sorted = days.sort((a, b) => order.indexOf(a) - order.indexOf(b))
  if (sorted.length === 1) return sorted[0]
  return `${sorted[0]} – ${sorted[sorted.length - 1]}`
}

  function formatHour(h: string) {
  if (!h) return ''
  const [hours, minutes] = h.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${h12}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

function isOpenNow(biz: Business): boolean {
  if (!biz.schedule_days?.length) return false
  const now = new Date()
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const today = days[now.getDay()]
  if (!biz.schedule_days.includes(today)) return false
  const currentTime = now.getHours() * 60 + now.getMinutes()
  const [open1H, open1M] = (biz.schedule_open1 || '').split(':').map(Number)
  const [close1H, close1M] = (biz.schedule_close1 || '').split(':').map(Number)
  if (currentTime >= open1H * 60 + open1M && currentTime < close1H * 60 + close1M) return true
  if (biz.schedule_open2 && biz.schedule_close2) {
    const [open2H, open2M] = biz.schedule_open2.split(':').map(Number)
    const [close2H, close2M] = biz.schedule_close2.split(':').map(Number)
    if (currentTime >= open2H * 60 + open2M && currentTime < close2H * 60 + close2M) return true
  }
  return false
}

  // ─── RENDER PRINCIPAL ──────────────────────────────────────────
  return (
    <>
      <NavBar />

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background: 'var(--green)', padding: '16px' }}>

        {/* Botón atrás + título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={() => router.back()}
            // Navega a la página anterior
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
              {biz.name}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
              {biz.category}
            </div>
          </div>
        </div>

        {/* Imagen del negocio */}
        <div
          style={{
            width: '100%',
            height: '180px',
            borderRadius: '12px',
            background: meta.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {biz.image_url ? (
            <img
              src={biz.image_url}
              alt={biz.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // Si no hay imagen → mostramos emoji
            <span style={{ fontSize: '56px' }}>{meta.emoji}</span>
          )}
        </div>
      </div>


      <div style={{ padding: '20px 16px 80px' }}>
  
  {/* Descripción */}
  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: '12px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Descripción</div>
    <div style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.6 }}>{biz.description}</div>
  </div>

  {/* Horario y Teléfono en fila */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px 18px' }}>
  
  {/* Título + badge abierto/cerrado */}
  <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px'
}}>

  <div style={{
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--green)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}>
    Horario
  </div>

  {/* Estado: Abierto / Cerrado */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    
    <span style={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
      background: isOpenNow(biz) ? '#1D9E75' : '#E53E3E',
      boxShadow: isOpenNow(biz)
        ? '0 0 0 3px rgba(29,158,117,0.2)'
        : '0 0 0 3px rgba(229,62,62,0.2)',
    }} />

    <span style={{
      fontSize: '12px',
      fontWeight: 600,
      color: isOpenNow(biz) ? '#1D9E75' : '#E53E3E',
    }}>
      {isOpenNow(biz) ? 'Abierto' : 'Cerrado'}
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

  {/* Fallback por si el negocio tiene solo el campo legacy */}
  {!biz.schedule_days?.length && biz.schedule && (
    <div style={{ fontSize: '14px', color: 'var(--text2)' }}>{biz.schedule}</div>
  )}
</div>
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '16px 18px' }}>
  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Teléfono</div>
  <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>+{biz.phone}</div>

  {biz.address && (
    <>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '12px' }}>Direccion</div>
      <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
        <a href={`mailto:${biz.address}`} style={{ color: 'var(--text)', textDecoration: 'none', wordBreak: 'break-all' }}>{biz.address}</a>
      </div>
    </>
  )}
</div>
  </div>

  {/* Botón WhatsApp */}
  

<WhatsAppButton phone={biz.phone} />
  <p style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', marginTop: '8px' }}>
    Abre WhatsApp con un mensaje listo para enviar
  </p>
</div>

      
    </>
  )
}