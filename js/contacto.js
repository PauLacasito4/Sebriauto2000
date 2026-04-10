// contacto.js
import { supabase } from './supabase.js';

const contactForm = document.getElementById('contact-form');
const statusMsg = document.getElementById('status-msg');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('name').value,
        email: document.getElementById('email').value || null,
        telefono: document.getElementById('phone').value || null,
        mensaje: document.getElementById('message').value
    };

    const submitBtn = contactForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const { error } = await supabase
            .from('contactos')
            .insert([formData]);

        if (error) throw error;

        // Éxito
        statusMsg.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        statusMsg.className = 'status-msg success';
        contactForm.reset();
    } catch (err) {
        console.error(err);
        statusMsg.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o llámanos.';
        statusMsg.className = 'status-msg error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
        
        // Scroll al mensaje
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
