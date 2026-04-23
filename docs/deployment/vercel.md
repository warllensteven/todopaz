# ▲ Deploy en Vercel

## 🧠 Descripción general

TodoPaz utiliza **Vercel** como plataforma de despliegue, lo que permite:

- 🚀 Deploy automático desde Git
- 🔍 Previsualizaciones por rama (Preview Deployments)
- 🌐 Entorno de producción estable
- ⚡ Optimización automática para Next.js

---

## ⚙️ ¿Qué es Vercel?

Vercel es una plataforma especializada en aplicaciones frontend modernas, especialmente:

- Next.js
- React
- Aplicaciones serverless

---

## 🔄 Flujo de despliegue

![deploy-flow](placeholder-deploy-flow.png)

```id="8f0k2p"
Git Push → Vercel → Build → Deploy → URL disponible
🌿 Tipos de entornos
🟢 Producción
Rama principal (main)
URL oficial del proyecto
Accesible por usuarios reales

📌 Ejemplo:


https://todopaz.vercel.app

🟡 Preview (Vistas previas)
Se crean automáticamente por cada branch
Permiten probar cambios antes de producción

📌 Ejemplo:


https://todopaz-git-feature.vercel.app

🔵 Desarrollo local
Ejecutado en tu máquina
No afecta producción
npm run dev
🔍 Preview Deployments (clave)
🧠 ¿Qué son?

Son versiones temporales de tu app generadas automáticamente por cada cambio en Git.

⚙️ Cómo funcionan
Creas una rama:
git checkout -b feature/filtro
Haces cambios y push:
git push origin feature/filtro
Vercel automáticamente:
Construye la app
Genera una URL única
Permite probar los cambios
🎯 Para qué sirven

✔ Probar features sin romper producción
✔ Validar cambios antes de merge
✔ Compartir avances con otros
✔ Detectar errores temprano

🧪 Ejemplo real
Rama	URL	Uso
main	Producción	Usuarios finales
feature/search	Preview	Nueva funcionalidad
fix/navbar	Preview	Corrección de bug
🚀 Proceso recomendado de trabajo
1. Crear rama (feature)
2. Desarrollar cambio
3. Hacer push
4. Revisar preview en Vercel
5. Validar funcionamiento
6. Merge a main
7. Deploy automático a producción
⚡ Integración con Next.js

Vercel detecta automáticamente:

Rutas (app/)
SSR / CSR
Optimización de imágenes
Código dividido (code splitting)
📊 Speed Insights
<SpeedInsights />
🔍 Qué mide:
⚡ Tiempo de carga
📱 Rendimiento real del usuario
🌐 Experiencia en producción

📍 Se visualiza en:

👉 Dashboard de Vercel → Analytics

🔐 Variables de entorno

Se configuran en:

👉 Vercel Dashboard → Settings → Environment Variables

Ejemplo:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
⚠️ Buenas prácticas

✔ No trabajar directamente en main
✔ Usar ramas por feature
✔ Validar siempre en preview
✔ Usar variables de entorno (no hardcodear claves)
✔ Revisar logs de build

🚨 Problemas comunes
❌ Error de build
Revisar logs en Vercel
❌ Variables no definidas
Configurarlas en dashboard
❌ Hydration error
Diferencias entre SSR y cliente
🚀 Mejoras futuras (PRO)
🌐 Dominio personalizado
🔐 Protección de previews
📊 Monitoring avanzado
⚡ Edge Functions
🔁 CI/CD avanzado
📈 Resumen de mejoras

Se documentó el flujo completo de despliegue
Se explicó el uso de Preview Deployments
Se definieron entornos (dev, preview, prod)
Se integró con Next.js y Vercel
Se establecieron buenas prácticas de trabajo profesional
```
