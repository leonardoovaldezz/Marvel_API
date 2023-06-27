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
      latitude: 19.4144,
      longitude: -99.0284
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
      latitude: 19.4059,
      longitude: -98.9925
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

    // Iterar sobre los superhéroes y crear marcadores en el mapa para cada ubicación
    for (const superheroKey in superheroes) {
      const superhero = superheroes[superheroKey];
      const { latitude, longitude } = superhero.location;
      const superheroMarker = createMarker(latitude, longitude, superhero.name).addTo(map);
    }
  } catch (error) {
    console.error("Error al obtener la geolocalización:", error);
  }
};

renderMap();