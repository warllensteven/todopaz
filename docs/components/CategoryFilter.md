🏷 CategoryFilter (CategoryFilter.tsx)
🧠 Descripción general

Este componente representa un filtro horizontal de categorías reutilizable.

Se utiliza para:

🔍 Filtrar negocios por categoría
🎯 Mejorar la navegación del usuario
♻️ Reutilizar lógica de filtrado en distintas páginas
📦 Importaciones
'use client'
🎯 Propósito:
Indica que el componente se ejecuta en el cliente
Necesario porque:
Maneja eventos (onClick)
Actualiza estado desde el padre
🧩 Props del componente
type Props = {
categories: string[]
selected: string
onSelect: (cat: string) => void
total?: number
}
Prop Tipo Descripción
categories string[] Lista de categorías disponibles
selected string Categoría actualmente seleccionada
onSelect function Callback al hacer click
total number (opcional) Total de negocios
🏷 Mapa de emojis
const CATS_EMOJI: Record<string, string>
🎯 Propósito:
Asociar cada categoría con un emoji
Mejorar la experiencia visual
🔄 Render dinámico
categories.map((cat) => { ... })
🧠 Qué hace:
Itera sobre todas las categorías
Genera un botón por cada una
🎯 Lógica de selección
const isActive = selected === cat
📌 Comportamiento:
Determina si la categoría está activa
Cambia estilos dinámicamente
🖱 Interacción
onClick={() => onSelect(cat)}
🔁 Flujo:
Click → CategoryFilter → onSelect → Page.tsx → setCategory → re-render
🎨 Estilos dinámicos
background: isActive ? 'var(--amber)' : 'rgba(...)'
🎯 Diferencias:
Estado Estilo
Activo Color destacado
Inactivo Fondo tenue
🧾 Render del contenido
{cat === 'Todos'
? `Todos (${total})`
: `${CATS_EMOJI[cat]} ${cat}`}
📌 Comportamiento:
"Todos" muestra contador total
Otras categorías muestran:
Emoji + nombre
📱 UX: Scroll horizontal
overflowX: 'auto'
🎯 Beneficio:
Compatible con móviles
Permite muchas categorías sin romper layout
🔄 Flujo de datos completo
Page.tsx
↓
CategoryFilter
↓ (onSelect)
Page.tsx (setCategory)
↓
Filtro aplicado
↓
UI actualizada
🚀 Buenas prácticas aplicadas

✔ Componente desacoplado
✔ Reutilizable en múltiples páginas
✔ Props tipadas (TypeScript)
✔ UI reactiva basada en estado
✔ Separación de lógica (padre) y UI (hijo)

⚠️ Mejores prácticas recomendadas (PRO)
🧠 Evitar duplicación de constantes

Actualmente:

CATS_EMOJI está aquí
También en page.tsx y BizCard

👉 Mejor:

/constants/categories.ts
⚡ Accesibilidad

Agregar:

aria-pressed={isActive}

👉 Mejora para lectores de pantalla

🎯 Mejorar selección visual
Animación más clara (scale / shadow)
Indicador inferior activo
🧱 Escalabilidad

Convertir en componente más genérico:

<FilterChips />

Para reutilizar en:

Filtros de productos
Tags
Búsquedas
📈 Resumen de mejoras
Se documentó el componente de filtrado reutilizable
Se explicó el flujo de interacción con el padre
Se detalló el render dinámico de categorías
Se identificaron oportunidades de reutilización
Se propusieron mejoras de arquitectura
