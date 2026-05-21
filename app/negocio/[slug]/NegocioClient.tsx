'use client'

// ─── IMPORTACIONES ───────────────────────────────────────────────
import { useEffect, useState, useMemo } from 'react'
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

// ─── TIPOS ───────────────────────────────────────────────────────
interface OrderItem {
  product: Product
  quantity: number
}

interface NegocioClientProps {
  slug: string  // ← slug en vez de id
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function NegocioClient({ slug }: NegocioClientProps) {  // ← slug

  const [biz, setBiz] = useState<Business | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<OrderItem[]>([])
  const [showOrder, setShowOrder] = useState(false)

  useEffect(() => {

    async function fetchData() {
      // Primero traemos el negocio por slug
      const { data: bizData } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)  // ← busca por slug
        .single()

      if (bizData) {
        setBiz(bizData)
        // Luego traemos productos con el id real del negocio
        const { data: prodData } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', bizData.id)  // ← usa el id real
          .order('category')
        setProducts(prodData ?? [])
      }

      setLoading(false)
    }

    async function registerVisit() {
      // Primero obtenemos el id real para la función RPC
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', slug)
        .single()

      if (data) {
        const { error } = await supabase.rpc(
          'increment_visits',
          { business_id: data.id }
        )
        if (error) console.error('Error registrando visita:', error)
      }
    }

    fetchData()
    registerVisit()

  }, [slug])  // ← dependencia slug

  // ─── FILTRAR PRODUCTOS ─────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!search) return products
    const q = search.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }, [products, search])

  // ─── AGRUPAR PRODUCTOS POR CATEGORÍA ───────────────────────────
  const grouped = useMemo(() => {
    return filteredProducts.reduce<Record<string, Product[]>>(
      (acc, p) => {
        if (!acc[p.category]) acc[p.category] = []
        acc[p.category].push(p)
        return acc
      },
      {}
    )
  }, [filteredProducts])

  const categories = useMemo(() => Object.keys(grouped), [grouped])

  // ─── PEDIDOS ───────────────────────────────────────────────────
  function handleSelectProduct(p: Product) {
    setOrder(prev => {
      const existing = prev.find(i => i.product.id === p.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === p.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product: p, quantity: 1 }]
    })
  }

  function handleIncrement(productId: string) {
    setOrder(prev =>
      prev.map(i =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    )
  }

  function handleDecrement(productId: string) {
    setOrder(prev => {
      const updated = prev.map(i =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
      return updated.filter(i => i.quantity > 0)
    })
  }

  // ─── CÁLCULOS ──────────────────────────────────────────────────
  const totalItems = order.reduce((sum, i) => sum + i.quantity, 0)
  const hasProducts = products.length > 0

  // ─── ESTADO CARGANDO ───────────────────────────────────────────
  if (loading) return (
    <>
      <NavBar />
      <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
        Cargando...
      </p>
    </>
  )

  // ─── NEGOCIO NO ENCONTRADO ─────────────────────────────────────
  if (!biz) return (
    <>
      <NavBar />
      <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
        Negocio no encontrado
      </p>
    </>
  )

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <>
      <NavBar />

      <BusinessHeader biz={biz} />

      {/* ─── CATÁLOGO ─────────────────────────────────────── */}
      {hasProducts && (
        <>
          <DeliveryBar />

          {/* Categorías horizontales */}
          <div style={{
            padding: '12px 16px 0',
            overflowX: 'auto',
            display: 'flex',
            gap: '8px',
            scrollbarWidth: 'none'
          }}>
            {categories.map(cat => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text2)',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                {cat}
              </a>
            ))}
          </div>

          {/* Buscador */}
          <div style={{ padding: '12px 16px' }}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)'
              }}
            />
          </div>

          {/* Secciones por categoría */}
          <div style={{ paddingBottom: totalItems > 0 ? '90px' : '20px' }}>
            {categories.map(cat => (
              <div key={cat} id={`cat-${cat}`}>
                <CatalogSection
                  category={cat}
                  products={grouped[cat]}
                  businessId={biz.id}  // ← usa biz.id real, no slug
                  onSelect={handleSelectProduct}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── INFO NEGOCIO ───────────────────────────────── */}
      <div style={{
        padding: '20px 16px',
        paddingBottom: totalItems > 0 ? '90px' : '80px'
      }}>
        <BusinessDescription description={biz.description ?? ''} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <BusinessSchedule biz={biz} />
          <BusinessContact biz={biz} />
        </div>

        {!hasProducts && <WhatsAppButton phone={biz.phone} />}
      </div>

      {/* ─── BOTÓN PEDIDO ──────────────────────────────── */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          padding: '12px 16px',
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)'
        }}>
          <button onClick={() => setShowOrder(true)}>
            Ver pedido
          </button>
        </div>
      )}

      {/* ─── DRAWER PEDIDO ─────────────────────────────── */}
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