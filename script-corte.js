// Define la función guardarCorte fuera del evento DOMContentLoaded
function guardarCorte() {
    const contado = parseFloat(document.getElementById("contadoEfectivo").value);

    const data = {
        usuario_id: 1, // Puedes ajustar según usuario activo
        caja: "Caja 1",
        total: contado
    };

    fetch("php/corte_caja.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(r => r.json())
        .then(resp => {
            alert(resp.message);
            if (resp.success) cerrarModalCorte();
        });
}


// Espera a que el contenido se haya cargado
document.addEventListener("DOMContentLoaded", function () {
    // Evento al hacer click en el botón de corte (F3)
    document.querySelector(".toolbar button").addEventListener("click", mostrarModalCorte);
    document.addEventListener("keydown", e => {
        if (e.key === "F3") {
            e.preventDefault();
            mostrarModalCorte();
        }
    });

    function mostrarModalCorte() {
        // Realizar una solicitud AJAX para obtener el total calculado desde el servidor
        fetch("php/getCorte.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let calculado = data.monto_total; // Monto total calculado desde la base de datos

                    // Verificar si el monto_total es un número válido
                    calculado = parseFloat(calculado);

                    if (isNaN(calculado)) {
                        console.error("El monto calculado no es un número válido.");
                        alert("Hubo un error al obtener el monto total.");
                        return;
                    }

                    // Mostrar el monto total calculado en el modal
                    const calculadoElement = document.getElementById("calculadoEfectivo");
                    if (calculadoElement) {
                        calculadoElement.textContent = `$${calculado.toFixed(2)}`;
                    }

                    // Agregar evento de input en el campo de contado
                    const contadoInput = document.getElementById("contadoEfectivo");
                    if (contadoInput) {
                        contadoInput.addEventListener("input", actualizarDiferencia);
                    }

                    actualizarDiferencia();  // Calcular y mostrar la diferencia
                    document.getElementById("modalCorte").style.display = "block";  // Mostrar el modal
                } else {
                    alert(data.message);  // Mostrar mensaje de error si algo salió mal
                }
            })
            .catch(error => {
                console.error("Error al obtener el total:", error);
                alert("Hubo un error al obtener el monto total.");
            });
    }


    function cerrarModalCorte() {
        document.getElementById("modalCorte").style.display = "none";
    }

    function actualizarDiferencia() {
        const contadoInput = document.getElementById("contadoEfectivo");
        const calculadoElement = document.getElementById("calculadoEfectivo");
        const diferenciaElement = document.getElementById("diferenciaEfectivo");

        if (contadoInput && calculadoElement && diferenciaElement) {
            const contado = parseFloat(contadoInput.value || 0);
            const calculado = parseFloat(calculadoElement.textContent.replace("$", "") || 0);
            const diferencia = contado - calculado;

            diferenciaElement.textContent = `$${diferencia.toFixed(2)}`;
        }
    }

    // Exponer cerrarModalCorte globalmente para que funcione desde el onclick
    window.cerrarModalCorte = cerrarModalCorte;
});


document.addEventListener("DOMContentLoaded", function () {
    // Llamar a la función para obtener el último corte
    obtenerUltimoCorte();

    // Función para obtener el último corte y actualizar la interfaz
    function obtenerUltimoCorte() {
        // Realizar una solicitud AJAX para obtener el último corte
        fetch("php/getUltimoCorte.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Llenar los campos con la información del último corte
                    const cajaElement = document.querySelector(".contenido #cajaLabel");
                    const usuarioElement = document.querySelector(".contenido #usuarioLabel");
                    const fechaElement = document.querySelector(".contenido #fechaLabel");
                    const horaElement = document.querySelector(".contenido #horaLabel");

                    // Formatear la fecha
                    const fecha = new Date(data.fecha);
                    const fechaFormateada = fecha.toLocaleDateString('es-ES');  // Formato de fecha: dd/mm/yyyy
                    const horaFormateada = fecha.toLocaleTimeString('es-ES');  // Formato de hora: hh:mm:ss

                    // Mostrar la información obtenida en el HTML
                    if (cajaElement) cajaElement.textContent = `Caja: ${data.caja}`;
                    if (usuarioElement) usuarioElement.textContent = `Usuario ID: ${data.usuario_id}`;
                    if (fechaElement) fechaElement.textContent = `Fecha: ${fechaFormateada}`;
                    if (horaElement) horaElement.textContent = `Hora: ${horaFormateada}`;
                } else {
                    alert(data.message);  // Mostrar mensaje de error si algo salió mal
                }
            })
            .catch(error => {
                console.error("Error al obtener el último corte:", error);
                alert("Hubo un error al obtener la información del último corte.");
            });
    }
});
