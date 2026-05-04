// components.js — Este script se encarga de cargar elementos comunes como el Navbar y el Footer
// También gestiona el menú móvil, las animaciones de entrada y el aviso de cookies.
import { applyTranslations, setLanguage } from './i18n.js';

// Determinamos la ruta base para cargar los archivos estáticos desde cualquier subdirectorio (admin, pages, etc.)
const BASE = (() => {
    const path = window.location.pathname;
    if (path.includes('/admin/')) return '../';
    if (path.includes('/pages/')) return '../';
    if (path.includes('/benja_administrador/')) return '../';
    return './';
})();

/**
 * Carga un archivo HTML parcial y lo inyecta en el selector indicado.
 */
async function loadPartial(selector, file) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
        const res = await fetch(BASE + 'partials/' + file);
        if (!res.ok) throw new Error('No se pudo cargar ' + file);
        const html = await res.text();
        
        // Inyectamos el contenido y reemplazamos el placeholder
        el.outerHTML = html;
    } catch (e) {
        console.warn('[Componentes]', e.message);
    }
}

/**
 * Inicializa la lógica común de la página: carga de parciales, idioma y animaciones.
 */
async function init() {
    // Cargamos Navbar y Footer de forma paralela
    await Promise.all([
        loadPartial('#navbar-placeholder', 'navbar.html'),
        loadPartial('#footer-placeholder', 'footer.html'),
    ]);

    // Lógica para marcar el enlace activo en la navegación según la URL actual
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';

    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(page) || (page === 'index' && href === './'))) {
            link.classList.add('active');
        }
    });

    // Menú móvil (Hamburguesa)
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navLinks  = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav-open');
        });
        
        // Al hacer clic fuera del menú, lo cerramos automáticamente
        document.addEventListener('click', () => {
            navLinks.classList.remove('nav-open');
        });
    }

    // Aplicamos las traducciones dinámicas a toda la página
    applyTranslations();

    // Vinculamos los botones de cambio de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Sistema de detección para animaciones de entrada (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                revealObserver.unobserve(entry.target); // Dejamos de observar una vez activada
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Gestión del banner legal de cookies
    handleCookies();
}

function handleCookies() {
    if (!localStorage.getItem('cookie-consent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <h4 data-i18n="cookie-title">¿Aceptar cookies?</h4>
                <p data-i18n="cookie-text">Utilizamos cookies propias para mejorar tu experiencia de navegación y seguridad.</p>
                <div class="cookie-btns">
                    <button id="accept-cookies" class="btn btn-primary" data-i18n="cookie-accept">Aceptar</button>
                    <a href="politica-cookies.html" class="btn btn-outline" data-i18n="cookie-info">Más info</a>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Traducir banner
        if (window.applyTranslations) window.applyTranslations();

        setTimeout(() => banner.classList.add('active'), 500);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'true');
            banner.classList.remove('active');
            setTimeout(() => banner.remove(), 600);
        });
    }
}

init();
