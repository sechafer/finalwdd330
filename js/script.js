const settings = {
  async: true,
  crossDomain: true,
  url: 'https://seeking-alpha.p.rapidapi.com/articles/v2/list?size=20&number=1&category=latest-articles',
  method: 'GET',
  headers: {
      'x-rapidapi-key': 'd76e96be04mshb6bfdb8c4178973p19b5bajsn6adaa687028d',
      'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
  }
};

$.ajax(settings).done(function (response) {
  console.log(response); // Esto imprimirá el JSON en la consola

  const newsContainer = $('#news-container');
  const articles = response.data.slice(0, 6);
  const baseUrl = 'https://seekingalpha.com'; // Dominio base

  articles.forEach(article => {
      const articleLink = baseUrl + article.links.self;
      const hasImage = article.attributes.gettyImageUrl; // Verifica si hay una imagen
      const imageHTML = hasImage ? `<img src="${article.attributes.gettyImageUrl}" class="card-img-top" alt="Article Image">` : '';

      const newsHTML = `
          <div class="col-md-4 news-article">
              <div class="card">
                  ${imageHTML} <!-- Solo muestra la imagen si existe -->
                  <div class="card-body">
                      <h3 class="card-title">${article.attributes.title}</h3>
                      <p class="card-text">${new Date(article.attributes.publishOn).toLocaleDateString()}</p>
                      <a href="${articleLink}" class="btn btn-primary" target="_blank">Read More</a>
                  </div>
              </div>
          </div>
      `;
      newsContainer.append(newsHTML);
  });
});