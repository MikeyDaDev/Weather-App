document.getElementById('search').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    const apiKey = 'ce2814bc1a43af5e628dfbfdfe9a24e3'; // Replace with your OpenWeatherMap API key
    
    if (city === '') {
      document.getElementById('weatherResult').innerHTML = `<p>Please enter a city name.</p>`;
      return;
    }

    // Show a loading message
    document.getElementById('weatherResult').innerHTML = `<p>⏳ Please wait, weather is loading...</p>`;


    // Request weather in Farenheit units=imperial and celsius units=metric 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data); // debugging in console

        // Icon code and create image URL
        const icon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        // The weather HTML using the API data
        const weather = `
          <h2>${data.name}</h2>
          <img src="${iconUrl}" alt="Weather icon"/>
          <p>${data.weather[0].description}</p>
          <p>🌡️ Temp: ${data.main.temp}°F</p>
          <p> 💧 Humidity: ${data.main.humidity}%</p>
          <p> 🌬️ Wind: ${data.wind.speed} mph</p>
        `;

        // Display the result
        document.getElementById('weatherResult').innerHTML = weather;
      })
      .catch(error => {
        // Handle errors
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherResult').innerHTML = `<p>Could not determine the weather. Try a valid city please.</p>`;
      });
  });
  
  // This allows the "Enter" key to be used to search
  document.getElementById('city').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      document.getElementById('search').click();
    }
  });