// SIN 'use client' — corre en el servidor
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import NegocioClient from './NegocioClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { id } = await params

  const { data: biz } = await supabaseServer
    .from('businesses')
    .select('name, description, image_url, category')
    .eq('id', id)
    .single()

  if (!biz) {
    return {
      title: 'Negocio no encontrado'
    }
  }

  const title = biz.name

  const description =
    biz.description ??
    `${biz.category} en Paz de Ariporo, Casanare. Contáctanos por WhatsApp.`

  return {
    title,
    description,

    openGraph: {
      title: `${title} | TodoPaz`,
      description,
      type: 'website',
      locale: 'es_CO',

      images: biz.image_url
        ? [
            {
              url: biz.image_url,
              alt: title
            }
          ]
        : [
            {
              url: '/logo.png',
              alt: 'TodoPaz'
            }
          ]
    },

    twitter: {
      card: 'summary_large_image',
      title: `${title} | TodoPaz`,
      description,
      images: biz.image_url
        ? [biz.image_url]
        : ['/logo.png']
    }
  }
}

export default async function NegocioPage(
  { params }: Props
) {

  const { id } = await params

  return <NegocioClient id={id} />
}