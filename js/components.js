// components.js — Carga navbar y footer desde partials/
// Detecta automáticamente en qué página estamos y activa el link correspondiente

const BASE = (() => {
    // Calcula la ruta relativa hasta la raíz según la profundidad del HTML actual
    const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
    return depth > 0 ? '../'.repeat(depth) : './';
})();

async function loadPartial(selector, file) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
        const res = await fetch(BASE + 'partials/' + file);
        if (!res.ok) throw new Error('No se pudo cargar ' + file);
        el.outerHTML = await res.text();
    } catch (e) {
        console.warn('[components.js]', e.message);
    }
}

async function init() {
    await Promise.all([
        loadPartial('#navbar-placeholder', 'navbar.html'),
        loadPartial('#footer-placeholder', 'footer.html'),
    ]);

    // Marcar el enlace activo en la navbar
    const currentPage = window.location.pathname
        .split('/').pop()
        .replace('.html', '') || 'index';

    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });

    // Menú móvil (toggle)
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navLinks  = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
        });
    }
}

init();
