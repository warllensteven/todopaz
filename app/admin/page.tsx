'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'
import AdminLoginScreen from '@/components/admin/AdminLoginScreen'
import BusinessListItem from '@/components/admin/Businesslistitem'
import BusinessFormModal from '@/components/admin/Businessformmodal'

// ─── FORMULARIO VACÍO ────────────────────────────────────────────
const emptyForm = {
  name: '', phone: '', address: '',
  category: 'Restaurante',
  schedule: '',
  schedule_days: [] as string[],
  schedule_open1: '', schedule_close1: '',
  schedule_open2: '', schedule_close2: '',
  schedule_note: '',
  description: '',
  is_active: true, image_url: '',
  image_focal_x: 50, image_focal_y: 50,
}

export default function AdminPage() {

  // ─── ESTADO DE AUTENTICACIÓN ─────────────────────────────────
  const [auth, setAuth] = useState(false)
  const [isSuperadmin, setIsSuperadmin] = useState(false)

  // ─── ESTADO DEL PANEL ────────────────────────────────────────
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const [uploading, setUploading] = useState(false)


  // ─── VERIFICAR SESIÓN AL CARGAR ──────────────────────────────
  // Esperamos a checkRole antes de setAuth(true) para evitar
  // race condition donde fetchAll corre con isSuperadmin = false
  useEffect(() => {
    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await checkRole(session.user.id)
        // Solo después de conocer el rol autenticamos
        setAuth(true)
      }
    }
    initAuth()
  }, [])

  // Cargar negocios cuando auth o isSuperadmin cambian
  useEffect(() => { if (auth) fetchAll() }, [auth, isSuperadmin])


  // ─── FUNCIONES DE AUTENTICACIÓN ──────────────────────────────

  async function checkRole(userId: string) {
    // Retorna el rol para poder usarlo inmediatamente si es necesario
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()
    setIsSuperadmin(data?.role === 'superadmin')
    return data?.role
  }

  async function login() {
    // Esperamos a conocer el rol antes de mostrar el panel
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await checkRole(session.user.id)
    }
    setAuth(true)
  }

  async function logout() {
    await supabase.auth.signOut()
    setAuth(false)
    setIsSuperadmin(false)
    setBusinesses([])
  }


  // ─── FUNCIONES DE BASE DE DATOS ──────────────────────────────

async function fetchAll() {
  if (isSuperadmin) {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })
    setBusinesses(data ?? [])
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user?.id)
    setBusinesses(data ?? [])
  }
}
  
async function save() {
  if (!form.name || !form.phone) return alert('Nombre y teléfono son requeridos')

  // Generar slug desde el nombre
  const slug = form.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()

  if (editingId) {
    await supabase.from('businesses').update({ ...form, slug }).eq('id', editingId)
  } else {
    await supabase.from('businesses').insert({ ...form, slug })
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


  // ─── FUNCIONES DE UI ─────────────────────────────────────────

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
      schedule_open1: b.schedule_open1 || '',
      schedule_close1: b.schedule_close1 || '',
      schedule_open2: b.schedule_open2 || '',
      schedule_close2: b.schedule_close2 || '',
      schedule_note: b.schedule_note ?? '',
      is_active: b.is_active,
      image_url: b.image_url ?? '',
      image_focal_x: b.image_focal_x ?? 50,
      image_focal_y: b.image_focal_y ?? 50,
    })
    setEditingId(b.id)
    setShowModal(true)
  }


  // ─── RENDER: LOGIN ───────────────────────────────────────────
  if (!auth) return <AdminLoginScreen onAuth={login} />


  // ─── RENDER: PANEL ───────────────────────────────────────────
  return (
    <>
      <NavBar />

      <div style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>
          {isSuperadmin ? 'Panel de administración' : 'Mi negocio'}
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isSuperadmin && (
            <button
              onClick={openNew}
              style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
            >
              + Agregar
            </button>
          )}
          <button
            onClick={logout}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '80px' }}>
        {businesses.map(b => (
          <BusinessListItem
            key={b.id}
            business={b}
            onEdit={openEdit}
            onDelete={isSuperadmin ? remove : () => {}}
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