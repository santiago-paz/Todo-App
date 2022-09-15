function compararContrasenias(contrasenia_1, contrasenia_2) {
  return contrasenia_1 === contrasenia_2;
}

window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */

  const form = document.forms[0],
    nombre = document.getElementById("inputNombre"),
    apellido = document.getElementById("inputApellido"),
    email = document.getElementById("inputEmail"),
    password = document.getElementById("inputPassword"),
    passwordRepetida = document.getElementById("inputPasswordRepetida");

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
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
      alert('Las contraseñas no son iguales.')
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

    fetch("https://ctd-todo-api.herokuapp.com/v1/users", configuraciones)
      /* .then(function(response) {
        return response.json()
      }) */
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Alguno de los datos es incorrecto");
        }
      })
      .then(function (jsonResponse) {
        if (jsonResponse.jwt) {
          localStorage.setItem("jwt", jsonResponse.jwt);
          location.replace("./mis-tareas.html");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
