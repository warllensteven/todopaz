'use client'
 
import { useState } from 'react'
import FocalPointPicker from '@/components/admin/FocalPointPicker'
 
interface FormState {
  name: string
  phone: string
  address: string
  category: string
  schedule: string
  schedule_days: string[]
  schedule_open1: string
  schedule_close1: string
  schedule_open2: string
  schedule_close2: string
  schedule_note: string
  description: string
  is_active: boolean
  image_url: string
  image_focal_x: number
  image_focal_y: number
}
 
interface Props {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  editingId: string | null
  uploading: boolean
  onSave: () => void
  onClose: () => void
  onUpload: (file: File) => void
}
 
const CATEGORIES = [
  'Restaurante', 'Panadería', 'Barbería', 'Supermercado', 'Estetica', 'Accesorios',
  'Servicio', 'Farmacia', 'Ropa', 'Calzado', 'Tienda Naturista', 'Bar', 'Otro'
]
 
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
 
const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px', outline: 'none', color: 'var(--text)'
}
 
const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 500 as const,
  color: 'var(--text3)', textTransform: 'uppercase' as const,
  letterSpacing: '.3px', marginBottom: '6px'
}
 
export default function BusinessFormModal({ form, setForm, editingId, uploading, onSave, onClose, onUpload }: Props) {
  const [showFocalPicker, setShowFocalPicker] = useState(false)
 
  return (
    <>
      {showFocalPicker && form.image_url && (
        <FocalPointPicker
          imageSrc={form.image_url}
          initialX={form.image_focal_x ?? 50}
          initialY={form.image_focal_y ?? 50}
          onConfirm={(x, y) => {
            setForm(f => ({ ...f, image_focal_x: x, image_focal_y: y }))
            setShowFocalPicker(false)
          }}
          onCancel={() => setShowFocalPicker(false)}
        />
      )}
      <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
      <div style={{ background: 'var(--bg)', borderRadius: '16px 16px 0 0', padding: '24px 20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
 
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
          {editingId ? 'Editar negocio' : 'Nuevo negocio'}
        </h3>
 
        {/* Nombre */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Nombre</label>
          <input
            placeholder="Ej: Panadería El Trigo"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
        </div>
 
        {/* Teléfono y Dirección */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Teléfono WA</label>
            <input
              placeholder="573001234567"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>
              Dirección <span style={{ fontSize: '11px', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              placeholder="Cra X # X - XX"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>
 
        {/* Descripción */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Descripción</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="¿Qué ofrece este negocio?"
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          />
        </div>
 
        {/* Categoría */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            style={inputStyle}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
 
        {/* Días de atención */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Días de atención</label>
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
 
        {/* Franja mañana */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Franja mañana</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select value={form.schedule_open1} onChange={e => setForm(f => ({ ...f, schedule_open1: e.target.value }))} style={inputStyle}>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span style={{ color: 'var(--text3)', fontWeight: 500 }}>—</span>
            <select value={form.schedule_close1} onChange={e => setForm(f => ({ ...f, schedule_close1: e.target.value }))} style={inputStyle}>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
 
        {/* Franja tarde */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>
            Franja tarde <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text3)' }}>(opcional)</span>
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select value={form.schedule_open2} onChange={e => setForm(f => ({ ...f, schedule_open2: e.target.value }))} style={inputStyle}>
              <option value="">No aplica</option>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span style={{ color: 'var(--text3)', fontWeight: 500 }}>—</span>
            <select value={form.schedule_close2} onChange={e => setForm(f => ({ ...f, schedule_close2: e.target.value }))} style={inputStyle}>
              <option value="">No aplica</option>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
 
        {/* Nota especial */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>
            Nota especial <span style={{ fontSize: '11px', fontWeight: 400 }}>(opcional)</span>
          </label>
          <input
            placeholder="Ej: Domingos solo hasta las 2pm"
            value={form.schedule_note}
            onChange={e => setForm(f => ({ ...f, schedule_note: e.target.value }))}
            style={inputStyle}
          />
        </div>
 
        {/* Toggle activo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Negocio activo</span>
          <button
            onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
            style={{ width: '44px', height: '24px', background: form.is_active ? 'var(--green-mid)' : 'var(--gray-light)', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}
          >
            <span style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: form.is_active ? '23px' : '3px', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', display: 'block' }} />
          </button>
        </div>
 
        {/* Imagen */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Logo o foto</label>
          {form.image_url && (
            <div style={{ marginBottom: '10px', position: 'relative', width: '80px', height: '80px' }}>
              <img src={form.image_url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: `${form.image_focal_x ?? 50}% ${form.image_focal_y ?? 50}%`, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
              <button
                onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#A32D2D', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
          )}
 
          {form.image_url && (
            <button
              onClick={() => setShowFocalPicker(true)}
              style={{ width: '100%', padding: '9px', marginBottom: '8px', background: 'transparent', border: '1px solid var(--green)', borderRadius: 'var(--radius-sm)', color: 'var(--green)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
            >
              🎯 Ajustar punto focal
            </button>
          )}
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px dashed var(--green)', borderRadius: 'var(--radius-sm)', cursor: uploading ? 'not-allowed' : 'pointer', color: 'var(--green)', fontSize: '14px', fontWeight: 500 }}>
            {uploading ? 'Subiendo...' : '📷 Seleccionar imagen'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              disabled={uploading}
              onChange={e => { const file = e.target.files?.[0]; if (file) onUpload(file) }}
            />
          </label>
        </div>
 
        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            style={{ flex: 1, padding: '10px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#fff' }}
          >
            Guardar
          </button>
        </div>
 
      </div>
    </div>
    </>
  )
}
 