                            // Codificación Operaciones - Ventas
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("modalBusqueda").style.display = "none";
    document.getElementById("modalCambio").style.display = "none";
    document.getElementById("modalPago").style.display = "none";
    document.getElementById("modalCambioVenta").style.display = "none";
    document.getElementById("modalCantidad").style.display = "none";
    document.getElementById("modalDescuento").style.display = "none";
});

// Cargar artículos de la BD
let articulosDisponibles = []; // Esta lista se llenará desde el servidor o al inicio
function obtenerArticulos() {
    const tabla = document.getElementById("tabla-articulos");
    const inputBusqueda = document.getElementById("busqueda-articulo");
    let articulos = [];

    // Obtener artículos de PHP
    fetch("php/get_articulos.php")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                articulos = data.data;
                articulosDisponibles = data.data;
                renderizarTabla(articulos);
            }
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
                // Eliminar clase "selected" de todos los TR
                document.querySelectorAll("#tabla-articulos tr").forEach(row => row.classList.remove("selected"));

                // Agregar clase al TR actual
                tr.classList.add("selected");

                // Obtener datos del artículo seleccionado
                const clave = articulo.clave;
                const descripcion = articulo.descripcion;
                const precio = parseFloat(articulo.precio).toFixed(2);

                // Agregar o actualizar el artículo en la tabla de productos
                agregarOActualizarArticulo(clave, descripcion, precio);

            });

            tabla.appendChild(tr);
        });
    }
    // Filtro en tiempo real
    inputBusqueda.addEventListener("input", () => {
        const texto = inputBusqueda.value.toLowerCase();
        const filtrados = articulos.filter(a =>
            a.clave.toLowerCase().includes(texto) ||
            a.descripcion.toLowerCase().includes(texto)
        );
        renderizarTabla(filtrados);
    });
}

// Módulo de búsqueda
document.getElementById("btnBuscar").addEventListener("click", () => {
    document.getElementById("modalBusqueda").style.display = "block";
    obtenerArticulos();
});

document.getElementById("cerrarModal").addEventListener("click", () => {
    document.getElementById("modalBusqueda").style.display = "none";
});

