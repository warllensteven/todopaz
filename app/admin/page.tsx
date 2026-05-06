'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'
import AdminLoginScreen from '@/components/admin/AdminLoginScreen'
import BusinessListItem from '@/components/admin/Businesslistitem'
import BusinessFormModal from '@/components/admin/Businessformmodal' // arreglo

const emptyForm = {
  name: '', phone: '', address: '',
  category: 'Restaurante',
  schedule: '',
  schedule_days: [] as string[],
  schedule_open1: '07:00', schedule_close1: '12:00',
  schedule_open2: '14:00', schedule_close2: '18:00',
  schedule_note: '',
  description: '',
  is_active: true, image_url: '',
  image_focal_x: 50, image_focal_y: 50,
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { if (auth) fetchAll() }, [auth])

  async function fetchAll() {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })
    setBusinesses(data ?? [])
  }

  async function save() {
    if (!form.name || !form.phone) return alert('Nombre y teléfono son requeridos')
    if (editingId) {
      await supabase.from('businesses').update(form).eq('id', editingId)
    } else {
      await supabase.from('businesses').insert(form)
    }
    setShowModal(false)
    fetchAll()
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este negocio?')) return
    await supabase.from('businesses').delete().eq('id', id)
    fetchAll()
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('businesses')
      .upload(fileName, file, { upsert: true })
    if (error) {
      alert('Error subiendo imagen')
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('businesses').getPublicUrl(fileName)
    setForm(f => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
  }

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(b: Business) {
    setForm({
      name: b.name,
      phone: b.phone,
      address: b.address ?? '',
      category: b.category,
      description: b.description ?? '',
      schedule: b.schedule ?? '',
      schedule_days: b.schedule_days ?? [],
      schedule_open1: b.schedule_open1 || '07:00',
      schedule_close1: b.schedule_close1 || '12:00',
      schedule_open2: b.schedule_open2 || '14:00',
      schedule_close2: b.schedule_close2 || '18:00',
      schedule_note: b.schedule_note ?? '',
      is_active: b.is_active,
      image_url: b.image_url ?? '',
      image_focal_x: b.image_focal_x ?? 50,
      image_focal_y: b.image_focal_y ?? 50,
    })
    setEditingId(b.id)
    setShowModal(true)
  }

  if (!auth) return <AdminLoginScreen onAuth={() => setAuth(true)} />

  return (
    <>
      <NavBar />

      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>
          Panel de administración
        </h2>
        <button
          onClick={openNew}
          style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
        >
          + Agregar
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '80px' }}>
        {businesses.map(b => (
          <BusinessListItem
            key={b.id}
            business={b}
            onEdit={openEdit}
            onDelete={remove}
          />
        ))}
      </div>

      {showModal && (
        <BusinessFormModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          uploading={uploading}
          onSave={save}
          onClose={() => setShowModal(false)}
          onUpload={uploadImage}
        />
      )}
    </>
  )
}