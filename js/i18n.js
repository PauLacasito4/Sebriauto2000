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
        // Cargar traducciones personalizadas
        const { data, error } = await supabase.from('traducciones').select('*');
        if (!error && data) {
            data.forEach(item => {
                if (item.es) traduccionesMezcladas.es[item.clave] = item.es;
                if (item.va) traduccionesMezcladas.va[item.clave] = item.va;
            });
        }
        
        // Cargar datos de configuración global y mapear a claves de traducción
        const { data: configData, error: configError } = await supabase.from('configuracion').select('*').eq('id', 1).single();
        if (!configError && configData) {
            const applyConfig = (lang, labelMap) => {
                if (configData.direccion) {
                    traduccionesMezcladas[lang]['val-direccion'] = configData.direccion;
                }
                if (configData.telefono) {
                    traduccionesMezcladas[lang]['val-telefono'] = configData.telefono;
                }
                if (configData.movil) {
                    const parts = configData.movil.split('|');
                    traduccionesMezcladas[lang]['val-movil'] = parts[0] ? parts[0].trim() : '';
                    traduccionesMezcladas[lang]['val-telefono-ventas'] = parts[1] ? parts[1].trim() : '672 099 514';
                }
                if (configData.email) {
                    const parts = configData.email.split('|');
                    traduccionesMezcladas[lang]['val-email'] = parts[0] ? parts[0].trim() : '';
                    traduccionesMezcladas[lang]['val-email-ventas'] = parts[1] ? parts[1].trim() : 'ventas@sebriauto.es';
                }
                
                if (configData.horario_lun_jue) {
                    traduccionesMezcladas[lang]['cont-hor-1'] = `${labelMap.lun_jue}: ${configData.horario_lun_jue}`;
                    traduccionesMezcladas[lang]['footer-h1'] = `${labelMap.lun_jue}: ${configData.horario_lun_jue}`;
                }
                if (configData.horario_vie) {
                    traduccionesMezcladas[lang]['cont-hor-2'] = `${labelMap.vie}: ${configData.horario_vie}`;
                    traduccionesMezcladas[lang]['footer-h2'] = `${labelMap.vie}: ${configData.horario_vie}`;
                }
                
                const sabText = configData.horario_sab || 'Cerrado';
                const domText = configData.horario_dom || 'Cerrado';
                if (sabText === 'Cerrado' && domText === 'Cerrado') {
                    traduccionesMezcladas[lang]['footer-h3'] = `${labelMap.sab_dom_cerrado}`;
                } else if (sabText === 'Tancat' && domText === 'Tancat') {
                    traduccionesMezcladas[lang]['footer-h3'] = `${labelMap.sab_dom_cerrado}`;
                } else {
                    traduccionesMezcladas[lang]['footer-h3'] = `${labelMap.sab}: ${sabText} | ${labelMap.dom}: ${domText}`;
                }

                if (configData.slogan) {
                    traduccionesMezcladas[lang]['hero-subtitle'] = configData.slogan;
                }
                if (configData.descripcion_footer) {
                    traduccionesMezcladas[lang]['footer-desc'] = configData.descripcion_footer;
                }
            };

            applyConfig('es', {
                lun_jue: 'Lunes – Jueves',
                vie: 'Viernes',
                sab: 'Sábado',
                dom: 'Domingo',
                sab_dom_cerrado: 'Sábado y Domingo: Cerrado'
            });

            applyConfig('va', {
                lun_jue: 'Dilluns – Dijous',
                vie: 'Divendres',
                sab: 'Dissabte',
                dom: 'Diumenge',
                sab_dom_cerrado: 'Dissabte i Diumenge: Tancat'
            });
        }
    } catch (e) {
        console.warn('Conexión con Supabase lenta o fallida. Usando diccionario local de emergencia.', e);
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
 * Escanea y traduce todos los elementos que contengan el atributo [data-i18n] y [data-i18n-href].
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

    // Actualizar atributos href dinámicamente
    const elementsHref = container.querySelectorAll('[data-i18n-href]');
    elementsHref.forEach(el => {
        const key = el.getAttribute('data-i18n-href');
        const translation = getTranslation(key);
        if (translation) {
            let cleanNum = translation.replace(/\D/g, '');
            if (cleanNum.length === 9 && !translation.startsWith('+')) {
                cleanNum = '34' + cleanNum;
            }
            
            if (key.includes('email')) {
                el.href = 'mailto:' + translation.trim();
            } else if (key.includes('telefono') && !key.includes('ventas') && !key.includes('movil')) {
                el.href = 'tel:' + cleanNum;
            } else if (key.includes('movil') || key.includes('whatsapp') || key.includes('ventas')) {
                el.href = 'https://wa.me/' + cleanNum;
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
