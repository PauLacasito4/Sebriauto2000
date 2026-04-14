// vehiculo.js
import { supabase } from './supabase.js';

const detailContainer = document.getElementById('detail-container');
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('id');

async function fetchVehicleDetail() {
    if (!vehicleId) {
        detailContainer.innerHTML = '<p class="error">ID de vehículo no proporcionado.</p>';
        return;
    }

    const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .eq('id', vehicleId)
        .single();

    if (error || !data) {
        detailContainer.innerHTML = '<p class="error">No se pudo encontrar el vehículo.</p>';
        return;
    }

    renderDetail(data);
}

function renderDetail(v) {
    const formattedPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.precio);
    const photos = v.fotos && v.fotos.length > 0 ? v.fotos : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];
    
    // Cloudinary optimize: add w_800,f_auto,q_auto to URL if it's cloudinary
    const optimizedPhotos = photos.map(url => {
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/w_800,f_auto,q_auto/');
        }
        return url;
    });

    const waMessage = encodeURIComponent(`Hola, me interesa el ${v.marca} ${v.modelo} (${v.anio}). ¿Está disponible?`);
    const waLink = `https://wa.me/34695599086?text=${waMessage}`;

    detailContainer.innerHTML = `
        <div class="gallery-column">
            <div class="gallery-main">
                <img id="main-photo" src="${optimizedPhotos[0]}" alt="${v.marca} ${v.modelo}">
            </div>
            <div class="gallery-thumbs">
                ${optimizedPhotos.map((url, idx) => `
                    <div class="thumb ${idx === 0 ? 'active' : ''}" onclick="window.changePhoto('${url}', this)">
                        <img src="${url.replace('w_800', 'w_200')}" alt="Vista ${idx + 1}">
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 40px;">
                <h3 style="margin-bottom: 20px;">Descripción</h3>
                <div class="description">${v.description || v.descripcion || 'Sin descripción disponible.'}</div>
            </div>
        </div>

        <div class="sticky-info">
            <div class="vehicle-header">
                <a href="catalogo.html" style="color: var(--text-secondary); display: block; margin-bottom: 20px;">
                    <i class="fa-solid fa-arrow-left"></i> Volver al catálogo
                </a>
                <h1>${v.marca} ${v.modelo}</h1>
                <div class="price">${formattedPrice}</div>
            </div>

            <div class="specs-grid">
                <div class="spec-item">
                    <span class="label">Año</span>
                    <span class="value">${v.anio}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Kilómetros</span>
                    <span class="value">${v.kilometros.toLocaleString()} km</span>
                </div>
                <div class="spec-item">
                    <span class="label">Combustible</span>
                    <span class="value">${v.combustible}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Cambio</span>
                    <span class="value">${v.cambio || 'Manual'}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Potencia</span>
                    <span class="value">${v.potencia_cv ? v.potencia_cv + ' CV' : 'N/D'}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Referencia</span>
                    <span class="value">${v.id.substring(0, 8)}</span>
                </div>
            </div>

            <div class="contact-box">
                <p style="margin-bottom: 20px;">¿Te interesa este coche?</p>
                <a href="${waLink}" target="_blank" class="btn btn-accent" style="width: 100%; font-size: 1.1rem; padding: 15px;">
                    <i class="fa-brands fa-whatsapp" style="margin-right: 10px;"></i> Contactar por WhatsApp
                </a>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 15px;">Consúltanos disponibilidad y opciones de financiación.</p>
            </div>
        </div>
    `;
}

// Global para que el onclick del HTML funcione
window.changePhoto = (url, el) => {
    document.getElementById('main-photo').src = url;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
};

fetchVehicleDetail();
