/**
 * DICCIONARIO DE TRADUCCIONES - Sebriauto 2000
 * Centraliza todos los textos de la web para soportar multi-idioma (Castellano y Valenciano).
 * Cada clave (Key) se corresponde con el atributo [data-i18n] en el HTML.
 */
export const translations = {
    // SECCIÓN 🇪🇸 CASTELLANO
    es: {
        // --- NAVEGACIÓN (Navbar) ---
        "nav-inicio": "Inicio",
        "nav-servicios": "Servicios",
        "nav-catalogo": "Catálogo",
        "nav-contacto": "Contacto",
        
        // --- CABECERA PRINCIPAL (Hero) ---
        "hero-subtitle": "Taller mecánico · Vehículos de ocasión · Riba-roja de Túria",
        "btn-ver-vehiculos": "Ver vehículos",
        "btn-contactar": "Contactar",
        
        // --- SERVICIOS EN PÁGINA DE INICIO ---
        "title-servicios": "Nuestros Servicios",
        "subtitle-servicios": "Ofrecemos soluciones integrales para el mantenimiento y reparación de tu vehículo con la máxima garantía.",
        "srv-mecanica": "Mecánica General",
        "srv-mecanica-desc": "Mantenimiento preventivo y correctivo de todo tipo de motores y sistemas mecánicos.",
        "srv-diagnosis": "Diagnosis Electrónica",
        "srv-diagnosis-desc": "Sistemas de diagnosis avanzados para detectar cualquier fallo en la electrónica de tu coche.",
        "srv-aceite": "Cambio de Aceite",
        "srv-aceite-desc": "Utilizamos lubricantes de primera calidad para prolongar la vida útil de tu motor.",
        "srv-frenos": "Frenos e ITV",
        "srv-frenos-desc": "Revisión completa de sistemas de seguridad y pre-ITV para que circules sin preocupaciones.",
        "srv-aire": "Aire Acondicionado",
        "srv-aire-desc": "Carga y reparación de sistemas de climatización para tu confort en la carretera.",
        "srv-bateria": "Baterías y Electricidad",
        "srv-bateria-desc": "Comprobación y sustitución de baterías, alternadores y sistemas eléctricos.",

        // --- BLOQUE DE VEHÍCULOS DESTACADOS ---
        "title-destacados": "Vehículos Destacados",
        "subtitle-destacados": "Descubre nuestra selección de coches de ocasión totalmente revisados.",
        "btn-ver-todo": "Ver catálogo completo",
        "loading": "Cargando vehículos...",

        // --- BLOQUE DE VALORES (Elegirnos) ---
        "title-porque": "¿Por qué elegirnos?",
        "test-vecino": "Reseña de Google",
        "why-exp": "Experiencia",
        "why-exp-desc": "Cuidando de los vehículos de nuestros vecinos en Riba-roja.",
        "why-conf": "Confianza",
        "why-conf-desc": "Transparencia total en cada presupuesto y reparación. Sin sorpresas.",
        "why-price": "Precio Justo",
        "why-price-desc": "Calidad profesional a precios competitivos. La mejor relación calidad-precio.",

        // --- PÁGINA DETALLE DE SERVICIOS ---
        "srv-page-title": "Especialistas en tu coche",
        "srv-page-subtitle": "Servicios mecánicos profesionales con tecnología de vanguardia",
        "srv-mecanica-long": "Desde reparaciones complejas de motor hasta el mantenimiento más básico. Cuidamos cada detalle para garantizar tu seguridad.",
        "srv-diagnosis-long": "Equipamiento de última generación para leer los códigos de error de cualquier centralita multimarca y solucionar averías difíciles.",
        "srv-clima": "Climatización",
        "srv-clima-long": "Mantén la temperatura perfecta en tu habitáculo. Realizamos cargas de gas y detección de fugas en sistemas de aire acondicionado.",
        "srv-elec": "Electricidad",
        "srv-elec-long": "Reparamos todo tipo de fallos eléctricos, desde una bombilla fundida hasta problemas complejos en el alternador o arranque.",
        "srv-itv": "Revisión Pre-ITV",
        "srv-itv-long": "No te lleves sorpresas en la estación. Revisamos todos los puntos clave que exige la inspección técnica de vehículos.",
        "srv-neumaticos": "Neumáticos",
        "srv-neumaticos-long": "El único contacto con el asfalto. Ofrecemos las mejores marcas y realizamos el equilibrado y alineación de dirección.",
        "cta-boxes": "¿Tu coche necesita pasar por boxes?",
        "cta-boxes-p": "Pide cita ahora y deja tu vehículo en manos de profesionales.",
        "btn-cita": "Pedir cita previa",

        // --- PÁGINA DE CONTACTO ---
        "cont-page-title": "Contacta con nosotros",
        "cont-page-subtitle": "Estamos aquí para ayudarte. Ven a visitarnos o escríbenos.",
        "cont-info-h2": "Información de contacto",
        "cont-dir": "Dirección",
        "cont-tel": "Teléfono",
        "cont-mov": "Móvil / WhatsApp",
        "cont-ventas": "Ventas / WhatsApp",
        "val-telefono-ventas": "672 099 514",
        "cont-email-ventas": "Email Ventas",
        "val-email-ventas": "ventas@sebriauto.es",
        "cont-hor": "Horario",
        "cont-hor-1": "Lunes – Jueves: 08:00 – 15:30",
        "cont-hor-2": "Viernes: 08:00 – 14:00",
        "cont-wa-h3": "Contacta por WhatsApp",
        "cont-wa-p": "Para tu seguridad y rapidez, gestionamos todas las consultas directamente por WhatsApp. Así evitamos phishing y correos fraudulentos.",
        "btn-wa": "Escribir por WhatsApp",
        "cont-sec-title": "Zona Segura",
        "cont-sec-desc": "Sebriauto 2000 nunca te pedirá contraseñas ni datos bancarios por email o SMS. Nuestra comunicación oficial siempre se realiza a través de nuestros teléfonos autorizados.",
        "form-enviar": "Abrir WhatsApp",
        "ph-nombre": "Escribe tu nombre",
        "ph-mensaje": "¿En qué podemos ayudarte?",

        // --- LISTADO CATÁLOGO (Filtros y Búsqueda) ---
        "cat-title": "Vehículos de Ocasión",
        "cat-subtitle": "Encuentra tu próximo coche totalmente garantizado y revisado.",
        "cat-filter-search": "Buscar modelo",
        "cat-filter-marca": "Marca",
        "cat-filter-todas": "Todas las marcas",
        "cat-filter-cualquiera": "Cualquiera",
        "cat-filter-year": "Año Mínimo",
        "cat-filter-fuel": "Combustible",
        "cat-filter-transmission": "Cambio",
        "cat-filter-label": "Etiqueta",
        "cat-filter-precio-min": "Precio Mín",
        "cat-filter-precio-max": "Precio Máx",
        "cat-btn-reset": "Limpiar",
        "cat-no-results": "No hay coches con esas características",
        "cat-no-results-desc": "Prueba a limpiar los filtros o cambiar los criterios de búsqueda.",
        "btn-ver-detalles": "Ver detalles",

        // --- PIE DE PÁGINA (Footer) ---
        "footer-desc": "Tu taller de confianza en Riba-roja de Túria. Mecánica multimarca y venta de vehículos de ocasión seleccionados.",
        "footer-links": "Enlaces",
        "footer-contacto": "Contacto",
        "footer-horario": "Horario",
        "footer-h1": "Lunes - Jueves: 08:00 - 15:30",
        "footer-h2": "Viernes: 08:00 - 14:00",
        "footer-h3": "Sábado y Domingo: Cerrado",
        "footer-copy": "© 2026 Sebriauto 2000. Todos los derechos reservados.",
        "footer-legal": "Aviso Legal",
        "footer-privacy": "Política de Privacidad",
        "footer-cookies": "Política de Cookies",
        "footer-sitemap": "Mapa Web",
        
        // --- POLÍTICA DE COOKIES Y ERRORES ---
        "cookie-title": "¿Aceptar cookies?",
        "cookie-text": "Utilizamos cookies propias para mejorar tu experiencia de navegación y seguridad en nuestra web.",
        "cookie-accept": "Aceptar todas",
        "cookie-necessary": "Solo necesarias",
        "cookie-info": "Más información",
        "error-title": "¡Vaya! Parece que te has perdido",
        "error-text": "La página que buscas no existe o ha sido movida. Puedes volver al inicio o contactar con nosotros si necesitas ayuda."
    },

    // SECCIÓN 💙 VALENCIÀ
    va: {
        // --- NAVEGACIÓ ---
        "nav-inicio": "Inici",
        "nav-servicios": "Servicis",
        "nav-catalogo": "Catàleg",
        "nav-contacto": "Contacte",
        
        // --- CABECERA (Hero) ---
        "hero-subtitle": "Taller mecànic · Vehicles d'ocasió · Riba-roja de Túria",
        "btn-ver-vehiculos": "Veure vehicles",
        "btn-contactar": "Contactar",
        
        // --- SERVICIS ---
        "title-servicios": "Els nostres Servicis",
        "subtitle-servicios": "Oferim solucions integrals per al manteniment i reparació del teu vehicle amb la màxima garantia.",
        "srv-mecanica": "Mecànica General",
        "srv-mecanica-desc": "Manteniment preventiu i correctiu de tot tipus de motors i sistemes mecànics.",
        "srv-diagnosis": "Diagnosi Electrònica",
        "srv-diagnosis-desc": "Sistemes de diagnosi avançats per detectar qualsevol fallada en l'electrònica del teu cotxe.",
        "srv-aceite": "Canvi d'Oli",
        "srv-aceite-desc": "Utilitzem lubricants de primera qualitat per a prolongar la vida útil del teu motor.",
        "srv-frenos": "Frens i ITV",
        "srv-frenos-desc": "Revisió completa de sistemes de seguretat i pre-ITV perquè circules sense preocupacions.",
        "srv-aire": "Aire Condicionat",
        "srv-aire-desc": "Càrrega i reparació de sistemes de climatització per al teu confort en la carretera.",
        "srv-bateria": "Bateries i Electricitat",
        "srv-bateria-desc": "Comprovació i substitució de bateries, alternadors i sistemes elèctrics.",

        // --- DESTACATS ---
        "title-destacados": "Vehicles Destacats",
        "subtitle-destacados": "Descobreix la nostra selecció de cotxes d'ocasió totalment revisats.",
        "btn-ver-todo": "Veure catàleg complet",
        "loading": "Carregant vehicles...",

        // --- PER QUÈ TRIAR-NOS ---
        "title-porque": "Per què triar-nos?",
        "why-exp": "Experiència",
        "why-exp-desc": "Cuidant dels vehicles dels nostres veïns a Riba-roja.",
        "why-conf": "Confiança",
        "why-conf-desc": "Transparència total en cada pressupost i reparació. Sense sorpreses.",
        "why-price": "Preu Just",
        "why-price-desc": "Qualitat professional a preus competitius. La millor relació qualitat-preu.",

        // --- DETALL DE SERVICIS ---
        "srv-page-title": "Especialistes en el teu cotxe",
        "srv-page-subtitle": "Servicis mecànics professionals amb tecnologia d'avantguarda",
        "srv-mecanica-long": "Des de reparacions complexes de motor fins al manteniment més bàsic. Cuidem cada detall per a garantir la teua seguretat.",
        "srv-diagnosis-long": "Equipament d'última generació per a llegir los codis d'error de qualsevol centraleta multimarca i solucionar averies difícils.",
        "srv-clima": "Climatización",
        "srv-clima-long": "Mantén la temperatura perfecta en el teu habitacle. Realitzem càrregues de gas i detecció de fugues en sistemes d'aire acondicionat.",
        "srv-elec": "Electricitat",
        "srv-elec-long": "Reparem tot tipus de fallades elèctriques, des d'una bombeta fosca fins a problemas complexos en l'alternador o arrencada.",
        "srv-itv": "Revisió Pre-ITV",
        "srv-itv-long": "No et portes sorpreses en l'estació. Revisem tots los punts clau que exigix la inspecció tècnica de vehicles.",
        "srv-neumaticos": "Pneumàtics",
        "srv-neumaticos-long": "L'únic contacte amb l'asfalt. Oferim les millors marques i realitzem l'equilibrat i alineació de direcció.",
        "cta-boxes": "El teu cotxe necessita passar por boxes?",
        "cta-boxes-p": "Demana cita ara i deixa el teu vehicle en mans de professionals.",
        "btn-cita": "Demanar cita prèvia",

        // --- CONTACTE ---
        "cont-page-title": "Contacta amb nosaltres",
        "cont-page-subtitle": "Estem ací per a ajudar-te. Vine a visitar-nos o escriu-nos.",
        "cont-info-h2": "Informació de contacte",
        "cont-dir": "Direcció",
        "cont-tel": "Telèfon",
        "cont-mov": "Mòbil / WhatsApp",
        "cont-ventas": "Vendes / WhatsApp",
        "val-telefono-ventas": "672 099 514",
        "cont-email-ventas": "Email Vendes",
        "val-email-ventas": "ventas@sebriauto.es",
        "cont-hor": "Horario",
        "cont-hor-1": "Dilluns – Dijous: 08:00 – 15:30",
        "cont-hor-2": "Divendres: 08:00 – 14:00",
        "cont-wa-h3": "Contacta per WhatsApp",
        "cont-wa-p": "Per a la teua seguretat i rapidesa, gestionem totes les consultes directament por WhatsApp. Així evitem phishing i correus fraudulents.",
        "btn-wa": "Escriure per WhatsApp",
        "cont-sec-title": "Zona Segura",
        "cont-sec-desc": "Sebriauto 2000 mai et demanarà contrasenyes ni dades bancàries per email o SMS. La nostra comunicació oficial sempre es realitza a través dels nostres telèfons autoritzats.",
        "form-enviar": "Obrir WhatsApp",
        "ph-nombre": "Escriu el teu nom",
        "ph-mensaje": "En què podem ajudar-te?",

        // --- CATÀLEG ---
        "cat-title": "Vehicles d'Ocasió",
        "cat-subtitle": "Troba el teu pròxim cotxe totalment garantit i revisat.",
        "cat-filter-search": "Buscar model",
        "cat-filter-marca": "Marca",
        "cat-filter-todas": "Totes les marques",
        "cat-filter-cualquiera": "Qualsevol",
        "cat-filter-year": "Any Mínim",
        "cat-filter-fuel": "Combustible",
        "cat-filter-transmission": "Canvi",
        "cat-filter-label": "Etiqueta",
        "cat-filter-precio-min": "Preu Mín",
        "cat-filter-precio-max": "Preu Máx",
        "cat-btn-reset": "Netejar",
        "cat-no-results": "No hi ha cotxes amb eixes característiques",
        "cat-no-results-desc": "Prova a netejar els filtres o canviar els criteris de cerca.",
        "btn-ver-detalles": "Veure detalls",

        // --- FOOTER ---
        "footer-desc": "El teu taller de confiança a Riba-roja de Túria. Mecànica multimarca i venda de vehicles d'ocasió seleccionats.",
        "footer-links": "Enllaços",
        "footer-contacto": "Contacte",
        "footer-horario": "Horari",
        "footer-h1": "Dilluns - Dijous: 08:00 - 15:30",
        "footer-h2": "Divendres: 08:00 - 14:00",
        "footer-h3": "Dissabte i Diumenge: Tancat",
        "footer-copy": "© 2026 Sebriauto 2000. Tots los drets reservats.",
        "footer-legal": "Avís Legal",
        "footer-privacy": "Política de Privacitat",
        "footer-cookies": "Política de Cookies",
        "footer-sitemap": "Mapa Web",

        // --- COOKIES I ERRORS ---
        "cookie-title": "¿Acceptar cookies?",
        "cookie-text": "Utilitzem cookies pròpies per a millorar la teua experiència de navegació i seguretat en la nostra web.",
        "cookie-accept": "Acceptar totes",
        "cookie-necessary": "Només necessàries",
        "cookie-info": "Més informació",
        "error-title": "Vaja! Pareix que t'has perdut",
        "error-text": "La pàgina que busques no existix o ha sigut moguda. Pots tornar a l'inici o contactar amb nosaltres si necesites ajuda."
    }
};
