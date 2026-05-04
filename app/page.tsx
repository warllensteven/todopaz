'use client'
 
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import { CATEGORIES } from '@/constants/categories'
import NavBar from '@/components/NavBar'
import BizCard from '@/components/BizCard'
import HomeHero from '@/components/home/HomeHero'
import CategoryFilter from '@/components/CategoryFilter'
 
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
 
      <HomeHero search={search} onSearch={setSearch} />
 
      <div style={{ background: 'var(--green)', padding: '0 16px' }}>
        <CategoryFilter
          categories={['Todos', ...CATEGORIES]}
          selected={category}
          onSelect={setCategory}
          total={businesses.length}
        />
      </div>
 
      <div style={{ padding: '14px 16px 80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {category === 'Todos' ? 'Todos los negocios' : `Categoría: ${category}`}
        </div>
 
        {loading && (
          <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px 0' }}>Cargando...</p>
        )}
 
        {!loading && filtered.length === 0 && (
          <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px 0' }}>No se encontraron negocios</p>
        )}
 
        {filtered.map(biz => (
          <BizCard key={biz.id} biz={biz} />
        ))}
      </div>
    </>
  )
}
 