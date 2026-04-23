# 🏗️ Arquitectura del sistema

## 🧠 Descripción general

TodoPaz está construido como una **aplicación fullstack moderna** basada en:

- ⚛️ Next.js (App Router)
- 🗄️ Supabase (Backend as a Service)
- 🧱 TypeScript (tipado fuerte)

La arquitectura sigue una separación clara por capas:

- 🧱 Core (páginas y routing)
- 🎨 UI (componentes reutilizables)
- 🗄️ Data (acceso a datos)
- 🌐 Infraestructura (deploy en Vercel)

---

## 🧩 Diagrama de arquitectura

![arquitectura](placeholder-arquitectura-general.png)

---

## 🔄 Flujo completo de la aplicación

### 1️⃣ Usuario interactúa con la UI

Ejemplo:

- Busca un negocio
- Selecciona una categoría
- Hace clic en una tarjeta

---

### 2️⃣ Core (Pages) maneja la lógica

Archivos involucrados:

- `app/page.tsx`
- `app/admin/page.tsx`
- `app/negocio/[id]/page.tsx`

Responsabilidades:

- Manejar estado (`useState`)
- Ejecutar efectos (`useEffect`)
- Orquestar datos + UI

---

### 3️⃣ Data Layer (Supabase)

```ts
supabase.from('businesses').select('*')
Ejecuta queries
Devuelve datos en JSON
Conecta con PostgreSQL
4️⃣ Tipado (TypeScript)
Business[]
Garantiza estructura consistente
Evita errores en runtime
Mejora autocompletado
5️⃣ UI renderiza datos

Componentes:

BizCard
CategoryFilter
NavBar
WhatsAppButton

Responsabilidades:

Mostrar datos
Manejar interacción visual
Reutilización
🔁 Flujo resumido
Usuario → UI → Pages → Supabase → DB
                    ↓
                TypeScript
                    ↓
                 UI render
🧱 Estructura del proyecto
app/
├── layout.tsx
├── page.tsx
├── admin/
│   └── page.tsx
├── negocio/
│   └── [id]/
│       └── page.tsx

components/
├── BizCard.tsx
├── CategoryFilter.tsx
├── NavBar.tsx
├── WhatsAppButton.tsx

lib/
└── supabase.ts

types/
└── business.ts
🎯 Decisiones de arquitectura
✔ Uso de App Router (Next.js)
Routing basado en archivos
Soporte para SSR y CSR
Mejor organización por módulos
✔ Separación de capas
Capa	Responsabilidad
Core	Lógica y navegación
UI	Presentación
Data	Acceso a datos
✔ Backend como servicio (Supabase)
No se necesita backend propio
API automática
Base de datos PostgreSQL
✔ Tipado fuerte (TypeScript)
Seguridad en desarrollo
Mejor mantenimiento
Escalabilidad
⚡ Escalabilidad

El sistema está preparado para crecer:

📦 Nuevas entidades (usuarios, pedidos, etc.)
🔐 Autenticación con Supabase Auth
📊 Analytics avanzados
🌐 Multi-ciudad (no solo Paz de Ariporo)
🔐 Consideraciones de seguridad
Uso de variables de entorno
Clave pública (anon key)
Posibilidad de implementar RLS (Row Level Security)
🚀 Deploy e infraestructura
▲ Vercel (hosting)
⚡ Deploy automático con Git
🔍 Preview deployments por rama
📊 Speed Insights (rendimiento)
🧠 Buenas prácticas aplicadas

✔ Separación de responsabilidades
✔ Componentes reutilizables
✔ Tipado fuerte
✔ Uso de variables de entorno
✔ Arquitectura escalable

🚨 Mejoras futuras (nivel PRO)
🧩 Implementar Repository Pattern
🔐 Autenticación real (JWT / Supabase Auth)
📦 Manejo global de estado (Zustand / Redux)
⚡ Optimización de queries
🧪 Testing (Jest / Playwright)
📊 Observabilidad (logs + métricas)
📈 Resumen de mejoras

Se documentó la arquitectura completa del sistema
Se explicó el flujo de datos end-to-end
Se definieron las capas del proyecto
Se justificaron decisiones técnicas
Se dejó preparada la base para escalar a nivel empresarial
```
