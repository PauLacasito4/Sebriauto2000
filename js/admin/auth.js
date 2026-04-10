// auth.js
import { supabase } from '../supabase.js';

export async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return session;
}

export async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// Global checkout on page load for convenience
const currentPath = window.location.pathname;
if (!currentPath.includes('login.html')) {
    checkAuth();
}
