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
            const result = await response.json();  // Change to .json() to parse JSON data
            updateStockData(result);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }

    function updateStockData(data) {
        const stockDataDiv = document.getElementById('stock-data');
        stockDataDiv.innerHTML = `
            <p>Current Price: $${data.currentPrice}</p>
            <p>High: $${data.high}</p>
            <p>Low: $${data.low}</p>
            <p>Open: $${data.open}</p>
            <p>Close: $${data.close}</p>
            <p>Volume: ${data.volume}</p>
        `;
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