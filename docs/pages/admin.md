# 🛠 Panel de Administración (`admin/page.tsx`)## 🧠 Descripción generalEste módulo define el **panel de administración** de la aplicación.Permite:- 🔐 Acceso mediante clave simple- 📃 Visualizar todos los negocios (activos e inactivos)- ➕ Crear nuevos negocios- ✏️ Editar negocios existentes- ❌ Eliminar negocios- 📷 Subir imágenes (Supabase Storage)---## 🔐 Sistema de autenticaciónEl acceso está protegido por una clave local:```tsconst ADMIN_KEY = 'todopaz2024'

🔍 Funcionamiento:

El usuario ingresa la clave

Se compara con ADMIN_KEY

Si coincide → acceso permitido (auth = true)

Si no → error

⚠️ Nota: Esto es un sistema básico. En producción se recomienda usar Supabase Auth.

🧠 Estados del componente
EstadoTipoFunciónauthbooleanControla acceso al panelkeyInputstringValor del input de clavebusinessesBusiness[]Lista de negociosshowModalbooleanControla visibilidad del modaleditingIdstring | nullID del negocio en ediciónformobjetoDatos del formulariouploadingbooleanEstado de subida de imagen

🔄 Carga de datos
useEffect(() => { if (auth) fetchAll()}, [auth])
🔍 Comportamiento:

Solo se ejecuta cuando el usuario está autenticado

Evita llamadas innecesarias a la base de datos

🗄 Funciones de base de datos
📥 Obtener negocios
fetchAll()

Consulta todos los registros

Ordena por fecha (recientes primero)

Incluye activos e inactivos

💾 Guardar (crear / editar)
save()

Si existe editingId → UPDATE

Si no → INSERT

Validación mínima:

Nombre requerido

Teléfono requerido

❌ Eliminar
remove(id)

Solicita confirmación

Elimina por ID

Refresca la lista

📷 Subida de imágenes
uploadImage(file)
🔍 Flujo:

Genera nombre único (Date.now())

Sube a Supabase Storage

Obtiene URL pública

La guarda en el formulario

🧩 Funciones de UI
➕ Crear nuevo
openNew()

Limpia formulario

Abre modal

✏️ Editar
openEdit(business)

Carga datos del negocio

Abre modal

🔐 Render condicional (login)
if (!auth) return (...)
🔍 Comportamiento:

Si no está autenticado → muestra login

Evita renderizar el panel

🧾 Panel principal
Incluye:

Lista de negocios

Botones de editar / eliminar

Indicador de estado (activo/inactivo)

🪟 Modal (crear / editar)
Se usa para:

Crear negocios

Editar negocios

Incluye:

Inputs dinámicos

Select de categoría

Textarea de descripción

Toggle activo/inactivo

Subida de imagen

🧠 Flujo general

🚀 Buenas prácticas aplicadas
✔ Render condicional (seguridad básica)
✔ Reutilización de formulario
✔ Tipado con TypeScript
✔ Separación de lógica (DB / UI)
✔ Manejo de estado claro

⚠️ Mejores prácticas recomendadas (PRO)

🔐 Reemplazar ADMIN_KEY por Supabase Auth

🧠 Validaciones más robustas

📦 Manejo de errores en UI

🖼 Optimización de imágenes

📊 Logs de acciones admin

📈 Resumen de mejoras

Se documentó completamente el flujo del panel admin

Se separaron responsabilidades (auth, DB, UI)

Se explicó el sistema de subida de imágenes

Se añadieron recomendaciones de nivel profesional

Se dejó listo para migración a Wiki empresarial
