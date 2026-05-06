// ─── CONFIGURACIÓN GLOBAL DE LA APP (ROOT LAYOUT) ─────────────────
// Este archivo envuelve TODA la aplicación.
// Todo lo que pongas aquí se aplica a todas las páginas (Home, Admin, Detail, etc).

import type { Metadata } from 'next'
// Tipo de Next.js para definir metadata (SEO, título, descripción, etc)

import './globals.css'
// Estilos globales de toda la aplicación
// Aquí defines colores, tipografías, variables CSS, etc.

import { SpeedInsights } from '@vercel/speed-insights/next'
// Herramienta de Vercel para medir rendimiento real de usuarios (RUM)
// Te dice qué tan rápida es tu app en producción


// ─── METADATA (SEO) ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'TodoPaz — Negocios de Paz de Ariporo',
  // Título que aparece en la pestaña del navegador
  // También importante para posicionamiento (SEO)

  description: 'Encuentra negocios y servicios locales en Paz de Ariporo, Casanare',
  // Descripción usada por Google y redes sociales
}


// ─── COMPONENTE ROOT LAYOUT ──────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es">
      {/* lang="es" → importante para SEO y accesibilidad */}
      <body >
        {/* children → aquí se renderizan TODAS las páginas */}
        {/* Ej: Home, Admin, Detail, etc */}
        {children}

        {/* 🔥 MÉTRICAS DE RENDIMIENTO */}
        <SpeedInsights />
        {/* Mide:
            - tiempo de carga
            - interactividad
            - rendimiento real del usuario
        */}
      </body>
    </html>
  )
}