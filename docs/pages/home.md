🧠 Descripción general

Este archivo representa la página principal de la aplicación.

Su función es:

📦 Obtener negocios desde Supabase
🔍 Permitir búsqueda por texto
🏷 Filtrar por categorías
📋 Renderizar la lista de negocios activos

Es el punto de entrada principal para el usuario final.

📦 Importaciones
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'
import BizCard from '@/components/BizCard'
Importación Función
useState / useEffect Manejo de estado y efectos
supabase Cliente de base de datos
Business Tipado de datos
NavBar Barra de navegación
BizCard Tarjeta visual de negocio
🧩 Estado del componente
const [businesses, setBusinesses] = useState<Business[]>([])
const [category, setCategory] = useState('Todos')
const [search, setSearch] = useState('')
const [loading, setLoading] = useState(true)
Estado Propósito
businesses Lista de negocios
category Filtro por categoría
search Texto de búsqueda
loading Control de carga
📡 Obtención de datos (Supabase)
useEffect(() => {
async function fetchBusinesses() {
const { data } = await supabase
.from('businesses')
.select('\*')
.eq('is_active', true)
.order('created_at', { ascending: false })

    setBusinesses(data ?? [])
    setLoading(false)

}

fetchBusinesses()
}, [])
🔍 Qué hace:
Consulta la tabla businesses
Filtra solo los activos (is_active = true)
Ordena por fecha descendente
Guarda los datos en el estado
🏷 Sistema de categorías
const CATEGORIES = [...]
const CATS_EMOJI = {...}
🎯 Propósito:
Definir categorías disponibles
Asociar cada categoría a un emoji para UI
🔍 Sistema de filtrado
const filtered = businesses.filter(b => {
const matchCat = category === 'Todos' || b.category === category

const matchSearch =
!search ||
b.name.toLowerCase().includes(search.toLowerCase()) ||
b.description?.toLowerCase().includes(search.toLowerCase()) ||
b.category.toLowerCase().includes(search.toLowerCase())

return matchCat && matchSearch
})
🔍 Qué permite:
Filtrar por categoría
Buscar por:
Nombre
Descripción
Categoría
🎨 Estructura UI
🟢 1. Header / Hero
Título del proyecto
Descripción
Input de búsqueda
🟡 2. Filtro de categorías
{CATEGORIES.map(cat => (
<button onClick={() => setCategory(cat)}>
🎯 Función:
Cambiar categoría activa
Filtrar resultados dinámicamente
🔵 3. Lista de negocios
{filtered.map(biz => <BizCard key={biz.id} biz={biz} />)}
📌 Comportamiento:
Muestra loading
Maneja estado vacío
Renderiza cada negocio con BizCard
🔄 Flujo de datos
Supabase → businesses → filtered → UI
🚀 Buenas prácticas aplicadas

✔ Separación de lógica y UI
✔ Uso de tipado (TypeScript)
✔ Filtrado eficiente en memoria
✔ Componentes reutilizables
✔ Manejo de estados (loading / empty)

⚠️ Mejoras recomendadas (PRO)
🔄 Paginación (evitar cargar todo)
⚡ Debounce en búsqueda
🧠 Memoización (useMemo)
📦 Cache (React Query / SWR)
🌐 SSR o ISR para SEO
📈 Resumen de mejoras
Se documentó la página principal del sistema
Se explicó la integración con Supabase
Se detalló el sistema de filtrado
Se estructuró la UI por bloques
Se dejó lista para escalar a producción
