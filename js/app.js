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
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");

    const fetchCharacters = async () => {
      const response = await fetch(`${URL_API_MARVEL}${createParams()}`);
      const { data } = await response.json();
      return data.results;
    };

    const renderCharacters = (characters) => {
      let contentHTML = "";
      for (const { urls, name, thumbnail } of characters) {
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
    };

    const superheroes = {
      "3DMan": {
        name: "3-D Man",
        location: {
          latitude: 19.2970,
          longitude: -99.6352

        }
      },
      aBomb: {
        name: "A-Bomb (HAS)",
        location: {
          latitude: 19.4326,
          longitude: -99.1332
        }
      },
      aim: {
        name: "A.I.M.",
        location: {
          latitude: 19.4326,
          longitude: -99.1332
        }
      },
      // Agrega más superhéroes y sus ubicaciones aquí...
    };

    const findClosestSuperhero = (userLatitude, userLongitude) => {
      let closestSuperhero = null;
      let closestDistance = Infinity;

      for (const superheroKey in superheroes) {
        const superhero = superheroes[superheroKey];
        const superheroLatitude = superhero.location.latitude;
        const superheroLongitude = superhero.location.longitude;

        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          superheroLatitude,
          superheroLongitude
        );

        if (distance < closestDistance) {
          closestSuperhero = superhero;
          closestDistance = distance;
        }
      }

      return closestSuperhero;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const earthRadius = 6371;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;

      return distance;
    };

    const toRadians = (degrees) => {
      return degrees * (Math.PI / 180);
    };

    const searchCharacters = async () => {
      const characters = await fetchCharacters();
      const searchTerm = searchInput.value.toLowerCase();
      const filteredCharacters = characters.filter((character) =>
        character.name.toLowerCase().includes(searchTerm)
      );
      if (filteredCharacters.length === 0) {
        alert("No se encontraron coincidencias.");
        location.reload(); // Recargar la página
      }
      renderCharacters(filteredCharacters);
    };

    searchButton.addEventListener("click", searchCharacters);

    const characters = await fetchCharacters();
    renderCharacters(characters);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;

          const closestSuperhero = findClosestSuperhero(
            userLatitude,
            userLongitude
          );

          if (closestSuperhero) {
            console.log(
              "El superhéroe más cercano es:",
              closestSuperhero.name
            );
            // Aquí puedes utilizar la API de Marvel para obtener más información sobre el superhéroe más cercano
            // y mostrarla en tu aplicación
          } else {
            console.log("No se encontró ningún superhéroe cercano.");
          }
        },
        (error) => {
          console.error("Error al obtener la geolocalización:", error);
        }
      );
    } else {
      console.error("Geolocalización no compatible");
    }
  },
};

marvel.render();



//MAPA
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
