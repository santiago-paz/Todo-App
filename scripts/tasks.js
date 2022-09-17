// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const jwt = localStorage.getItem("jwt");

if (!jwt) {
  // usamos el replace para no guardar en el historial la url anterior
  location.replace("/");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */

  const btnCerrarSesion = this.document.getElementById("closeApp");
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    const confirmacionCerrarSesion = confirm("Desea cerrar sesión?");

    if (confirmacionCerrarSesion) {
      localStorage.removeItem("jwt");
      location.replace("./");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const url = "https://ctd-todo-api.herokuapp.com/v1/users/getMe",
      configuraciones = {
        method: "GET",
        headers: {
          authorization: jwt,
        },
      };

    fetch(url, configuraciones)
      .then((respuesta) => respuesta.json())
      .then((data) => {
        console.log(data);
        document.getElementById(
          "username"
        ).innerText = `${data.firstName} ${data.lastName}`;
      });
  }
  obtenerNombreUsuario();

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const url = "https://ctd-todo-api.herokuapp.com/v1/tasks",
      configuraciones = {
        method: "GET",
        headers: {
          authorization: jwt,
        },
      };

    fetch(url, configuraciones)
      .then((respuesta) => respuesta.json())
      .then((data) => {
        renderizarTareas(data)
      });
  }
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  const formCrearTarea = document.forms[0];
  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    const url = "https://ctd-todo-api.herokuapp.com/v1/tasks";
    const inputDescription = document.getElementById("nuevaTarea");

    configuraciones = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify({
        description: inputDescription.value,
        completed: false,
      }),
    };

    inputDescription.value = ""
    inputDescription.focus();

    fetch(url, configuraciones)
      .then((response) => response.json())
      .then((data) => {
        consultarTareas()
      });
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {


  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {}

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {}
});
