const marvel = {
  render: async () => {
    const URL_API_MARVEL = "https://gateway.marvel.com:443/v1/public/";
    const { MD5 } = CryptoJS;
    const [publicKey, privateKey] = ['f9b5a753184542779e73cafdc27fd8cd', '45114c84af1f858c5b4985489dc546b330164c60'];
    let offset = 0;

    const getTimestamp = () => new Date().getTime();
    const createHash = () => MD5(`${getTimestamp()}${privateKey}${publicKey}`).toString();
    const createParams = () => `characters?limit=20&offset=${offset}&ts=${getTimestamp()}&apikey=${publicKey}&hash=${createHash()}`;

    const container = document.querySelector('#marvel-row');
    let contentHTML = '';

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
  }
};

marvel.render();
