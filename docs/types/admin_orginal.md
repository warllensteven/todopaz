'use client'
// ↑ Indica que este componente se ejecuta en el navegador (cliente),
// no en el servidor. Necesario para usar useState, useEffect y eventos.

// ─── IMPORTACIONES ───────────────────────────────────────────────
import { useEffect, useState } from 'react'
// useState → guarda valores que cambian (ej: si el usuario está autenticado)
// useEffect → ejecuta código cuando algo cambia (ej: cargar negocios al entrar)

import { supabase } from '@/lib/supabase'
// Cliente de Supabase. El @/ es un atajo que apunta a la raíz del proyecto.
// Con este objeto hacemos todas las operaciones a la base de datos.

import { Business } from '@/types/business'
// Tipo TypeScript que describe la forma de un negocio.
// Nos ayuda a autocompletar y evitar errores de typos.

import NavBar from '@/components/NavBar'
// Barra de navegación superior compartida con el resto de la app.

// ─── CONSTANTES ──────────────────────────────────────────────────
const CATEGORIES = [
'Restaurante', 'Panadería', 'Barbería', 'Supermercado', 'Estetica', 'Accesorios',
'Servicio', 'Farmacia', 'Ropa', 'Calzado', 'Tienda Naturista', 'Bar', 'Otro'
]
// Lista de categorías disponibles. Se usa para poblar el select del formulario.
// Si en el futuro agregas una categoría, solo la añades aquí.

const ADMIN_KEY = 'todopaz2024'
// Clave simple para proteger el panel. En producción real esto iría
// en una variable de entorno (.env.local) y usaríamos Supabase Auth.

