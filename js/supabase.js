// supabase.js - Sebriauto 2000
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ahhzibgjveyfpyiflvwa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaHppYmdqdmV5ZnB5aWZsdndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTI2NTIsImV4cCI6MjA5MTY2ODY1Mn0.pOOVJm45Sf3nYH07PU9eRxPF0rcPgvchkHpTXU-ceHs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
