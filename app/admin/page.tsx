'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import NavBar from '@/components/NavBar'

const CATEGORIES = ['Restaurante', 'Panadería', 'Barbería', 'Tienda', 'Servicio', 'Farmacia', 'Otro']
const ADMIN_KEY = 'todopaz2024'
const emptyForm = { name: '', phone: '', category: 'Restaurante', schedule: '', description: '', is_active: true, image_url: '' }

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { if (auth) fetchAll() }, [auth])

  async function fetchAll() {
    const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false })
    setBusinesses(data ?? [])
  }

  function openNew() { setForm(emptyForm); setEditingId(null); setShowModal(true) }
  function openEdit(b: Business) {
    setForm({ name: b.name, phone: b.phone, category: b.category, schedule: b.schedule ?? '', description: b.description ?? '', is_active: b.is_active, image_url: b.image_url ?? '' })
    setEditingId(b.id)
    setShowModal(true)
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
  if (error) { alert('Error subiendo imagen'); setUploading(false); return }
  const { data } = supabase.storage.from('businesses').getPublicUrl(fileName)
  setForm(f => ({ ...f, image_url: data.publicUrl }))
  setUploading(false)
    }
    
  // — Pantalla de login —
  if (!auth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)' }}>
      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '32px 24px', width: '300px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
          Todo<span style={{ color: 'var(--amber)' }}>Paz</span>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '20px' }}>Acceso al panel de administración</p>
        <input
          type="password"
          placeholder="Clave de acceso"
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && keyInput === ADMIN_KEY && setAuth(true)}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '12px' }}
        />
        <button
          onClick={() => keyInput === ADMIN_KEY ? setAuth(true) : alert('Clave incorrecta')}
          style={{ width: '100%', padding: '11px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
        >
          Entrar
        </button>
      </div>
    </div>
  )

  // — Panel admin —
  return (
    <>
      <NavBar />
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>Panel de administración</h2>
        <button onClick={openNew} style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Agregar
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '80px' }}>
        {businesses.map(b => (
          <div key={b.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.is_active ? 'var(--green-mid)' : 'var(--gray)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: '14px' }}>{b.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{b.category} · {b.schedule}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => openEdit(b)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Editar</button>
              <button onClick={() => remove(b.id)} style={{ background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg)', borderRadius: '16px 16px 0 0', padding: '24px 20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              {editingId ? 'Editar negocio' : 'Nuevo negocio'}
            </h3>

            {[
              { label: 'Nombre', key: 'name', placeholder: 'Ej: Panadería El Trigo' },
              { label: 'Teléfono WA', key: 'phone', placeholder: '573001234567' },
              { label: 'Horario', key: 'schedule', placeholder: 'Lun-Sáb 7am-7pm' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>{label}</label>
                <input
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Descripción</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="¿Qué ofrece este negocio?" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)', minHeight: '80px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Negocio activo</span>
              <button onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} style={{ width: '44px', height: '24px', background: form.is_active ? 'var(--green-mid)' : 'var(--gray-light)', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                <span style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'block' }} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>
    Logo o foto
  </label>

  {/* Preview */}
  {form.image_url && (
    <div style={{ marginBottom: '10px', position: 'relative', width: '80px', height: '80px' }}>
      <img src={form.image_url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
      <button
        onClick={() => setForm(f => ({ ...f, image_url: '' }))}
        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#A32D2D', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ✕
      </button>
    </div>
  )}

  {/* Input archivo */}
  <label style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '10px', border: '1px dashed var(--green)', borderRadius: 'var(--radius-sm)',
    cursor: uploading ? 'not-allowed' : 'pointer', color: 'var(--green)',
    fontSize: '14px', fontWeight: 500,
  }}>
    {uploading ? 'Subiendo...' : '📷 Seleccionar imagen'}
    <input
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      disabled={uploading}
      onChange={e => { const file = e.target.files?.[0]; if (file) uploadImage(file) }}
    />
  </label>
</div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)' }}>Cancelar</button>
              <button onClick={save} style={{ flex: 1, padding: '10px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#fff' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}