function compararContrasenias(contrasenia_1, contrasenia_2) {
  return contrasenia_1 === contrasenia_2;
}

window.addEventListener("load", function () {
  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  const form = document.forms[0]
  form.addEventListener("submit", function (event) {
    const nombre = document.getElementById("inputNombre"),
      apellido = document.getElementById("inputApellido"),
      email = document.getElementById("inputEmail"),
      password = document.getElementById("inputPassword"),
      passwordRepetida = document.getElementById("inputPasswordRepetida");

    event.preventDefault();

    const payload = {
      firstName: nombre.value,
      lastName: apellido.value,
      email: email.value,
      password: password.value,
    };

    if (compararContrasenias(password.value, passwordRepetida.value)) {
      realizarRegister(payload);
    } else {
      alert('Error: Las contraseñas no coinciden.')
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(settings) {
    const configuraciones = {
      method: "POST",
      body: JSON.stringify(settings),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("https://ctd-fe2-todo-v2.herokuapp.com/v1/users", configuraciones)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Alguno de los datos es incorrecto");
        }
      })
      .then(function (response) {
        if (response.jwt) {
          localStorage.setItem("jwt", response.jwt);
          location.replace("./mis-tareas.html");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
