const marvel = {
  render: () => {
    const URL_API_MARVEL = "https://gateway.marvel.com:443/v1/public/";
    const KEY_PUBLICA = 'f9b5a753184542779e73cafdc27fd8cd';
    const KEY_PRIVADA = '45114c84af1f858c5b4985489dc546b330164c60';
    let marcaTiempo = '';
    let parametros = '';
    let html = '';
    let url = '';
    let offset = 0; 

    function marcarTiempo() {
      marcaTiempo = new Date().getTime();
    }

    function crearHash() {
      return CryptoJS.MD5(marcaTiempo + KEY_PRIVADA + KEY_PUBLICA).toString();
    }

    function crearParametros() {
      marcarTiempo();
      parametros = '';
      parametros += 'characters?limit=20&offset=' + offset + '&ts=';
      parametros += marcaTiempo;
      parametros += '&apikey=';
      parametros += KEY_PUBLICA;
      parametros += '&hash=';
      parametros += crearHash();
      url = URL_API_MARVEL + parametros;
    }

    const container = document.querySelector('#marvel-row');
    let contentHTML = '';

    crearParametros();

    fetch(url)
      .then(res => res.json())
      .then((json) => {
        for (const hero of json.data.results) {
          let urlHero = hero.urls[0].url;
          contentHTML += `
            <div class="col-md-4">
                <a href="${urlHero}" target="_blank">
                  <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" class="img-thumbnail">
                </a>
                <h3 class="title">${hero.name}</h3>
            </div>`;
        }
        container.innerHTML = contentHTML;
      });
  }
};

marvel.render();
