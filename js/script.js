document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.getElementById('home-link');
    const comparisonLink = document.getElementById('comparison-link');
    const alertsLink = document.getElementById('alerts-link');
    const favoritesLink = document.getElementById('favorites-link');

    const homeSection = document.getElementById('home-section');
    const comparisonSection = document.getElementById('comparison-section');
    const alertsSection = document.getElementById('alerts-section');
    const favoritesSection = document.getElementById('favorites-section');

    homeLink.addEventListener('click', () => showSection(homeSection));
    comparisonLink.addEventListener('click', () => showSection(comparisonSection));
    alertsLink.addEventListener('click', () => showSection(alertsSection));
    favoritesLink.addEventListener('click', () => showSection(favoritesSection));

    function showSection(section) {
        homeSection.style.display = 'none';
        comparisonSection.style.display = 'none';
        alertsSection.style.display = 'none';
        favoritesSection.style.display = 'none';
        section.style.display = 'block';
    }

    // Load initial data
    loadStockData();

    async function loadStockData() {
        const url = 'https://real-time-finance-data.p.rapidapi.com/stock-time-series-source-2?symbol=AAPL&period=1D';
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '09db4c897bmshb4182a425da0a1ap181b81jsnd2a13f91e193',
            'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
          }
        };
    
        try {
          const response = await fetch(url, options);
          const result = await response.json();
          updateStockData(result.data);
          updateStockChart(result.data);
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      }

    function updateStockData(data) {
        const stockDataDiv = document.getElementById('stock-data');
        stockDataDiv.innerHTML = `
            <p>Symbol: ${data.symbol}</p>
            <p>Exchange: ${data.exchange}</p>
            <p>Type: ${data.type}</p>
            <p>Current Price: $${data.price}</p>
            <p>Day Low: $${data.day_low}</p>
            <p>Day High: $${data.day_high}</p>
            <p>Year Low: $${data.year_low}</p>
            <p>Year High: $${data.year_high}</p>
            <p>Currency: ${data.currency}</p>
            <p>Volume: ${data.volume}</p>
            <p>Previous Close: $${data.previous_close}</p>
            <p>Change: $${data.change}</p>
            <p>Change Percent: ${(data.change_percent * 100).toFixed(2)}%</p>
        `;
    }

    function updateStockChart(data) {
        const labels = data.time_series.map(item => moment(item.datetime, "YYYY-MM-DD HH:mm:ss"));
        const prices = data.time_series.map(item => item.close);
      
        const ctx = document.getElementById('stock-chart').getContext('2d');
      
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `${data.symbol} Stock Price`,
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'minute',
                  displayFormats: {
                    minute: 'HH:mm'
                  }
                }
              }
            }
          }
        });
      }

      

    // Local Storage for Favorites
    function addFavorite(symbol) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.includes(symbol)) {
            favorites.push(symbol);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
    }

    function displayFavorites() {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoritesDataDiv = document.getElementById('favorites-data');
        favoritesDataDiv.innerHTML = favorites.map(symbol => `<p>${symbol}</p>`).join('');
    }

    displayFavorites();
});