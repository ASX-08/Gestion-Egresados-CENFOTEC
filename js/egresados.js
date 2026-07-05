function registrarEgresado() {

    let error = false;

    let identificacion = document.getElementById("identificacion").value;
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let fecha = document.getElementById("fecha").value;
    let trabajo = document.getElementById("trabajo").value;

    // Consola
    console.log("Identificación:", identificacion);
    console.log("Nombre:", nombre);
    console.log("Correo:", correo);
    console.log("Teléfono:", telefono);
    console.log("Fecha:", fecha);
    console.log("Lugar de trabajo:", trabajo);

  
   if (identificacion === "") {
    error = true;
}

if (nombre === "") {
    error = true;
}

if (correo === "") {
    error = true;
}

if (telefono === "") {
    error = true;
}

if (fecha === "") {
    error = true;
}

if (error == true) {
    alert("Debe rellenar todos los campos obligatorios.");
    return false;
}

    // Validación de cédula costarricense
    if (identificacion !== "") {

        if (identificacion.length != 9 || isNaN(identificacion)) {
            alert("La cédula debe tener exactamente 9 números.");
            error = true;
        } else {

            let provincia = identificacion.charAt(0);

            if (provincia < 1 || provincia > 7) {
                alert("La cédula no pertenece a una provincia válida de Costa Rica.");
                error = true;
            }

        }

    }

    if (error == true) {
        return false;
    }
 console.log("Egresado registrado correctamente.");

    alert("Egresado registrado correctamente.");
    return true;

}

// Fecha actual
let hoy = new Date();

let año = hoy.getFullYear();
let mes = String(hoy.getMonth() + 1).padStart(2, "0");
let dia = String(hoy.getDate()).padStart(2, "0");

let fechaActual = año + "-" + mes + "-" + dia;

document.getElementById("fecha").value = fechaActual;