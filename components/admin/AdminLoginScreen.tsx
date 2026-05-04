'use client'
 
import { useState } from 'react'
 
interface Props {
  onAuth: () => void
}
 
const ADMIN_KEY = 'todopaz2024'
 
export default function AdminLoginScreen({ onAuth }: Props) {
  const [keyInput, setKeyInput] = useState('')
 
  function handleLogin() {
    if (keyInput === ADMIN_KEY) {
      onAuth()
    } else {
      alert('Clave incorrecta')
    }
  }
 
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)' }}>
      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '32px 24px', width: '300px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
          Todo<span style={{ color: 'var(--amber)' }}>Paz</span>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '20px' }}>
          Acceso al panel de administración
        </p>
        <input
          type="password"
          placeholder="Clave de acceso"
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '12px' }}
        />
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '11px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}