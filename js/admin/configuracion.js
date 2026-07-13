// admin/configuracion.js — Gestión de la configuración global de la web
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';

// Elementos de la interfaz de configuración
const formGeneral = document.getElementById('config-form');
const saveBtnGeneral = document.getElementById('save-btn-general');
const statusGeneral = document.getElementById('save-status-general');

// Campos editables en la tabla de configuración
const FIELDS = [
    'direccion', 'telefono', 'movil', 'email',
    'horario_lun_jue', 'horario_vie', 'horario_sab', 'horario_dom',
    'slogan', 'descripcion_footer'
];

/**
 * Inicializa la página de ajustes, verifica la sesión y carga los datos actuales.
 */
async function init() {
    const session = await checkAuth();
    if (!session) return;

    document.getElementById('logout-btn').addEventListener('click', logout);
    
    await loadGeneralConfig();
    
    // Escuchador para el envío del formulario
    formGeneral.addEventListener('submit', saveGeneral);
}

/**
 * Recupera la configuración actual desde Supabase (registro con ID 1).
 */
async function loadGeneralConfig() {
    const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    if (data) {
        FIELDS.forEach(field => {
            const el = document.getElementById(field);
            if (el && data[field] !== null) {
                if (field === 'movil') {
                    const parts = data[field].split('|');
                    el.value = parts[0] ? parts[0].trim() : '';
                    const salesEl = document.getElementById('movil_ventas');
                    if (salesEl) salesEl.value = parts[1] ? parts[1].trim() : '672 099 514';
                } else if (field === 'email') {
                    const parts = data[field].split('|');
                    el.value = parts[0] ? parts[0].trim() : '';
                    const salesEl = document.getElementById('email_ventas');
                    if (salesEl) salesEl.value = parts[1] ? parts[1].trim() : 'ventas@sebriauto.es';
                } else {
                    el.value = data[field];
                }
            }
        });
    }
}

/**
 * Guarda los cambios realizados en los campos generales.
 */
async function saveGeneral(e) {
    e.preventDefault();
    saveBtnGeneral.disabled = true;
    saveBtnGeneral.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Guardando cambios...';

    const payload = { id: 1 };
    FIELDS.forEach(field => {
        if (field === 'movil') {
            const tallerVal = document.getElementById('movil').value.trim();
            const ventasVal = document.getElementById('movil_ventas').value.trim() || '672 099 514';
            payload[field] = `${tallerVal} | ${ventasVal}`;
        } else if (field === 'email') {
            const tallerVal = document.getElementById('email').value.trim();
            const ventasVal = document.getElementById('email_ventas').value.trim() || 'ventas@sebriauto.es';
            payload[field] = `${tallerVal} | ${ventasVal}`;
        } else {
            const el = document.getElementById(field);
            if (el) payload[field] = el.value;
        }
    });

    // Realización del UPDATE en la tabla 'configuracion' (el registro id: 1 ya existe)
    const { error } = await supabase.from('configuracion').update(payload).eq('id', 1);
    
    // Notificación visual del resultado de la operación
    setStatus(statusGeneral, error ? 'Error: ' + error.message : '✓ Cambios guardados correctamente', error ? 'err' : 'ok');
    
    saveBtnGeneral.disabled = false;
    saveBtnGeneral.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:8px;"></i> Guardar General';
}

/**
 * Helper para mostrar mensajes de estado con temporizador de borrado.
 */
function setStatus(el, msg, type) {
    el.textContent = msg;
    el.style.color = type === 'err' ? '#e74c3c' : (type === 'ok' ? '#2ecc71' : 'var(--text-secondary)');
    setTimeout(() => { 
        el.textContent = 'Se reflejarán automáticamente en la web.';
        el.style.color = 'var(--text-secondary)'; 
    }, 4000);
}

// Disparo inicial
init();

