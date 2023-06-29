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
    const createHash = (timestamp) =>
      MD5(`${timestamp}${privateKey}${publicKey}`).toString();
    const createParams = () =>
      `characters?limit=20&offset=${offset}&ts=${getTimestamp()}&apikey=${publicKey}&hash=${createHash(getTimestamp())}`;

    const container = document.querySelector("#marvel-row");
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");
    let allCharacters = []; // Variable para almacenar todos los personajes cargados

    const fetchCharacters = async () => {
      const response = await fetch(`${URL_API_MARVEL}${createParams()}`);
      const { data } = await response.json();
      return data.results;
    };

    const renderCharacters = (characters) => {
      let contentHTML = "";
      for (const { urls, name, thumbnail, description, comics, series, stories, events } of characters) {
        const urlHero = urls[0].url;
        contentHTML += `
              <tr class="trDatos">
                <td>
                  <div class="card mb-3 mx-auto"> <!-- Agregado "mx-auto" para centrar la tarjeta -->
                    <div class="row g-0">
                      <div class="col-md-4">
                        <img src="${thumbnail.path.replace("http", "https")}.${thumbnail.extension}" class="img-fluid rounded-start" alt="${name}" id="${name}">
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 id="h5_${name}" class="card-title display-4 text-center">${name}</h5>
                          <p class="card-text">${description ? description : 'No hay descripción'}</p>
                          <p class="card-text"><small class="text-muted">
                            ${comics.available} Comic(s) disponible(s).<br />
                            ${series.available} Serie(s) disponible(s).<br />
                            ${stories.available} Historia(s) disponible(s).<br />
                            ${events.available} Evento(s) disponible(s).<br />
                          </small></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>`;
      }
      container.innerHTML = contentHTML;
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
      const searchTerm = searchInput.value.toLowerCase().trim();

      if (searchTerm === "") {
        Swal.fire({
          title: "Campo de búsqueda vacío",
          text: "Por favor, ingresa un término de búsqueda.",
          icon: "warning",
        });
        return;
      }

      const timestamp = getTimestamp();
      const hash = createHash(timestamp);
      const params = `characters?nameStartsWith=${searchTerm}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

      const response = await fetch(`${URL_API_MARVEL}${params}`);
      const { data } = await response.json();
      const filteredCharacters = data.results;

      if (filteredCharacters.length === 0) {
        Swal.fire({
          title: "Personaje no encontrado",
          text:
            "Por favor, ingresa correctamente el nombre del personaje y vuelve a intentarlo.",
          icon: "error",
        });
        return;
      }

      renderCharacters(filteredCharacters);
    };

    searchButton.addEventListener("click", searchCharacters);

    const loadMoreCharacters = async () => {
      offset += 20;
      const previousScrollPosition = window.pageYOffset; // Obtener la posición actual de desplazamiento

      const newCharacters = await fetchCharacters();
      allCharacters = allCharacters.concat(newCharacters);
      renderCharacters(allCharacters);

      // Obtener el primer elemento agregado después de cargar los nuevos personajes
      const firstNewCharacterElement = container.children[allCharacters.length - newCharacters.length];

      // Desplazarse hacia el primer elemento agregado
      firstNewCharacterElement.scrollIntoView({ behavior: "auto" });

      // Actualizar la posición de desplazamiento anterior con respecto al primer elemento agregado
      const newScrollPosition = window.pageYOffset + firstNewCharacterElement.getBoundingClientRect().top;
      window.scrollTo({ top: newScrollPosition, left: 0 });
    };

    const loadMoreButton = document.querySelector("#load-more-button");
    loadMoreButton.addEventListener("click", loadMoreCharacters);

    const initialCharacters = await fetchCharacters();
    allCharacters = initialCharacters;
    renderCharacters(allCharacters);

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
            Swal.fire({
              title: "Superhéroe más cercano",
              html: `El superhéroe más cercano a tu ubicación es: <b>${closestSuperhero.name}</b>`,
              icon: "info",
              confirmButtonText: "Ver más",
              showCancelButton: true,
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                // Aquí puedes realizar acciones adicionales si el usuario confirma
                // Por ejemplo, redirigir a una página de detalles del superhéroe más cercano
                const closestSuperheroElement = document.getElementById(closestSuperhero.name);
                closestSuperheroElement.scrollIntoView({ behavior: "smooth" });
              }
            });
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

const superheroes = {
  "3DMan": {
    name: "3-D Man",
    location: {
      latitude: 19.4088,
      longitude: -99.0160
    }
  },
  aBomb: {
    name: "A-Bomb (HAS)",
    location: {
      latitude: 19.4059,
      longitude: -98.9925
    }
  },
  aim: {
    name: "A.I.M.",
    location: {
      latitude: 19.4206,
      longitude: -99.0694
    }
  },
  aaronStack: {
    name: "Aaron Stack",
    location: {
      latitude: 19.4043,
      longitude: -99.0515
    }
  },
  emilBlonsky: {
    name: "Abomination (Emil Blonsky)",
    location: {
      latitude: 19.4069,
      longitude: -99.0134
    }
  },
  ultimateAbomination: {
    name: "Abomination (Ultimate)",
    location: {
      latitude: 19.4224,
      longitude: -99.0156
    }
  },
  absorbingMan: {
    name: "Absorbing Man",
    location: {
      latitude: 19.4193,
      longitude: -98.9787
    }
  },
  abyss: {
    name: "Abyss",
    location: {
      latitude: 19.4065,
      longitude: -98.9607
    }
  },
  abyssAgeApocalypse: {
    name: "Abyss (Age of Apocalypse)",
    location: {
      latitude: 19.4323,
      longitude: -99.0102
    }
  },
  adamDestine: {
    name: "Adam Destine",
    location: {
      latitude: 19.4342,
      longitude: -99.0107
    }
  },
  adamWarlock: {
    name: "Adam Warlock",
    location: {
      latitude: 19.4463,
      longitude: -99.0328
    }
  },
  aegis: {
    name: "Aegis (Trey Rollins)",
    location: {
      latitude: 19.4144,
      longitude: -99.0284
    }
  },
  aero: {
    name: "Aero (Aero)",
    location: {
      latitude: 19.4172,
      longitude: -98.9549
    }
  },
  agathaHarkness: {
    name: "Agatha Harkness",
    location: {
      latitude: 19.4125,
      longitude: -99.0326
    }
  },
  agentBrand: {
    name: "Agent Brand",
    location: {
      latitude: 19.4160,
      longitude: -99.0460
    }
  },
  agentX: {
    name: "Agent X (Nijo)",
    location: {
      latitude: 19.4034,
      longitude: -99.0133
    }
  },
  agentZero: {
    name: "Agent Zero",
    location: {
      latitude: 19.4080,
      longitude: -99.0027
    }
  },
  agentsOfAtlas: {
    name: "Agents of Atlas",
    location: {
      latitude: 19.4088,
      longitude: -99.0160
    }
  },
  aginar: {
    name: "Aginar",
    location: {
      latitude: 19.4052,
      longitude: -99.0346
    }
  },
  airWalker: {
    name: "Air-Walker (Gabriel Lan)",
    location: {
      latitude: 19.4172,
      longitude: -98.9549
    }
  }
  // Agrega más superhéroes y sus ubicaciones aquí...
};

const geocodeApiKey = "e795af272354441ca0c66afc46eff58f";

const createMap = (latitude, longitude) => {
  const mapContainer = document.getElementById("map");
  const map = L.map(mapContainer).setView([latitude, longitude], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  return map;
};

const createMarker = (latitude, longitude, title) => {
  return L.marker([latitude, longitude]).bindPopup(`<b>${title}</b>`);
};

const fetchUserLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getAddressFromCoordinates = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?key=${geocodeApiKey}&q=${latitude},${longitude}`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    const { formatted } = data.results[0];
    return formatted;
  } else {
    throw new Error("No se encontró ninguna dirección para las coordenadas proporcionadas.");
  }
};

