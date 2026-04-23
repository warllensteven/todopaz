# 🧱 Root Layout (`layout.tsx`)

## 🧠 Descripción general

Este archivo define el **layout raíz global** de la aplicación en Next.js (App Router).

Es el componente más importante a nivel estructural, ya que:

- 🌐 Envuelve TODAS las páginas
- 🎨 Aplica estilos globales
- ⚙️ Configura metadatos SEO
- 📊 Integra herramientas globales (analytics, performance)

---

## 📦 Importaciones

```ts
import type { Metadata } from 'next'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
Importación	Función
Metadata	Tipado para SEO
globals.css	Estilos globales
SpeedInsights	Métricas de rendimiento
🌐 Metadatos (SEO)
export const metadata: Metadata = {
  title: 'TodoPaz — Negocios de Paz de Ariporo',
  description: 'Encuentra negocios y servicios locales en Paz de Ariporo, Casanare',
}
🎯 Propósito:

Define información global para:

Motores de búsqueda (SEO)
Vista previa en redes sociales
Título del navegador
🧩 Componente RootLayout
export default function RootLayout({ children }: { children: React.ReactNode })
🔍 Explicación:
children representa TODAS las páginas
Cada page.tsx se renderiza dentro de este layout
🧱 Estructura HTML
<html lang="es">
  <body>
    {children}
    <SpeedInsights />
  </body>
</html>
📌 Detalles importantes:
🌍 <html lang="es">
Define idioma de la aplicación
Mejora accesibilidad y SEO
📦 {children}
Aquí se renderiza el contenido de cada página
Es el "slot" dinámico
📊 <SpeedInsights />
Herramienta de Vercel
Mide rendimiento real del usuario
📊 Speed Insights
<SpeedInsights />
🔍 Qué hace:
Recoge métricas como:
⚡ Tiempo de carga
📱 Rendimiento en dispositivos
🌐 Experiencia real del usuario
📍 Dónde se ve:
Dashboard de Vercel → pestaña "Analytics"
🧠 Flujo de renderizado
🚀 Buenas prácticas aplicadas

✔ Separación de layout global
✔ SEO centralizado
✔ Estilos globales unificados
✔ Integración de analytics

⚠️ Mejores prácticas recomendadas (PRO)
🌐 Agregar meta tags adicionales (Open Graph)
🖼 Configurar favicon
🎨 Manejar temas (dark/light mode)
🔐 Integrar providers globales (Auth, Context)
⚡ Lazy load de scripts externos
📈 Resumen de mejoras
Se documentó el layout raíz de la aplicación
Se explicó el flujo global de renderizado
Se detalló la integración de Speed Insights
Se incluyeron prácticas de SEO y arquitectura
Se dejó listo para escalar a nivel empresarial
```
