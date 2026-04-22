'use client'

type Props = {
  categories: string[]
  selected: string
  onSelect: (cat: string) => void
  total?: number
}

const CATS_EMOJI: Record<string, string> = {
  'Restaurante': '🍽',
  'Panadería': '🥐',
  'Barbería': '✂️',
  'Tienda': '🛒',
  'Servicio': '🔧',
  'Farmacia': '💊',
  'Otro': '📦',
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  total = 0,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '16px',
        scrollbarWidth: 'none',
      }}
    >
      {categories.map((cat) => {
        const isActive = selected === cat

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              background: isActive
                ? 'var(--amber)'
                : 'rgba(255,255,255,0.12)',
              border: `1px solid ${
                isActive
                  ? 'var(--amber)'
                  : 'rgba(255,255,255,0.2)'
              }`,
              borderRadius: '20px',
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              color: isActive ? 'var(--green)' : '#fff',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {cat === 'Todos'
              ? `Todos (${total})`
              : `${CATS_EMOJI[cat]} ${cat}`}
          </button>
        )
      })}
    </div>
  )
}