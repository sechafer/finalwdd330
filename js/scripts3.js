$(document).ready(function() {
    // Load symbols from JSON file
    $.getJSON('data/constituents.json', function(data) {
        const symbols = data.map(company => company.Symbol);
        const select1 = $('#symbol1');
        const select2 = $('#symbol2');

        symbols.forEach(symbol => {
            select1.append(`<option value="${symbol}">${symbol}</option>`);
            select2.append(`<option value="${symbol}">${symbol}</option>`);
        });

        // Create a map for quick lookup of company names by symbol
        const companyMap = {};
        data.forEach(company => {
            companyMap[company.Symbol] = company.Security;
        });

        // Update labels and table headers with company names
        const updateLabelsAndHeaders = () => {
            const symbol1 = $('#symbol1').val();
            const symbol2 = $('#symbol2').val();
            const companyName1 = companyMap[symbol1] || symbol1;
            const companyName2 = companyMap[symbol2] || symbol2;

            $('label[for="symbol1"]').text(companyName1);
            $('label[for="symbol2"]').text(companyName2);
            $('#company1Name').text(companyName1);
            $('#company2Name').text(companyName2);
        };

        // Initial update
        updateLabelsAndHeaders();

        // Update labels and headers when a new symbol is selected
        $('#symbol1, #symbol2').on('change', updateLabelsAndHeaders);
    }).fail(function() {
        alert('Failed to load symbols.');
    });

    // Handle form submission
    $('#comparisonForm').on('submit', function(event) {
        event.preventDefault();

        const symbol1 = $('#symbol1').val();
        const symbol2 = $('#symbol2').val();

        const settings = {
            async: true,
            crossDomain: true,
            url: `https://seeking-alpha.p.rapidapi.com/symbols/get-summary?symbols=${symbol1}%2C${symbol2}`,
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'd76e96be04mshb6bfdb8c4178973p19b5bajsn6adaa687028d',
                'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
            }
        };

        $.ajax(settings).done(function(response) {
            console.log('API Response:', response);

            const profiles = response.data;
            const profile1 = profiles.find(profile => profile.id === symbol1);
            const profile2 = profiles.find(profile => profile.id === symbol2);

            if (!profile1 || !profile2) {
                alert('One or both of the selected symbols were not found.');
                return;
            }

            const attributes1 = profile1.attributes;
            const attributes2 = profile2.attributes;

            const htmlContent = `
                <tr>
                    <td>Market Cap</td>
                    <td>${attributes1.marketCap}</td>
                    <td>${attributes2.marketCap}</td>
                </tr>
                <tr>
                    <td>Last Price</td>
                    <td>${attributes1.lastClosePriceEarningsRatio}</td>
                    <td>${attributes2.lastClosePriceEarningsRatio}</td>
                </tr>
                <tr>
                    <td>Volume</td>
                    <td>${attributes1.totalEnterprise}</td>
                    <td>${attributes2.totalEnterprise}</td>
                </tr>
            `;

            $('#comparisonTable tbody').html(htmlContent);
        }).fail(function() {
            alert('Failed to get stock data.');
        });
    });

    // Book Search Section
    const bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    const apiKey = "AIzaSyDXyR5j8ZTwRqYFz0UUPQoKtetBIkyl-v8";
    const placeHldr = '<img src="https://via.placeholder.com/150">';

    const searchRandomBook = () => {
        const keywords = ['finances', 'economy', 'crypto currency', 'inflation'];
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

        $.ajax({
            url: `${bookUrl}${randomKeyword}&key=${apiKey}`,
            method: 'GET'
        }).done(function(response) {
            console.log('Book Search Response:', response);

            const bookResults = response.items || [];
            const htmlContent = bookResults.map(book => {
                const title = book.volumeInfo.title || 'No Title';
                const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No Authors';
                const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : placeHldr;

                return `
                    <div class="col-md-3 mb-4">
                        <div class="card">
                            <img src="${thumbnail}" class="card-img-top" alt="${title}">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <p class="card-text">${authors}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            $('#bookResults').html(htmlContent);
        }).fail(function() {
            alert('Failed to get book data.');
        });
    };

    // Execute the random book search on page load
    searchRandomBook();

      // Navbar transparency effect
      let idleTimer;
      const idleTime = 5000; // 5 seconds
  
      const resetIdleTimer = () => {
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
              $('.navbar-fixed').addClass('transparent');
          }, idleTime);
      };
  
      $(document).on('mousemove keypress scroll', resetIdleTimer);
  
      $(window).on('scroll', () => {
          $('.navbar-fixed').removeClass('transparent');
          resetIdleTimer();
      });
  
      // Initial call to reset the idle timer
      resetIdleTimer();
});