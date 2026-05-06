import { supabase } from '@/lib/supabase'

// Sube un Blob (imagen recortada) a Supabase Storage y retorna la URL pública
export async function uploadImage(blob: Blob, folder: string = 'general'): Promise<string> {
  const fileName = `${folder}/${Date.now()}.jpg`
  const { error } = await supabase.storage
    .from('businesses')
    .upload(fileName, blob, { upsert: true, contentType: 'image/jpeg' })

  if (error) throw new Error('Error subiendo imagen')

  const { data } = supabase.storage.from('businesses').getPublicUrl(fileName)
  return data.publicUrl
}