const emptyForm = {
name: '', phone: '', address: '',
category: 'Restaurante',
schedule: '',
schedule_days: [] as string[],
schedule_open1: '07:00', schedule_close1: '12:00',
schedule_open2: '14:00', schedule_close2: '18:00',
schedule_note: '',
description: "",
is_active: true, image_url: '',
}
// Objeto vacío que representa un formulario en blanco.
// Se usa al abrir el modal para crear un negocio nuevo (resetea los campos).

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const HOURS = [
'00:00', '00:30', '01:00', '01:30', '02:00',
'05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
'12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
'15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
'18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
'21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
]

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function AdminPage() {

// ─── ESTADO (useState) ─────────────────────────────────────────
const [auth, setAuth] = useState(false)
// Controla si el usuario ya ingresó la clave correcta.
// false = muestra pantalla de login / true = muestra el panel.

const [keyInput, setKeyInput] = useState('')
// Guarda lo que el usuario escribe en el campo de clave.

const [businesses, setBusinesses] = useState<Business[]>([])
// Lista de todos los negocios cargados desde Supabase.
// <Business[]> indica que es un array de objetos tipo Business.

const [showModal, setShowModal] = useState(false)
// Controla si el modal de crear/editar está abierto o cerrado.

const [editingId, setEditingId] = useState<string | null>(null)
// Guarda el ID del negocio que se está editando.
// null significa que estamos creando uno nuevo (no editando).

const [form, setForm] = useState<typeof emptyForm>(emptyForm)
// Guarda los valores actuales del formulario dentro del modal.
// typeof emptyForm le dice a TypeScript que tiene la misma forma que emptyForm.

const [uploading, setUploading] = useState(false)
// Indica si hay una imagen subiendo en este momento.
// Se usa para deshabilitar el input y mostrar "Subiendo...".

// ─── EFECTOS (useEffect) ───────────────────────────────────────
useEffect(() => { if (auth) fetchAll() }, [auth])
// Se ejecuta cada vez que cambia el valor de `auth`.
// Si el usuario acaba de autenticarse (auth = true), carga los negocios.
// Evita hacer llamadas a Supabase antes de que el usuario esté autenticado.

// ─── FUNCIONES DE BASE DE DATOS ───────────────────────────────

async function fetchAll() {
// Trae todos los negocios de Supabase (activos e inactivos).
// El admin necesita ver todos, a diferencia del Home que solo muestra activos.
const { data } = await supabase
.from('businesses') // tabla a consultar
.select('\*') // traer todas las columnas
.order('created_at', { ascending: false }) // más recientes primero
setBusinesses(data ?? []) // si data es null, usamos array vacío
}

async function save() {
// Guarda el negocio actual del formulario — crea uno nuevo o edita uno existente.
if (!form.name || !form.phone) return alert('Nombre y teléfono son requeridos')
// Validación mínima antes de enviar a Supabase.

    if (editingId) {
      // Si hay un ID en editingId, estamos editando → usamos UPDATE
      await supabase.from('businesses').update(form).eq('id', editingId)
      // .eq('id', editingId) es el WHERE — solo actualiza ese registro.
    } else {
      // Si editingId es null, estamos creando → usamos INSERT
      await supabase.from('businesses').insert(form)
    }

    setShowModal(false) // cierra el modal
    fetchAll()          // recarga la lista para reflejar el cambio

}

async function remove(id: string) {
// Elimina un negocio por su ID después de pedir confirmación.
if (!confirm('¿Eliminar este negocio?')) return
// confirm() muestra un diálogo nativo del navegador. Si el usuario
// cancela, la función termina aquí sin hacer nada.
await supabase.from('businesses').delete().eq('id', id)
fetchAll() // recarga la lista
}

async function uploadImage(file: File) {
// Sube una imagen al bucket de Supabase Storage y guarda su URL en el form.
setUploading(true)

    const ext = file.name.split('.').pop()
    // Extrae la extensión del archivo (ej: "jpg", "png").
    // split('.') divide el nombre por puntos → ["foto", "jpg"]
    // .pop() toma el último elemento → "jpg"

    const fileName = `${Date.now()}.${ext}`
    // Genera un nombre único usando el timestamp actual (milisegundos).
    // Ej: "1714932847123.jpg" — así nunca hay dos archivos con el mismo nombre.

    const { error } = await supabase.storage
      .from('businesses')               // bucket donde se guarda
      .upload(fileName, file, { upsert: true })
      // upsert: true → si ya existe un archivo con ese nombre, lo reemplaza.

    if (error) {
      alert('Error subiendo imagen')
      setUploading(false)
      return // detiene la función si hubo error
    }

    const { data } = supabase.storage.from('businesses').getPublicUrl(fileName)
    // Obtiene la URL pública del archivo que acabamos de subir.
    // Esta URL es la que se guarda en la base de datos y se muestra en la app.

    setForm(f => ({ ...f, image_url: data.publicUrl }))
    // Actualiza solo el campo image_url del formulario.
    // ...f copia todos los campos existentes, y luego pisamos image_url.

    setUploading(false)

}

// ─── FUNCIONES DE UI ──────────────────────────────────────────

function openNew() {
// Prepara el modal para crear un negocio nuevo.
setForm(emptyForm) // limpia el formulario
setEditingId(null) // asegura que no haya ID de edición activo
setShowModal(true) // abre el modal
}

function openEdit(b: Business) {
setForm({
name: b.name,
phone: b.phone,
address: b.address ?? '',
category: b.category,
description: b.description ?? '', // ← faltaba este
schedule: b.schedule ?? '',
schedule_days: b.schedule_days ?? [],
schedule_open1: b.schedule_open1 || '07:00',
schedule_close1: b.schedule_close1 || '12:00',
schedule_open2: b.schedule_open2 || '14:00',
schedule_close2: b.schedule_close2 || '18:00',
schedule_note: b.schedule_note ?? '',
is_active: b.is_active,
image_url: b.image_url ?? '',
})
setEditingId(b.id)
setShowModal(true)
}

// ─── RENDER: PANTALLA DE LOGIN ────────────────────────────────
// Si auth es false, mostramos solo la pantalla de login y cortamos el render aquí.
// Esto se llama "early return" — evita renderizar el panel si no hay acceso.
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
// onKeyDown permite entrar presionando Enter, sin necesidad de hacer clic.
onKeyDown={e => e.key === 'Enter' && keyInput === ADMIN_KEY && setAuth(true)}
style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '12px' }}
/>
<button
// Operador ternario: si la clave es correcta autentica, si no avisa.
onClick={() => keyInput === ADMIN_KEY ? setAuth(true) : alert('Clave incorrecta')}
style={{ width: '100%', padding: '11px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }} >
Entrar
</button>
</div>
</div>
)

// ─── RENDER: PANEL ADMIN ──────────────────────────────────────
// Solo llega aquí si auth === true.
return (
<>
<NavBar />

      {/* Encabezado con título y botón de agregar */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>Panel de administración</h2>
        <button onClick={openNew} style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Agregar
        </button>
      </div>

      {/* Lista de negocios */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '80px' }}>
        {businesses.map(b => (
          // key={b.id} es requerido por React para identificar cada elemento de la lista.
          <div key={b.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Punto de color: verde si activo, gris si inactivo */}
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.is_active ? 'var(--green-mid)' : 'var(--gray)', flexShrink: 0 }} />

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: '14px' }}>{b.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>

{b.category}
{b.schedule_days?.length > 0
? ` · ${b.schedule_days[0]}–${b.schedule_days[b.schedule_days.length - 1]} ${b.schedule_open1}–${b.schedule_close1}${b.schedule_open2 ? ' / ' + b.schedule_open2 + '–' + b.schedule_close2 : ''}`
: b.schedule ? ` · ${b.schedule}` : ''
}

</div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => openEdit(b)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Editar</button>
              <button onClick={() => remove(b.id)} style={{ background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MODAL de crear / editar ─────────────────────────────
          Solo se renderiza cuando showModal === true.
          Al hacer clic en el fondo oscuro (overlay) se cierra. */}
      {showModal && (
        <div
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
          // e.target === e.currentTarget verifica que el clic fue en el fondo
          // y no en el contenido del modal — evita cerrar al hacer clic adentro.
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg)', borderRadius: '16px 16px 0 0', padding: '24px 20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>

            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              {/* Título dinámico según si estamos editando o creando */}
              {editingId ? 'Editar negocio' : 'Nuevo negocio'}
            </h3>

            {/* Campos de texto — se generan dinámicamente desde un array
                para evitar repetir el mismo bloque de JSX tres veces */}
            {/* Campos de texto — se generan dinámicamente desde un array */}

{/_ Nombre _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Nombre</label>
  <input
    placeholder="Ej: Panadería El Trigo"
    value={form.name}
    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}
  />
</div>

{/_ Teléfono y Correo en la misma fila _/}

<div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
  <div style={{ flex: 1 }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Teléfono WA</label>
    <input
      placeholder="573001234567"
      value={form.phone}
      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}
    />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Direccion <span style={{ fontSize: '11px', fontWeight: 400 }}>(opcional)</span></label>
    <input
      placeholder="Cra X # X - XX"
      value={form.address}
      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}
    />
  </div>
</div>

{/_ Descripción _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Descripción</label>
  <textarea
    value={form.description}
    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
    placeholder="¿Qué ofrece este negocio?"
    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)', minHeight: '80px', resize: 'vertical' }}
  />
</div>

{/_ Select de categoría _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>Categoría</label>
  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}>
    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
</div>

{/_ Días de atención _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '8px' }}>
    Días de atención
  </label>
  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
    {DAYS.map(day => {
      const selected = form.schedule_days.includes(day)
      return (
        <button
          key={day}
          type="button"
          onClick={() => setForm(f => ({
            ...f,
            schedule_days: selected
              ? f.schedule_days.filter(d => d !== day)
              : [...f.schedule_days, day]
          }))}
          style={{
            padding: '6px 12px', borderRadius: '20px', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', border: 'none',
            background: selected ? 'var(--green)' : 'var(--gray-light)',
            color: selected ? '#fff' : 'var(--text2)',
            transition: 'all .2s',
          }}
        >
          {day}
        </button>
      )
    })}
  </div>
</div>

{/_ Franja mañana _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '8px' }}>
    Franja mañana
  </label>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <select value={form.schedule_open1} onChange={e => setForm(f => ({ ...f, schedule_open1: e.target.value }))}
      style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}>
      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
    <span style={{ color: 'var(--text3)', fontWeight: 500 }}>—</span>
    <select value={form.schedule_close1} onChange={e => setForm(f => ({ ...f, schedule_close1: e.target.value }))}
      style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}>
      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
  </div>
