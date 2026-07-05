function registrarCarrera() {

    let error = false;

    let codigo = document.getElementById("codigo").value;
    let nombre = document.getElementById("nombre").value;
    let escuela = document.getElementById("escuela").value;
    let grado = document.getElementById("grado").value;
    let descripcion = document.getElementById("descripcion").value;

    console.log("Código:", codigo);
    console.log("Nombre:", nombre);
    console.log("Escuela:", escuela);
    console.log("Grado:", grado);
    console.log("Descripción:", descripcion);

    if (codigo === "") {
        error = true;
    }

    if (nombre === "") {
        error = true;
    }

    if (escuela === "") {
        error = true;
    }

    if (grado === "") {
        error = true;
    }

    if (descripcion === "") {
        error = true;
    }

    if (error == true) {
        console.log("Error: faltan campos obligatorios.");
        alert("Debe rellenar todos los campos obligatorios.");
        return false;
    }

    console.log("Carrera registrada correctamente.");
    alert("Carrera registrada correctamente.");

    return true;
}