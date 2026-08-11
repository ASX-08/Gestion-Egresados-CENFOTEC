
let formulario = document.querySelector("#formEgresado");
let mensaje = document.querySelector("#mensaje");
let lista = document.querySelector("#listaEgresados");

// ==========================================
// FECHA ACTUAL
// ==========================================

let hoy = new Date();

let año = hoy.getFullYear();
let mes = String(hoy.getMonth() + 1).padStart(2, "0");
let dia = String(hoy.getDate()).padStart(2, "0");

let fechaActual = año + "-" + mes + "-" + dia;

document.getElementById("fecha").value = fechaActual;


// ==========================================
// CARGAR EGRESADOS AL ABRIR LA PÁGINA
// ==========================================

mostrarEgresados();


// ==========================================
// EVENTO DEL FORMULARIO
// ==========================================

formulario.addEventListener("submit", guardarEgresado);


// ==========================================
// GUARDAR EGRESADO - POST
// ==========================================

async function guardarEgresado(event) {

    event.preventDefault();

    mensaje.className = "";
    mensaje.textContent = "";


    // Obtener datos del formulario

    let identificacion = document.getElementById("identificacion").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let fecha = document.getElementById("fecha").value;
    let trabajo = document.getElementById("trabajo").value.trim();


    // ==========================================
    // VALIDAR CAMPOS OBLIGATORIOS
    // ==========================================

    if (
        identificacion === "" ||
        nombre === "" ||
        correo === "" ||
        telefono === "" ||
        fecha === ""
    ) {

        mensaje.className = "error";

        mensaje.textContent =
            "Debe rellenar todos los campos obligatorios.";

        return;
    }


    // ==========================================
    // VALIDAR CÉDULA DE COSTA RICA
    // ==========================================

    let regexCedula = /^[1-7]\d{8}$/;

    if (!regexCedula.test(identificacion)) {

        mensaje.className = "error";

        mensaje.textContent =
            "La cédula no es válida.";

        return;
    }


    // ==========================================
    // VALIDAR CORREO
    // ==========================================

    let regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {

        mensaje.className = "error";

        mensaje.textContent =
            "Correo electrónico inválido.";

        return;
    }


    // ==========================================
    // VALIDAR TELÉFONO
    // ==========================================

    let regexTelefono = /^\d{8}$/;

    if (!regexTelefono.test(telefono)) {

        mensaje.className = "error";

        mensaje.textContent =
            "El teléfono debe tener 8 dígitos.";

        return;
    }


    // ==========================================
    // CREAR OBJETO PARA EL BACKEND
    // ==========================================

    let egresado = {

        identificacion: identificacion,

        nombreCompleto: nombre,

        correoElectronico: correo,

        telefono: telefono,

        fechaRegistro: fecha

    };


    // ==========================================
    // LUGAR DE TRABAJO
    // ES OPCIONAL
    // ==========================================

    if (trabajo !== "") {

        egresado.lugaresTrabajo = [trabajo];

    }


    // ==========================================
    // ENVIAR DATOS AL BACKEND
    // ==========================================

    try {

        let respuesta = await fetch(
            "http://localhost:3000/egresados",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(egresado)

            }
        );


        let datos = await respuesta.json();


        // ==========================================
        // COMPROBAR RESPUESTA DEL SERVIDOR
        // ==========================================

        if (!respuesta.ok) {

            throw new Error(
                datos.mensajeError ||
                datos.error ||
                "No se pudo registrar el egresado."
            );

        }


        // ==========================================
        // MENSAJE DE ÉXITO
        // ==========================================

        mensaje.className = "exito";

        mensaje.textContent =
            "Egresado registrado correctamente.";


        // Limpiar formulario

        formulario.reset();


        // Volver a colocar la fecha actual

        document.getElementById("fecha").value = fechaActual;


        // Actualizar la tabla

        await mostrarEgresados();


    } catch (error) {

        console.error(
            "Error al registrar egresado:",
            error
        );

        mensaje.className = "error";

        mensaje.textContent =
            "No se pudo registrar el egresado: " +
            error.message;

    }

}


// ==========================================
// MOSTRAR EGRESADOS - GET
// ==========================================

async function mostrarEgresados() {

    try {

        let respuesta = await fetch(
            "http://localhost:3000/egresados"
        );


        // Comprobar respuesta

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron consultar los egresados."
            );

        }


        // Convertir respuesta a JSON

        let egresados = await respuesta.json();


        // Limpiar tabla

        lista.innerHTML = "";


        // ==========================================
        // MOSTRAR CADA EGRESADO
        // ==========================================

        for (let i = 0; i < egresados.length; i++) {

            let egresado = egresados[i];


            let lugaresTrabajo = "";

            if (Array.isArray(egresado.lugaresTrabajo)) {

                lugaresTrabajo =
                    egresado.lugaresTrabajo.join(", ");

            } else if (egresado.lugaresTrabajo) {

                lugaresTrabajo =
                    egresado.lugaresTrabajo;

            }


            lista.innerHTML += `

                <tr>

                    <td>${egresado.identificacion || ""}</td>

                    <td>${egresado.nombreCompleto || ""}</td>

                    <td>${egresado.correoElectronico || ""}</td>

                    <td>${egresado.telefono || ""}</td>

                    <td>${egresado.fechaRegistro || ""}</td>

                    <td>${lugaresTrabajo}</td>

                </tr>

            `;

        }


    } catch (error) {

        console.error(
            "Error al consultar egresados:",
            error
        );


        lista.innerHTML = `

            <tr>

                <td colspan="6">
                    No se pudieron cargar los egresados.
                </td>

            </tr>

        `;

    }

}

