import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Traer todos los negocios activos
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, created_at, slug')
    .eq('is_active', true)

const businessUrls = (businesses ?? []).map(b => ({
  url: `https://todopaz.vercel.app/negocio/${b.slug ?? b.id}`,
  lastModified: new Date(b.created_at),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}))

  return [
    {
      url: 'https://todopaz.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...businessUrls,
  ]
}