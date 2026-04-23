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
