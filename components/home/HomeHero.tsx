'use client'
 
interface Props {
  search: string
  onSearch: (value: string) => void
}
 
export default function HomeHero({ search, onSearch }: Props) {
  return (
    <div style={{ background: 'var(--green)', padding: '4px 16px 0', color: '#fff' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
        Negocios de Paz de Ariporo
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginBottom: '14px' }}>
        Encuentra todo lo que necesitas en un solo lugar
      </p>
      <input
        type="text"
        placeholder="Buscar negocio o servicio..."
        value={search}
        onChange={e => onSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: '16px' }}
      />
    </div>
  )
}
 