'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import { Product } from '@/types/product'
import NavBar from '@/components/NavBar'
import ProductFormModal from '@/components/admin/ProductFormModal'
import ProductListItem from '@/components/admin/ProductListItem'

export default function ProductosAdminPage() {
  const params = useParams()
  const router = useRouter()
  const businessId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? ''

  const [business, setBusiness] = useState<Business | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!businessId) return
    fetchBusiness()
    fetchProducts()
  }, [businessId])

  async function fetchBusiness() {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()
    setBusiness(data)
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .order('category')
    setProducts(data ?? [])
  }

  async function saveProduct(form: Omit<Product, 'id' | 'created_at'>) {
    if (editingProduct) {
      await supabase.from('products').update(form).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert({ ...form, business_id: businessId })
    }
    setShowModal(false)
    setEditingProduct(null)
    fetchProducts()
  }

  async function deleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  async function toggleAvailable(product: Product) {
    await supabase
      .from('products')
      .update({ available: !product.available })
      .eq('id', product.id)
    fetchProducts()
  }

  async function uploadImage(file: File): Promise<string> {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `products/${Date.now()}.${ext}`
    await supabase.storage.from('businesses').upload(fileName, file, { upsert: true })
    const { data } = supabase.storage.from('businesses').getPublicUrl(fileName)
    setUploading(false)
    return data.publicUrl
  }

  function openNew() {
    setEditingProduct(null)
    setShowModal(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setShowModal(true)
  }

  // Agrupar productos por categoría
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <>
      <NavBar />

      {/* Header */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => router.push('/admin')}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)' }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>
            {business?.name ?? 'Cargando...'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openNew}
          style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
        >
          + Agregar
        </button>
      </div>

      {/* Lista agrupada por categoría */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
        {products.length === 0 && (
          <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px 0' }}>
            Este negocio aún no tiene productos. Agrega el primero.
          </p>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '10px' }}>
              {category} ({items.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(p => (
                <ProductListItem
                  key={p.id}
                  product={p}
                  onEdit={openEdit}
                  onDelete={deleteProduct}
                  onToggleAvailable={toggleAvailable}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          businessId={businessId}
          onSave={saveProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null) }}
        />
      )}
    </>
  )
}