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

  // ─── ESTADOS ──────────────────────────────────────────────────
  const [businesses, setBusinesses] = useState<Business[]>([])

  const [category, setCategory] = useState('Todos')

  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)

  const [activeCategories, setActiveCategories] = useState<string[]>([])
  // Categorías que realmente tienen negocios activos
  // y se mostrarán en orden aleatorio


  // ─── EFECTO: CARGAR NEGOCIOS ──────────────────────────────────
  useEffect(() => {
    async function fetchBusinesses() {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .order('visits', { ascending: false })
      // más visitados primero

      setBusinesses(data ?? [])
      setLoading(false)
    }

    fetchBusinesses()
  }, [])


  // ─── FUNCIÓN: MEZCLAR ARRAY ───────────────────────────────────
  function shuffleArray<T>(arr: T[]): T[] {

    // Algoritmo Fisher-Yates
    // Mezcla los elementos aleatoriamente

    const shuffled = [...arr]

    for (let i = shuffled.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1))

      ;[shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]]
    }

    return shuffled
  }


  // ─── EFECTO: GENERAR CATEGORÍAS ACTIVAS ───────────────────────
  useEffect(() => {

    // Solo se ejecuta en cliente
    // Evita hydration mismatch

    const withBusinesses = CATEGORIES.filter(cat =>
      businesses.some(b => b.category === cat)
    )

    setActiveCategories(
      shuffleArray(withBusinesses)
    )

  }, [businesses])


  // ─── FILTRO DE NEGOCIOS ───────────────────────────────────────
  const filtered = businesses.filter(b => {

    const matchCat =
      category === 'Todos' ||
      b.category === category

    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())

    return matchCat && matchSearch
  })


  // ─── RENDER ───────────────────────────────────────────────────
  return (
    <>
      <NavBar />
 
      <HomeHero
        search={search}
        onSearch={setSearch}
      />
 
      <div style={{
        background: 'var(--green)',
        padding: '0 16px'
      }}>
        <CategoryFilter
          categories={[
            'Todos',
            ...activeCategories
          ]}
          selected={category}
          onSelect={setCategory}
          total={businesses.length}
        />
      </div>
 
      <div style={{
        padding: '14px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>

        {/* Título dinámico */}
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text3)',
          letterSpacing: '.5px',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          {category === 'Todos'
            ? 'Todos los negocios'
            : `Categoría: ${category}`
          }
        </div>
 
        {/* Loading */}
        {loading && (
          <p style={{
            color: 'var(--text3)',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            Cargando...
          </p>
        )}
 
        {/* Estado vacío */}
        {!loading && filtered.length === 0 && (
          <p style={{
            color: 'var(--text3)',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            No se encontraron negocios
          </p>
        )}
 
        {/* Lista */}
        {filtered.map(biz => (
          <BizCard
            key={biz.id}
            biz={biz}
          />
        ))}

      </div>
    </>
  )
}