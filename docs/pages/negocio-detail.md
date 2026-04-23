# 🏪 Detalle de Negocio (`negocio/[id]/page.tsx`)

## 🧠 Descripción general

Este módulo representa la **página de detalle de un negocio específico**.

Se accede mediante una ruta dinámica:

/negocio/[id]

Ejemplo:

/negocio/123

Permite:

- 📄 Ver información completa del negocio
- 🖼 Visualizar imagen o placeholder
- 📞 Contactar por WhatsApp
- 🔙 Navegar hacia atrás

---

## ⚙️ Tipo de componente

```ts
'use client'

✔ Ejecutado en el cliente
✔ Permite uso de hooks (useState, useEffect)
✔ Manejo de navegación (useRouter)

📦 Importaciones
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import WhatsAppButton from '@/components/WhatsAppButton'
import NavBar from '@/components/NavBar'
Módulo	Función
useParams	Obtener ID desde la URL
useRouter	Navegación programática
supabase	Acceso a base de datos
Business	Tipado del modelo
WhatsAppButton	Acción de contacto
NavBar	Barra superior
🧩 Configuración visual por categoría
const CATS_META: Record<string, { emoji: string; bg: string }>
🎯 Propósito:

Define apariencia visual según categoría:

Emoji representativo
Color de fondo

Ejemplo:

Categoría	Emoji	Fondo
Restaurante	🍽	Verde claro
Farmacia	💊	Verde suave
Otro	📦	Neutro
🧠 Estados del componente
const [biz, setBiz] = useState<Business | null>(null)

Negocio actual cargado desde la base de datos.

const [loading, setLoading] = useState(true)

Controla estado de carga.

🧭 Obtención del ID
const params = useParams()
const id = Array.isArray(params.id) ? params.id[0] : params.id
🔍 Explicación:
Next.js puede devolver id como array o string
Se normaliza para asegurar un valor único
🔄 Carga de datos
useEffect(() => {
  if (!id) return

  async function fetchBiz() {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single()
🔍 Flujo:
Espera que exista id
Consulta Supabase
Busca por ID
Retorna un solo registro (.single())
⚠️ Manejo de errores
if (error) {
  console.error(error)
}

✔ Actualmente solo logea en consola
⚠️ Recomendación: mostrar feedback en UI

⏳ Estados de renderizado
Cargando
if (loading)

Muestra mensaje:

Cargando...
No encontrado
if (!biz)

Muestra:

Negocio no encontrado
🎨 Render principal
🔝 Header

Incluye:

Botón de regreso
Nombre del negocio
Categoría
onClick={() => router.back()}

✔ Navegación hacia la página anterior

🖼 Imagen del negocio
{biz.image_url ? <img /> : <emoji>}
🔍 Comportamiento:
Si hay imagen → se muestra
Si no → se usa emoji como placeholder
🧠 Meta dinámico
const meta = CATS_META[biz.category] ?? CATS_META['Otro']

✔ Fallback seguro si la categoría no existe

📞 Contacto por WhatsApp
<WhatsAppButton phone={biz.phone} />
🎯 Función:
Permite contactar directamente al negocio
Usa número almacenado en DB
📄 Información mostrada
Descripción
Horario
Teléfono

✔ Datos básicos del negocio
✔ Renderizados dinámicamente

🧠 Flujo general
🚀 Buenas prácticas aplicadas

✔ Uso de rutas dinámicas
✔ Tipado con TypeScript
✔ Render condicional
✔ Manejo de fallback (emoji)
✔ Separación UI / lógica

⚠️ Mejoras recomendadas (PRO)
❗ Manejo visual de errores (toast / alert)
⚡ Skeleton loader en vez de "Cargando..."
🖼 Optimización con next/image
🔒 Validación de ID
📊 Tracking de visitas (analytics)
📈 Resumen de mejoras
Se documentó el flujo completo de detalle
Se explicó uso de rutas dinámicas en Next.js
Se estructuró la lógica de fetch y render
Se añadieron buenas prácticas y mejoras PRO
Se dejó listo para integración en Wiki técnica
```
