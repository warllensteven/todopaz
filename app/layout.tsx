import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://todopaz.vercel.app'),
  title: {
    default: 'TodoPaz — Negocios de Paz de Ariporo',
    template: '%s | TodoPaz',
  },
  description: 'Encuentra negocios y servicios locales en Paz de Ariporo, Casanare. Contacta directamente por WhatsApp.',
  keywords: ['Paz de Ariporo', 'negocios', 'Casanare', 'Colombia', 'directorio local'],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'TodoPaz',
    images: [{ url: '/logo.png', width: 1254, height: 1254, alt: 'TodoPaz' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TodoPaz — Negocios de Paz de Ariporo',
    description: 'Encuentra negocios y servicios locales en Paz de Ariporo, Casanare.',
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}