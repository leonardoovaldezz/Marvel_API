const marvel = {
  render: async () => {
    const URL_API_MARVEL = "https://gateway.marvel.com:443/v1/public/";
    const { MD5 } = CryptoJS;
    const [publicKey, privateKey] = [
      "f9b5a753184542779e73cafdc27fd8cd",
      "45114c84af1f858c5b4985489dc546b330164c60",
    ];
    let offset = 0;

    const getTimestamp = () => new Date().getTime();
    const createHash = () =>
      MD5(`${getTimestamp()}${privateKey}${publicKey}`).toString();
    const createParams = () =>
      `characters?limit=20&offset=${offset}&ts=${getTimestamp()}&apikey=${publicKey}&hash=${createHash()}`;

    const container = document.querySelector("#marvel-row");
    let contentHTML = "";

    const response = await fetch(`${URL_API_MARVEL}${createParams()}`);
    const { data } = await response.json();

    for (const { urls, name, thumbnail } of data.results) {
      const urlHero = urls[0].url;
      contentHTML += `
        <div class="col-md-4">
            <a href="${urlHero}" target="_blank">
                <img src="${thumbnail.path}.${thumbnail.extension}" alt="${name}" class="img-thumbnail">
            </a>
            <h3 class="title">${name}</h3>
        </div>`;
    }

    container.innerHTML = contentHTML;
  },
};

marvel.render();

const geocodeApiKey = "e795af272354441ca0c66afc46eff58f";

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?key=${geocodeApiKey}&q=${latitude},${longitude}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const { formatted } = data.results[0];
        console.log("Dirección:", formatted);

        const mapElement = document.getElementById("map");

        const map = L.map(mapElement).setView([latitude, longitude], 15);

        // Agregar capa de mapa base de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "Map data © OpenStreetMap contributors",
        }).addTo(map);

        // Agregar un marcador en la ubicación con la dirección como etiqueta
        const userLocationMarker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(formatted)
          .openPopup();

        const returnToUserLocation = () => {
          console.log("Haciendo clic en el botón de regresar");
          map.setView([latitude, longitude], 15);
          userLocationMarker.openPopup();
        };

        const returnButton = document.getElementById("return-button");
        returnButton.addEventListener("click", returnToUserLocation);


        mapElement.appendChild(returnButton);

      } else {
        console.log(
          "No se encontró ninguna dirección para las coordenadas proporcionadas."
        );
      }
    },
    (error) => {
      console.error("Error al obtener la geolocalización:", error);
    }
  );
} else {
  console.error("Geolocalización no compatible");
}
