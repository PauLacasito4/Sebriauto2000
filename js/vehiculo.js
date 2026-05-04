// vehiculo.js — Gestión de la página de detalle del vehículo
import { supabase } from './supabase.js';

// Selección de contenedor y captura de parámetros de la URL
const detailContainer = document.getElementById('detail-container');
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('id');

/**
 * Recupera los datos técnicos de un vehículo específico desde la base de datos.
 */
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
        detailContainer.innerHTML = '<p class="error">No se ha podido encontrar el vehículo seleccionado.</p>';
        return;
    }

    renderDetail(data);
}

/**
 * Renderiza la ficha técnica detallada y la galería de imágenes.
 */
function renderDetail(v) {
    const precioFormateado = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.precio);
    const fotos = v.fotos && v.fotos.length > 0 ? v.fotos : ['/img/no-image.svg'];
    
    // Como no usamos Cloudinary, pasamos las fotos directamente
    window.currentPhotos = fotos;

    // Preparación del mensaje de contacto para WhatsApp
    const mensajeWA = encodeURIComponent(`Hola, me interesa el ${v.marca} ${v.modelo} (${v.anio}). ¿Sigue disponible?`);
    const enlaceWA = `https://wa.me/34695599086?text=${mensajeWA}`;

    detailContainer.innerHTML = `
        <!-- COLUMNA IZQUIERDA: Galería Multimedia -->
        <div class="gallery-column">
            <div class="gallery-main">
                <img id="main-photo" src="${fotos[0]}" alt="${v.marca} ${v.modelo}">
            </div>
            <div class="gallery-thumbs">
                ${fotos.map((url, idx) => `
                    <div class="thumb ${idx === 0 ? 'active' : ''}" onclick="window.changePhoto(${idx}, this)">
                        <img src="${url}" alt="Vista lateral ${idx + 1}">
                    </div>
                `).join('')}
            </div>
            
            <!-- Descripción del Administrador -->
            <div style="margin-top: 40px;">
                <h3 style="margin-bottom: 20px;">Información Adicional</h3>
                <div class="description">${v.descripcion || v.description || 'Sin descripción detallada disponible.'}</div>
            </div>
        </div>

        <!-- COLUMNA DERECHA: Datos Rápidos y Contacto -->
        <div class="sticky-info">
            <div class="vehicle-header">
                <a href="/pages/catalogo.html" style="color: var(--text-secondary); display: block; margin-bottom: 20px;">
                    <i class="fa-solid fa-arrow-left"></i> Volver al listado completo
                </a>
                <h1>${v.marca} ${v.modelo}</h1>
                <div class="price">${precioFormateado}</div>
            </div>

            <!-- Grilla de Especificaciones -->
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
                    <span class="label">Transmisión</span>
                    <span class="value">${v.cambio || 'Manual'}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Potencia</span>
                    <span class="value">${v.potencia_cv ? v.potencia_cv + ' CV' : 'No indicada'}</span>
                </div>
                <div class="spec-item">
                    <span class="label">ID de Referencia</span>
                    <span class="value">${v.id.substring(0, 8)}</span>
                </div>
            </div>

            <!-- Caja de Acción de Contacto -->
            <div class="contact-box">
                <p style="margin-bottom: 20px;">¿Te gustaría probar este coche?</p>
                <a href="${enlaceWA}" target="_blank" class="btn btn-accent" style="width: 100%; font-size: 1.1rem; padding: 15px;">
                    <i class="fa-brands fa-whatsapp" style="margin-right: 10px;"></i> Contactar por WhatsApp
                </a>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 15px;">Respuesta inmediata. Consulta opciones de financiación sin compromiso.</p>
            </div>
        </div>
    `;
}

/**
 * Cambia la foto principal de la galería al hacer clic en una miniatura (Thumbnail).
 */
window.changePhoto = (idx, el) => {
    const mainPhoto = document.getElementById('main-photo');
    if (mainPhoto && window.currentPhotos && window.currentPhotos[idx]) {
        mainPhoto.src = window.currentPhotos[idx];
    }
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
};

// Disparo inicial
fetchVehicleDetail();
