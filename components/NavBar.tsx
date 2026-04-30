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
      height: '58px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      // sticky → se queda fija arriba al hacer scroll
      // zIndex → se mantiene por encima del contenido
    }}>

      {/* ─── LOGO / MARCA ───────────────────────── */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
        <img
          src="/logo.png"
          alt="TodoPaz"
          style={{ height: '56px', width: 'auto' }}
        />
        <span style={{
          fontFamily: 'Syne, sans-serif',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.5px',
        }}>
          Todo<span style={{ color: 'var(--amber)' }}>Paz</span>
        </span>
      </Link>

      {/* ─── NAVEGACIÓN ─────────────────────────── */}
<div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>

  <Link href="/" style={{
    background: pathname === '/' ? 'transparent' : 'rgba(255,255,255,0.15)',
    color: pathname === '/' ? 'rgba(255,255,255,0.6)' : '#fff',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '12px',
    padding: '6px 8px',
    borderRadius: '6px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }}>
    Inicio
  </Link>

  {/* Botón de registro — abre WhatsApp con mensaje predefinido */}
        <a href="https://wa.me/573209640363?text=Hola%2C%20quiero%20registrar%20mi%20negocio%20en%20TodoPaz"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--amber)',
            color: 'var(--green)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>Registra tu negocio</a>
    
</div>
    </nav>
  )
}

