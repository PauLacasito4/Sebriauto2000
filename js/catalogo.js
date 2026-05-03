// catalogo.js — Gestión del filtrado dinámico y renderizado de vehículos
import { supabase } from './supabase.js';

// Selección de elementos del DOM
const catalogContainer = document.getElementById('catalog-container');
const searchInput = document.getElementById('search-input');
const brandFilter = document.getElementById('filter-brand');
const yearFilter = document.getElementById('filter-year');
const fuelFilter = document.getElementById('filter-fuel');
const transmissionFilter = document.getElementById('filter-transmission');
const labelFilter = document.getElementById('filter-label');
const priceMinFilter = document.getElementById('filter-price-min');
const priceMaxFilter = document.getElementById('filter-price-max');
const resetBtn = document.getElementById('reset-filters');

let allVehicles = []; // Almacena la lista completa de vehículos para filtrar localmente

/**
 * Muestra el estado de carga mediante esqueletos animados (Skeletons)
 */
function showSkeletons() {
    catalogContainer.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton skeleton-card"></div>
    `).join('');
}

/**
 * Carga el listado de marcas comerciales en el selector de filtros
 */
async function loadBrands() {
    const marcasComunes = [
        'Abarth', 'Alfa Romeo', 'Audi', 'BMW', 'Citroën', 'Cupra', 'Dacia', 'DS', 'Fiat', 'Ford', 
        'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Mazda', 
        'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Porsche', 
        'Renault', 'SEAT', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 
        'Volkswagen', 'Volvo'
    ];

    brandFilter.innerHTML = '<option value="" data-i18n="cat-filter-todas">Todas las marcas</option>';
    marcasComunes.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

/**
 * Genera el listado de años para el filtro de antigüedad
 */
function loadYears() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= 1990; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Desde ${i}`;
        yearFilter.appendChild(option);
    }
}

/**
 * Recupera el inventario de vehículos desde Supabase
 */
async function fetchVehicles() {
    showSkeletons();
    
    // Consulta filtrada: solo vehículos visibles y NO vendidos
    let query = supabase
        .from('vehiculos')
        .select('*')
        .eq('visible', true)
        .eq('vendido', false)
        .order('creado_en', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('Error de base de datos:', error);
        catalogContainer.innerHTML = '<p class="error">Se ha producido un error al conectar con el inventario.</p>';
        return;
    }

    allVehicles = data;
    renderVehicles(allVehicles);
}

/**
 * Renderiza los vehículos en la cuadrícula (Grid)
 * Genera las tarjetas de producto dinámicamente.
 */
