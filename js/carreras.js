let formulario = document.querySelector("#formCarrera");
let mensaje = document.querySelector("#mensaje");
let lista = document.querySelector("#listaCarreras");

let indiceEditar = -1;

mostrarCarreras();

formulario.addEventListener("submit", guardarCarrera);

function guardarCarrera(event){

    event.preventDefault();

    mensaje.className = "";
    mensaje.textContent = "";

    let codigo = document.getElementById("codigo").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let escuela = document.getElementById("escuela").value.trim();
    let grado = document.getElementById("grado").value;
    let descripcion = document.getElementById("descripcion").value.trim();

    console.log("Código:", codigo);
    console.log("Nombre:", nombre);
    console.log("Escuela:", escuela);
    console.log("Grado:", grado);
    console.log("Descripción:", descripcion);

    if(
        codigo === "" ||
        nombre === "" ||
        escuela === "" ||
        grado === "" ||
        descripcion === ""
    ){

        mensaje.className = "error";
        mensaje.textContent = "Debe completar todos los campos.";
        return;
    }

    let carrera = {
        codigo,
        nombre,
        escuela,
        grado,
        descripcion
    };

    let carreras = JSON.parse(localStorage.getItem("carreras")) || [];

    if(indiceEditar == -1){
        carreras.push(carrera);
    }else{
        carreras[indiceEditar] = carrera;
        indiceEditar = -1;
    }

    localStorage.setItem("carreras", JSON.stringify(carreras));

    mensaje.className = "exito";
    mensaje.textContent = "Carrera registrada correctamente.";

    formulario.reset();

    mostrarCarreras();
}

function mostrarCarreras() {

    let carreras = JSON.parse(localStorage.getItem("carreras")) || [];

    lista.innerHTML = "";

    for (let i = 0; i < carreras.length; i++) {

        lista.innerHTML += `
        <tr>

            <td>${carreras[i].codigo}</td>
            <td>${carreras[i].nombre}</td>
            <td>${carreras[i].escuela}</td>
            <td>${carreras[i].grado}</td>
            <td>${carreras[i].descripcion}</td>

            <td>

                <button class="editar" onclick="editarCarrera(${i})">
                    Editar
                </button>

                <button class="eliminar" onclick="eliminarCarrera(${i})">
                    Eliminar
                </button>

            </td>

        </tr>
        `;
    }

}

function eliminarCarrera(indice) {

    let carreras = JSON.parse(localStorage.getItem("carreras")) || [];

    if (confirm("¿Desea eliminar esta carrera?")) {

        carreras.splice(indice, 1);

        localStorage.setItem("carreras", JSON.stringify(carreras));

        mostrarCarreras();

        mensaje.className = "exito";
        mensaje.textContent = "Carrera eliminada correctamente.";

    }

}

function editarCarrera(indice) {

    let carreras = JSON.parse(localStorage.getItem("carreras")) || [];

    let carrera = carreras[indice];

    document.getElementById("codigo").value = carrera.codigo;
    document.getElementById("nombre").value = carrera.nombre;
    document.getElementById("escuela").value = carrera.escuela;
    document.getElementById("grado").value = carrera.grado;
    document.getElementById("descripcion").value = carrera.descripcion;

    indiceEditar = indice;

    mensaje.className = "exito";
    mensaje.textContent = "Modifique los datos y presione Guardar Carrera.";

}