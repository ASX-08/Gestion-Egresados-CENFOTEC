let formulario = document.querySelector("#formEgresado");
let mensaje = document.querySelector("#mensaje");
let lista = document.querySelector("#listaEgresados");

let indiceEditar = -1;

// Fecha actual
let hoy = new Date();

let año = hoy.getFullYear();
let mes = String(hoy.getMonth() + 1).padStart(2, "0");
let dia = String(hoy.getDate()).padStart(2, "0");

let fechaActual = año + "-" + mes + "-" + dia;

document.getElementById("fecha").value = fechaActual;

// Cargar tabla al abrir la página
mostrarEgresados();

formulario.addEventListener("submit", guardarEgresado);

function guardarEgresado(event){

    event.preventDefault();

    mensaje.className = "";
    mensaje.textContent = "";

    let identificacion = document.getElementById("identificacion").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let fecha = document.getElementById("fecha").value;
    let trabajo = document.getElementById("trabajo").value.trim();

    console.log("Identificación:", identificacion);
    console.log("Nombre:", nombre);
    console.log("Correo:", correo);
    console.log("Teléfono:", telefono);
    console.log("Fecha:", fecha);
    console.log("Trabajo:", trabajo);

    if(
        identificacion==="" ||
        nombre==="" ||
        correo==="" ||
        telefono==="" ||
        fecha===""){

        mensaje.className="error";
        mensaje.textContent="Debe rellenar todos los campos obligatorios.";
        return;
    }

    let regexCedula=/^[1-7]\d{8}$/;
    let regexCorreo=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let regexTelefono=/^\d{8}$/;

    if(!regexCedula.test(identificacion)){
        mensaje.className="error";
        mensaje.textContent="La cédula no es válida.";
        return;
    }

    if(!regexCorreo.test(correo)){
        mensaje.className="error";
        mensaje.textContent="Correo electrónico inválido.";
        return;
    }

    if(!regexTelefono.test(telefono)){
        mensaje.className="error";
        mensaje.textContent="El teléfono debe tener 8 dígitos.";
        return;
    }

    let egresado = {
        identificacion,
        nombre,
        correo,
        telefono,
        fecha,
        trabajo
    };

    let egresados = JSON.parse(localStorage.getItem("egresados")) || [];

    if(indiceEditar==-1){
        egresados.push(egresado);
    }else{
        egresados[indiceEditar]=egresado;
        indiceEditar=-1;
    }

    localStorage.setItem("egresados",JSON.stringify(egresados));

    mensaje.className="exito";
    mensaje.textContent="Registro guardado correctamente.";

    formulario.reset();

    document.getElementById("fecha").value=fechaActual;

    mostrarEgresados();
}

function mostrarEgresados() {

    let egresados = JSON.parse(localStorage.getItem("egresados")) || [];

    lista.innerHTML = "";

    for (let i = 0; i < egresados.length; i++) {

        lista.innerHTML += `
        <tr>

            <td>${egresados[i].identificacion}</td>
            <td>${egresados[i].nombre}</td>
            <td>${egresados[i].correo}</td>
            <td>${egresados[i].telefono}</td>
            <td>${egresados[i].fecha}</td>
            <td>${egresados[i].trabajo}</td>

            <td>

                <button class="editar" onclick="editarEgresado(${i})">
                    Editar
                </button>

                <button class="eliminar" onclick="eliminarEgresado(${i})">
                    Eliminar
                </button>

            </td>

        </tr>
        `;
    }

}

function eliminarEgresado(indice) {

    let egresados = JSON.parse(localStorage.getItem("egresados")) || [];

    if (confirm("¿Desea eliminar este egresado?")) {

        egresados.splice(indice, 1);

        localStorage.setItem("egresados", JSON.stringify(egresados));

        mostrarEgresados();

        mensaje.className = "exito";
        mensaje.textContent = "Egresado eliminado correctamente.";

    }

}

function editarEgresado(indice) {

    let egresados = JSON.parse(localStorage.getItem("egresados")) || [];

    let egresado = egresados[indice];

    document.getElementById("identificacion").value = egresado.identificacion;
    document.getElementById("nombre").value = egresado.nombre;
    document.getElementById("correo").value = egresado.correo;
    document.getElementById("telefono").value = egresado.telefono;
    document.getElementById("fecha").value = egresado.fecha;
    document.getElementById("trabajo").value = egresado.trabajo;

    indiceEditar = indice;

    mensaje.className = "exito";
    mensaje.textContent = "Modifique los datos y presione Guardar Egresado.";

}