## Modelo de datos

Tabla `businesses` en Supabase:

| Campo       | Tipo      | Descripción                        |
| ----------- | --------- | ---------------------------------- |
| id          | uuid      | Identificador único (auto)         |
| name        | text      | Nombre del negocio                 |
| category    | text      | Categoría (Restaurante, Tienda...) |
| phone       | text      | Número WhatsApp (ej: 573001234567) |
| description | text      | Descripción del negocio            |
| image_url   | text      | URL de la foto/logo (Supabase)     |
| schedule    | text      | Horario de atención                |
| is_active   | boolean   | Si aparece o no en el directorio   |
| created_at  | timestamp | Fecha de creación (auto)           |

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Correr el proyecto localmente

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

## Pantallas

| Ruta            | Descripción                                       |
| --------------- | ------------------------------------------------- |
| `/`             | Home — listado de negocios con búsqueda y filtros |
| `/negocio/[id]` | Detalle del negocio + botón WhatsApp              |
| `/admin`        | Panel admin protegido por clave                   |

## Acceso al panel admin

Navega a `/admin` e ingresa la clave definida en `ADMIN_KEY` dentro de `app/admin/page.tsx`. Por defecto es `todopaz2024` — cámbiala antes de compartir la URL.

## Roadmap futuro

- [ ] Autenticación real con Supabase Auth
- [ ] Dominio propio (todopaz.co)
- [ ] SEO y Open Graph por negocio
- [ ] Feed de noticias del municipio
- [ ] Sistema de pedidos
- [ ] Servicio de mototaxi
- [ ] Publicidad para negocios destacados

##

Últimas funcionalidades agregadas:

Sistema de autenticación real con Supabase Auth (email + contraseña)
Roles: superadmin (ve todo) y owner (solo su negocio)
Tabla user_roles en Supabase
Cerrar sesión desde el panel
Sesión persistente con Supabase (no pide login al volver atrás)
Campo visits en tabla businesses
Función RPC increment_visits en Supabase
Negocios ordenados por visitas en el Home
Contador de visitas visible en el panel admin

Para crear un usuario dueño de negocio:

Supabase → Authentication → Users → Add user
Copiar UUID
SQL: INSERT INTO user_roles (user_id, role) VALUES ('UUID', 'owner');
SQL: UPDATE businesses SET owner_id = 'UUID' WHERE id = 'UUID-NEGOCIO';

Claude respondió: Pasos para agregar una categoría — 4 archivos, sin tocar Supabase:
Pasos para agregar una categoría — 4 archivos, sin tocar Supabase:

app/admin/page.tsx → agregar en CATEGORIES
app/page.tsx → agregar en CATS_EMOJI
components/BizCard.tsx → agregar en CATS_META
app/negocio/[id]/page.tsx → agregar en CATS_META
