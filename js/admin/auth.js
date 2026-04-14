import { supabase } from '../supabase.js';

export async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        // Solo redirigir si NO estamos ya en la página de login
        if (!window.location.pathname.includes('login')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    return session;
}

export async function logout() {
    try {
        await supabase.auth.signOut();
    } catch (err) {
        console.error('Sign out error:', err);
    }
    window.location.href = 'login.html';
}

// Bloqueamos la ejecución automática global si ya estamos en login
if (!window.location.pathname.includes('login')) {
    checkAuth();
}
