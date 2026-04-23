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


      {/* ─── INFORMACIÓN ─────────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 80px' }}>
        <p><strong>Descripción:</strong> {biz.description}</p>
        <p><strong>Horario:</strong> {biz.schedule}</p>
        <p><strong>Teléfono:</strong> +{biz.phone}</p>

        {/* Botón de contacto */}
        <WhatsAppButton phone={biz.phone} />
      </div>
    </>
  )
}