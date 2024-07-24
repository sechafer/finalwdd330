$(document).ready(function() {
    // Verifica si es la primera vez que se accede
    if (!localStorage.getItem('visited')) {
      $('#welcomeMessage').html('<div class="alert alert-info">Welcome to the Finance Search Page!</div>');
      localStorage.setItem('visited', 'true');
    }
  
    // Muestra el historial de búsquedas si existe
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (history.length > 0) {
      updateHistoryDisplay(history);
    }
  
    // Cargar y mostrar 10 símbolos aleatorios
    $.getJSON('data/constituents.json', function(data) {
      const randomCompanies = getRandomCompanies(data, 10);
      let htmlContent = `<div class="table-responsive">
                          <table class="table table-striped">
                            <thead class="thead-dark">
                              <tr>
                                <th scope="col">Symbol</th>
                                <th scope="col">Security</th>
                              </tr>
                            </thead>
                            <tbody>`;
  
      randomCompanies.forEach(company => {
        htmlContent += `<tr>
                          <td>${company.Symbol}</td>
                          <td>${company.Security}</td>
                        </tr>`;
      });
  
      htmlContent += `</tbody></table></div>`;
      $('#randomSymbols').html(htmlContent);
  
      // Agrega el evento click a cada fila
      $('#randomSymbols tbody tr').on('click', function() {
        const symbol = $(this).find('td:first').text();
        $('#symbols').val(symbol);
        $('#stockForm').submit(); // Simula el clic en el botón de envío del formulario
      });
    }).fail(function() {
      $('#randomSymbols').html('<div class="alert alert-danger">Failed to load company data.</div>');
    });
  
    $('#stockForm').on('submit', function(event) {
      event.preventDefault(); // Previene el comportamiento por defecto del formulario
  
      // Obtén los símbolos del formulario
      const symbolsInput = $('#symbols').val();
      const symbols = symbolsInput.split(',').map(symbol => symbol.trim()).join(',');
  
      // Configuración para la llamada AJAX
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://seeking-alpha.p.rapidapi.com/symbols/get-profile?symbols=${symbols}`,
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'd76e96be04mshb6bfdb8c4178973p19b5bajsn6adaa687028d',
          'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
        }
      };
  
      // Llamada AJAX
      $.ajax(settings).done(function(response) {
        const profiles = response.data;
        let htmlContent = `<div class="table-responsive">
                            <table class="table table-striped">
                              <thead class="thead-dark">
                                <tr>
                                  <th scope="col">ID</th>
                                  <th scope="col">Company Name</th>
                                  <th scope="col">Sector</th>
                                  <th scope="col">Market Cap</th>
                                  <th scope="col">Employees</th>
                                  <th scope="col">Last Price</th>
                                  <th scope="col">Volume</th>
                                </tr>
                              </thead>
                              <tbody>`;
  
        profiles.forEach(profile => {
          const attributes = profile.attributes;
          htmlContent += `<tr>
                            <th scope="row">${profile.id}</th>
                            <td>${attributes.companyName}</td>
                            <td>${attributes.sectorname}</td>
                            <td>${attributes.marketCap}</td>
                            <td>${attributes.numberOfEmployees}</td>
                            <td>${attributes.lastDaily.last}</td>
                            <td>${attributes.lastDaily.volume}</td>
                          </tr>`;
        });
  
        htmlContent += `</tbody></table></div>`;
        $('#profiles').html(htmlContent);
  
        // Guardar la búsqueda en el historial
        if (!history.includes(symbols)) {
          history.push(symbols);
          localStorage.setItem('searchHistory', JSON.stringify(history));
          updateHistoryDisplay(history);
        }
      });
    });
  
    // Actualiza la visualización del historial
    function updateHistoryDisplay(history) {
      let historyHtml = '';
      history.forEach((entry, index) => {
        historyHtml += `<div class="history-item" data-index="${index}">
                          <span>${entry}</span>
                          <span class="delete-btn" data-index="${index}">❌</span>
                        </div>`;
      });
      $('#searchHistory').html(historyHtml);
  
      // Maneja clic en elementos del historial
      $('.history-item').on('click', function() {
        const symbols = $(this).text().trim().split('❌')[0];
        $('#symbols').val(symbols);
        $('#stockForm').submit(); // Simula el clic en el botón de envío del formulario
      });
  
      // Maneja clic en botones de eliminación
      $('.delete-btn').on('click', function(event) {
        event.stopPropagation(); // Previene que el clic en el botón de eliminación también active el clic en el contenedor
        const index = $(this).data('index');
        history.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateHistoryDisplay(history);
      });
    }
  
    // Función para obtener n elementos aleatorios de una lista
    function getRandomCompanies(data, n) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    }
  });