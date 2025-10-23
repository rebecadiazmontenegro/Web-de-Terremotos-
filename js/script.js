const firebaseConfig = {
    apiKey: "AIzaSyCxDmYsOau4FBT0PfobJ_1jevkQPVk1XQ8",
    authDomain: "fir-web-589d4.firebaseapp.com",
    projectId: "fir-web-589d4",
    storageBucket: "fir-web-589d4.firebasestorage.app",
    messagingSenderId: "674609037037",
    appId: "1:674609037037:web:f1a54da2f2f49de812d6e4"
  }; // Son los datos de conexion, con esto accedes al firebase

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi base de datos //inicia Firestore

// -------------------------------------------------------------------------------------------------------------------------------

// Función para guardar usuarios en Firestore y que se cree la colección ---------------------------------------------------------

  function createUser(usuario) {
  db.collection("users-terremotos")
    .doc(usuario.id) 
    .set({
      email: usuario.email,
      name: usuario.name,
      favoritos: [] // Para poder añadir favoritos
    })
    .then(() => {
      console.log("Usuario guardado con ID:", usuario.id);
    })
    .catch((error) => {
      console.error("Error al guardar el usuario:", error);
    });
}

// -------------------------------------------------------------------------------------------------------------------------------

// SIGN UP --------------------------------------------------

const signUpUser = (email, password, name) => {
  firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(`Se ha registrado ${user.email}`);
        Swal.fire({
          icon: "success",
          title: "Registro completado",
          text: `Se ha registrado ${user.email}.`
        });
    

      // Guardar en Firestore con nombre
      createUser({
        id: user.uid,
        email: user.email,
        name: name
      });

      return firebase.auth().signOut();

    })
    
    .catch((error) => {
      console.log("Error en el sistema: " + error.message, "Error: " + error.code);
      alert("Error: " + error.message);
    });
};

// SIGN IN Y SIGN OUT --------------------------------------------------

const signInAndOutUser = (email,password) => {
  const contenedor = document.getElementById("contenedor-form");
  const registrarBtn = document.getElementById("registrar");
  const loginBtn = document.getElementById("login");

  firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(`Sesión iniciada: ${user.email}`);
          Swal.fire({
            icon: "success",
            title: "Bienvenido!",
            text: "Has iniciado sesión."
          });

          registrarBtn.style.display = "none";
          loginBtn.style.display = "none";

          contenedor.innerHTML = `
            <aside class="bienvenida">
            <h3>¡Bienvenido, ${user.email}!</h3>
            <button id="botonLogOut" type="submit">Desconectar</button>
            </aside>
          `;

    // Cerrar sesion
    document.getElementById("botonLogOut").addEventListener("click", () => {
      firebase.auth().signOut()
        .then(() => {
          console.log(`Sesión cerrada ${user.email}`);
          Swal.fire({
            icon: "success",
            title: "¡Adios!",
            text: "Has cerrado sesión."
          });
          contenedor.innerHTML = "";

          registrarBtn.style.display = "inline-block";
          loginBtn.style.display = "inline-block";
        })
              
        .catch((error) => {
          Swal.fire("Error al cerrar sesión: " + error.message);
        });
    });
  })
        .catch((error) => {
          Swal.fire("Error de login: " + error.message);
  });
}

//Para que salga siempre lo de bienvenido y el boton de desconectas y no se vaya cuando recargues
firebase.auth().onAuthStateChanged((user) => {
    window.usuarioActual = user ? user : null;

    const contenedor = document.getElementById("contenedor-form");
    const registrarBtn = document.getElementById("registrar");
    const loginBtn = document.getElementById("login");

    if (user) {
        // Ocultar botones de login/registro
        registrarBtn.style.display = "none";
        loginBtn.style.display = "none";

        // Mostrar mensaje de bienvenida y botón de logout
        contenedor.innerHTML = `
            <aside class="bienvenida">
                <h3>¡Bienvenido, ${user.email}!</h3>
                <button id="botonLogOut" type="submit">Desconectar</button>
            </aside>
        `;

        // Evento de logout
        document.getElementById("botonLogOut").addEventListener("click", () => {
            firebase.auth().signOut()
                .then(() => {
                    Swal.fire({
                      icon: "success",
                      title: "¡Adios!",
                      text: "Has cerrado sesión."
                    });
                    contenedor.innerHTML = "";
                    registrarBtn.style.display = "inline-block";
                    loginBtn.style.display = "inline-block";
                })
                .catch((error) => {
                    Swal.fire("Error al cerrar sesión: " + error.message);
                });
        });
    } else {
        // Si no hay usuario logueado, mostrar botones
        registrarBtn.style.display = "inline-block";
        loginBtn.style.display = "inline-block";
        contenedor.innerHTML = "";
    }
});


