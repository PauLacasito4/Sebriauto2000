// catalogo.js
import { supabase } from './supabase.js';

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

let allVehicles = [];

// Mostrar skeletons al inicio
function showSkeletons() {
    catalogContainer.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton skeleton-card"></div>
    `).join('');
}

async function loadBrands() {
    const commonBrands = [
        'Abarth', 'Alfa Romeo', 'Audi', 'BMW', 'Citroën', 'Cupra', 'Dacia', 'DS', 'Fiat', 'Ford', 
        'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Mazda', 
        'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Porsche', 
        'Renault', 'SEAT', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 
        'Volkswagen', 'Volvo'
    ];

    brandFilter.innerHTML = '<option value="" data-i18n="cat-filter-todas">Todas</option>';
    commonBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

function loadYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1990; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Desde ${i}`;
        yearFilter.appendChild(option);
    }
}

async function fetchVehicles() {
    showSkeletons();
    
    let query = supabase
        .from('vehiculos')
        .select('*')
        .eq('visible', true)
        .eq('vendido', false)
        .order('creado_en', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error(error);
        catalogContainer.innerHTML = '<p class="error">Error al cargar el catálogo.</p>';
        return;
    }

    allVehicles = data;
    renderVehicles(allVehicles);
}

function renderVehicles(vehicles) {
    if (vehicles.length === 0) {
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
        const mainPhoto = v.fotos && v.fotos.length > 0 ? v.fotos[0] : 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        const formattedPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.precio);
        
        // Determinar color de etiqueta
        const labelColors = {
            '0': '#009fe3',
            'Eco': '#a4c639',
            'C': '#f39200',
            'B': '#ffe600'
        };
        const labelColor = labelColors[v.etiqueta] || 'transparent';
        const labelText = v.etiqueta ? v.etiqueta : '';

        return `
            <article class="vehicle-card reveal">
                <div class="vehicle-img">
                    <img src="${mainPhoto}" alt="${v.marca} ${v.modelo}" loading="lazy">
                    ${v.etiqueta ? `<div class="label-badge" style="background-color: ${labelColor}">${labelText}</div>` : ''}
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-header-flex">
                        <div class="vehicle-price">${formattedPrice}</div>
                        ${v.cambio ? `<span class="transmission-tag">${v.cambio}</span>` : ''}
                    </div>
                    <h3 class="vehicle-title">${v.marca} ${v.modelo}</h3>
                    <div class="vehicle-specs">
                        <span><i class="fa-solid fa-calendar"></i> ${v.anio}</span>
                        <span><i class="fa-solid fa-gauge"></i> ${v.kilometros.toLocaleString()} km</span>
                        <span><i class="fa-solid fa-gas-pump"></i> ${v.combustible}</span>
                    </div>
                    <a href="vehiculo.html?id=${v.id}" class="btn btn-primary btn-full" data-i18n="btn-ver-detalles">Ver detalles</a>
                </div>
            </article>
        `;
    }).join('');
    
    if (window.applyTranslations) window.applyTranslations();
    
    // Observer para animaciones
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

function filterData() {
    const search = searchInput.value.toLowerCase();
    const brand = brandFilter.value;
    const year = parseInt(yearFilter.value) || 0;
    const fuel = fuelFilter.value;
    const transmission = transmissionFilter.value;
    const label = labelFilter.value;
    const minPrice = parseFloat(priceMinFilter.value) || 0;
    const maxPrice = parseFloat(priceMaxFilter.value) || Infinity;

    const filtered = allVehicles.filter(v => {
        const vMarca = (v.marca || '').toLowerCase();
        const vModelo = (v.modelo || '').toLowerCase();
        
        const matchSearch = search === '' || 
                         vMarca.includes(search) || 
                         vModelo.includes(search);
        const matchBrand = brand === '' || v.marca === brand;
        const matchYear = year === 0 || v.anio >= year;
        const matchFuel = fuel === '' || v.combustible === fuel;
        const matchTransmission = transmission === '' || v.cambio === transmission;
        const matchLabel = label === '' || v.etiqueta === label;
        const matchPrice = v.precio >= minPrice && v.precio <= maxPrice;

        return matchSearch && matchBrand && matchYear && matchFuel && matchTransmission && matchLabel && matchPrice;
    });

    renderVehicles(filtered);
}

// Event Listeners
searchInput.addEventListener('input', filterData);
brandFilter.addEventListener('change', filterData);
yearFilter.addEventListener('change', filterData);
fuelFilter.addEventListener('change', filterData);
transmissionFilter.addEventListener('change', filterData);
labelFilter.addEventListener('change', filterData);
priceMinFilter.addEventListener('change', filterData);
priceMaxFilter.addEventListener('change', filterData);

resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    brandFilter.value = '';
    yearFilter.value = '';
    fuelFilter.value = '';
    transmissionFilter.value = '';
    labelFilter.value = '';
    priceMinFilter.value = '';
    priceMaxFilter.value = '';
    renderVehicles(allVehicles);
});

// Init
loadBrands();
loadYears();
fetchVehicles();
