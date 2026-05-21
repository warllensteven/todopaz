import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import NegocioClient from './NegocioClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── TIPO COMPARTIDO ─────────────────────────────────────────────
type BizSEO = {
  name: string
  description: string | null
  image_url: string | null
  category: string
  phone: string
  address: string | null
  schedule_days: string[]
  schedule_open1: string
  schedule_close1: string
  schedule_open2: string
  schedule_close2: string
}

// ─── DÍAS AL FORMATO SCHEMA.ORG ──────────────────────────────────
const DAY_MAP: Record<string, string> = {
  'Lun': 'Mo', 'Mar': 'Tu', 'Mié': 'We',
  'Jue': 'Th', 'Vie': 'Fr', 'Sáb': 'Sa', 'Dom': 'Su'
}

function buildOpeningHours(biz: BizSEO): string[] {
  if (!biz.schedule_days?.length) return []

  const days = biz.schedule_days.map(d => DAY_MAP[d] ?? d).join('-')
  const hours: string[] = []

  if (biz.schedule_open1 && biz.schedule_close1) {
    hours.push(`${days} ${biz.schedule_open1}-${biz.schedule_close1}`)
  }

  if (biz.schedule_open2 && biz.schedule_close2) {
    hours.push(`${days} ${biz.schedule_open2}-${biz.schedule_close2}`)
  }

  return hours
}

// ─── SELECT COMPARTIDO ───────────────────────────────────────────
// Un solo string para no repetirlo en generateMetadata y NegocioPage
const SELECT_FIELDS = 'name, description, image_url, category, phone, address, schedule_days, schedule_open1, schedule_close1, schedule_open2, schedule_close2'

// ─── METADATA ────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {

  const { id } = await params

  const { data: biz } = await supabaseServer
    .from('businesses')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single() as { data: BizSEO | null, error: unknown }

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

// ─── PÁGINA ──────────────────────────────────────────────────────
export default async function NegocioPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Mismo select que generateMetadata — incluye campos de horario
  const { data: biz } = await supabaseServer
    .from('businesses')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single() as { data: BizSEO | null, error: unknown }

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
  postalCode: '856040', 
},
    url: `https://todopaz.vercel.app/negocio/${id}`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 5.8797,
      longitude: -71.8917,
    },
    areaServed: 'Paz de Ariporo, Casanare, Colombia',
    currenciesAccepted: 'COP',
    priceRange: '$$',
    openingHours: buildOpeningHours(biz),
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