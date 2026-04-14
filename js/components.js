// components.js — Carga navbar y footer desde partials/
import { applyTranslations, setLanguage } from './i18n.js';

const BASE = (() => {
    // Intentar determinar la raíz del proyecto de forma más robusta
    // Si estamos en local (file://) o en un entorno donde pathname es largo
    const path = window.location.pathname;
    
    // Si el path termina en .html, quitamos el nombre del archivo
    const dir = path.substring(0, path.lastIndexOf('/'));
    
    // Contamos cuántas carpetas hay DESPUÉS de la raíz del proyecto
    // Asumimos que la raíz es donde están index.html y la carpeta 'partials'
    // Una forma simple es ver si estamos en una subcarpeta conocida (ej: admin/)
    if (path.includes('/admin/')) return '../';
    
    return './'; 
})();

async function loadPartial(selector, file) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
        const res = await fetch(BASE + 'partials/' + file);
        if (!res.ok) throw new Error('No se pudo cargar ' + file);
        const html = await res.text();
        el.innerHTML = html; // Usar innerHTML en lugar de outerHTML para mantener el placeholder si se desea, o simplemente inyectar
        
        // Si queremos que el <nav> o <footer> sea el elemento raíz, podemos hacer:
        // el.outerHTML = html;
        // Pero mantendremos innerHTML para evitar perder la referencia si se llama varias veces (aunque no debería)
        el.outerHTML = html;
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
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';

    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(page) || (page === 'index' && href === './'))) {
            link.classList.add('active');
        }
    });

    // Menú móvil (toggle)
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navLinks  = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav-open');
        });
        
        // Cerrar al hacer click fuera
        document.addEventListener('click', () => {
            navLinks.classList.remove('nav-open');
        });
    }

    // Traducir la página tras cargar componentes
    applyTranslations();

    // Configurar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Observer para animaciones de entrada (reveal)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

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
                    <a href="aviso-legal.html" class="btn btn-outline" data-i18n="cookie-info">Más info</a>
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
