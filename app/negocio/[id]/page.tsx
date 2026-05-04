'use client'
 
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'
import WhatsAppButton from '@/components/WhatsAppButton'
import BusinessHeader from '@/components/negocio/BusinessHeader'
import BusinessDescription from '@/components/negocio/BusinessDescription'
import BusinessSchedule from '@/components/negocio/BusinessSchedule'
import BusinessContact from '@/components/negocio/BusinessContact'
 
export default function DetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
 
  const [biz, setBiz] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    if (!id) return
    async function fetchBiz() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) console.error(error)
      else setBiz(data)
      setLoading(false)
    }
    fetchBiz()
  }, [id])
 
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
 
      <div style={{ padding: '20px 16px 80px' }}>
        <BusinessDescription description={biz.description ?? ''} />
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <BusinessSchedule biz={biz} />
          <BusinessContact biz={biz} />
        </div>
 
        <WhatsAppButton phone={biz.phone} />
        <p style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', marginTop: '8px' }}>
          Abre WhatsApp con un mensaje listo para enviar
        </p>
      </div>
    </>
  )
}