// admin/upload.js — Lógica de gestión de vehículos y subida de imágenes a base de datos (Base64)
import { supabase } from '../supabase.js';
import { checkAuth, logout } from './auth.js';

// Captura de elementos de la interfaz
const form = document.getElementById('vehicle-form');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('photos-preview');
const submitBtn = document.getElementById('submit-btn');

// Gestión de parámetros de edición (si viene un ID, estamos en modo edición)
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('id');

let uploadedPhotos = []; // Almacena las URLs de las fotos subidas correctamente

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
        document.getElementById('etiqueta').value = data.etiqueta || '';
        document.getElementById('descripcion').value = data.descripcion || '';
        document.getElementById('visible').checked = data.visible;
        document.getElementById('destacado').checked = data.destacado;
        document.getElementById('vendido').checked = data.vendido || false;
        
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
            const url = await processAndEncodeImage(file);
            uploadedPhotos.push(url);
            placeholder.remove();
            renderPreviews();
        } catch (err) {
            console.error('Error procesando la imagen:', err);
            placeholder.classList.add('error');
            placeholder.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
        }
    }
}

/**
 * Procesa y codifica una imagen a Base64 con redimensionamiento.
 * Devuelve la cadena Base64 lista para guardar en la base de datos.
 */
function processAndEncodeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP, 80% quality to save database space
                const dataUrl = canvas.toDataURL('image/webp', 0.8);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function renderPreviews() {
    previewContainer.innerHTML = uploadedPhotos.map((url, idx) => `
        <div class="upload-preview" draggable="true" ondragstart="window.dragStart(${idx})" ondragover="window.dragOver(event)" ondrop="window.drop(${idx})">
            <img src="${url}" alt="">
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

/**
 * Manejador del envío del formulario.
 * Valida los datos y realiza el INSERT o UPDATE en la base de datos Supabase.
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando cambios...';

    const vehicleData = {
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        anio: parseInt(document.getElementById('anio').value),
        kilometros: parseInt(document.getElementById('kilometros').value),
        precio: parseFloat(document.getElementById('precio').value),
        combustible: document.getElementById('combustible').value,
        cambio: document.getElementById('cambio').value,
        etiqueta: document.getElementById('etiqueta').value,
        descripcion: document.getElementById('descripcion').value,
        fotos: uploadedPhotos,
        visible: document.getElementById('visible').checked,
        destacado: document.getElementById('destacado').checked,
        vendido: document.getElementById('vendido').checked,
        updated_at: new Date()
    };

    try {
        let result;
        if (vehicleId) {
            // Modo Edición: Actualizamos el registro existente
            result = await supabase
                .from('vehiculos')
                .update(vehicleData)
                .eq('id', vehicleId);
        } else {
            // Modo Creación: Insertamos un nuevo registro
            result = await supabase
                .from('vehiculos')
                .insert([vehicleData]);
        }

        if (result.error) throw result.error;

        alert('¡Vehículo guardado con éxito!');
        window.location.href = 'vehiculos.html';
    } catch (err) {
        console.error('Error al guardar en Supabase:', err);
        alert('Se ha producido un error al guardar: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Vehículo';
    }
});

// Inicialización de la sesión y carga de datos
init();
