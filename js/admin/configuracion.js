// admin/configuracion.js
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';
import { translations as defaultTexts } from '../translations.js';

const formGeneral = document.getElementById('config-form');
const saveBtnGeneral = document.getElementById('save-btn-general');
const statusGeneral = document.getElementById('save-status-general');

const formTrans = document.getElementById('translations-form');
const saveBtnTrans = document.getElementById('save-btn-trans');
const statusTrans = document.getElementById('save-status-trans');

const transList = document.getElementById('translations-list');
const importBtn = document.getElementById('import-btn');

let transData = [];

const FIELDS = [
    'direccion', 'telefono', 'movil', 'email',
    'horario_lun_jue', 'horario_vie', 'horario_sab', 'horario_dom',
    'slogan', 'descripcion_footer'
];

async function init() {
    const session = await checkAuth();
    if (!session) return;

    document.getElementById('logout-btn').addEventListener('click', logout);
    
    setupTabs();
    await loadGeneralConfig();
    await loadTranslations();
    
    formGeneral.addEventListener('submit', saveGeneral);
    formTrans.addEventListener('submit', saveTranslations);
    importBtn.addEventListener('click', importFromLocal);
}

function setupTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // tabs design update
            btns.forEach(b => {
                b.classList.remove('active');
                b.style.borderColor = 'transparent';
                b.style.color = 'var(--text-secondary)';
            });
            btn.classList.add('active');
            btn.style.borderColor = 'var(--accent-color)';
            btn.style.color = 'var(--text-primary)';

            // Hide/Show contents
            contents.forEach(c => c.style.display = 'none');
            document.getElementById(btn.getAttribute('data-tab')).style.display = 'block';
        });
    });
}

// ---- GENERAL CONFIG ----
async function loadGeneralConfig() {
    const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).single();
    if (data) {
        FIELDS.forEach(field => {
            const el = document.getElementById(field);
            if (el && data[field] !== null) el.value = data[field];
        });
    }
}

async function saveGeneral(e) {
    e.preventDefault();
    saveBtnGeneral.disabled = true;
    saveBtnGeneral.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Guardando...';

    const payload = { id: 1 };
    FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el) payload[field] = el.value;
    });

    const { error } = await supabase.from('configuracion').upsert(payload, { onConflict: 'id' });
    setStatus(statusGeneral, error ? 'Error: ' + error.message : '✓ Cambios guardados', error ? 'err' : 'ok');
    
    saveBtnGeneral.disabled = false;
    saveBtnGeneral.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:8px;"></i> Guardar General';
}

// ---- TRANSLATIONS ----
async function loadTranslations() {
    const { data, error } = await supabase.from('traducciones').select('*').order('clave');
    
    if (error) {
        transList.innerHTML = `<p class="error">Error cargando traducciones: ${error.message}</p>`;
        return;
    }
    
    transData = data || [];
    renderTranslationsList();
}

function renderTranslationsList() {
    if (transData.length === 0) {
        transList.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--border-radius);">No hay traducciones. Pulsa "Cargar textos del archivo original" para inicializar la base de datos.</p>`;
        return;
    }

    transList.innerHTML = transData.map(t => `
        <div class="translation-item" style="background: var(--bg-card); padding: 20px; border-radius: var(--border-radius); border: 1px solid var(--border-color);">
            <div style="font-family: monospace; color: var(--accent-color); margin-bottom: 15px; font-size: 0.9rem;">
                <i class="fa-solid fa-key" style="margin-right: 5px;"></i> ${t.clave}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <label style="display:block; margin-bottom:8px; font-size: 0.85rem; color: var(--text-secondary);"><img src="/img/flag-es.png" style="width:16px; margin-right:5px; vertical-align:middle;"> Español</label>
                    <textarea class="t-es" data-key="${t.clave}" rows="2" style="width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 10px; border-radius: 4px;">${t.es || ''}</textarea>
                </div>
                <div>
                    <label style="display:block; margin-bottom:8px; font-size: 0.85rem; color: var(--text-secondary);"><img src="/img/flag-va.png" style="width:16px; margin-right:5px; vertical-align:middle;"> Valenciano</label>
                    <textarea class="t-va" data-key="${t.clave}" rows="2" style="width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 10px; border-radius: 4px;">${t.va || ''}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

async function saveTranslations(e) {
    e.preventDefault();
    if (transData.length === 0) return;

    saveBtnTrans.disabled = true;
    saveBtnTrans.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Guardando...';

    // Collect Data
    const items = [];
    document.querySelectorAll('.translation-item').forEach(item => {
        const esArea = item.querySelector('.t-es');
        const vaArea = item.querySelector('.t-va');
        items.push({
            clave: esArea.dataset.key,
            es: esArea.value,
            va: vaArea.value
        });
    });

    // Massive Upsert
    const { error } = await supabase.from('traducciones').upsert(items, { onConflict: 'clave' });
    
    setStatus(statusTrans, error ? 'Error: ' + error.message : '✓ Todas las traducciones guardadas', error ? 'err' : 'ok');
    saveBtnTrans.disabled = false;
    saveBtnTrans.innerHTML = '<i class="fa-solid fa-floppy-disk" style="margin-right:8px;"></i> Guardar Textos';
}

async function importFromLocal(e) {
    e.preventDefault();
    if (!confirm('Esto leerá el archivo translations.js y sobrescribirá todas las traducciones actuales si las claves coinciden. ¿Deseas continuar?')) return;
    
    importBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
    importBtn.disabled = true;

    try {
        const items = Object.keys(defaultTexts.es).map(key => ({
            clave: key,
            es: defaultTexts.es[key] || '',
            va: defaultTexts.va[key] || ''
        }));

        const { error } = await supabase.from('traducciones').upsert(items, { onConflict: 'clave' });
        
        if (error) alert('Error importando: ' + error.message);
        else {
            alert('¡Importación completada! Recargando vista...');
            await loadTranslations();
        }
    } catch (err) {
        console.error(err);
        alert('Error desconocido durante la importación.');
    }
    
    importBtn.innerHTML = '<i class="fa-solid fa-upload"></i> Cargar textos del archivo original';
    importBtn.disabled = false;
}

// Helpers
function setStatus(el, msg, type) {
    el.textContent = msg;
    el.style.color = type === 'err' ? '#e74c3c' : (type === 'ok' ? '#2ecc71' : 'var(--text-secondary)');
    setTimeout(() => { 
        el.textContent = el === statusTrans ? 'Se reflejarán automáticamente al recargar la web.' : 'Se reflejarán automáticamente en la web.';
        el.style.color = 'var(--text-secondary)'; 
    }, 4000);
}

init();

