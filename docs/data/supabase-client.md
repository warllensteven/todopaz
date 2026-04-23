# 🔌 Supabase Client (`lib/supabase.ts`)

## 🧠 Descripción general

Este archivo configura y exporta el **cliente oficial de Supabase**, el cual permite a la aplicación conectarse a la base de datos y ejecutar operaciones CRUD.

Actúa como el **punto central de acceso a datos** en toda la aplicación.

---

## 📦 Importaciones

```ts
import { createClient } from '@supabase/supabase-js'
Importación	Función
createClient	Crea una instancia del cliente Supabase
🔐 Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
🔍 Explicación:
Variable	Propósito
NEXT_PUBLIC_SUPABASE_URL	URL del proyecto en Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY	Clave pública para acceso desde el cliente

📌 El prefijo NEXT_PUBLIC_ permite que estas variables estén disponibles en el navegador.

⚠️ El ! (non-null assertion) le indica a TypeScript que estas variables siempre existirán.

🚀 Inicialización del cliente
export const supabase = createClient(supabaseUrl, supabaseKey)
🎯 Qué hace:
Crea una conexión con Supabase
Permite ejecutar queries como:
SELECT
INSERT
UPDATE
DELETE
🔄 Uso en la aplicación

Este cliente se importa en múltiples módulos:

import { supabase } from '@/lib/supabase'

Ejemplo real:

const { data } = await supabase
  .from('businesses')
  .select('*')
🧠 Flujo de funcionamiento

UI solicita datos
Supabase Client envía query
Supabase procesa en PostgreSQL
Retorna datos en formato JSON
UI renderiza resultados
🎯 Responsabilidades

✔ Centralizar la conexión a la base de datos
✔ Evitar múltiples configuraciones repetidas
✔ Facilitar mantenimiento y escalabilidad
✔ Proveer una API simple para queries

⚠️ Buenas prácticas aplicadas

✔ Uso de variables de entorno
✔ Cliente único reutilizable
✔ Separación de responsabilidades
✔ Tipado con TypeScript

🚨 Mejores prácticas recomendadas (PRO)

🔐 No usar la clave anon para operaciones sensibles
🛡 Implementar Row Level Security (RLS) en Supabase
📦 Crear servicios intermedios (repository pattern)
⚡ Manejar errores globalmente
📊 Agregar logging de queries

📈 Resumen de mejoras

Se documentó la conexión a Supabase
Se explicó el uso de variables de entorno
Se definió el flujo de datos
Se establecieron buenas prácticas de seguridad
Se dejó preparado para escalar a nivel empresarial
```
