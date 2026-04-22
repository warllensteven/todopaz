'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import WhatsAppButton from '@/components/WhatsAppButton'
import NavBar from '@/components/NavBar'

const CATS_META: Record<string, { emoji: string; bg: string }> = {
  'Restaurante': { emoji: '🍽', bg: '#E1F5EE' },
  'Panadería':   { emoji: '🥐', bg: '#FAEEDA' },
  'Barbería':    { emoji: '✂️', bg: '#EEEDFE' },
  'Tienda':      { emoji: '🛒', bg: '#FAECE7' },
  'Servicio':    { emoji: '🔧', bg: '#E6F1FB' },
  'Farmacia':    { emoji: '💊', bg: '#EAF3DE' },
  'Otro':        { emoji: '📦', bg: '#F1EFE8' },
}

const WA_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
  </svg>
)

export default function DetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const router = useRouter()
  const [biz, setBiz] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function fetchBiz() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setBiz(data)
      }

      setLoading(false)
    }

    fetchBiz()
  }, [id])

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

  const meta = CATS_META[biz.category] ?? CATS_META['Otro']
  const waMsg = encodeURIComponent(
    'Hola, vi tu negocio en TodoPaz y me gustaría obtener más información.'
  )

  return (
    <>
      <NavBar />

      {/* Header */}
      <div style={{ background: 'var(--green)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={() => router.back()}
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

        {/* Imagen */}
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
            <span style={{ fontSize: '56px' }}>{meta.emoji}</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 80px' }}>
        <p><strong>Descripción:</strong> {biz.description}</p>
        <p><strong>Horario:</strong> {biz.schedule}</p>
        <p><strong>Teléfono:</strong> +{biz.phone}</p>

        {/* Botón WhatsApp */}
<WhatsAppButton phone={biz.phone} />
      </div>
    </>
  )
}