🧩 Business Type (types/business.ts)
🧠 Descripción general

Este archivo define el tipo Business, que representa la estructura de un negocio dentro de la aplicación.

Es fundamental porque:

🧾 Define el modelo de datos
🛡 Evita errores de tipado
⚡ Mejora el autocompletado
🔄 Asegura consistencia entre frontend y backend
📦 Definición del tipo
export type Business = {
id: string
name: string
category: string
phone: string
description: string
image_url: string | null
schedule: string
is_active: boolean
created_at: string
}
🧱 Estructura del modelo
Campo Tipo Descripción
id string Identificador único del negocio
name string Nombre del negocio
category string Categoría (Restaurante, Tienda, etc.)
phone string Número de contacto (WhatsApp)
description string Descripción del negocio
image_url string | null URL de imagen o logo
schedule string Horario de atención
is_active boolean Estado (activo/inactivo)
created_at string Fecha de creación
🔍 Explicación clave
🆔 id
Generado por Supabase (UUID o auto)
Usado para:
Navegación (/negocio/[id])
Edición
Eliminación
🏷 category
Define el tipo de negocio
Se usa para:
Filtros (CategoryFilter)
UI (emoji, colores)
📞 phone
Número usado por WhatsAppButton
Se limpia antes de usarse (replace(/\D/g, ''))
🖼 image_url
string | null
🔍 Por qué puede ser null:
No todos los negocios tienen imagen
Se usa fallback (emoji)
🕒 schedule
Texto libre

Ejemplo:

Lun-Sáb 7am - 7pm
🔘 is_active
Controla visibilidad en el Home
.eq('is_active', true)
🎯 Uso:

✔ Ocultar negocios
✔ Moderación desde admin

📅 created_at
Generado automáticamente por Supabase
Usado para ordenar:
.order('created_at', { ascending: false })
🔄 Flujo de uso del tipo
Supabase (DB)
↓
Business (type)
↓
Componentes React
↓
UI renderizada
🧠 Dónde se utiliza

Este tipo se usa en:

🏠 page.tsx → listado
🛠 admin/page.tsx → CRUD
📄 negocio/[id] → detalle
🧩 BizCard → UI
📦 estado (useState<Business[]>)
🛡 Beneficios del tipado
❌ Sin tipos:
biz.nam // error silencioso
✅ Con tipos:
biz.name // autocompletado y validación
🚀 Buenas prácticas aplicadas

✔ Tipado centralizado
✔ Reutilización global
✔ Compatibilidad con Supabase
✔ Manejo de valores opcionales (null)
✔ Modelo consistente

⚠️ Mejores prácticas recomendadas (PRO)
🧩 1. Separar DTOs

Para creación/edición:

export type BusinessInsert = Omit<Business, 'id' | 'created_at'>
🔄 2. Tipo parcial para updates
export type BusinessUpdate = Partial<Business>
🎯 3. Tipar categorías (MUY PRO)

Evitar strings libres:

export type Category =
| 'Restaurante'
| 'Panadería'
| 'Barbería'
| 'Tienda'
| 'Servicio'
| 'Farmacia'
| 'Otro'

Y usarlo:

category: Category
🧠 4. Tipos generados automáticamente

Desde Supabase:

npx supabase gen types typescript
🔐 5. Validación runtime (avanzado)

Usar librerías como:

Zod
Yup
🧠 Relación con la base de datos

Este tipo refleja la tabla:

businesses
📦 Columnas:
id
name
category
phone
description
image_url
schedule
is_active
created_at
📈 Resumen de mejoras
Se documentó el modelo de datos principal
Se explicó cada campo y su propósito
Se detalló el flujo de uso en la app
Se mostraron beneficios del tipado
Se propusieron mejoras tipo producción
Se alineó con arquitectura backend
