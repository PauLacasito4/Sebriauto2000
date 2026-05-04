// supabase.js - Sebriauto 2000
// supabase.js — Configuración de la conexión con la base de datos de producción
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Credenciales de conexión (URL del proyecto y clave anónima pública)
const SUPABASE_URL = 'https://ahhzibgjveyfpyiflvwa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaHppYmdqdmV5ZnB5aWZsdndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTI2NTIsImV4cCI6MjA5MTY2ODY1Mn0.pOOVJm45Sf3nYH07PU9eRxPF0rcPgvchkHpTXU-ceHs'

/**
 * Instancia global del cliente de Supabase para realizar consultas en toda la web.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
