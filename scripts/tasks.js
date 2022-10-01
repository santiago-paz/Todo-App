// Si no se encuentra en localStorage información del usuario,
// no lo deja acceder a la página y redirige al login inmediatamente.
const jwt = localStorage.getItem("jwt");

if (!jwt) {
  // Usamos el replace para no guardar en el historial la url anterior
  location.replace("/");
}

AOS.init();
/* ------ Comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {

  const apiURL = "https://ctd-fe2-todo-v2.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */
  const btnCerrarSesion = this.document.getElementById("closeApp");
  btnCerrarSesion.addEventListener("click", function () {
    /* const confirmacionCerrarSesion = confirm("Desea cerrar sesión?"); */
    /* if (confirmacionCerrarSesion) {
      localStorage.removeItem("jwt");
      location.replace("./");
    } */

    Swal.fire({
      title: '¿Estás seguro que querés cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confimButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem("jwt");
        location.replace("./");
      }
    })
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */
  function obtenerNombreUsuario() {
    const url = `${apiURL}/users/getMe`,
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
    const url = `${apiURL}/tasks`,
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
        botonesCambioEstado()
        botonBorrarTarea()
      });
  }
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */
  const formCrearTarea = document.forms[0];
  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    const url = `${apiURL}/tasks`
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
    const contenedorTareasPendientes = document.getElementById('tareas_pendientes')
    const contenedorTareasTerminadas = document.getElementById('tareas_terminadas')

    contenedorTareasPendientes.innerHTML = "";
    contenedorTareasTerminadas.innerHTML = "";
    listado.forEach((tarea) => {
      const li = document.createElement("li");
      li.classList.add("tarea");
      if (tarea.completed) {
        li.setAttribute("data-aos", "fade-up");

        li.innerHTML = `<div class="hecha">
				<i class="fa-regular fa-circle-check"></i>
			</div>
			<div class="descripcion">
				<p class="nombre">${tarea.description}</p>
				<div class="cambios-estados">
					<button class="change completa" id="${tarea.id}"><i
							class="fa-solid fa-rotate-left"></i></button>
					<button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
				</div>
			</div>`;
        contenedorTareasTerminadas.appendChild(li);
      } else {
        li.setAttribute("data-aos", "fade-down");
        li.innerHTML = `<button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
			<div class="descripcion">
				<p class="nombre">${tarea.description}</p>
				<p class="timestamp">${tarea.createdAt}</p>
			</div>`;
        contenedorTareasPendientes.appendChild(li);
      }
    });

  }
  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll('.change');

    btnCambioEstado.forEach(boton => {
      //a cada boton le asignamos una funcionalidad
      boton.addEventListener('click', function (event) {
        const id = event.target.id;
        const url = `${apiURL}/tasks/${id}`
        const payload = {};

        if (event.target.classList.contains('completa')) {
          payload.completed = false;
        } else {
          payload.completed = true;
        }

        const settingsCambio = {
          method: 'PUT',
          headers: {
            "Authorization": jwt,
            "Content-type": "application/json"
          },
          body: JSON.stringify(payload)
        }

        fetch(url, settingsCambio)
          .then(response => {
            console.log(response.status);
            // Vuelvo a consultar las tareas actualizadas y pintarlas nuevamente en pantalla
            consultarTareas();
          })
      })
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    // Obtenemos los botones de borrado
    const btnBorrarTarea = document.querySelectorAll('.borrar');

    btnBorrarTarea.forEach(boton => {
      boton.addEventListener('click', function (event) {
        /* const deleteConfirmation = confirm('Estás seguro que querés borrar esta tarea?') */
        /* if (deleteConfirmation) { */

        Swal.fire({
          title: '¿Estás seguro que querés borrar esta tarea?',
          icon: 'question',
          showCancelButton: true,
          confimButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then(result => {
          if (result.isConfirmed) {
            const id = event.target.id;
            const url = `${apiURL}/tasks/${id}`

            const settingsCambio = {
              method: 'DELETE',
              headers: {
                "Authorization": jwt,
              }
            }
            fetch(url, settingsCambio)
              .then(response => {
                console.log(response.status);
                consultarTareas();
              })
          }
        })
      })
    });
  }
});
