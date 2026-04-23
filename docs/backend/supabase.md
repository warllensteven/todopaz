🗄 Supabase Client (lib/supabase.ts)
🧠 Descripción general

Este archivo configura y exporta el cliente oficial de Supabase, que permite a la aplicación comunicarse con la base de datos y servicios backend.

Es el punto central para:

🗃 Consultas a base de datos
📦 Storage (imágenes)
🔐 Autenticación (futuro)
🔄 Operaciones CRUD
📦 Importaciones
import { createClient } from '@supabase/supabase-js'
Importación Función
createClient Crea una instancia de conexión a Supabase
🔐 Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
🔍 Qué son:

Son variables definidas en el archivo .env.local:

NEXT*PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
⚠️ Detalles importantes
🔓 NEXT_PUBLIC*
Hace que la variable esté disponible en el cliente (frontend)
Necesario porque estás usando Supabase desde el navegador
❗ ! (Non-null assertion)
process.env.NEXT_PUBLIC_SUPABASE_URL!

Le dice a TypeScript:

“Confía, esta variable SIEMPRE existe”

⚠️ Riesgo:

Si no existe → la app rompe en runtime

🧩 Creación del cliente
export const supabase = createClient(supabaseUrl, supabaseKey)
🔍 Qué hace:
Inicializa la conexión con Supabase
Usa:
URL del proyecto
API Key pública
🌐 Uso en la aplicación

Este cliente se importa en múltiples archivos:

import { supabase } from '@/lib/supabase'
🧠 Ejemplo de uso
const { data } = await supabase
.from('businesses')
.select('\*')
🔄 Flujo de conexión
App (Next.js)
↓
supabase.ts (cliente)
↓
Supabase API
↓
Base de datos / Storage
🚀 Buenas prácticas aplicadas

✔ Centralización del cliente
✔ Uso de variables de entorno
✔ Separación de configuración
✔ Reutilización global

⚠️ Mejores prácticas recomendadas (PRO)
🔐 1. Validación segura de variables

Evitar usar ! directamente:

if (!supabaseUrl || !supabaseKey) {
throw new Error('Faltan variables de entorno de Supabase')
}
🧩 2. Separar cliente server/client

En apps grandes:

Cliente público (frontend)
Cliente seguro (backend con service role)
🔒 3. NO usar Service Role en frontend

Nunca exponer:

SUPABASE_SERVICE_ROLE_KEY ❌
⚙️ 4. Configuración avanzada
createClient(url, key, {
auth: {
persistSession: true,
},
})
📦 5. Tipado automático (muy PRO)

Generar tipos desde Supabase:

npx supabase gen types typescript
🧠 Relación con el proyecto

Este archivo es usado por:

🏠 page.tsx → listar negocios
🛠 admin/page.tsx → CRUD completo
📄 negocio/[id] → detalle
📦 uploadImage() → storage
🔥 Importancia arquitectónica

Sin este archivo:

❌ No hay conexión a BD
❌ No hay datos
❌ No hay app

👉 Es el core del backend cliente

📈 Resumen de mejoras
Se documentó la conexión con Supabase
Se explicó el uso de variables de entorno
Se detalló el funcionamiento de createClient
Se explicó el flujo de datos
Se incluyeron prácticas de seguridad
Se dejaron recomendaciones tipo producción
