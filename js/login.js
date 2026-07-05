function iniciarSesion() {

    let error = false;

    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;

    console.log("Correo:", correo);
    console.log("Contraseña:", password);

    if (correo === "") {
        error = true;
    }

    if (password === "") {
        error = true;
    }

    if (error == true) {
        console.log("Error: faltan campos obligatorios.");
        alert("Debe rellenar todos los campos obligatorios.");
        return false;
    }

    console.log("Inicio de sesión exitoso.");
    alert("Inicio de sesión exitoso.");

    return true;
}