// admin/configuracion.js
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';

const form = document.getElementById('config-form');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');

const FIELDS = [
    'direccion', 'telefono', 'movil', 'email',
    'horario_lun_jue', 'horario_vie', 'horario_sab', 'horario_dom',
    'slogan', 'descripcion_footer'
];

async function init() {
    const session = await checkAuth();
    if (!session) return;

    document.getElementById('logout-btn').addEventListener('click', logout);
    await loadConfig();
}

async function loadConfig() {
    const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        setStatus('Error al cargar la configuración: ' + error.message, 'err');
        return;
    }

    if (data) {
        FIELDS.forEach(field => {
            const el = document.getElementById(field);
            if (el && data[field] !== null && data[field] !== undefined) {
                el.value = data[field];
            }
        });
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Guardando...';

    const payload = {};
    FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el) payload[field] = el.value;
    });
    payload.id = 1;

    const { error } = await supabase
        .from('configuracion')
        .upsert(payload, { onConflict: 'id' });

    if (error) {
        setStatus('Error al guardar: ' + error.message, 'err');
    } else {
        setStatus('✓ Cambios guardados correctamente', 'ok');
        setTimeout(() => setStatus('Los cambios se guardan en Supabase y se reflejan automáticamente en la web.', ''), 3000);
    }

    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:8px;"></i> Guardar Cambios';
});

function setStatus(msg, type) {
    saveStatus.textContent = msg;
    saveStatus.className = type;
}

init();
