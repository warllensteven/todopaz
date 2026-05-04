// ─── CONSTANTES DE CATEGORÍAS ────────────────────────────────────
// Fuente única de verdad para categorías, emojis y colores.
// Importar desde aquí en todos los componentes que lo necesiten.
 
export const CATEGORIES = [
  'Restaurante', 'Panadería', 'Barbería', 'Supermercado', 'Estética', 'Accesorios',
  'Servicio', 'Farmacia', 'Ropa', 'Calzado', 'Tienda Naturista', 'Bar', 'Otro'
]
 
export const CATS_EMOJI: Record<string, string> = {
  'Restaurante':      '🍽',
  'Panadería':        '🥐',
  'Barbería':         '✂️',
  'Supermercado':     '🛒',
  'Estética':         '💅',
  'Accesorios':       '💍',
  'Servicio':         '🔧',
  'Farmacia':         '💊',
  'Ropa':             '👕',
  'Calzado':          '👟',
  'Tienda Naturista': '🌿',
  'Bar':              '🍺',
  'Otro':             '📦',
}
 
export const CATS_META: Record<string, { emoji: string; bg: string }> = {
  'Restaurante':      { emoji: '🍽', bg: '#E1F5EE' },
  'Panadería':        { emoji: '🥐', bg: '#FAEEDA' },
  'Barbería':         { emoji: '✂️', bg: '#EEEDFE' },
  'Supermercado':     { emoji: '🛒', bg: '#FAECE7' },
  'Estética':         { emoji: '💅', bg: '#FDE8F5' },
  'Accesorios':       { emoji: '💍', bg: '#FEF9E7' },
  'Servicio':         { emoji: '🔧', bg: '#E6F1FB' },
  'Farmacia':         { emoji: '💊', bg: '#EAF3DE' },
  'Ropa':             { emoji: '👕', bg: '#EAF0FB' },
  'Calzado':          { emoji: '👟', bg: '#FFF3E0' },
  'Tienda Naturista': { emoji: '🌿', bg: '#E8F5E9' },
  'Bar':              { emoji: '🍺', bg: '#FFF8E1' },
  'Otro':             { emoji: '📦', bg: '#F1EFE8' },
}
 