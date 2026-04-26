import { translations as localTranslations } from './translations.js';
import { supabase } from './supabase.js';

let currentLang = localStorage.getItem('lang') || 'es';
const observer = new MutationObserver(() => applyTranslations());

// Dictionary will hold merged translations: Supabase overrides Local
let mergedTranslations = { es: { ...localTranslations.es }, va: { ...localTranslations.va } };

/**
 * Carga las traducciones desde Supabase y reemplaza la base local
 */
export async function initI18n() {
    try {
        const { data, error } = await supabase.from('traducciones').select('*');
        if (!error && data) {
            data.forEach(item => {
                if (item.es) mergedTranslations.es[item.clave] = item.es;
                if (item.va) mergedTranslations.va[item.clave] = item.va;
            });
        }
    } catch (e) {
        console.warn('Usando traducciones locales por fallo de red.');
    }
    
    document.documentElement.lang = currentLang;
    applyTranslations();
}

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

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function getTranslation(key) {
    if (mergedTranslations[currentLang][key]) return mergedTranslations[currentLang][key];
    
    const parts = key.split('.');
    let result = mergedTranslations[currentLang];
    for (const part of parts) {
        if (result[part]) result = result[part];
        else return null;
    }
    return typeof result === 'string' ? result : null;
}

export function getCurrentLang() {
    return currentLang;
}

// Inicializamos llamando a DB y luego pintando
initI18n();
