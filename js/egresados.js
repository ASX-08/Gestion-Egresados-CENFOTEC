let formulario = document.querySelector("#formEgresado");
let mensaje = document.querySelector("#mensaje");
let lista = document.querySelector("#listaEgresados");

let editando = false;
let identificacionOriginal = "";

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
// GUARDAR / EDITAR EGRESADO
// ==========================================

async function guardarEgresado(event) {

    event.preventDefault();

    mensaje.className = "";
    mensaje.textContent = "";

    // Obtener datos

    let identificacion =
        document.getElementById("identificacion").value.trim();

    let nombre =
        document.getElementById("nombre").value.trim();

    let correo =
        document.getElementById("correo").value.trim();

    let telefono =
        document.getElementById("telefono").value.trim();

    let fecha =
        document.getElementById("fecha").value;

    let trabajo =
        document.getElementById("trabajo").value.trim();


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
    // VALIDAR CÉDULA
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

    let regexCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    // SI ESTAMOS EDITANDO
    // ==========================================

    if (editando) {

        let egresadosLocal =
            JSON.parse(
                localStorage.getItem("egresados") || "[]"
            );

        let posicion = egresadosLocal.findIndex(
            function (egresado) {
                return egresado.identificacion === identificacionOriginal;
            }
        );

        if (posicion !== -1) {

            egresadosLocal[posicion] = {

                identificacion: identificacion,

                nombreCompleto: nombre,

                correoElectronico: correo,

                telefono: telefono,

                fechaRegistro: fecha,

                lugaresTrabajo:
                    trabajo !== "" ? [trabajo] : []

            };

            localStorage.setItem(
                "egresados",
                JSON.stringify(egresadosLocal)
            );
        }

        mensaje.className = "exito";

        mensaje.textContent =
            "Egresado actualizado correctamente.";

        editando = false;
        identificacionOriginal = "";

        formulario.reset();

        document.getElementById("fecha").value =
            fechaActual;

        document.getElementById("btnGuardar").textContent =
            "Guardar Egresado";

        await mostrarEgresados();

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
    // ==========================================

    if (trabajo !== "") {

        egresado.lugaresTrabajo = [trabajo];

    }


    // ==========================================
    // ENVIAR POST AL BACKEND
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
        // COMPROBAR RESPUESTA
        // ==========================================

        if (!respuesta.ok) {

            throw new Error(
                datos.mensajeError ||
                datos.error ||
                "No se pudo registrar el egresado."
            );

        }


        // ==========================================
        // GUARDAR TAMBIÉN EN LOCALSTORAGE
        // ==========================================

        let egresadosLocal =
            JSON.parse(
                localStorage.getItem("egresados") || "[]"
            );

        egresadosLocal.push(datos);

        localStorage.setItem(
            "egresados",
            JSON.stringify(egresadosLocal)
        );


        // ==========================================
        // MENSAJE DE ÉXITO
        // ==========================================

        mensaje.className = "exito";

        mensaje.textContent =
            "Egresado registrado correctamente.";


        // Limpiar formulario

        formulario.reset();


        // Colocar fecha nuevamente

        document.getElementById("fecha").value =
            fechaActual;


        // Actualizar tabla

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


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron consultar los egresados."
            );

        }


        let egresados = await respuesta.json();


        lista.innerHTML = "";


        // ==========================================
        // MOSTRAR CADA EGRESADO
        // ==========================================

        for (let i = 0; i < egresados.length; i++) {

            let egresado = egresados[i];

            let lugaresTrabajo = "";

            if (
                Array.isArray(
                    egresado.lugaresTrabajo
                )
            ) {

                lugaresTrabajo =
                    egresado.lugaresTrabajo.join(", ");

            } else if (
                egresado.lugaresTrabajo
            ) {

                lugaresTrabajo =
                    egresado.lugaresTrabajo;

            }


            lista.innerHTML += `

                <tr>

                    <td>
                        ${egresado.identificacion || ""}
                    </td>

                    <td>
                        ${egresado.nombreCompleto || ""}
                    </td>

                    <td>
                        ${egresado.correoElectronico || ""}
                    </td>

                    <td>
                        ${egresado.telefono || ""}
                    </td>

                    <td>
                        ${egresado.fechaRegistro || ""}
                    </td>

                    <td>
                        ${lugaresTrabajo}
                    </td>

                    <td>

                        <button
                            class="editar"
                            onclick="editarEgresado('${egresado.identificacion}')">
                            Editar
                        </button>

                        <button
                            class="eliminar"
                            onclick="eliminarEgresado('${egresado.identificacion}')">
                            Eliminar
                        </button>

                    </td>

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

                <td colspan="7">
                    No se pudieron cargar los egresados.
                </td>

            </tr>

        `;

    }
}


// ==========================================
// EDITAR EGRESADO
// ==========================================

function editarEgresado(identificacion) {

    let egresadosLocal =
        JSON.parse(
            localStorage.getItem("egresados") || "[]"
        );


    let egresado =
        egresadosLocal.find(
            function (item) {
                return item.identificacion === identificacion;
            }
        );


    if (!egresado) {

        mensaje.className = "error";

        mensaje.textContent =
            "No se encontró el egresado en LocalStorage.";

        return;
    }


    // ==========================================
    // CARGAR DATOS EN EL FORMULARIO
    // ==========================================

    document.getElementById("identificacion").value =
        egresado.identificacion || "";

    document.getElementById("nombre").value =
        egresado.nombreCompleto || "";

    document.getElementById("correo").value =
        egresado.correoElectronico || "";

    document.getElementById("telefono").value =
        egresado.telefono || "";

    document.getElementById("fecha").value =
        egresado.fechaRegistro || fechaActual;


    if (
        Array.isArray(
            egresado.lugaresTrabajo
        )
    ) {

        document.getElementById("trabajo").value =
            egresado.lugaresTrabajo.join(", ");

    } else {

        document.getElementById("trabajo").value =
            egresado.lugaresTrabajo || "";

    }


    editando = true;

    identificacionOriginal =
        identificacion;


    document.getElementById("btnGuardar").textContent =
        "Actualizar Egresado";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// ELIMINAR EGRESADO
// ==========================================

function eliminarEgresado(identificacion) {

    let confirmar =
        confirm(
            "¿Está seguro de eliminar este egresado?"
        );


    if (!confirmar) {

        return;

    }


    let egresadosLocal =
        JSON.parse(
            localStorage.getItem("egresados") || "[]"
        );


    egresadosLocal =
        egresadosLocal.filter(
            function (egresado) {

                return egresado.identificacion !==
                    identificacion;

            }
        );


    localStorage.setItem(
        "egresados",
        JSON.stringify(egresadosLocal)
    );


    mensaje.className = "exito";

    mensaje.textContent =
        "Egresado eliminado correctamente.";


    mostrarEgresados();

}


