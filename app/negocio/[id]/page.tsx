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
    .select('name, description, image_url, category, phone, address')
    .eq('id', params.id)
    .single()

  if (!biz) return { title: 'Negocio no encontrado' }

  const title = biz.name
  const description = biz.description
    ?? `${biz.category} en Paz de Ariporo, Casanare. Contáctanos por WhatsApp.`

  return {
    title,
    description,

    // ← URL canónica — evita contenido duplicado
    alternates: {
      canonical: `https://todopaz.vercel.app/negocio/${params.id}`
    },

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

export default async function NegocioPage(
  { params }: { params: { id: string } }
) {
  // Traemos el negocio en el servidor para el JSON-LD
  const { data: biz } = await supabaseServer
    .from('businesses')
    .select('name, description, image_url, category, phone, address')
    .eq('id', params.id)
    .single()

  // JSON-LD — datos estructurados para Google
  const jsonLd = biz ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: biz.name,
    description: biz.description,
    telephone: `+${biz.phone}`,
    image: biz.image_url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: biz.address ?? '',
      addressLocality: 'Paz de Ariporo',
      addressRegion: 'Casanare',
      addressCountry: 'CO',
    },
    url: `https://todopaz.vercel.app/negocio/${params.id}`,
  } : null

  return (
    <>
      {/* JSON-LD inyectado en el <head> por Next.js */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NegocioClient id={params.id} />
    </>
  )
}