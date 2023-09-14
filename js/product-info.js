document.addEventListener("DOMContentLoaded", function () {
  const nuevoID = localStorage.getItem("prodID");
  const productoInfoURL = `https://japceibal.github.io/emercado-api/products/${nuevoID}.json`;
  const comentariosURL = `https://japceibal.github.io/emercado-api/products_comments/${nuevoID}.json`;

  // Obtener información del producto
  fetch(productoInfoURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar la información del producto.");
      }
      return response.json();
    })
    .then((productoData) => {
      console.log(productoData);
      const datosElement = document.getElementById("datosproducto");

      let contenidoHTML = `
        <h3>${productoData.name}</h3>
        <p><b>Precio</b></p>
        <p>${productoData.cost} ${productoData.currency}</p>
        <p><b>Descripción</b></p>
        <p>${productoData.description}</p>
        <p><b>Categoría</b></p>
        <p>${productoData.category}</p>
        <p><b>Cantidad de vendidos</b></p>
        <p>${productoData.soldCount} unidades vendidas</p>
        <p><b>Imágenes ilustrativas</b></p>
      `;

      // Agregar las imágenes al contenido
      if (productoData.images && productoData.images.length > 0) {
        contenidoHTML += '<div class="imagenes-producto">';
        productoData.images.forEach((image) => {
          contenidoHTML += `<img src="${image}" alt="Imagen ilustrativa">`;
        });
        contenidoHTML += "</div>";
      }

      // Establecer el contenido completo en el elemento
      datosElement.innerHTML = contenidoHTML;

      // Obtener y mostrar los comentarios
      fetch(comentariosURL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al cargar los comentarios.");
          }
          return response.json();
        })
        .then((comentariosData) => {
          console.log(comentariosData);
          const comentariosElement = document.getElementById(
            "comentarios-container"
          );

          // Limpiar el contenido de comentarios antes de agregar nuevos
          comentariosElement.innerHTML = "";

          // Iterar sobre los comentarios y mostrarlos
          comentariosData.forEach((comentario) => {
            const estrellasHTML = getStarsHtml(comentario.score);
            const comentarioHTML = `
              <div class="comentario">
                <div class="usuario">${comentario.user}</div>
                <div class="fecha">${comentario.dateTime}</div>
                <div class="puntuacion">
                  <div class="estrellas-container">${estrellasHTML}</div>
                </div>
                <div class="descripcion">${comentario.description}</div>
              </div>
            `;
            comentariosElement.innerHTML += comentarioHTML;
          });
        })
        .catch((error) => {
          console.error("Error al cargar los comentarios:", error);
        });
    })
    .catch((error) => {
      console.error("Error al cargar la información del producto:", error);
    });

  // Función para obtener el HTML de las estrellas según el puntaje
  function getStarsHtml(score) {
    const maxScore = 5;
    const filledStars = "★".repeat(score);
    const emptyStars = "☆".repeat(maxScore - score);
    return filledStars + emptyStars;
  }
});

// Función para actualizar el contador de caracteres restantes
document.getElementById("textarea").addEventListener("input", function () {
  var maxCaracteres = 250; //Establecemos la cantidad máxima permitida de caracteres
  var texto = this.value; // Obtener el valor del <textarea> actual
  var caracteresRestantes = maxCaracteres - texto.length;

  // Actualiza el contador en la página
  document.getElementById("contador").textContent = caracteresRestantes;

  // Limita la longitud del texto en el textarea
  if (caracteresRestantes < 0) {
    this.value = texto.slice(0, maxCaracteres);
    caracteresRestantes = 0;
    document.getElementById("contador").textContent = caracteresRestantes;
  }
});

/* Tomamos datos del comentario*/
const url =
  "https://jsonplaceholder.typicode.com/users"; /* Aca guardo en una variable la url donde voy a enviar los datos */
const commentForm = document.querySelector("#comentar");
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const score = document.querySelector("#mi-puntuacion").value;
  const comentario = document.querySelector("#textarea").value;
  const fechaActual = new Date();
  const formatoFechaHora = fechaActual
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // Formatear la fecha y hora en "aaaa-mm-dd hh:mm:ss"

  /* Traemos el local storage donde está el nombre del usuario logueado */
  const usuarioAlmacenado = localStorage.getItem("nameUsr");
  /* reutilizamos la función de las estrellas */
  function getStarsHtml(score) {
    const maxScore = 5;
    const filledStars = "★".repeat(score);
    const emptyStars = "☆".repeat(maxScore - score);
    return filledStars + emptyStars;
  }
  // Definir los datos que deseas enviar
  if (usuarioAlmacenado) {
    const datosAEnviar = {
      score: score,
      description: comentario,
      user: usuarioAlmacenado, // Asigna el nombre de usuario almacenado
      dateTime: formatoFechaHora,
    };
    const promesa = {
      method: "POST" /* Declaro el metodo que quiero usar */,
      Headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        datosAEnviar
      ) /* Convierto todos los datos a string del objeto */,
    };
    fetch(url, promesa)
      .then((Response) => {
        if (!Response.ok) {
          throw new Error("fallo el envio");
        }
        return Response.json();
      })
      .then((datos) => {
        console.log("respuesta del servidor", datosAEnviar);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }
});
