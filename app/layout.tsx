import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TodoPaz — Negocios de Paz de Ariporo',
  description: 'Encuentra negocios y servicios locales en Paz de Ariporo, Casanare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}