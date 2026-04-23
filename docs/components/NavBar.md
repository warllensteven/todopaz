🧭 NavBar (NavBar.tsx)
🧠 Descripción general

Este componente representa la barra de navegación principal de la aplicación.

Se muestra en todas las páginas y permite:

🏠 Navegar al inicio
🧭 Identificar en qué ruta está el usuario
🎨 Mantener consistencia visual global
📦 Importaciones
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
Importación Función
'use client' Permite usar hooks del cliente
Link Navegación sin recarga (Next.js)
usePathname Obtiene la ruta actual
🧩 Componente principal
export default function NavBar()

Componente funcional que renderiza la barra superior de navegación.

🧠 Hook: usePathname
const pathname = usePathname()
🔍 Qué hace:
Obtiene la ruta actual del navegador
Ejemplo:
/ → Home
/negocio/123 → Detalle
🎯 Para qué se usa:

Permite resaltar visualmente el link activo

🧱 Estructura del componente

<nav>
  <Link>Logo</Link>
  <div>Links</div>
</nav>
🎨 Contenedor principal (nav)
<nav style={{ ... }}>
🔍 Características:
position: sticky → se queda fijo arriba
top: 0 → pegado al top
zIndex: 100 → encima del contenido
display: flex → layout horizontal
🎯 Resultado:

✔ Barra siempre visible
✔ UX tipo app móvil
✔ Navegación accesible en todo momento

🏷 Logo / Marca

<Link href="/">
  Todo<span>Paz</span>
</Link>
🔍 Características:
Redirige al Home (/)
Usa Link (sin recarga)
Estilizado con:
Tipografía personalizada
Color diferenciado (amber)
🎯 UX:

✔ Branding visible
✔ Acceso rápido al inicio

🔗 Links de navegación

<Link href="/">Inicio</Link>

Actualmente solo tienes un link, pero está preparado para escalar.

🎯 Link activo (estado visual)
background: pathname === '/'
? 'rgba(255,255,255,0.15)'
: 'transparent'
🔍 Qué hace:
Compara la ruta actual con el link
Si coincide:
Cambia fondo
Cambia color
🧠 Ejemplo:
Ruta actual Resultado
/ "Inicio" activo
/negocio/1 "Inicio" inactivo
🎨 Estilos clave
🧱 Contenedor
Verde (var(--green))
Altura fija (52px)
Padding lateral
🔤 Texto
Fuente: Syne (logo)
Fuente: DM Sans (links)
🧩 Botones
Bordes redondeados
Feedback visual en activo
🔄 Flujo de renderizado
Usuario entra a página
↓
Next.js renderiza layout
↓
NavBar se monta
↓
usePathname detecta ruta actual
↓
Se resalta el link activo
🚀 Buenas prácticas aplicadas

✔ Uso de Link (evita recarga)
✔ Uso de hook de navegación (usePathname)
✔ UI consistente en toda la app
✔ Sticky navbar (mejor UX)
✔ Preparado para escalar

⚠️ Mejores prácticas recomendadas (PRO)
🔥 Escalabilidad

Agregar más rutas:

const links = [
{ name: 'Inicio', href: '/' },
{ name: 'Admin', href: '/admin' },
]
🔐 Control de acceso

Ocultar links según rol:

{isAdmin && <Link href="/admin">Admin</Link>}
📱 Responsive

Agregar menú tipo mobile (hamburguesa)

🎯 Accesibilidad
Agregar aria-current="page" en link activo
Mejorar navegación por teclado
📈 Resumen de mejoras
Se documentó el sistema de navegación global
Se explicó el uso de usePathname
Se detalló el comportamiento de links activos
Se describió el layout sticky
Se dejaron bases para escalar a múltiples rutas
Se incluyeron mejoras tipo producción real
