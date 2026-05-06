'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import ProductCard from '@/components/negocio/ProductCard'

interface Props {
  category: string
  products: Product[]
  businessId: string
  onSelect: (p: Product) => void
}

export default function CatalogSection({ category, products, businessId, onSelect }: Props) {
  const router = useRouter()

  return (
    <div style={{ marginBottom: '24px' }}>

      {/* Header de categoría */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '10px' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
          {category}
        </h3>
        <button
          onClick={() => router.push(`/negocio/${businessId}/catalogo?cat=${encodeURIComponent(category)}`)}
          style={{ background: 'transparent', border: 'none', fontSize: '13px', color: 'var(--green)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          Ver más →
        </button>
      </div>

      {/* Scroll horizontal de productos */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}