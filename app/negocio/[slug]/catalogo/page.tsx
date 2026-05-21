'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import { Product } from '@/types/product'
import NavBar from '@/components/NavBar'
import ProductCard from '@/components/negocio/ProductCard'
import OrderDrawer from '@/components/negocio/OrderDrawer'

interface OrderItem {
  product: Product
  quantity: number
}

export default function CatalogoPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? ''

  const [biz, setBiz] = useState<Business | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderItem[]>([])
  const [showOrder, setShowOrder] = useState(false)

  useEffect(() => {
    // Si viene con ?cat=Analgésicos desde CatalogSection, lo aplicamos
    const cat = searchParams.get('cat')
    if (cat) setSelectedCat(cat)
  }, [searchParams])

  useEffect(() => {
    if (!id) return
    async function fetchData() {
      const [{ data: bizData }, { data: prodData }] = await Promise.all([
        supabase.from('businesses').select('*').eq('id', id).single(),
        supabase.from('products').select('*').eq('business_id', id).order('category'),
      ])
      if (bizData) setBiz(bizData)
      setProducts(prodData ?? [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)))
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = products
    if (selectedCat) result = result.filter(p => p.category === selectedCat)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    return result
  }, [products, selectedCat, search])

  const grouped = useMemo(() => {
    return filteredProducts.reduce<Record<string, Product[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {})
  }, [filteredProducts])

  function handleSelectProduct(p: Product) {
    setOrder(prev => {
      const existing = prev.find(i => i.product.id === p.id)
      if (existing) return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product: p, quantity: 1 }]
    })
  }

  function handleIncrement(productId: string) {
    setOrder(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i))
  }

  function handleDecrement(productId: string) {
    setOrder(prev => {
      const updated = prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
      return updated.filter(i => i.quantity > 0)
    })
  }

  const totalItems = order.reduce((sum, i) => sum + i.quantity, 0)

  if (loading) return (
    <>
      <NavBar />
      <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>Cargando...</p>
    </>
  )

  if (!biz) return (
    <>
      <NavBar />
      <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>Negocio no encontrado</p>
    </>
  )

  return (
    <>
      <NavBar />

      {/* Header */}
      <div style={{ background: 'var(--green)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <button
            onClick={() => router.push(`/negocio/${id}`)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{biz.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>Catálogo completo · {products.length} productos</div>
          </div>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        />
      </div>

      {/* Filtro de categorías vertical */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedCat(null)}
          style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: selectedCat === null ? 700 : 500,
            cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            background: selectedCat === null ? 'var(--green)' : 'var(--bg2)',
            color: selectedCat === null ? '#fff' : 'var(--text2)',
          }}
        >
          Todas
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat === selectedCat ? null : cat)}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: selectedCat === cat ? 700 : 500,
              cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              background: selectedCat === cat ? 'var(--green)' : 'var(--bg2)',
              color: selectedCat === cat ? '#fff' : 'var(--text2)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Productos agrupados por categoría en grid */}
      <div style={{ padding: '16px', paddingBottom: totalItems > 0 ? '90px' : '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {Object.keys(grouped).length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 0' }}>
            No se encontraron productos
          </p>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            {/* Título de categoría */}
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
              {category}
              <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text3)', marginLeft: '8px' }}>
                {items.length} producto{items.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Grid de productos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {items.map(p => (
                <ProductCard key={p.id} product={p} onSelect={handleSelectProduct} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante del pedido */}
      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)', zIndex: 100 }}>
          <button
            onClick={() => setShowOrder(true)}
            style={{ width: '100%', padding: '14px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '2px 10px', fontSize: '13px' }}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
            <span>Ver pedido</span>
            <span style={{ fontSize: '14px' }}>→</span>
          </button>
        </div>
      )}

      {showOrder && (
        <OrderDrawer
          items={order}
          phone={biz.phone}
          businessName={biz.name}
          onClose={() => setShowOrder(false)}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      )}
    </>
  )
}