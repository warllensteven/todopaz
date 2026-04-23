🧩 BizCard (BizCard.tsx)
🧠 Descripción general

Este componente representa una tarjeta visual reutilizable para mostrar un negocio.

Se utiliza en:

🏠 Página principal (page.tsx)
🔍 Resultados filtrados
🎯 Responsabilidades:
Mostrar información básica del negocio
Renderizar imagen o fallback (emoji)
Indicar estado (abierto)
Permitir navegación al detalle del negocio
📦 Importaciones
import Link from 'next/link'
import { Business } from '@/types/business'
Importación Función
Link Navegación sin recarga (Next.js)
Business Tipado del objeto negocio
🏷 Metadata de categorías
const CATS_META: Record<string, { emoji: string; bg: string }>
🎯 Propósito:
Asociar cada categoría con:
🎨 Color de fondo
😀 Emoji representativo
📌 Ejemplo:
'Restaurante': { emoji: '🍽', bg: '#E1F5EE' }
🧩 Props del componente
export default function BizCard({ biz }: { biz: Business })
Prop Tipo Descripción
biz Business Datos del negocio
🔗 Navegación dinámica

<Link href={`/negocio/${biz.id}`}>
🧠 Explicación:
Usa rutas dinámicas de Next.js ([id])
Redirige a:
/negocio/123
🚀 Beneficios:
Navegación rápida (sin reload)
Optimizada por Next.js
🧠 Resolución de metadata
const meta = CATS_META[biz.category] ?? CATS_META['Otro']
🎯 Qué hace:
Busca metadata según categoría
Si no existe → fallback a "Otro"
🎨 Estructura UI
🟢 1. Contenedor principal
Tarjeta clickable
Estilo tipo card (border + shadow)
Hover implícito (transition)
🟡 2. Imagen / Emoji
{biz.image_url
  ? <img ... />
  : meta.emoji
}
📌 Comportamiento:
Si hay imagen → la muestra
Si no → muestra emoji
🎯 Beneficio:
Evita tarjetas vacías
Mejora UX visual
🔵 3. Información del negocio
🏷 Nombre + estado
{biz.name}
<span>Abierto</span>
Nombre destacado
Badge visual de estado

⚠️ Actualmente el estado es estático ("Abierto")

📂 Categoría
{biz.category}
Texto secundario
Ayuda a identificar tipo de negocio
📝 Descripción
{biz.description}
📌 Características:
Texto truncado (ellipsis)
Evita romper el layout
🔄 Flujo de navegación
BizCard → click → /negocio/[id] → DetailPage
🚀 Buenas prácticas aplicadas

✔ Componente reutilizable
✔ Separación de responsabilidades
✔ Uso de tipado fuerte (TypeScript)
✔ Navegación optimizada (Next.js Link)
✔ Fallback visual (emoji)
✔ UI consistente

⚠️ Mejoras recomendadas (PRO)
🧠 Lógica real de estado

Actualmente:

"Abierto" → siempre fijo

👉 Mejor:

Calcular según horario (schedule)
Mostrar:
🟢 Abierto
🔴 Cerrado
🖼 Optimización de imágenes

Reemplazar:

<img />

Por:

next/image

Beneficios:

Lazy loading
Optimización automática
Mejor performance
⚡ Interacción UI
Hover effect (scale / shadow)
Click feedback
Skeleton loading
🧱 Reutilización avanzada

Convertir en:

<Card variant="business" />

Para escalar diseño

📈 Resumen de mejoras
Se documentó el componente visual principal de negocios
Se explicó la navegación dinámica con Next.js
Se detalló la lógica de fallback de imagen
Se estructuró la UI en bloques reutilizables
Se identificaron mejoras para escalar a producción
