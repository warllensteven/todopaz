🚀 TodoPaz — Plataforma de Negocios Locales
🧠 Visión del proyecto

TodoPaz es una plataforma web diseñada para conectar a los habitantes de Paz de Ariporo con los negocios locales, facilitando el descubrimiento, contacto y visibilidad de servicios dentro del municipio.

El objetivo es claro:

🌍 Digitalizar el comercio local y hacerlo accesible en segundos.

🎯 Problema que resuelve

En muchos municipios:

❌ No existe un directorio digital centralizado
❌ Los negocios dependen solo del voz a voz
❌ Es difícil encontrar servicios específicos rápidamente

TodoPaz soluciona esto con:

✔ Listado centralizado
✔ Búsqueda en tiempo real
✔ Contacto directo vía WhatsApp
✔ Panel de administración para negocios

🧱 Arquitectura del sistema
Frontend (Next.js)
↓
Cliente Supabase
↓
Base de datos + Storage
↓
Usuarios finales
🛠 Stack tecnológico
Capa Tecnología
Frontend Next.js (App Router)
Lenguaje TypeScript
Backend Supabase
Base de datos PostgreSQL
Storage Supabase Storage
Deploy Vercel
Analytics Speed Insights
📂 Estructura de documentación
docs/
├── README.md
├── core/
│ └── layout.md
│
├── pages/
│ ├── home.md
│ ├── admin.md
│ └── negocio-detail.md
│
├── components/
│ ├── navbar.md
│ ├── bizcard.md
│ ├── category-filter.md
│ └── whatsapp-button.md
│
├── backend/
│ └── supabase.md
│
└── types/
└── business.md
🧭 Navegación de la documentación
🧱 Core
📄 layout.tsx → estructura global de la app
👉 Define SEO, estilos y layout base
📄 Pages
🏠 page.tsx → Home
🛠 admin/page.tsx → Panel de administración
🔍 negocio/[id]/page.tsx → Detalle de negocio

👉 Manejan la lógica principal de la aplicación

🧩 Components
🧭 NavBar → navegación global
🏪 BizCard → tarjeta de negocio
🎯 CategoryFilter → filtros por categoría
💬 WhatsAppButton → contacto directo

👉 Componentes reutilizables de UI

🗄 Backend
🔌 supabase.ts → cliente de conexión

👉 Punto central de comunicación con la base de datos

🧩 Types
📦 Business → modelo de datos

👉 Define la estructura de la información en toda la app

🔄 Flujo principal del usuario
Usuario entra a la app
↓
Explora negocios (Home)
↓
Filtra o busca
↓
Selecciona un negocio
↓
Ve detalles
↓
Contacta por WhatsApp
🔐 Flujo de administración
Admin ingresa clave
↓
Accede al panel
↓
Crea / edita / elimina negocios
↓
Sube imágenes
↓
Controla visibilidad (activo/inactivo)
⚙️ Funcionalidades principales
🔍 Búsqueda y filtrado
Búsqueda en tiempo real
Filtro por categorías
UI dinámica
📄 Detalle de negocio
Información completa
Imagen/logo
Botón de contacto
💬 Integración con WhatsApp
Mensaje predefinido
Redirección directa
Conversión inmediata
🛠 Panel de administración
CRUD completo
Subida de imágenes
Activación/desactivación
📊 Performance y monitoreo

Se integra:

⚡ Speed Insights (Vercel)

Permite medir:

Tiempo de carga
Experiencia del usuario
Rendimiento en producción
🚀 Deploy y entornos
Entorno Descripción
Production Rama main
Preview Ramas feature
Local Desarrollo
🔍 Preview Deployments (clave)

Cada cambio en una rama genera:

✔ URL única
✔ Entorno aislado
✔ Pruebas sin afectar producción

🧠 Decisiones técnicas clave
🧩 App Router (Next.js)
Mejor organización por rutas
Soporte para layouts
🔥 Supabase
Backend sin configurar servidores
DB + Storage integrados
⚡ Client Components
Interactividad total (hooks, eventos)
🎯 Tipado con TypeScript
Menos errores
Código mantenible
📈 Escalabilidad futura
🔐 Autenticación real (Supabase Auth)
⭐ Sistema de ratings
📍 Geolocalización
📱 PWA / App móvil
💳 Pagos online
📊 Dashboard analytics para negocios
🧪 Buenas prácticas aplicadas

✔ Separación por capas
✔ Componentización
✔ Tipado fuerte
✔ Uso de variables de entorno
✔ Deploy continuo (CI/CD con Vercel)
✔ Documentación técnica estructurada

👨‍💻 Autor

Steven Romero
Full Stack Developer

📈 Valor del proyecto

Este proyecto demuestra:

🧠 Arquitectura moderna (Next.js + Supabase)
⚙️ Integración real frontend-backend
🎯 Enfoque en producto (no solo código)
📚 Documentación profesional
🚀 Preparación para entornos reales
📌 Conclusión

TodoPaz no es solo una app, es una solución digital para comunidades locales.

Combina:

Tecnología moderna
Experiencia de usuario
Impacto real
📈 Resumen de mejoras
Se creó documentación centralizada tipo empresa
Se estructuró la arquitectura del proyecto
Se definieron flujos de usuario y admin
Se documentó stack y decisiones técnicas
Se dejó base para escalabilidad real
Se elevó el proyecto a nivel portafolio profesional
