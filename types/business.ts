// ─── TIPO PRINCIPAL: BUSINESS ────────────────────────────────────
export type Business = {
  id: string
  // Identificador único del negocio (UUID generado por Supabase)
  // Es la clave principal → se usa para rutas (/negocio/:id), updates y deletes

  name: string
  // Nombre del negocio
  // Ej: "Pollo la 23"

  category: string
  // Categoría del negocio
  // Debe coincidir con las usadas en el sistema:
  // Restaurante, Panadería, Barbería, etc.

  phone: string
  // Número de WhatsApp del negocio (SIN formato)
  // Ej: "573001234567"
  // Se usa para generar el link wa.me

  address: string | null
  // correo electronico personal o de la empresa (SIN formato)
  // Ej: "ejemplo@gmail.com"

  description: string
  // Descripción corta del negocio
  // Se muestra en Home (BizCard) y Detail

  image_url: string | null
  // URL pública de la imagen (logo o foto)
  // null = no tiene imagen → se usa emoji fallback

  schedule: string
  // campo legacy, lo mantenemos por compatibilidad

  schedule_days: string[] 
  // ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
  
  schedule_open1: string
  // '07:00'
  
  schedule_close1: string
  // '12:00'
  
  schedule_open2: string
  // '14:00' (vacío si no hay franja tarde)
  
  schedule_close2: string
  // '18:00' (vacío si no hay franja tarde)
  
  schedule_note: string
  // nota libre

  is_active: boolean
  // Controla si el negocio aparece en el Home
  // true → visible
  // false → oculto (pero sigue existiendo en admin)

  created_at: string
  // Fecha de creación (timestamp)
  // Se usa para ordenar (más recientes primero)
}