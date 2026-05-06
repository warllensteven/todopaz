'use client'

import { useState, useRef } from 'react'

interface Props {
  imageSrc: string
  initialX?: number  // 0-100, default 50
  initialY?: number  // 0-100, default 50
  onConfirm: (x: number, y: number) => void
  onCancel: () => void
}

export default function FocalPointPicker({ imageSrc, initialX = 50, initialY = 50, onConfirm, onCancel }: Props) {
  const [focal, setFocal] = useState({ x: initialX, y: initialY })
  const containerRef = useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setFocal({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  function handleTouch(e: React.TouchEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const touch = e.touches[0]
    const x = Math.round(((touch.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((touch.clientY - rect.top) / rect.height) * 100)
    setFocal({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <span style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700 }}>
            Punto focal
          </span>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '2px 0 0' }}>
            Toca donde está lo más importante de la imagen
          </p>
        </div>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      {/* Imagen con punto focal */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', overflow: 'hidden' }}>
        <div
          ref={containerRef}
          onClick={handleClick}
          onTouchStart={handleTouch}
          style={{ position: 'relative', width: '100%', maxHeight: '100%', cursor: 'crosshair', userSelect: 'none' }}
        >
          <img
            src={imageSrc}
            alt="focal"
            draggable={false}
            style={{ width: '100%', display: 'block', borderRadius: '8px', maxHeight: '60vh', objectFit: 'contain' }}
          />

          {/* Punto focal — círculo arrastrable */}
          <div
            style={{
              position: 'absolute',
              left: `${focal.x}%`,
              top: `${focal.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '3px solid #fff',
              background: 'rgba(29,158,117,0.7)',
              boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
              transition: 'left .1s, top .1s',
            }}
          />

          {/* Líneas de referencia */}
          <div style={{ position: 'absolute', left: `${focal.x}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.3)', pointerEvents: 'none', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', top: `${focal.y}%`, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.3)', pointerEvents: 'none', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Preview de cómo se verá */}
      <div style={{ padding: '12px 16px 8px', flexShrink: 0 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginBottom: '8px' }}>
          Preview — así se verá recortada
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {/* Preview móvil — proporción del banner */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '4px' }}>Móvil</p>
            <div style={{ width: '120px', height: '68px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <img src={imageSrc} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focal.x}% ${focal.y}%` }} />
            </div>
          </div>
          {/* Preview desktop — más ancho */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '4px' }}>Desktop</p>
            <div style={{ width: '200px', height: '68px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <img src={imageSrc} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focal.x}% ${focal.y}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '10px', padding: '12px 16px 28px', flexShrink: 0 }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer' }}
        >
          Cancelar
        </button>
        <button
          onClick={() => onConfirm(focal.x, focal.y)}
          style={{ flex: 2, padding: '12px', background: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Confirmar punto focal
        </button>
      </div>
    </div>
  )
}