</div>

{/_ Franja tarde _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '8px' }}>
    Franja tarde <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text3)' }}>(opcional)</span>
  </label>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <select value={form.schedule_open2} onChange={e => setForm(f => ({ ...f, schedule_open2: e.target.value }))}
      style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}>
      <option value="">No aplica</option>
      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
    <span style={{ color: 'var(--text3)', fontWeight: 500 }}>—</span>
    <select value={form.schedule_close2} onChange={e => setForm(f => ({ ...f, schedule_close2: e.target.value }))}
      style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}>
      <option value="">No aplica</option>
      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
  </div>
</div>

{/_ Nota especial _/}

<div style={{ marginBottom: '14px' }}>
  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>
    Nota especial <span style={{ fontSize: '11px', fontWeight: 400 }}>(opcional)</span>
  </label>
  <input
    placeholder='Ej: Domingos solo hasta las 2pm'
    value={form.schedule_note}
    onChange={e => setForm(f => ({ ...f, schedule_note: e.target.value }))}
    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', color: 'var(--text)' }}
  />
</div>

            {/* Toggle de negocio activo / inactivo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Negocio activo</span>
              <button
                onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                // !f.is_active invierte el valor booleano actual (true → false, false → true)
                style={{ width: '44px', height: '24px', background: form.is_active ? 'var(--green-mid)' : 'var(--gray-light)', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                <span style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'block' }} />
                {/* El círculo blanco se mueve con left: 3px (apagado) o 23px (encendido) */}
              </button>
            </div>

            {/* Sección de imagen */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '6px' }}>
                Logo o foto
              </label>

              {/* Preview — solo se muestra si ya hay una imagen cargada */}
              {form.image_url && (
                <div style={{ marginBottom: '10px', position: 'relative', width: '80px', height: '80px' }}>
                  <img src={form.image_url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                  {/* Botón X para eliminar la imagen seleccionada */}
                  <button
                    onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#A32D2D', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Input de archivo oculto — el label actúa como botón visual.
                  Al hacer clic en el label se dispara el input file invisible. */}
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px', border: '1px dashed var(--green)', borderRadius: 'var(--radius-sm)',
                cursor: uploading ? 'not-allowed' : 'pointer', color: 'var(--green)',
                fontSize: '14px', fontWeight: 500,
              }}>
                {uploading ? 'Subiendo...' : '📷 Seleccionar imagen'}
                <input
                  type="file"
                  accept="image/*"   // solo permite imágenes
                  style={{ display: 'none' }}
                  disabled={uploading}
                  onChange={e => { const file = e.target.files?.[0]; if (file) uploadImage(file) }}
                  // e.target.files?.[0] → el primer archivo seleccionado (o undefined si no hay).
                  // El ?. es optional chaining — evita error si files es null.
                />
              </label>
            </div>

            {/* Botones de acción del modal */}
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