const renderMap = async () => {
  try {
    const userPosition = await fetchUserLocation();
    const { latitude, longitude } = userPosition.coords;

    const userAddress = await getAddressFromCoordinates(latitude, longitude);
    console.log("Dirección:", userAddress);

    const map = createMap(latitude, longitude);

    // Agregar un marcador en la ubicación del usuario con la dirección como etiqueta
    const userLocationMarker = createMarker(latitude, longitude, userAddress).addTo(map).openPopup();

    const returnToUserLocation = () => {
      console.log("Haciendo clic en el botón de regresar");
      map.setView([latitude, longitude], 15);
      userLocationMarker.openPopup();
    };

    const returnButton = document.getElementById("return-button");
    returnButton.addEventListener("click", returnToUserLocation);

    const redirectToSuperhero = (superheroName) => {
      const confirmed = confirm(`¿Deseas ver a ${superheroName}?`);

      if (confirmed) {
        location.href = `#${superheroName}`;
      }
    };

    // Iterar sobre los superhéroes y crear marcadores en el mapa para cada ubicación
    for (const superheroKey in superheroes) {
      const superhero = superheroes[superheroKey];
      const { latitude, longitude } = superhero.location;

      const superheroMarker = createMarker(latitude, longitude, superhero.name).addTo(map);
      superheroMarker.superheroName = superhero.name;

      let clickCount = 0;

      superheroMarker.on("click", () => {
        clickCount++;

        if (clickCount === 2) {
          const clickedSuperheroName = superheroMarker.superheroName;
          redirectToSuperhero(clickedSuperheroName);
        }
      });
    }

  } catch (error) {
    console.error("Error al obtener la geolocalización:", error);
  }
};

renderMap();

//Scroll para subir
const scrollToTopButton = document.querySelector("#scroll-to-top");

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 500) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
});