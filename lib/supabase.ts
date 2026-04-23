// ─── CLIENTE DE SUPABASE ─────────────────────────────────────────
// Este archivo crea la conexión con tu backend (Supabase).
// 👉 Es el puente entre tu app (frontend) y la base de datos.

import { createClient } from '@supabase/supabase-js'
// SDK oficial de Supabase para interactuar con:
// - Base de datos (PostgreSQL)
// - Storage (imágenes)
// - Auth (usuarios)


// ─── VARIABLES DE ENTORNO ─────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// URL de tu proyecto en Supabase
// Ej: https://xxxx.supabase.co

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Clave pública (anon key)
// Permite acceder a la DB desde el frontend (con reglas de seguridad)


// ─── CREACIÓN DEL CLIENTE ─────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseKey)
// Instancia global reutilizable
// 👉 Con esto haces:
// - SELECT
// - INSERT
// - UPDATE
// - DELETE
// - Storage (subir imágenes)
