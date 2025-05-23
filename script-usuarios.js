// Obtener el formulario
const form = document.getElementById('formCrearUsuario');
const mensaje = document.getElementById('mensaje');

// Escuchar el evento de envío del formulario
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    // Recoger los datos del formulario
    const formData = new FormData(form);
    formData.append('activo', formData.has('activo') ? 1 : 0); // Asegurarse de enviar el valor correcto para 'activo'

    // Enviar los datos al servidor con AJAX
    fetch('php/crear_usuario.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json()) // Suponiendo que el PHP devuelve JSON
        .then(data => {
            if (data.success) {
                // Redirigir a la página de configuración si el usuario se creó con éxito
                window.location.href = 'configuracion.html';  // Redirige a la página de configuración
            } else {
                // Mostrar mensaje de error
                mensaje.innerHTML = `<div class="error">${data.message}</div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mensaje.innerHTML = `<div class="error">Hubo un error al crear el usuario. Intenta nuevamente.</div>`;
        });
});