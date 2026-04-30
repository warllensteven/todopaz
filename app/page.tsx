'use client'
// ↑ Este componente corre en el cliente.
// Necesario porque usamos estado, efectos y eventos (búsqueda, filtros).

// ─── IMPORTACIONES ───────────────────────────────────────────────
import { useEffect, useState } from 'react'
// useState → manejar estado (negocios, categoría, búsqueda, loading)
// useEffect → ejecutar lógica al cargar la página

import { supabase } from '@/lib/supabase'
// Cliente para consultar la base de datos (tabla businesses)

import { Business } from '@/types/business'
// Tipado de los datos → estructura de cada negocio

import NavBar from '@/components/NavBar'
// Barra de navegación global

import BizCard from '@/components/BizCard'
// Componente reutilizable para mostrar cada negocio


// ─── CONSTANTES ──────────────────────────────────────────────────
const CATEGORIES = [
  'Restaurante', 'Panadería', 'Barbería', 'Supermercado', 'Estética', 'Accesorios',
  'Servicio', 'Farmacia', 'Ropa', 'Calzado', 'Tienda Naturista', 'Bar', 'Otro'
]
// Lista de categorías disponibles para filtrar.
// "Todos" permite mostrar todo sin filtro.

const CATS_EMOJI: Record<string, string> = {
  'Restaurante':      '🍽',
  'Panadería':        '🥐',
  'Barbería':         '✂️',
  'Supermercado':     '🛒',
  'Estética':         '💅',
  'Accesorios':       '💍',
  'Servicio':         '🔧',
  'Farmacia':         '💊',
  'Ropa':             '👕',
  'Calzado':          '👟',
  'Tienda Naturista': '🌿',
  'Bar':              '🍺',
  'Otro':             '📦',
}
// Mapa de categoría → emoji para UI


// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function Home() {

  // ─── ESTADO ────────────────────────────────────────────────────
  const [businesses, setBusinesses] = useState<Business[]>([])
  // Lista completa de negocios desde la DB

  const [category, setCategory] = useState('Todos')
  // Categoría seleccionada

  const [search, setSearch] = useState('')
  // Texto de búsqueda

  const [loading, setLoading] = useState(true)
  // Estado de carga


  // ─── EFECTO: CARGAR NEGOCIOS ───────────────────────────────────
  useEffect(() => {
    async function fetchBusinesses() {
      const { data } = await supabase
        .from('businesses')                // tabla
        .select('*')                       // todas las columnas
        .eq('is_active', true)             // SOLO negocios activos
        .order('created_at', { ascending: false }) // más recientes primero

      setBusinesses(data ?? [])
      // Si data es null → usamos array vacío

      setLoading(false)
    }

    fetchBusinesses()
  }, [])
  // Se ejecuta solo una vez al cargar la página


  // ─── FILTRO DE NEGOCIOS ────────────────────────────────────────
  const filtered = businesses.filter(b => {

    const matchCat =
      category === 'Todos' || b.category === category
    // Si "Todos" → pasa todo
    // Si no → filtra por categoría

    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    // Si no hay búsqueda → pasa todo
    // Si hay → busca en nombre, descripción o categoría

    return matchCat && matchSearch
  })


  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <>
      <NavBar />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <div style={{ background: 'var(--green)', padding: '4px 16px 0', color: '#fff' }}>

        {/* Título */}
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          marginBottom: '4px'
        }}>
          Negocios de Paz de Ariporo
        </h2>

        {/* Subtítulo */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.65)',
          marginBottom: '14px'
        }}>
          Encuentra todo lo que necesitas en un solo lugar
        </p>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar negocio o servicio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          // Cada vez que el usuario escribe → actualiza el estado

          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            outline: 'none',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            marginBottom: '16px',
          }}
        />

        {/* ─── CATEGORÍAS ─────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (

            <button
              key={cat}
              onClick={() => setCategory(cat)}
              // Cambia la categoría activa

              style={{
                background: category === cat
                  ? 'var(--amber)'
                  : 'rgba(255,255,255,0.12)',

                border: `1px solid ${
                  category === cat
                    ? 'var(--amber)'
                    : 'rgba(255,255,255,0.2)'
                }`,

                borderRadius: '20px',
                padding: '7px 14px',
                fontSize: '13px',
                fontWeight: category === cat ? 700 : 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                color: category === cat ? 'var(--green)' : '#fff',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {cat === 'Todos'
                ? `Todos (${businesses.length})`
                : `${CATS_EMOJI[cat]} ${cat}`
              }
            </button>

          ))}
        </div>
      </div>


      {/* ─── LISTA DE NEGOCIOS ─────────────────────────────────── */}
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
          marginBottom: '4px',
        }}>
          {category === 'Todos'
            ? 'Todos los negocios'
            : `Categoría: ${category}`
          }
        </div>

        {/* Estado: loading */}
        {loading && (
          <p style={{
            color: 'var(--text3)',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            Cargando...
          </p>
        )}

        {/* Estado: vacío */}
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
          <BizCard key={biz.id} biz={biz} />
        ))}
        {/* key={biz.id} → necesario para React (optimización de render) */}

      </div>
    </>
  )
}