import { translations as localTranslations } from './translations.js';
import { supabase } from './supabase.js';

/**
 * Gestión de Internacionalización (i18n)
 * Permite alternar entre Castellano (es) y Valenciano (va).
 * Combina textos locales del archivo translations.js con textos dinámicos desde Supabase.
 */

let idiomActual = localStorage.getItem('lang') || 'es';
const observador = new MutationObserver(() => applyTranslations());

// Diccionario de mezcla: Supabase tiene prioridad sobre los archivos locales para poder actualizar textos sin desplegar código.
let traduccionesMezcladas = { es: { ...localTranslations.es }, va: { ...localTranslations.va } };

/**
 * Inicializa el sistema de traducción.
 * Intenta conectar con la base de datos para obtener textos personalizados.
 */
export async function initI18n() {
    try {
        const { data, error } = await supabase.from('traducciones').select('*');
        if (!error && data) {
            data.forEach(item => {
                if (item.es) traduccionesMezcladas.es[item.clave] = item.es;
                if (item.va) traduccionesMezcladas.va[item.clave] = item.va;
            });
        }
    } catch (e) {
        console.warn('Conexión con Supabase lenta o fallida. Usando diccionario local de emergencia.');
    }
    
    document.documentElement.lang = idiomActual;
    applyTranslations();
}

/**
 * Cambia el idioma de la aplicación.
 * @param {string} lang - 'es' para Castellano o 'va' para Valenciano.
 */
export function setLanguage(lang) {
    if (lang !== 'es' && lang !== 'va') return;
    idiomActual = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = idiomActual;
    applyTranslations();
}

/**
 * Escanea y traduce todos los elementos que contengan el atributo [data-i18n].
 */
export function applyTranslations(container = document) {
    observador.disconnect();

    const elements = container.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        if (translation) {
            // Si es un campo de entrada, traducimos el placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                // Si es un elemento de texto, traducimos su contenido
                el.textContent = translation;
            }
        }
    });

    // Actualiza el estado visual de los botones de selección de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === idiomActual);
    });

    // Vigilamos futuros cambios en el DOM para traducir contenido inyectado dinámicamente
    observador.observe(document.body, { childList: true, subtree: true });
}

/**
 * Recupera una traducción del diccionario merged. Soporta claves anidadas (ej. 'nav.home').
 */
function getTranslation(key) {
    if (traduccionesMezcladas[idiomActual][key]) return traduccionesMezcladas[idiomActual][key];
    
    const parts = key.split('.');
    let result = traduccionesMezcladas[idiomActual];
    for (const part of parts) {
        if (result[part]) result = result[part];
        else return null;
    }
    return typeof result === 'string' ? result : null;
}

export function getCurrentLang() {
    return idiomActual;
}

// Auto-ejecución al cargar el script
initI18n();
