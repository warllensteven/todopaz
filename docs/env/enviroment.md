# 🌐 Variables de entorno

## 🧠 Descripción general

Las variables de entorno permiten configurar valores sensibles o dependientes del entorno sin exponerlos directamente en el código.

En TodoPaz se utilizan principalmente para:

- 🔐 Conexión a Supabase
- ⚙️ Configuración del entorno (dev, preview, producción)

---

## 📦 Archivo local

En desarrollo, se definen en:

```bash id="2l9x7c"
.env.local

📌 Este archivo NO debe subirse a Git.

🔑 Variables utilizadas
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
🔍 Explicación
Variable	Descripción
NEXT_PUBLIC_SUPABASE_URL	URL del proyecto en Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY	Clave pública para acceder desde el cliente
⚠️ Prefijo NEXT_PUBLIC_

En Next.js:

Variables con NEXT_PUBLIC_ → disponibles en el navegador
Variables sin ese prefijo → solo servidor

📌 En este proyecto se usan en frontend, por eso requieren el prefijo.

🚀 Uso en el código
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

📌 El ! indica que la variable existe (non-null assertion).

🌐 Configuración en Vercel

Se deben agregar en:

👉 Dashboard Vercel → Settings → Environment Variables

Entornos disponibles:
Development
Preview
Production
🔄 Flujo de uso
.env.local → Next.js → Supabase Client → Base de datos
🔐 Buenas prácticas

✔ No subir .env.local al repositorio
✔ Usar variables en lugar de valores hardcodeados
✔ Separar entornos (dev / prod)
✔ Rotar claves periódicamente

🚨 Errores comunes
❌ Variable undefined

Causa:

No definida en .env.local o Vercel

Solución:

Verificar nombre exacto
Reiniciar servidor (npm run dev)
❌ No funciona en producción

Causa:

Variable no configurada en Vercel

Solución:

Agregarla en el dashboard
🚀 Mejores prácticas (PRO)

🔐 Usar claves privadas en backend (no públicas)
🛡 Implementar RLS en Supabase
📦 Separar config por entorno
🔍 Validar variables al iniciar la app
📊 Usar secretos en CI/CD

📈 Resumen de mejoras

Se documentó el uso de variables de entorno
Se explicó la integración con Next.js y Vercel
Se establecieron buenas prácticas de seguridad
Se identificaron errores comunes
Se dejó preparado para despliegue profesional
```
