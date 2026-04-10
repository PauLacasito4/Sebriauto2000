// admin/upload.js
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';

const CLOUD_NAME = 'TU_CLOUD_NAME';
const UPLOAD_PRESET = 'TU_PRESET';

const form = document.getElementById('vehicle-form');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('photos-preview');
const submitBtn = document.getElementById('submit-btn');

const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('id');

let uploadedPhotos = []; // Array de URLs de Cloudinary

async function init() {
    const session = await checkAuth();
    if (!session) return;
    document.getElementById('logout-btn').addEventListener('click', logout);

    if (vehicleId) {
        document.getElementById('form-title').textContent = 'Editar Vehículo';
        loadVehicleData(vehicleId);
    }
}

async function loadVehicleData(id) {
    const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .eq('id', id)
        .single();

    if (data) {
        document.getElementById('marca').value = data.marca;
        document.getElementById('modelo').value = data.modelo;
        document.getElementById('anio').value = data.anio;
        document.getElementById('kilometros').value = data.kilometros;
        document.getElementById('precio').value = data.precio;
        document.getElementById('combustible').value = data.combustible;
        document.getElementById('cambio').value = data.cambio;
        document.getElementById('potencia_cv').value = data.potencia_cv || '';
        document.getElementById('descripcion').value = data.descripcion || '';
        document.getElementById('visible').checked = data.visible;
        document.getElementById('destacado').checked = data.destacado;
        
        uploadedPhotos = data.fotos || [];
        renderPreviews();
    }
}

// Interacción de Archivos
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

async function handleFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        // Mostrar placeholder cargando
        const tempId = Math.random().toString(36).substring(7);
        const placeholder = document.createElement('div');
        placeholder.className = 'upload-preview skeleton';
        placeholder.id = tempId;
        previewContainer.appendChild(placeholder);

        try {
            const url = await uploadToCloudinary(file);
            uploadedPhotos.push(url);
            placeholder.remove();
            renderPreviews();
        } catch (err) {
            console.error('Error subiendo a Cloudinary:', err);
            placeholder.classList.add('error');
            placeholder.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
        }
    }
}

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    });
    
    const data = await res.json();
    return data.secure_url;
}

function renderPreviews() {
    previewContainer.innerHTML = uploadedPhotos.map((url, idx) => `
        <div class="upload-preview" draggable="true" ondragstart="window.dragStart(${idx})" ondragover="window.dragOver(event)" ondrop="window.drop(${idx})">
            <img src="${url.replace('/upload/', '/upload/w_200,h_200,c_fill/')}" alt="">
            <div class="remove-photo" onclick="window.removePhoto(${idx})">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `).join('');
}

// Global Actions for Previews
window.removePhoto = (idx) => {
    uploadedPhotos.splice(idx, 1);
    renderPreviews();
};

let draggedIdx = null;
window.dragStart = (idx) => { draggedIdx = idx; };
window.dragOver = (e) => { e.preventDefault(); };
window.drop = (idx) => {
    const item = uploadedPhotos.splice(draggedIdx, 1)[0];
    uploadedPhotos.splice(idx, 0, item);
    renderPreviews();
};

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const vehicleData = {
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        anio: parseInt(document.getElementById('anio').value),
        kilometros: parseInt(document.getElementById('kilometros').value),
        precio: parseFloat(document.getElementById('precio').value),
        combustible: document.getElementById('combustible').value,
        cambio: document.getElementById('cambio').value,
        potencia_cv: parseInt(document.getElementById('potencia_cv').value) || null,
        descripcion: document.getElementById('descripcion').value,
        fotos: uploadedPhotos,
        visible: document.getElementById('visible').checked,
        destacado: document.getElementById('destacado').checked,
        updated_at: new Date()
    };

    try {
        let result;
        if (vehicleId) {
            result = await supabase
                .from('vehiculos')
                .update(vehicleData)
                .eq('id', vehicleId);
        } else {
            result = await supabase
                .from('vehiculos')
                .insert([vehicleData]);
        }

        if (result.error) throw result.error;

        alert('Vehículo guardado correctamente.');
        window.location.href = 'vehiculos.html';
    } catch (err) {
        console.error(err);
        alert('Error al guardar: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Vehículo';
    }
});

init();