document.addEventListener("keydown", function(event) {
    if (event.key === "F2") {
        event.preventDefault();
        document.getElementById("modalBusqueda").style.display = "block";
        obtenerArticulos();
    }
});
function agregarOActualizarArticulo(clave, descripcion, precio) {
    const tablaProductos = document.querySelector(".table-container tbody");
    let filaExistente = null;

    // Buscar si el artículo ya está en la tabla
    document.querySelectorAll(".table-container tbody tr").forEach(row => {
        const descripcionCelda = row.children[2]; // Celda de descripción

        if (descripcionCelda.textContent === descripcion) {
            filaExistente = row;
        }
    });

    if (filaExistente) {
        let cantidadCelda = filaExistente.children[1]; // Ajuste del índice de cantidad
        let cantidadActual = parseInt(cantidadCelda.textContent);
        cantidadCelda.textContent = cantidadActual + 1;

        let importeCelda = filaExistente.children[4]; // Ajuste del índice de importe
        importeCelda.textContent = `$${((cantidadActual + 1) * precio).toFixed(2)}`;
    } else {
        // Si no existe, agregarlo a la tabla
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="clave">${clave}</td>  <!-- Clave del artículo -->
            <td class="cantidad">1</td>  <!-- Cantidad -->
            <td>${descripcion}</td>  <!-- Descripción -->
            <td>$${precio}</td>  <!-- Precio -->
            <td class="importe">$${precio}</td>  <!-- Importe -->
        `;

        tablaProductos.appendChild(tr);
        aplicarEventosCantidad(tr);
    }
    actualizarTotal();
}

document.getElementById("inputClave").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const claveIngresada = this.value.trim();
        if (claveIngresada === "") return;

        // Buscar en la lista
        const articulo = articulosDisponibles.find(a => a.clave === claveIngresada);

        if (articulo) {
            // Agregar o actualizar en la tabla
            agregarOActualizarArticulo(articulo.clave, articulo.descripcion, parseFloat(articulo.precio));
            this.value = ""; // Limpiar input
        } else {
            // Mostrar modal de búsqueda si no se encontró
            document.getElementById("modalBusqueda").style.display = "block";
            obtenerArticulos(); // actualiza el modal si lo necesitas
        }
    }
});


// Módulo de cantidades
function aplicarEventosCantidad(row) {
    let cantidadCell = row.children[1];

    // Doble clic para editar cantidad
    cantidadCell.addEventListener("dblclick", function () {
        this.setAttribute("contenteditable", "true");
        this.focus();

        this.addEventListener("blur", function () {
            this.removeAttribute("contenteditable");
            actualizarImporte(row);
        });

        this.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                this.blur();
            }
        });
    });

    // Click para seleccionar fila
    row.addEventListener("click", () => {
        if (filaSeleccionada) filaSeleccionada.classList.remove("selected");
        filaSeleccionada = row;
        filaSeleccionada.classList.add("selected");
    });
}
function actualizarImporte(fila) {
    const cantidad = parseInt(fila.children[1].textContent);
    const precio = parseFloat(fila.children[3].textContent.replace("$", ""));
    const importeCell = fila.children[4];
    importeCell.textContent = `$${(cantidad * precio).toFixed(2)}`;
    actualizarTotal();
}

        // Doble clic en la cantidad
document.querySelectorAll("tbody tr").forEach((row) => {
    row.children[1].addEventListener("dblclick", function () {
        this.setAttribute("contenteditable", "true");
        this.focus();

        this.addEventListener("blur", function () {
            this.removeAttribute("contenteditable");
            actualizarImporte(row);
        });

        this.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                this.blur();
            }
        });
    });
});
        // Flechas ↑ y ↓ para cambiar cantidad del artículo seleccionado
let filaSeleccionada = null;
document.querySelectorAll("tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
        if (filaSeleccionada) filaSeleccionada.classList.remove("selected");
        filaSeleccionada = row;
        filaSeleccionada.classList.add("selected");
    });
});
document.addEventListener("keydown", (e) => {
    if (filaSeleccionada) {
        let cantidadCell = filaSeleccionada.children[1];
        let cantidad = parseInt(cantidadCell.textContent);

        if (e.key === "ArrowUp") {
            cantidad++;
        } else if (e.key === "ArrowDown" && cantidad > 1) {
            cantidad--;
        } else {
            return;
        }

        cantidadCell.textContent = cantidad;
        actualizarImporte(filaSeleccionada);
    }
});
        // Atajo de teclado F3 para abrir el modal de cantidad
document.addEventListener("keydown", (e) => {
    if (e.key === "F3") {
        e.preventDefault(); // Evita que el navegador recargue
        if (filaSeleccionada) {
            document.getElementById("nuevaCantidad").value = 0;
            document.getElementById("modalCantidad").style.display = "block";
        } else {
            alert("Selecciona un artículo para modificar la cantidad.");
        }
    }
});
        // Botón “Cantidad (F3)”
document.getElementById("btnCant").addEventListener("click", () => {
    document.getElementById("nuevaCantidad").value = 0;
    document.getElementById("modalCantidad").style.display = "block";
});
function cerrarModalCantidad() {
    document.getElementById("modalCantidad").style.display = "none";
}
        // Aplicar nueva cantidad
function aplicarNuevaCantidad() {
    const nuevaCantidad = parseInt(document.getElementById("nuevaCantidad").value);
    if (filaSeleccionada && nuevaCantidad > 0) {
        filaSeleccionada.children[1].textContent = nuevaCantidad;
        actualizarImporte(filaSeleccionada);
        actualizarTotal()
    }
    cerrarModalCantidad();
}

//  Módulo de pago
function hayArticulosEnVenta() {
    const filas = document.querySelectorAll("tbody tr");
    return filas.length > 0;
}
function mostrarTotalEnModal() {
    // Obtener el total visible en la página principal
    const totalTexto = document.querySelector(".footer").textContent;
    const totalNum = parseFloat(totalTexto.replace("Total: $", "").replace(" MXN", ""));

    // Actualizar el h1 del modal
    document.getElementById("totalModal").textContent = `$${totalNum.toFixed(2)}`;

    // Actualizar texto en letras (opcional)
    document.getElementById("totalEnLetras").textContent = `(${convertirNumeroALetras(totalNum)} MXN)`;
}
function convertirNumeroALetras(numero) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero).replace('$', '');
}
document.getElementById("btnPagar").addEventListener("click", () => {
    if (hayArticulosEnVenta()) {
        mostrarTotalEnModal();
        document.getElementById("modalPago").style.display = "block";
        calcularCambio();
    } else {
        alert("No hay artículos en la venta.");
    }
});
document.addEventListener("keydown", function (event) {
    if (event.key === "F1") {
        event.preventDefault();
        if (hayArticulosEnVenta()) {
            mostrarTotalEnModal();
            document.getElementById("modalPago").style.display = "block";
            calcularCambio();
        } else {
            alert("No hay artículos en la venta.");
        }
    }
});
document.getElementById("cerrarPago").addEventListener("click", () => {
    document.getElementById("modalPago").style.display = "none";
});

// Módulo de cambio
document.querySelector("select").addEventListener("dblclick", () => {
    document.getElementById("modalCambio").style.display = "block";
});
document.getElementById("cerrarCambio").addEventListener("click", () => {
    document.getElementById("modalCambio").style.display = "none";
});
function calcularCambio() {
    // Obtener el total desde la página principal
    const totalTexto = document.querySelector(".footer").textContent;
    const total = parseFloat(totalTexto.replace("Total: $", "").replace(" MXN", ""));

    const efectivo = parseFloat(document.getElementById("efectivoInput").value) || 0;
    const tarjeta = parseFloat(document.getElementById("tarjetaInput").value) || 0;
    const transferencia = parseFloat(document.getElementById("transferenciaInput").value) || 0;
    const pagado = efectivo + tarjeta + transferencia;
    const cambio = pagado - total;

    document.getElementById("cambioMonto").innerText = `$${cambio.toFixed(2)}`;

    const aceptarBtn = document.getElementById("btnAceptarPago");
    aceptarBtn.disabled = cambio < 0;
}
document.querySelectorAll("#efectivoInput, #tarjetaInput, #transferenciaInput").forEach(input => {
    input.addEventListener("input", calcularCambio);
});
document.querySelectorAll(".pago-item input").forEach(input => {
    input.addEventListener("input", calcularCambio);
});
document.getElementById("btnAceptarPago").addEventListener("click", () => {
    // Obtener el total desde la página principal
    const totalTexto = document.querySelector(".footer").textContent;
    const total = parseFloat(totalTexto.replace("Total: $", "").replace(" MXN", ""));
    const efectivo = parseFloat(document.getElementById("efectivoInput").value) || 0;
    const tarjeta = parseFloat(document.getElementById("tarjetaInput").value) || 0;
    const transferencia = parseFloat(document.getElementById("transferenciaInput").value) || 0;
    const pagado = efectivo + tarjeta + transferencia;
    const cambio = pagado - total;

    if (cambio > 0) {
        document.getElementById("modalPago").style.display = "none";
        document.getElementById("modalCambioVenta").style.display = "block";
        document.getElementById("cambioFinal").innerText = `$${cambio.toFixed(2)}`;
    } else {
        alert("Venta completada.");
        document.getElementById("modalPago").style.display = "none";
    }
    registrarVenta();
    limpiarVenta();
});
document.getElementById("cerrarPago").addEventListener("click", () => {
    document.getElementById("modalPago").style.display = "none";
});

function limpiarVenta() {
    // Eliminar todas las filas de la tabla
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    // Reiniciar el total
    document.querySelector(".footer").textContent = "Total: $0.00 MXN";

    // Si estás mostrando algo en el modal de pago, resetearlo también
    document.getElementById("totalModal").textContent = "$0.00";
    document.getElementById("totalEnLetras").textContent = "";

    // Limpiar variables internas, descuentos, etc.
    articuloSeleccionado = null;
    tipoCambio = 1;
}


// Cambio de color en fila seleccionada
document.querySelectorAll("tbody").forEach((tbody) => {
    tbody.addEventListener("click", function (e) {
        const fila = e.target.closest("tr");

        if (fila) {
            // Quitar selección de otras filas
            document.querySelectorAll("tbody tr").forEach((tr) => {
                tr.classList.remove("selected");
            });

            // Agregar selección a la fila clicada
            fila.classList.add("selected");
        }
    });
});

function actualizarTotal() {
    let total = 0;
    document.querySelectorAll(".table-container tbody tr").forEach(row => {
        const importe = parseFloat(row.children[4].textContent.replace("$", ""));
        total += importe;
    });

    const footer = document.querySelector(".footer");
    footer.textContent = `Total: $${total.toFixed(2)} MXN`;
}


// Remover artículo con “Remover (F6)”
document.querySelector("button:nth-child(3)").addEventListener("click", () => {
    if (filaSeleccionada) {
        filaSeleccionada.remove();
        filaSeleccionada = null;
        actualizarTotal();
    }
});

// Botón “Descuento (F7)”
document.querySelector("button:nth-child(4)").addEventListener("click", () => {
    document.getElementById("modalDescuento").style.display = "block";
});

function cerrarModalDescuento() {
    document.getElementById("modalDescuento").style.display = "none";
}

function aplicarDescuento() {
    const valor = parseFloat(document.getElementById("valorDescuento").value);
    const modo = document.querySelector('input[name="modoDesc"]:checked').value;

    if (filaSeleccionada) {
        let precioCell = filaSeleccionada.children[3];
        let precio = parseFloat(precioCell.textContent.replace("$", ""));
        if (isNaN(precio)) {
            console.error("Precio no es un número válido:", precioCelda.textContent);
            return;
        }
        if (modo === "porcentaje") {
            precio = precio - (precio * (valor / 100));
        } else {
            precio = valor;
        }

        precioCell.textContent = `$${precio.toFixed(2)}`;
        actualizarImporte(filaSeleccionada);
    } else {
        // Aplicar descuento general a todos
        document.querySelectorAll("tbody tr").forEach((row) => {
            let precioCell = row.children[3];
            let precio = parseFloat(precioCell.textContent.replace("$", ""));

            if (modo === "porcentaje") {
                precio = precio - (precio * (valor / 100));
            } else {
                precio = valor;
            }

            precioCell.textContent = `$${precio.toFixed(2)}`;
            actualizarImporte(row);
        });
    }

    cerrarModalDescuento();
}

function actualizarImporte(row) {
    let cantidad = parseInt(row.children[1].textContent);
    let precioCelda = row.children[3];
    let precio = parseFloat(precioCelda.textContent.replace("$", ""));

    if (!isNaN(precio) && !isNaN(cantidad)) {
        let importeCell = row.children[4];
        importeCell.textContent = `$${(cantidad * precio).toFixed(2)}`;
        actualizarTotal() 
    } else {
        console.error("Error: cantidad o precio no válidos");
    }
}

function actualizarTotal() {
    let totalMXN = 0;

    document.querySelectorAll("tbody tr").forEach((row) => {
        const importeCell = row.children[4];
        if (importeCell) {
            const importe = parseFloat(importeCell.textContent.replace("$", "")) || 0;
            totalMXN += importe;
        }
    });

    const moneda = document.getElementById("monedaSelect").value;
    let totalConvertido;
    let simbolo;
    let tasaCambio;

    if (moneda === "USD") {
        // Convertir de MXN a USD
        tasaCambio = tipoCambioUSD !== 0 ? tipoCambioUSD : 1;
        totalConvertido = totalMXN / tasaCambio;
        simbolo = "USD";
    } else {
        // Mostrar en pesos
        totalConvertido = totalMXN;
        simbolo = "MXN";
    }

    document.querySelector(".footer").textContent = `Total: $${totalConvertido.toFixed(2)} ${simbolo}`;
}

// Variables para guardar el tipo de cambio
let tipoCambioUSD = parseFloat(document.getElementById("cambioUSD").textContent) || 18.50;
let tipoCambioMXN = parseFloat(document.getElementById("cambioMXN").textContent) || 1.00;

// Aceptar en modal de tipo de cambio
document.querySelector('#modalCambio button').addEventListener('click', function () {
    // Actualiza los valores guardados
    tipoCambioUSD = parseFloat(document.getElementById("cambioUSD").textContent) || 18.50;
    tipoCambioMXN = parseFloat(document.getElementById("cambioMXN").textContent) || 1.00;

    // Cierra el modal
    document.getElementById("modalCambio").style.display = "none";

    // Actualiza el input según la moneda actual seleccionada
    const moneda = document.getElementById("monedaSelect").value;
    actualizarInputCambio(moneda);
});

// Actializar tipo de cambio
function actualizarInputCambio(moneda) {
    const inputCambio = document.getElementById("inputCambio");
    if (moneda === "USD") {
        inputCambio.value = tipoCambioUSD.toFixed(2);
    } else {
        inputCambio.value = tipoCambioMXN.toFixed(2);
    }
}

document.getElementById("monedaSelect").addEventListener("change", function () {
    actualizarInputCambio(this.value);
    actualizarTotal();
});


function registrarVenta() {
    const usuario_id = 1; // Cambia según tu sistema de usuarios
    const totalTexto = document.querySelector(".footer").textContent;
    const total = parseFloat(totalTexto.replace("Total: $", "").replace(" MXN", ""));

    const articulosVendidos = [];
    document.querySelectorAll("tbody tr").forEach(fila => {
        const celdas = fila.children;
        if (celdas.length < 4) {
            console.warn("⚠️ Fila ignorada por tener menos de 4 columnas:", fila.innerText);
            return; // Saltar fila
        }

        const articulo_id = celdas[0]?.textContent?.trim() || null;
        const cantidad = parseInt(celdas[1]?.textContent?.trim(), 10) || 0;
        const descripcion = celdas[2]?.textContent?.trim() || ""; 
        const precio_unitario = parseFloat(celdas[3]?.textContent?.replace("$", "").trim()) || 0;
        const importe = cantidad * precio_unitario;

        if (articulo_id !== null && cantidad > 0 && !isNaN(precio_unitario)) {
            console.log("🔍 Fila válida:", { articulo_id, descripcion, cantidad, precio_unitario });
            articulosVendidos.push({ articulo_id, descripcion, cantidad, precio_unitario, importe });
        }
    });


    console.log("📌 Artículos enviados:", articulosVendidos);

    // 🔴 Validación fuera del forEach
    if (articulosVendidos.length === 0) {
        alert("⚠️ No se encontraron artículos válidos para registrar.");
        return; // Detiene la ejecución
    }

    fetch("php/insert_venta.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ usuario_id: usuario_id, total: total }).toString()
    })
        .then(response => response.json())
        .then(data => {
            console.log("📌 Venta registrada:", data);

            if (data.success) {
                registrarDetalleVenta(data.venta_id, articulosVendidos);
            } else {
                alert(`Error al registrar venta: ${data.message}`);
            }
        })
        .catch(error => console.error("Error en fetch:", error));
}



function registrarDetalleVenta(venta_id, articulos) {
    console.log("📌 Artículos enviados:", articulos); // 🔍 Confirmar qué datos se están enviando

    fetch("php/insert_detalle_venta.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venta_id: venta_id, articulos: articulos })
    })
        .then(response => response.text()) // ⚠️ Muestra la respuesta como texto en vez de JSON
        .then(text => {
            console.log("📌 Respuesta completa del servidor:", text); // Ver qué está regresando
            return JSON.parse(text);
        })
        .then(data => {
            console.log("📌 Respuesta procesada:", data);
            alert("Venta completada correctamente.");
        })
        .catch(error => console.error("Error en fetch:", error));
}

function logout() {
    // Eliminar cookies
    deleteCookies();

    // Limpiar sessionStorage y localStorage
    sessionStorage.clear();
    localStorage.clear();

    // Redirigir a la página de login
    window.location.href = 'Login.html';
}

// Función para eliminar todas las cookies
function deleteCookies() {
    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    });
}


const rol = localStorage.getItem("rol");

if (rol !== "admin") {
    // Oculta el botón de cancelar venta
    document.getElementById("cancelarVenta")?.remove();
}