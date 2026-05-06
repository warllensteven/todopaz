'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import { Product } from '@/types/product'
import NavBar from '@/components/NavBar'
import WhatsAppButton from '@/components/WhatsAppButton'
import BusinessHeader from '@/components/negocio/BusinessHeader'
import BusinessDescription from '@/components/negocio/BusinessDescription'
import BusinessSchedule from '@/components/negocio/BusinessSchedule'
import BusinessContact from '@/components/negocio/BusinessContact'
import DeliveryBar from '@/components/negocio/DeliveryBar'
import CatalogSection from '@/components/negocio/CatalogSection'
import OrderDrawer from '@/components/negocio/OrderDrawer'

interface OrderItem {
  product: Product
  quantity: number
}

export default function DetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? ''

  const [biz, setBiz] = useState<Business | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<OrderItem[]>([])
  const [showOrder, setShowOrder] = useState(false)

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

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const q = search.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }, [products, search])

  const grouped = useMemo(() => {
    return filteredProducts.reduce<Record<string, Product[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {})
  }, [filteredProducts])

  const categories = useMemo(() => Object.keys(grouped), [grouped])

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
  const hasProducts = products.length > 0

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
      <BusinessHeader biz={biz} />

      {hasProducts && (
        <>
          <DeliveryBar />

          {/* Categorías horizontales */}
          <div style={{ padding: '12px 16px 0', overflowX: 'auto', display: 'flex', gap: '8px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                style={{ padding: '6px 14px', borderRadius: '20px', background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 500, color: 'var(--text2)', whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}
              >
                {cat}
              </a>
            ))}
            <a
              href={`/negocio/${id}/catalogo`}
              style={{ padding: '6px 14px', borderRadius: '20px', background: 'var(--green)', border: 'none', fontSize: '12px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}
            >
              Ver todas →
            </a>
          </div>

          {/* Buscador */}
          <div style={{ padding: '12px 16px' }}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)', background: 'var(--bg)' }}
            />
          </div>

          {/* Secciones por categoría */}
          <div style={{ paddingBottom: totalItems > 0 ? '90px' : '20px' }}>
            {categories.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text3)', padding: '30px' }}>
                No se encontraron productos
              </p>
            )}
            {categories.map(cat => (
              <div key={cat} id={`cat-${cat}`}>
                <CatalogSection
                  category={cat}
                  products={grouped[cat]}
                  businessId={id}
                  onSelect={handleSelectProduct}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Info del negocio */}
      <div style={{ padding: '20px 16px', paddingBottom: totalItems > 0 ? '90px' : '80px' }}>
        <BusinessDescription description={biz.description ?? ''} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <BusinessSchedule biz={biz} />
          <BusinessContact biz={biz} />
        </div>
        {!hasProducts && <WhatsAppButton phone={biz.phone} />}
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