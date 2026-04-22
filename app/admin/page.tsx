'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'
import BizCard from '@/components/BizCard'
import CategoryFilter from '@/components/CategoryFilter'

const CATEGORIES = [
  'Todos',
  'Restaurante',
  'Panadería',
  'Barbería',
  'Tienda',
  'Servicio',
  'Farmacia',
  'Otro',
]

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [category, setCategory] = useState('Todos') // ✅ IMPORTANTE
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

  const filtered = businesses.filter((b) => {
    const matchCat = category === 'Todos' || b.category === category

    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())

    return matchCat && matchSearch
  })

  return (
    <>
      <NavBar />

      {/* HERO */}
      <div
        style={{
          background: 'var(--green)',
          padding: '20px 16px 0',
          color: '#fff',
        }}
      >
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>
          Negocios de Paz de Ariporo
        </h2>

        <p style={{ fontSize: '14px', opacity: 0.7 }}>
          Encuentra todo lo que necesitas en tu municipio
        </p>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar negocio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '8px',
            border: 'none',
          }}
        />

        {/* 🔥 CATEGORY FILTERS (AQUÍ VA) */}
        <CategoryFilter
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
          total={businesses.length}
        />
      </div>

      {/* LISTA */}
      <div style={{ padding: '16px' }}>
        {loading && <p>Cargando...</p>}

        {!loading && filtered.length === 0 && (
          <p>No hay resultados</p>
        )}

        {filtered.map((biz) => (
          <BizCard key={biz.id} biz={biz} />
        ))}
      </div>
    </>
  )
}