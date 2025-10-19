
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

        const marcador = L.marker(pinCoordenadas)
            .bindPopup(`
                <p>${tituloSolo}</p>
                <p>${fechaFormateada}</p>
                <p>${pin.properties.place}</p>
                <p>${pin.properties.code}</p>
                <p>${pin.properties.magType}</p>
                <button class='favBoton'>Añadir a favoritos</button>`)
            .addTo(map);

        marcador.on("popupopen", () => {
            const favBoton = document.querySelector('.favBoton');
            if(favBoton){
                favBoton.addEventListener("click", () => {
                    alert("favorito guardado") //Cambiar por Sweet alert
                })
            }
        })
        
    })
})