function renderVehicles(vehicles) {
    if (vehicles.length === 0) {
        // Estado vacío: Cuando ningún coche coincide con los filtros
        catalogContainer.innerHTML = `
            <div class="empty-state reveal active-reveal">
                <div class="empty-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3 data-i18n="cat-no-results">No hay coches con esas características</h3>
                <p data-i18n="cat-no-results-desc">Prueba a limpiar los filtros o cambiar los criterios de búsqueda.</p>
                <button onclick="document.getElementById('reset-filters').click()" class="btn btn-accent" style="margin-top: 20px;">
                    <i class="fa-solid fa-rotate-left"></i> <span data-i18n="cat-btn-reset">Limpiar filtros</span>
                </button>
            </div>
        `;
        return;
    }

    catalogContainer.innerHTML = vehicles.map(v => {
        const fotoPrincipal = v.fotos && v.fotos.length > 0 ? v.fotos[0] : '/img/no-image.svg';
        const precioFormateado = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.precio);
        
        // Asignación de colores según la etiqueta medioambiental de la DGT
        const coloresEtiqueta = {
            '0': '#009fe3',
            'Eco': '#a4c639',
            'C': '#f39200',
            'B': '#ffe600'
        };
        const colorEtiqueta = coloresEtiqueta[v.etiqueta] || 'transparent';
        const textoEtiqueta = v.etiqueta ? v.etiqueta : '';

        return `
            <article class="vehicle-card reveal">
                <div class="vehicle-img">
                    <img src="${fotoPrincipal}" alt="${v.marca} ${v.modelo}" loading="lazy">
                    ${v.etiqueta ? `<div class="label-badge" style="background-color: ${colorEtiqueta}">${textoEtiqueta}</div>` : ''}
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-header-flex">
                        <div class="vehicle-price">${precioFormateado}</div>
                        ${v.cambio ? `<span class="transmission-tag">${v.cambio}</span>` : ''}
                    </div>
                    <h3 class="vehicle-title">${v.marca} ${v.modelo}</h3>
                    <div class="vehicle-specs">
                        <span><i class="fa-solid fa-calendar"></i> ${v.anio}</span>
                        <span><i class="fa-solid fa-gauge"></i> ${v.kilometros.toLocaleString()} km</span>
                        <span><i class="fa-solid fa-gas-pump"></i> ${v.combustible}</span>
                    </div>
                    <a href="/pages/vehiculo.html?id=${v.id}" class="btn btn-primary btn-full" data-i18n="btn-ver-detalles">Ver detalles</a>
                </div>
            </article>
        `;
    }).join('');
    
    // Aplicamos traducciones a los nuevos elementos renderizados
    if (window.applyTranslations) window.applyTranslations();
    
    // Observer para animaciones de entrada en las tarjetas cargadas
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.catalog-grid .reveal').forEach(el => revealObserver.observe(el));
}

/**
 * Aplica lógica de filtrado sobre el conjunto de datos cargado en memoria
 */
function filterData() {
    const busqueda = searchInput.value.toLowerCase();
    const marca = brandFilter.value;
    const anio = parseInt(yearFilter.value) || 0;
    const combustible = fuelFilter.value;
    const transmision = transmissionFilter.value;
    const etiqueta = labelFilter.value;
    const precioMin = parseFloat(priceMinFilter.value) || 0;
    const precioMax = parseFloat(priceMaxFilter.value) || Infinity;

    const filtrados = allVehicles.filter(v => {
        const vMarca = (v.marca || '').toLowerCase();
        const vModelo = (v.modelo || '').toLowerCase();
        
        const coincidenciaBusqueda = busqueda === '' || 
                         vMarca.includes(busqueda) || 
                         vModelo.includes(busqueda);
        const coincidenciaMarca = marca === '' || v.marca === marca;
        const coincidenciaAnio = anio === 0 || v.anio >= anio;
        const coincidenciaCombustible = combustible === '' || v.combustible === combustible;
        const coincidenciaTransmision = transmision === '' || v.cambio === transmision;
        const coincidenciaEtiqueta = etiqueta === '' || v.etiqueta === etiqueta;
        const coincidenciaPrecio = v.precio >= precioMin && v.precio <= precioMax;

        return coincidenciaBusqueda && coincidenciaMarca && coincidenciaAnio && coincidenciaCombustible && coincidenciaTransmision && coincidenciaEtiqueta && coincidenciaPrecio;
    });

    renderVehicles(filtrados);
}

// Escuchas de eventos para filtros en tiempo real
searchInput.addEventListener('input', filterData);
brandFilter.addEventListener('change', filterData);
yearFilter.addEventListener('change', filterData);
fuelFilter.addEventListener('change', filterData);
transmissionFilter.addEventListener('change', filterData);
labelFilter.addEventListener('change', filterData);
priceMinFilter.addEventListener('change', filterData);
priceMaxFilter.addEventListener('change', filterData);

// Botón de restablecimiento de filtros
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    brandFilter.value = '';
    yearFilter.value = '';
    fuelFilter.value = '';
    transmissionFilter.value = '';
    labelFilter.value = '';
    priceMinFilter.value = '';
    priceMaxFilter.value = '';
    renderVehicles(allVehicles); // Volvemos a mostrar toda la lista original
});

// Inicialización del catálogo
loadBrands();
loadYears();
fetchVehicles();
