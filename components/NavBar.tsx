'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

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
    }}>
      <Link href="/" style={{
        fontFamily: 'Syne, sans-serif',
        color: '#fff',
        fontSize: '20px',
        fontWeight: 700,
        letterSpacing: '-0.5px',
        textDecoration: 'none',
      }}>
        Todo<span style={{ color: 'var(--amber)' }}>Paz</span>
      </Link>

      <div style={{ display: 'flex', gap: '4px' }}>
        <Link href="/" style={{
          background: pathname === '/' ? 'rgba(255,255,255,0.15)' : 'transparent',
          border: 'none',
          color: pathname === '/' ? '#fff' : 'rgba(255,255,255,0.6)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          padding: '6px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
        }}>
          Inicio
        </Link>
      </div>
    </nav>
  )
}