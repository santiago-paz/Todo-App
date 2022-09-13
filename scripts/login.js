// evaluar si hay un token para mandarlo directo a sus tareas
window.addEventListener("load", function () {
  const form = document.forms[0];
  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");

    event.preventDefault();

    const usuario = {
      email: inputEmail.value,
      password: inputPassword.value,
    };

    realizarLogin(usuario);
  });

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(user) {
    const apiURL = "https://ctd-todo-api.herokuapp.com/v1/users/login";

    const configuraciones = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };

    fetch(apiURL, configuraciones)
      .then((respuesta) => respuesta.json())
      .then((respuesta) => {
        if (respuesta.jwt) {
          localStorage.setItem("jwt", respuesta.jwt);
          location.replace("/mis-tareas.html");
        }
      });
  }
});
