                                            // Codificación Operaciones - Articulos
const tabla = document.getElementById("tabla-articulos");
const inputBusqueda = document.getElementById("busqueda-articulo");
let articulos = [];
let filaSeleccionada = null; 

document.addEventListener("DOMContentLoaded", function () {

    // Obtener artículos de PHP
    fetch("php/get_articulos.php")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                articulos = data.data;
                renderizarTabla(articulos);
            }
        });

    // Filtro en tiempo real
    inputBusqueda.addEventListener("input", () => {
        const texto = inputBusqueda.value.toLowerCase();
        const filtrados = articulos.filter(a =>
            a.clave.toLowerCase().includes(texto) ||
            a.descripcion.toLowerCase().includes(texto)
        );
        renderizarTabla(filtrados);
    });
});

// Renderizar la tabla
function renderizarTabla(data) {
    tabla.innerHTML = "";
    data.forEach((articulo, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${articulo.clave}</td>
        <td>${articulo.descripcion}</td>
        <td>$${parseFloat(articulo.precio).toFixed(2)}</td>
    `;

        tr.addEventListener("click", () => {
            document.querySelectorAll("#tabla-articulos tr").forEach(row => {
                row.classList.remove("selected");
            });

            filaSeleccionada = tr;
            tr.classList.add("selected");

            seleccionarArticulo(
                articulo.imagen_url || "img/default.jpg",
                articulo.descripcion,
                `$${parseFloat(articulo.precio).toFixed(2)}`
            );
        });

        tabla.appendChild(tr);
    });
}


function seleccionarArticulo(imagen, descripcion, precio) {
    document.getElementById("foto-articulo").src = imagen;
    document.getElementById("desc-articulo").textContent = descripcion;
    document.getElementById("precio-articulo").textContent = precio;
}

// Mostrar modal Agregar
document.querySelector('.toolbar button:nth-child(1)').addEventListener('click', abrirModalAgregar);
document.addEventListener('keydown', (e) => {
    if (e.key === "F3") {
        e.preventDefault();
        abrirModalAgregar();
    }
});

function abrirModalAgregar() {
    document.getElementById("modalAgregarArticulo").style.display = "flex";
}

function cerrarModalAgregar() {
    document.getElementById("modalAgregarArticulo").style.display = "none";
}

// Enviar formulario al servidor
document.getElementById("form-articulo").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Mostrar contenido del FormData
    for (let [key, value] of formData.entries()) {
        console.log(key + ": " + value);
    }

    fetch("php/agregar_articulo.php", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert("Artículo agregado correctamente");
                this.reset(); // limpia el formulario
                document.getElementById("modalAgregar").style.display = "none";
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(err => {
            console.error("Error en fetch:", err);
        });
});

// Mostrar modal Editar
document.getElementById("btnEditar").addEventListener("click", abrirModalEditar);
document.addEventListener("keydown", (e) => {
    if (e.key === "F4") {
        e.preventDefault();
        abrirModalEditar();
    }
});
function abrirModalEditar() {
    if (!filaSeleccionada) {
        alert("Selecciona un artículo de la tabla para editar.");
        return;
    }

    // Mostrar modal primero
    document.getElementById("modalEditarArticulo").style.display = "flex";

    const clave = filaSeleccionada.children[0].textContent.trim();
    const descripcion = filaSeleccionada.children[1].textContent.trim();
    const precio = parseFloat(filaSeleccionada.children[2].textContent.replace("$", "").trim());
    const imagen = document.getElementById("foto-articulo").src.trim();

    console.log("Datos que se asignarán al formulario:");
    console.log("Clave:", clave);
    console.log("Descripción:", descripcion);
    console.log("Precio:", precio);
    console.log("Imagen:", imagen);

    const form = document.querySelector("#form-EditarArticulo");

    form.querySelector("input[name='clave']").value = clave;
    console.log("Valor en input[name='clave']:", form.querySelector("input[name='clave']").value);
    form.querySelector("input[name='descripcion']").value = descripcion;
    form.querySelector("input[name='precio']").value = precio;
    form.querySelector("input[name='imagen_url']").value = imagen;
}


function cerrarModalEditar() {
    document.getElementById("modalEditarArticulo").style.display = "none";
    document.querySelector("#form-EditarArticulo").reset(); // Limpia los campos al cerrar
}

function actualizarTabla() {
    fetch("php/get_articulos.php")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderizarTabla(data.data);
            }
        })
        .catch(error => console.error("Error al actualizar la tabla:", error));
}

document.querySelector("#btnGuardar").addEventListener("click", function () {
    document.querySelector("#form-EditarArticulo").dispatchEvent(new Event("submit"));
});



document.querySelector("#form-EditarArticulo").addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("✅ Submitting form...");

    const form = document.querySelector("#form-EditarArticulo");

    const clave = form.querySelector('input[name="clave"]').value.trim();
    const descripcion = form.querySelector('input[name="descripcion"]').value.trim();
    const precio = form.querySelector('input[name="precio"]').value.trim();
    const imagenUrl = form.querySelector('input[name="imagen_url"]').value.trim();

    console.log("📋 Valores dentro del submit:");
    console.log("Clave:", clave);
    console.log("Descripción:", descripcion);
    console.log("Precio:", precio);
    console.log("Imagen URL:", imagenUrl);

    if (!clave) {
        console.warn("⚠️ No se detectó la clave en el formulario. ¿Se reinició?");
    }

    const bodyData = new URLSearchParams({
        clave: clave,
        descripcion: descripcion,
        precio: precio,
        imagen_url: imagenUrl
    }).toString();

    fetch("php/update_articulo.php", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyData
    })
        .then(response => response.json())
        .then(data => {
            console.log("📌 Respuesta del servidor:", data);
            if (data.success) {
                cerrarModalEditar();
                actualizarTabla();
                alert("Artículo actualizado correctamente.");
                return 0;
            } 
        })
        .catch(error => console.error("Error en fetch:", error));
});



// Eliminar articulos
document.getElementById("btnEliminar").addEventListener("click", function () {
    if (!filaSeleccionada) {
        alert("Selecciona un artículo antes de eliminar.");
        return;
    }

    const clave = filaSeleccionada.children[0].textContent.trim();

    if (!confirm(`¿Estás seguro de que quieres eliminar el artículo con clave ${clave}?`)) {
        return; // ✅ Evita la eliminación si el usuario cancela
    }

    fetch("php/delete_articulo.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ clave: clave }).toString()
    })
        .then(response => response.json())
        .then(data => {
            console.log("📌 Respuesta del servidor:", data);

            if (data.success) {
                actualizarTabla(); // Refrescar tabla después de la eliminación
                alert("Artículo eliminado correctamente.");
            } else {
                alert(`Error al eliminar: ${data.message}`);
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
});

const rol = localStorage.getItem("rol");
if (rol !== "admin") {
    // Oculta los botones para vendedores
    document.getElementById("btnAgregar")?.remove();
    document.getElementById("btnEditar")?.remove();
    document.getElementById("btnEliminar")?.remove();
}

