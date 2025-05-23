document.addEventListener('DOMContentLoaded', function () {
    const tabla = document.querySelector('#tablaUsuarios tbody');
    const form = document.getElementById('formEditarUsuario');
    const mensaje = document.getElementById('mensaje');

    fetch('php/get_usuarios.php')
        .then(res => res.json())
        .then(data => {
            data.forEach(usuario => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.rol}</td>
                    <td>${usuario.activo == 1 ? 'Sí' : 'No'}</td>
                    <td>
                        <button onclick='editarUsuario(${JSON.stringify(usuario)})'>Editar</button>
                        <button onclick='eliminarUsuario(${usuario.id}, "${usuario.rol}")'>Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        formData.set('activo', document.getElementById('activo').checked ? 1 : 0);

        fetch('php/editar_usuario.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                mensaje.innerHTML = data.success
                    ? `<div class="success">Usuario actualizado correctamente.</div>`
                    : `<div class="error">${data.message}</div>`;
                if (data.success) setTimeout(() => location.reload(), 1000);
            });
    });
});

function editarUsuario(usuario) {
    const form = document.getElementById('formEditarUsuario');
    const container = document.getElementById('editarUsuarioContainer');

    // Rellenar campos
    form.id.value = usuario.id;
    form.nombre.value = usuario.nombre;
    form.usuario.value = usuario.usuario;
    form.rol.value = usuario.rol;
    form.activo.checked = usuario.activo == 1;

    // Mostrar el contenedor
    container.style.display = 'block';

    // Scroll al formulario si es necesario
    container.scrollIntoView({ behavior: 'smooth' });
}


function eliminarUsuario(id, rol) {
    if (rol === 'admin') {
        alert('No se puede eliminar un usuario con rol admin.');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch('php/eliminar_usuario.php', {
            method: 'POST',
            body: new URLSearchParams({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Usuario eliminado correctamente.');
                    location.reload();
                } else {
                    alert('Error al eliminar el usuario: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al intentar eliminar el usuario.');
            });
    }
}
