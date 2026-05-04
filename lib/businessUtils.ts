// ─── UTILIDADES DE NEGOCIOS ───────────────────────────────────────
// Funciones puras compartidas entre componentes.
// Sin dependencias de React — se pueden usar en cualquier parte.

import { Business } from '@/types/business'

// ─── isOpenNow ────────────────────────────────────────────────────
// Determina si un negocio está abierto en este momento.
// Soporta dos franjas horarias y horarios que cruzan medianoche (ej: 17:00 → 02:00).
export function isOpenNow(biz: Business): boolean {
  if (!biz.schedule_days?.length) return false

  const now = new Date()
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const today = days[now.getDay()]
  const yesterday = days[(now.getDay() + 6) % 7]

  const currentTime = now.getHours() * 60 + now.getMinutes()

  function isInRange(open: string, close: string, dayActive: boolean): boolean {
    if (!open || !close || !dayActive) return false
    const [oH, oM] = open.split(':').map(Number)
    const [cH, cM] = close.split(':').map(Number)
    const openMin = oH * 60 + oM
    const closeMin = cH * 60 + cM

    if (closeMin > openMin) {
      // Horario normal, no cruza medianoche. Ej: 07:00 → 12:00
      return currentTime >= openMin && currentTime < closeMin
    } else {
      // Cruza medianoche. Ej: 17:00 → 02:00
      return currentTime >= openMin || currentTime < closeMin
    }
  }

  const todayActive = biz.schedule_days.includes(today)
  const yesterdayActive = biz.schedule_days.includes(yesterday)

  // Franjas de hoy
  if (isInRange(biz.schedule_open1, biz.schedule_close1, todayActive)) return true
  if (isInRange(biz.schedule_open2 ?? '', biz.schedule_close2 ?? '', todayActive)) return true

  // Franja 1 abrió ayer y cruza medianoche hasta hoy
  if (yesterdayActive && biz.schedule_open1 && biz.schedule_close1) {
    const [oH, oM] = biz.schedule_open1.split(':').map(Number)
    const [cH, cM] = biz.schedule_close1.split(':').map(Number)
    const closeMin = cH * 60 + cM
    const openMin = oH * 60 + oM
    if (closeMin < openMin && currentTime < closeMin) return true
  }

  // Franja 2 abrió ayer y cruza medianoche hasta hoy
  if (yesterdayActive && biz.schedule_open2 && biz.schedule_close2) {
    const [oH, oM] = biz.schedule_open2.split(':').map(Number)
    const [cH, cM] = biz.schedule_close2.split(':').map(Number)
    const closeMin = cH * 60 + cM
    const openMin = oH * 60 + oM
    if (closeMin < openMin && currentTime < closeMin) return true
  }

  return false
}

// ─── formatDays ──────────────────────────────────────────────────
// Convierte ['Lun','Mar','Mié'] → 'Lun – Mié'
export function formatDays(days: string[]): string {
  const order = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  if (!days?.length) return ''
  const sorted = [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b))
  if (sorted.length === 1) return sorted[0]
  return `${sorted[0]} – ${sorted[sorted.length - 1]}`
}

// ─── formatHour ──────────────────────────────────────────────────
// Convierte '14:30' → '2:30 PM'
export function formatHour(h: string): string {
  if (!h) return ''
  const [hours, minutes] = h.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${h12}:${minutes.toString().padStart(2, '0')} ${ampm}`
}