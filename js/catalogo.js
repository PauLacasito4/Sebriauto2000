// catalogo.js
import { supabase } from './supabase.js';

const catalogContainer = document.getElementById('catalog-container');
const brandFilter = document.getElementById('filter-brand');
const fuelFilter = document.getElementById('filter-fuel');
const priceFilter = document.getElementById('filter-price');
const priceValueText = document.getElementById('price-value');
const resetBtn = document.getElementById('reset-filters');

let allVehicles = [];

// Mostrar skeletons al inicio
function showSkeletons() {
    catalogContainer.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton skeleton-card"></div>
    `).join('');
}

async function loadBrands() {
    const { data, error } = await supabase
        .from('vehiculos')
        .select('marca')
        .eq('visible', true)
        .eq('vendido', false);

    if (data) {
        const brands = [...new Set(data.map(v => v.marca))].sort();
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter.appendChild(option);
        });
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

    // Aplicar filtros locales si ya se cargaron datos o refetch con filtros
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
            <div class="empty-state">
                <i class="fa-solid fa-car-side"></i>
                <h3>No hay vehículos disponibles</h3>
                <p>Prueba a cambiar los filtros o vuelve más tarde.</p>
            </div>
        `;
        return;
    }

    catalogContainer.innerHTML = vehicles.map(v => {
        const mainPhoto = v.fotos && v.fotos.length > 0 ? v.fotos[0] : 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        const formattedPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.precio);
        
        return `
            <article class="vehicle-card">
                <div class="vehicle-img">
                    <img src="${mainPhoto}" alt="${v.marca} ${v.modelo}" loading="lazy">
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-price">${formattedPrice}</div>
                    <h3 class="vehicle-title">${v.marca} ${v.modelo}</h3>
                    <div class="vehicle-specs">
                        <span><i class="fa-solid fa-calendar"></i> ${v.anio}</span>
                        <span><i class="fa-solid fa-gauge"></i> ${v.kilometros.toLocaleString()} km</span>
                        <span><i class="fa-solid fa-gas-pump"></i> ${v.combustible}</span>
                    </div>
                    <a href="vehiculo.html?id=${v.id}" class="btn btn-primary" style="width: 100%;">Ver detalles</a>
                </div>
            </article>
        `;
    }).join('');
}

function filterData() {
    const brand = brandFilter.value;
    const fuel = fuelFilter.value;
    const maxPrice = parseFloat(priceFilter.value);

    const filtered = allVehicles.filter(v => {
        const matchBrand = brand === '' || v.marca === brand;
        const matchFuel = fuel === '' || v.combustible === fuel;
        const matchPrice = v.precio <= maxPrice;
        return matchBrand && matchFuel && matchPrice;
    });

    renderVehicles(filtered);
}

// Event Listeners
brandFilter.addEventListener('change', filterData);
fuelFilter.addEventListener('change', filterData);
priceFilter.addEventListener('input', (e) => {
    priceValueText.textContent = e.target.value;
    filterData();
});

resetBtn.addEventListener('click', () => {
    brandFilter.value = '';
    fuelFilter.value = '';
    priceFilter.value = 100000;
    priceValueText.textContent = 100000;
    renderVehicles(allVehicles);
});

// Init
priceValueText.textContent = priceFilter.value;
loadBrands();
fetchVehicles();
