'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'
import BizCard from '@/components/BizCard'


const CATEGORIES = ['Todos', 'Restaurante', 'Panadería', 'Barbería', 'Tienda', 'Servicio', 'Farmacia', 'Otro']

const CATS_EMOJI: Record<string, string> = {
  'Restaurante': '🍽', 'Panadería': '🥐', 'Barbería': '✂️',
  'Tienda': '🛒', 'Servicio': '🔧', 'Farmacia': '💊', 'Otro': '📦',
}

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusinesses() {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      setBusinesses(data ?? [])
      setLoading(false)
    }
    fetchBusinesses()
  }, [])

  const filtered = businesses.filter(b => {
    const matchCat = category === 'Todos' || b.category === category
    const matchSearch = !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <NavBar />

      {/* Hero */}
      <div style={{ background: 'var(--green)', padding: '20px 16px 0', color: '#fff' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          Negocios de Paz de Ariporo
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginBottom: '14px' }}>
          Encuentra todo lo que necesitas en tu municipio
        </p>
        <input
          type="text"
          placeholder="Buscar negocio o servicio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px',
            borderRadius: 'var(--radius-sm)', border: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
            outline: 'none', background: 'rgba(255,255,255,0.15)',
            color: '#fff', marginBottom: '16px',
          }}
        />

        {/* Categorías */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? 'var(--amber)' : 'rgba(255,255,255,0.12)',
                border: `1px solid ${category === cat ? 'var(--amber)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '20px', padding: '7px 14px',
                fontSize: '13px', fontWeight: category === cat ? 700 : 500,
                whiteSpace: 'nowrap', cursor: 'pointer',
                color: category === cat ? 'var(--green)' : '#fff',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {cat === 'Todos' ? `Todos (${businesses.length})` : `${CATS_EMOJI[cat]} ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div style={{ padding: '14px 16px 80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 600,
          color: 'var(--text3)', letterSpacing: '.5px', textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          {category === 'Todos' ? 'Todos los negocios' : `Categoría: ${category}`}
        </div>

        {loading && <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px 0' }}>Cargando...</p>}
        {!loading && filtered.length === 0 && <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px 0' }}>No se encontraron negocios</p>}
        {filtered.map(biz => <BizCard key={biz.id} biz={biz} />)}
      </div>
    </>
  )
}