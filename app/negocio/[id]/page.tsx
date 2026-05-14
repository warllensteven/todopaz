// SIN 'use client' — corre en el servidor
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import NegocioClient from './NegocioClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { data: biz } = await supabaseServer
    .from('businesses')
    .select('name, description, image_url, category')
    .eq('id', params.id)
    .single()

  if (!biz) return { title: 'Negocio no encontrado' }

  const title = biz.name
  const description = biz.description
    ?? `${biz.category} en Paz de Ariporo, Casanare. Contáctanos por WhatsApp.`

  return {
    title,
    description,
    openGraph: {
      title: `${biz.name} | TodoPaz`,
      description,
      type: 'website',
      locale: 'es_CO',
      images: biz.image_url
        ? [{ url: biz.image_url, alt: biz.name }]
        : [{ url: '/logo.png', alt: 'TodoPaz' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${biz.name} | TodoPaz`,
      description,
      images: biz.image_url ? [biz.image_url] : ['/logo.png'],
    },
  }
}

export default function NegocioPage({ params }: { params: { id: string } }) {
  // El server component solo pasa el id al client component
  return <NegocioClient id={params.id} />
}