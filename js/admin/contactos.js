// admin/contactos.js
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';

const tableBody = document.getElementById('messages-body');
const filterSelect = document.getElementById('filter-read');
const modal = document.getElementById('msg-modal');

let allMessages = [];

async function init() {
    const session = await checkAuth();
    if (!session) return;
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    loadMessages();
}

async function loadMessages() {
    const { data, error } = await supabase
        .from('contactos')
        .select('*')
        .order('creado_en', { ascending: false });

    if (error) {
        tableBody.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        return;
    }

    allMessages = data;
    renderMessages(allMessages);
}

function renderMessages(msgs) {
    const showUnreadOnly = filterSelect.value === 'unread';
    const filtered = showUnreadOnly ? msgs.filter(m => !m.leido) : msgs;

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px;">No hay mensajes.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map(m => `
        <tr class="${!m.leido ? 'msg-unread' : ''}" style="cursor: pointer" onclick="window.viewMessage('${m.id}')">
            <td>${new Date(m.creado_en).toLocaleDateString()}</td>
            <td>${m.nombre}</td>
            <td style="font-size: 0.85rem">
                ${m.email || '-'}<br>
                ${m.telefono || '-'}
            </td>
            <td style="font-size: 0.9rem; color: var(--text-secondary)">
                ${m.mensaje.substring(0, 50)}${m.mensaje.length > 50 ? '...' : ''}
            </td>
            <td>
                <span class="badge ${m.leido ? 'badge-secondary' : 'badge-success'}">
                    ${m.leido ? 'Leído' : 'Nuevo'}
                </span>
            </td>
            <td>
                <button onclick="event.stopPropagation(); window.deleteMessage('${m.id}')" class="action-btn delete"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

window.viewMessage = async (id) => {
    const msg = allMessages.find(m => m.id === id);
    if (!msg) return;

    document.getElementById('modal-name').textContent = msg.nombre;
    document.getElementById('modal-date').textContent = new Date(msg.creado_en).toLocaleString();
    document.getElementById('modal-email').textContent = msg.email || 'No proporcionado';
    document.getElementById('modal-phone').textContent = msg.telefono || 'No proporcionado';
    document.getElementById('modal-text').textContent = msg.mensaje;

    modal.style.display = 'flex';

    if (!msg.leido) {
        const { error } = await supabase
            .from('contactos')
            .update({ leido: true })
            .eq('id', id);
        
        if (!error) {
            msg.leido = true;
            renderMessages(allMessages);
        }
    }
};

window.closeModal = () => {
    modal.style.display = 'none';
};

window.deleteMessage = async (id) => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    const { error } = await supabase
        .from('contactos')
        .delete()
        .eq('id', id);
    
    if (!error) loadMessages();
};

filterSelect.addEventListener('change', () => renderMessages(allMessages));

init();
