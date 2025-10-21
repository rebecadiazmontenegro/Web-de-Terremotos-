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

// Función para guardar usuarios en Firestore y que se cree la colección

function createUser(usuario) {
  db.collection("users-terremotos")
    .add(usuario)
    .then((docRef) => {
      console.log("Usuario guardado con ID:", docRef.id);
    })
    .catch((error) => {
      console.error("Error al guardar el usuario:", error);
      });
    }

// -------------------------------------------------------------------------------------------------------------------------------

// SIGN UP

const signUpUser = (email, password, name) => {
  firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(`Se ha registrado ${user.email}`);
        Swal.fire(`Se ha registrado ${user.email}`);

      // Guardar en Firestore con nombre
      createUser({
        id: user.uid,
        email: user.email,
        name: name
      });
    })
    .catch((error) => {
      console.log("Error en el sistema: " + error.message, "Error: " + error.code);
      alert("Error: " + error.message);
    });
};



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

  contenedor.addEventListener("submit", (event) => {
    event.preventDefault();

    // Formulario de registro
    if (event.target.classList.contains("registroUsuario")) { 
      const name = event.target.elements.name.value;
      const email = event.target.elements.email.value;
      const pass = event.target.elements.pass.value;
      const pass2 = event.target.elements.pass2.value;
    
      if (pass === pass2 && pass.length >= 6) { 
        signUpUser(email, pass, name);
        contenedor.innerHTML = "";

      } else {
        Swal.fire({
          icon: "error",
          title: "Contraseña no válida",
          text: "La contraseña debe tener al menos 6 dígitos",
        });
      }
    }

    // Formulario de login
    if (event.target.classList.contains("loginUser")) { 
      const email = event.target.elements.emailLog.value;
      const password = event.target.elements.passwordLog.value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(`Sesión iniciada: ${user.email}`);
          Swal.fire(`Sesión iniciada: ${user.email}`);

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
                Swal.fire("Sesión cerrada correctamente");
                contenedor.innerHTML = "";
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
  });
});



// -------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------ MAPA 1 ------------------------------------------
let map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Llamada a la API de terremotos

async function getData() {
    try{
        const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        const data = await response.json();
        return data.features;
    }
    catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }
}

function getColorByMag(mag) {
    if(mag < 1) return '#f0f0f0';
    if(mag < 2) return '#1e881a';
    if(mag < 3) return '#8f911c';
    if(mag < 4) return '#faf115';
    if(mag < 5) return '#f6cf1e';
    if(mag < 6) return '#fb9d16';
    if(mag < 7) return '#f51919';
    return '#f71afa';
}

getData().then(data => {

    console.log(data)

    data.map(pin => {
        const pinCoordenadas = [pin.geometry.coordinates[1],pin.geometry.coordinates[0]];

        const fecha = new Date(pin.properties.time); // Transforma los segundos en una fecha normal
        const fechaFormateada = fecha.toLocaleString('es-ES', { //Lo convierte en strings y lo pasa al español
            dateStyle: 'short', // Formato corto de fecha
            timeStyle: 'short'  // Formato corto de hora
        });

        const titulo = pin.properties.title;
        const tituloSolo = titulo.split(" - ")[0]; //Se queda solo con la primera parte del string

        const marcador = L.circleMarker(pinCoordenadas, {
            radius: 8, // tamaño del pin
            fillColor: getColorByMag(pin.properties.mag), // color según la magnitud
            color: "#000", // borde negro
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`
            <p>${tituloSolo}</p>
            <p>${fechaFormateada}</p>
            <p>${pin.properties.place}</p>
            <p>${pin.properties.code}</p>
            <p>${pin.properties.magType}</p>
            <button class='favBoton'>Añadir a favoritos</button>
        `).addTo(map);

        marcador.on("popupopen", () => {
            const favBoton = document.querySelector('.favBoton');
            if(favBoton){
                //Logica para añadir favoritos al objeto del usuario
                favBoton.addEventListener("click", () => {
                    alert("favorito guardado");
                })
            }
        });
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

        marcador.on("popupopen", (e) => {
            const popup = e.popup.getElement();
            const favBoton = popup.querySelector('.favBoton');
            if (favBoton) {
                favBoton.addEventListener("click", () => {
                    alert("Favorito guardado");
                });
            }
        });
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
    }

    mostrarTerremotos(data);
}

filtroMag.addEventListener('change', aplicarFiltros); // Para que se cambie cada vez que cambiamos la magnitud en el desplegable
filtroFecha.addEventListener('submit', (e) => { 
    e.preventDefault();
    aplicarFiltros();
});

getData().then(data => mostrarTerremotos(data));
