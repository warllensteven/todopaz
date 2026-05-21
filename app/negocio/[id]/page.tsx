import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import NegocioClient from './NegocioClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ← params ahora es Promise en Next.js 15
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {

  const { id } = await params  // ← await aquí

  const { data: biz } = await supabaseServer
    .from('businesses')
    .select('name, description, image_url, category, phone, address')
    .eq('id', id)
    .single()

  if (!biz) return { title: 'Negocio no encontrado' }

  const title = biz.name
  const description = biz.description
    ?? `${biz.category} en Paz de Ariporo, Casanare. Contáctanos por WhatsApp.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://todopaz.vercel.app/negocio/${id}`
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
  { params }: { params: Promise<{ id: string }> }  // ← Promise aquí también
) {
  const { id } = await params  // ← await aquí

  const { data: biz } = await supabaseServer
    .from('businesses')
    .select('name, description, image_url, category, phone, address')
    .eq('id', id)
    .single()

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
    url: `https://todopaz.vercel.app/negocio/${id}`,
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NegocioClient id={id} />
    </>
  )
}