import { translations } from './translations.js';

let currentLang = localStorage.getItem('lang') || 'es';
const observer = new MutationObserver(() => applyTranslations());

/**
 * Cambia el idioma global y lo guarda
 */
export function setLanguage(lang) {
    if (lang !== 'es' && lang !== 'va') return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = currentLang;
    applyTranslations();
}

/**
 * Traduce todos los elementos con [data-i18n] en el documento
 */
export function applyTranslations(container = document) {
    // Desconectamos temporalmente para evitar bucles infinitos
    observer.disconnect();

    const elements = container.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        }
    });

    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    // Volvemos a observar cambios en el DOM
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Busca una clave en el diccionario (soporta contextos como 'index.title')
 */
function getTranslation(key) {
    // Si la clave es directa (ej: "nav-inicio")
    if (translations[currentLang][key]) return translations[currentLang][key];
    
    // Si la clave tiene contexto (ej: "index.title")
    const parts = key.split('.');
    let result = translations[currentLang];
    for (const part of parts) {
        if (result[part]) result = result[part];
        else return null;
    }
    return typeof result === 'string' ? result : null;
}

export function getCurrentLang() {
    return currentLang;
}

// Inicialización inicial
document.documentElement.lang = currentLang;
applyTranslations();