// -------------------------------------------------------------------------------------------------------------------------------

// Crear formulario cuando le das al boton de crear o login -----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-form");

  document.getElementById("registrar").addEventListener("click", () => {
    contenedor.innerHTML = `
      <p>Crea una cuenta</p>
      <form class="registroUsuario">
        <label>Nombre de usuario</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Introduce tu nombre de usuario"
          required
        />
        <p id="mensajeName"></p>
        <label>Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Introduce tu correo electrónico" 
          required
        />
        <label>Password:</label>
        <input 
          type="password"
          id="pass"
          name="pass"
          placeholder="Introduce password..."
          required
        />
        <p id="mensajePass"></p>
        <label>Repite password:</label>
        <input
          type="password"
          id="pass2"
          name="pass2"
          placeholder="Repite password..."
          required
        />
        <button class="botonCrear" type="submit">Crear</button>
      </form>
    `;
  });

  document.getElementById("login").addEventListener("click", () => {
    contenedor.innerHTML = `
      <p>Log In</p>
      <form class="loginUser">
        <label>Correo electrónico</label>
        <input
          type="email"
          id="emailLog"
          name="emailLog"
          placeholder="Introduce tu correo electrónico"
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          id="passwordLog"
          name="passwordLog"
          placeholder="Introduce tu contraseña"
          required
        />
        <button class="botonEnviar" type="submit">Enviar</button>
      </form>
    `;
  });

  //Todos las funciones de logIn, SingUp y SingOut van aqui metidas
  contenedor.addEventListener("submit", (event) => {
    event.preventDefault();

    // Formulario de registro
    if (event.target.classList.contains("registroUsuario")) { 
      const name = event.target.elements.name.value.trim();
      const email = event.target.elements.email.value;
      const pass = event.target.elements.pass.value;
      const pass2 = event.target.elements.pass2.value;

      const nameInput = document.getElementById("name");
      const passInput = document.getElementById("pass");

      const mensajeName = document.getElementById("mensajeName");
      const mensajePass = document.getElementById("mensajePass");

      // Regex
      const regexName = /^(?!\s*$).+/; // No solo espacios
      const regexPass = /^[A-Za-z\d]{6,}$/; 
      // Al menos una mayúscula, una minúscula, un número y mínimo 6 caracteres

      // Validar nombre
      if (!regexName.test(name)) {
          Swal.fire({
                icon: "error",
                title: "Nombre no válido",
                text: "El nombre debe tener al menos un carácter",
            });
        return;
      }

      // Validar contraseña
      if (!regexPass.test(pass)) {
        Swal.fire({
                icon: "error",
                title: "Contraseña no es válida",
                text: "La contraseña debe tener números, letras y un mínimo de 6 carácteres",
            });
        return;
      }

      // Confirmar contraseña
      if (pass !== pass2) {
        Swal.fire({
          icon: "error",
          title: "Contraseña no coincide",
          text: "Las contraseñas deben coincidir",
        });
        return;
      }

      // Si todo es válido, crear usuario
      signUpUser(email, pass, name);
      contenedor.innerHTML = "";
    }

    // Formulario de login
    if (event.target.classList.contains("loginUser")) { 
      const email = event.target.elements.emailLog.value;
      const password = event.target.elements.passwordLog.value;
      signInAndOutUser(email, password);
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------- MAPA 1 ---------------------------------------------------------

let map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
{
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Variable global para guardar todos los terremotos cargados
let allEarthquakes = [];

// Llamada a la API de terremotos (solo se ejecutará una vez)
async function getData() {
    try {
        const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await response.json();
        return data.features;
    } catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }
}

// Función para colorear según magnitud
function getColorByMag(mag) {
    if (mag < 1) return '#f0f0f0';
    if (mag < 2) return '#1e881a';
    if (mag < 3) return '#8f911c';
    if (mag < 4) return '#faf115';
    if (mag < 5) return '#f6cf1e';
    if (mag < 6) return '#fb9d16';
    if (mag < 7) return '#f51919';
    return '#f71afa';
}

// Función que muestra todos los terremotos en el mapa
function mostrarTodosLosTerremotos(data) {
    // Limpia los pines anteriores
    map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    // Dibuja los nuevos pines
    data.forEach(pin => {
        const pinCoordenadas = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]];
        const fecha = new Date(pin.properties.time);
        const fechaFormateada = fecha.toLocaleString('es-ES', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        const tituloSolo = pin.properties.title.split(" - ")[0];

        const marcador = L.circleMarker(pinCoordenadas, {
            radius: 8,
            fillColor: getColorByMag(pin.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`
            <p>${tituloSolo}</p>
            <p>${fechaFormateada}</p>
            <p>${pin.properties.place}</p>
            <p>${pin.properties.code}</p>
            <p>${pin.properties.magType}</p>
            <a href = "${pin.properties.url}" target=_blank>Pulsa aquí para acceder al punto</a>
            <button class='favBoton'>Añadir a favoritos</button>
        `).addTo(map);

        marcador.on("popupopen", (e) => {
            const popup = e.popup.getElement();
            const favBoton = popup.querySelector('.favBoton');
            if (favBoton) {
                const user = firebase.auth().currentUser;
                if (!user) {
                    favBoton.style.display = "none"; // Oculta el botón si no hay login
                } else {
                    favBoton.addEventListener("click", () => {
                        addFavorite(pin);
                    });
                }
            }
        });
    });
}
// Cargar datos una sola vez al inicio
getData().then(data => {
    allEarthquakes = data; // Guardar los terremotos en memoria
    mostrarTodosLosTerremotos(data); // Llama a la función de mostras
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------

//Función para que cuando le des a favorito se mande a FireBase -----------------------------------------------------------------------------------------
function addFavorite(pin) {
    const user = firebase.auth().currentUser; // Usuario logueado
    if (!user) {
        Swal.fire({
          icon: "error",
          title: "Error en Log In",
          text: "Debes estar logueado para poder guardar favoritos",
        });
        return;
    }
    const pinData = {
        id: pin.id,
        title: pin.properties.title,
        place: pin.properties.place,
        mag: pin.properties.mag,
        time: pin.properties.time,
        coordinates: pin.geometry.coordinates,
        link: pin.properties.url
    };

    const userRef = db.collection("users-terremotos").doc(user.uid);

    // Primero obtenemos los favoritos actuales
    userRef.get()
        .then(doc => {
            if (!doc.exists) {
                // Si no existe el documento, lo creamos
                userRef.set({ favoritos: [pinData] })
                    .then(() => 
                      Swal.fire({
                      icon: "success",
                      title: "Terremoto añadido",
                      text: "Tu terremoto favorito ha sido guardado."
                      })
                  );
                return;
            }

            const favoritos = doc.data().favoritos || [];

            // Comprobamos si ya existe
            const yaFavorito = favoritos.some(fav => fav.id === pinData.id);
            if (yaFavorito) {
                Swal.fire({
                    icon: "info",
                    title: "Ya existe",
                    text: "Este terremoto ya está en tus favoritos"
                });
                return;
            }

            // Si no existe, lo añadimos
            userRef.update({
                favoritos: firebase.firestore.FieldValue.arrayUnion(pinData)
            })
            .then(() => 
                      Swal.fire({
                      icon: "success",
                      title: "Terremoto añadido",
                      text: "Tu terremoto favorito ha sido guardado."
                      }))
            .catch(error => {
                console.error("Error al añadir favorito:", error);
                Swal.fire("Error al guardar favorito: " + error.message);
            });
        })
        .catch(error => {
            console.error("Error al leer usuario:", error);
        });
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------

//Para ocultar el boton de mostrar pines favoritos en el mapa -------------------------------------------------------------------------------------------

const favTerremotos = document.getElementById('favTerremotos');
const actualizarFavBtn = (user) => {
    if (user) {
        favTerremotos.style.display = 'inline-block'; 
    } else {
        favTerremotos.style.display = 'none'; 
    }
}

// Llamamos a esta función cada vez que cambia el estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
    window.usuarioActual = user ? user : null;
    actualizarFavBtn(user);
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------

// Función para mostrar solo los favoritos en el mapa ---------------------------------------------------------------------------------------------------

const botonFavTerremotos = document.getElementById('favTerremotos');
botonFavTerremotos.addEventListener('click', mostrarFavoritos);

async function mostrarFavoritos() {
  const user = firebase.auth().currentUser;

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Error de sesión",
      text: "Debes iniciar sesión para ver tus favoritos"
    });
    return;
  }
    Swal.fire({
      icon: "success",
      title: "Mapa actualizado",
      text: "Mostrando tu terremotos favoritos."
    })

  const userRef = db.collection("users-terremotos").doc(user.uid); //Llama a la colección

  try {
    const doc = await userRef.get(); //Llama a los datos dentro de la colección

    if (!doc.exists || !doc.data().favoritos || doc.data().favoritos.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin favoritos",
        text: "No tienes terremotos guardados"
      });
      return;
    }

    const favoritos = doc.data().favoritos;

    // Esto impia pines previos antes de mostrar solo los favoritos
    map.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    favoritos.forEach(pin => {
      const pinCoordenadas = [pin.coordinates[1], pin.coordinates[0]];
      const fecha = new Date(pin.time);
      const fechaFormateada = fecha.toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      // Crear marcador con botón para eliminar
      const marcador = L.circleMarker(pinCoordenadas, {
        radius: 8,
        fillColor: getColorByMag(pin.mag), //Funcion que ya hemos creado antes
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`
        <div class="popup-content">
          <p><strong>${pin.title.split(" - ")[0]}</strong></p>
          <p>${fechaFormateada}</p>
          <p>${pin.place}</p>
          <p>Magnitud: ${pin.mag}</p>
          <button class="eliminarFavBoton">Eliminar de favoritos</button>
        </div>
      `).addTo(map);

      // Evento para el botón de eliminar
      marcador.on("popupopen", (e) => {
        const popup = e.popup.getElement();
        const eliminarBtn = popup.querySelector('.eliminarFavBoton');
        if (eliminarBtn) {
          eliminarBtn.addEventListener("click", () => {
            removeFavorite(pin.id, marcador);
          });
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar favoritos:", error);
    Swal.fire("Error al mostrar favoritos: " + error.message);
  }
}


// Para eliminar un favorito del pin y de firebase
async function removeFavorite(pinId, marcador) {
  const user = firebase.auth().currentUser;
  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Error de sesión",
      text: "Debes iniciar sesión para eliminar favoritos"
    });
    return;
  }

  const userRef = db.collection("users-terremotos").doc(user.uid);

  try {
    const doc = await userRef.get();
    if (!doc.exists) return;

    const favoritos = doc.data().favoritos || [];
    const nuevosFavoritos = favoritos.filter(fav => fav.id !== pinId);

    await userRef.update({ favoritos: nuevosFavoritos });

    map.removeLayer(marcador);

    Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "Terremoto eliminado de tus favoritos"
    });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    Swal.fire("Error al eliminar favorito: " + error.message);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------

// Función para mostrar de nuevo el mapa con todo ---------------------------------------------------------------------------------------------------

const botonAllTerremotos = document.getElementById("allTerremotos");

botonAllTerremotos.addEventListener("click", () => {
    if (allEarthquakes.length === 0) {
        Swal.fire("No hay datos cargados aún");
        return;
    }

    mostrarTodosLosTerremotos(allEarthquakes);

    Swal.fire({
        icon: "success",
        title: "Mapa actualizado",
        text: "Se muestran todos los terremotos del día."
    });
});


// ------------------------------------------ MAPA 2 ------------------------------------------

let mapTwo = L.map('mapTwo').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapTwo);

async function getData() {
    try {
        const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await response.json();
        return data.features;
    } catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }
}

function getColorByMag(mag) {
    if (mag < 1) return '#f0f0f0';
    if (mag < 2) return '#1e881a';
    if (mag < 3) return '#8f911c';
    if (mag < 4) return '#faf115';
    if (mag < 5) return '#f6cf1e';
    if (mag < 6) return '#fb9d16';
    if (mag < 7) return '#f51919';
    return '#f71afa';
}

function mostrarTerremotos(data) { //Esta funcion se añade para que no se mezclen los pines
    mapTwo.eachLayer(layer => { //Elimina los pines anteriores para que no colapse con los nuevos
        if (layer instanceof L.CircleMarker) mapTwo.removeLayer(layer);
    });

    data.forEach(pin => {
        const pinCoordenadas = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]];
        const fecha = new Date(pin.properties.time);
        const fechaFormateada = fecha.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
        const tituloSolo = pin.properties.title.split(" - ")[0];

        const marcador = L.circleMarker(pinCoordenadas, {
            radius: 8,
            fillColor: getColorByMag(pin.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`
            <div class="popup-content">
                <p><strong>${tituloSolo}</strong></p>
                <p>${fechaFormateada}</p>
                <p>${pin.properties.place}</p>
                <p>Magnitud: ${pin.properties.mag} (${pin.properties.magType})</p>
            </div>
        `).addTo(mapTwo);
    });
}

// ------- Filtrado -------

//Llamamos a los formulario
const filtroMag = document.getElementById('filtroMag');
const filtroFecha = document.getElementById('filtroFecha');

async function aplicarFiltros() {
    let data = await getData(); //Llamamos a la función que hemos creado antes

    const valorMag = filtroMag.value; //En la variable guardamos lo que el usuario elija en el selector
    if (valorMag !== "magAll") { //Si el valor no es todos pasa lo siguiente
        const min = parseInt(valorMag); 
        const max = min + 1; //Le sumas 1 al valor minimo para que se cree el rango
        if (valorMag === "7") { //Si el valor es igual a 7 significa que sera mayor que 7
            data = data.filter(d => d.properties.mag >= 7); //Filtra todas las magnitudes mayores o iguales a 7
        } else {
            data = data.filter(d => d.properties.mag >= min && d.properties.mag < max); //Se fintran todos los terremotos que esten entre el minimo y el maximo del rango seleccionado
        }

        if (data.length === 0) {
          Swal.fire({
              icon: "info",
              title: "Sin resultados",
              text: "No se encontraron terremotos con los filtros seleccionados"
          });
          return; 
         }

        Swal.fire({
            icon: "success",
            title: "Filtro aplicado",
            text: `Se encontraron ${data.length} resultados`
        });
    }


    const fechaComienzoInput = document.getElementById('fechaComienzo').value;
    const fechaFinInput = document.getElementById('fechaFinal').value;

    if (fechaComienzoInput && fechaFinInput) {
        const fechaInicio = new Date(fechaComienzoInput);
        fechaInicio.setHours(0,0,0,0); 
        const fechaFin = new Date(fechaFinInput);
        fechaFin.setHours(23,59,59,999); // Si no se ponen las horas solo coge los ocurridos exactamente a media noche

        data = data.filter(d => {
            const terremotoFecha = new Date(d.properties.time);
            return terremotoFecha >= fechaInicio && terremotoFecha <= fechaFin; //Devuelve en base a los datos recibidos los que esten entres los dos parametros
        });
        if (data.length === 0) {
          Swal.fire({
              icon: "info",
              title: "Sin resultados",
              text: "No se encontraron terremotos con los filtros seleccionados"
          });
          return; 
         }

        Swal.fire({
            icon: "success",
            title: "Filtro aplicado",
            text: `Se encontraron ${data.length} resultados`
        });
    
    }

    mostrarTerremotos(data);
}

filtroMag.addEventListener('change', aplicarFiltros); // Para que se cambie cada vez que cambiamos la magnitud en el desplegable
filtroFecha.addEventListener('submit', (e) => { 
    e.preventDefault();
    aplicarFiltros();
});

getData().then(data => mostrarTerremotos(data));
