document.addEventListener("DOMContentLoaded", function () {
    // Al cargar la página
    obtenerVentas();
    ocultarModales();

    // Evento tecla F5 para cancelar venta
    document.addEventListener("keydown", function (event) {
        if (event.key === "F5") {
            event.preventDefault(); // Evita que el navegador recargue la página
            cancelarVenta();
        }
    });

    // Evento botón "Cancelar"
    document.getElementById("cancelarVenta").addEventListener("click", cancelarVenta);

    // Evento botón "Ver (F3)"
    document.getElementById("verDetalleVenta").addEventListener('click', function () {
        const ventaId = this.getAttribute("data-id");
        if (ventaId) {
            mostrarDetallesVenta(ventaId);
        } else {
            alert("Por favor, seleccione una venta.");
        }
    });
});

// -------------------- FUNCIONES --------------------

function ocultarModales() {
    const modalDetalle = document.getElementById("modalDetalleVenta");
    if (modalDetalle) modalDetalle.style.display = "none";

    const modalCorte = document.getElementById("modalCorte");
    if (modalCorte) modalCorte.style.display = "none";
}

function obtenerVentas() {
    fetch('php/getVentas.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarVentas(data.ventas);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error al obtener ventas:", error);
            alert("Hubo un error al obtener las ventas.");
        });
}

function mostrarVentas(ventas) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    ventas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.setAttribute("data-id", venta.id);

        const total = parseFloat(venta.total);
        const totalFormateado = !isNaN(total) ? `$${total.toFixed(2)}` : '$0.00';

        tr.innerHTML = `
            <td>${venta.id}</td>
            <td>${venta.fecha}</td>
            <td>${venta.vendedor}</td>
            <td>${totalFormateado}</td>
        `;
        tbody.appendChild(tr);
    });

    // Añadir evento clic a cada fila
    const filas = document.querySelectorAll('table tbody tr');
    filas.forEach(fila => {
        fila.addEventListener('click', function () {
            const ventaId = this.getAttribute("data-id");

            filas.forEach(f => f.classList.remove("selected"));
            this.classList.add("selected");

            const btnVer = document.getElementById("verDetalleVenta");
            btnVer.disabled = false;
            btnVer.setAttribute("data-id", ventaId);
        });
    });
}

function mostrarDetallesVenta(ventaId) {
    fetch(`php/getDetalleVenta.php?venta_id=${ventaId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarDetallesArticulos(data.detalles);
                document.getElementById("modalDetalleVenta").style.display = "block";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error al obtener los detalles de los artículos:", error);
            alert("Hubo un error al obtener los detalles.");
        });
}

function mostrarDetallesArticulos(detalles) {
    const tbody = document.getElementById("tabla-detalles-articulos").getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    detalles.forEach(detalle => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${detalle.articulo_clave}</td>
            <td>${detalle.articulo_descripcion}</td>
            <td>${detalle.cantidad}</td>
            <td>${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
            <td>${parseFloat(detalle.subtotal).toFixed(2)}</td>
        `;
        tbody.appendChild(fila);
    });
}

function cerrarModal() {
    document.getElementById("modalDetalleVenta").style.display = "none";
}

function cancelarVenta() {
    const filaSeleccionada = document.querySelector('tr.selected');
    if (!filaSeleccionada) {
        alert("Por favor, selecciona una venta primero.");
        return;
    }

    const ventaId = filaSeleccionada.getAttribute("data-id");
    if (!confirm("¿Estás seguro de que deseas cancelar esta venta y eliminar sus detalles?")) {
        return;
    }

    fetch(`php/eliminarVenta.php?venta_id=${ventaId}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                filaSeleccionada.remove();
                alert("Venta y detalles eliminados con éxito.");
            } else {
                alert("Hubo un error al intentar eliminar la venta.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar la venta:", error);
            alert("Hubo un error al eliminar la venta.");
        });
}

document.getElementById("search-input").addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll("table tbody tr");

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
});

const rol = localStorage.getItem("rol");
if (rol !== "admin") {
    // Oculta los botones para vendedores
    document.getElementById("cancelarVenta")?.remove();
}