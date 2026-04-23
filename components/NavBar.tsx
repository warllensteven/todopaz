// ─── BARRA DE NAVEGACIÓN GLOBAL (NavBar) ─────────────────────────
// Este componente aparece en TODAS las páginas.
// 👉 Define identidad, navegación y consistencia del producto.

'use client'
// Necesario porque usamos hooks (usePathname)


// ─── IMPORTACIONES ───────────────────────────────────────────────
import Link from 'next/link'
// Navegación interna sin recargar página (SPA)

import { usePathname } from 'next/navigation'
// Permite saber en qué ruta estamos (ej: "/", "/admin")


// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function NavBar() {

  const pathname = usePathname()
  // Ruta actual
  // Se usa para resaltar el link activo


  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <nav style={{

      background: 'var(--green)',
      padding: '0 16px',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',

      height: '52px',

      position: 'sticky',
      top: 0,
      zIndex: 100,
      // sticky → se queda fija arriba al hacer scroll
      // zIndex → se mantiene por encima del contenido
    }}>

      {/* ─── LOGO / MARCA ───────────────────────── */}
      <Link
        href="/"
        style={{
          fontFamily: 'Syne, sans-serif',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          textDecoration: 'none',
        }}
      >
        Todo<span style={{ color: 'var(--amber)' }}>Paz</span>
      </Link>


      {/* ─── NAVEGACIÓN ─────────────────────────── */}
      <div style={{ display: 'flex', gap: '4px' }}>

        <Link
          href="/"
          // Link al home

          style={{

            background:
              pathname === '/'
                ? 'rgba(255,255,255,0.15)'
                : 'transparent',
            // Si estamos en "/" → resaltado

            border: 'none',

            color:
              pathname === '/'
                ? '#fff'
                : 'rgba(255,255,255,0.6)',
            // Activo = blanco fuerte
            // Inactivo = blanco tenue

            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Inicio
        </Link>

      </div>
    </nav>
  )
}