// admin/vehiculos.js
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';

const tableBody = document.getElementById('vehicles-body');

async function init() {
    const session = await checkAuth();
    if (!session) return;

    document.getElementById('logout-btn').addEventListener('click', logout);
    loadVehicles();
}

async function loadVehicles() {
    const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .order('creado_en', { ascending: false });

    if (error) {
        tableBody.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        return;
    }

    renderTable(data);
}

function renderTable(vehicles) {
    if (vehicles.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px;">No hay vehículos registrados.</td></tr>`;
        return;
    }

    tableBody.innerHTML = vehicles.map(v => {
        const photo = v.fotos && v.fotos.length > 0 ? v.fotos[0] : 'https://via.placeholder.com/100x75?text=No+Img';
        
        return `
            <tr data-id="${v.id}">
                <td><img src="${photo}" alt="" style="width: 60px; height: 45px; object-fit: cover; border-radius: 4px;"></td>
                <td>
                    <strong>${v.marca} ${v.modelo}</strong><br>
                    <span style="font-size: 0.8rem; color: var(--text-secondary)">${v.anio} • ${v.kilometros.toLocaleString()} km</span>
                </td>
                <td>${v.precio.toLocaleString()} €</td>
                <td>
                    <span class="badge ${v.vendido ? 'badge-secondary' : 'badge-success'}">
                        ${v.vendido ? 'Vendido' : 'Disponible'}
                    </span>
                    ${v.destacado ? '<span class="badge badge-warning" style="margin-left:5px">Destacado</span>' : ''}
                </td>
                <td>
                    <span class="badge ${v.visible ? 'badge-success' : 'badge-secondary'}" style="opacity: ${v.visible ? 1 : 0.5}">
                        ${v.visible ? 'Visible' : 'Oculto'}
                    </span>
                </td>
                <td>
                    <div class="actions-cell">
                        <a href="vehiculo-form.html?id=${v.id}" class="action-btn" title="Editar"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button onclick="window.toggleSold('${v.id}', ${v.vendido})" class="action-btn" title="${v.vendido ? 'Marcar como disponible' : 'Marcar como vendido'}">
                            <i class="fa-solid ${v.vendido ? 'fa-rotate-left' : 'fa-hand-holding-dollar'}"></i>
                        </button>
                        <button onclick="window.toggleVisibility('${v.id}', ${v.visible})" class="action-btn" title="${v.visible ? 'Ocultar' : 'Mostrar'}">
                            <i class="fa-solid ${v.visible ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button onclick="window.deleteVehicle('${v.id}')" class="action-btn delete" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global Actions
window.toggleSold = async (id, currentStatus) => {
    const { error } = await supabase
        .from('vehiculos')
        .update({ vendido: !currentStatus })
        .eq('id', id);
    if (!error) loadVehicles();
};

window.toggleVisibility = async (id, currentStatus) => {
    const { error } = await supabase
        .from('vehiculos')
        .update({ visible: !currentStatus })
        .eq('id', id);
    if (!error) loadVehicles();
};

window.deleteVehicle = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo permanentemente?')) return;
    const { error } = await supabase
        .from('vehiculos')
        .delete()
        .eq('id', id);
    if (!error) loadVehicles();
};

init();
