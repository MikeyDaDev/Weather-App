function fetchWeatherByCoords(lat, lon) {
  const apiKey = 'ce2814bc1a43af5e628dfbfdfe9a24e3';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&appid=${apiKey}&units=imperial`;

  const resultEl = document.getElementById('weatherResult');
  resultEl.classList.remove('show');
  resultEl.innerHTML = `<p>📍 Detecting your weather...</p>`;

  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      const weather = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="Weather icon"/>
        <p>${data.weather[0].description}</p>
        <p>🌡️ Temp: ${data.main.temp}°F</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} mph</p>
        <h3>Next 5 Hours:</h3>
        <div class="hourly-forecast"></div>
      `;

      resultEl.innerHTML = weather;
      resultEl.classList.add('show');

      return fetch(oneCallUrl);
    })
    .then(res => res.json())
    .then(oneCallData => {
      const hourlyContainer = document.querySelector('.hourly-forecast');
      hourlyContainer.innerHTML = '';

      oneCallData.hourly.slice(1, 6).forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const time = date.getHours() % 12 || 12;
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        const icon = hour.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        const hourBlock = `
          <div class="hour-block">
            <p>${time} ${ampm}</p>
            <img src="${iconUrl}" alt="Weather icon"/>
            <p>${Math.round(hour.temp)}°F</p>
          </div>
        `;
        hourlyContainer.innerHTML += hourBlock;
      });
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      resultEl.innerHTML = `<p>Could not get weather data.</p>`;
    });
}

document.getElementById('search').addEventListener('click', function () {
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const country = document.getElementById('country').value.trim();
  const apiKey = 'ce2814bc1a43af5e628dfbfdfe9a24e3';

  if (city === '') {
    document.getElementById('weatherResult').innerHTML = `<p>Please enter a city name.</p>`;
    return;
  }

  const resultEl = document.getElementById('weatherResult');
  resultEl.classList.remove('show');
  resultEl.innerHTML = `<p>⏳ Please wait, weather is loading...</p>`;

  let location = city;
  if (state !== '') location += `,${state}`;
  if (country !== '') location += `,${country}`;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      const weather = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="Weather icon"/>
        <p>${data.weather[0].description}</p>
        <p>🌡️ Temp: ${data.main.temp}°F</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} mph</p>
      `;

      resultEl.innerHTML = weather;
      resultEl.classList.add('show');
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      resultEl.innerHTML = `<p>Could not determine the weather. Check for spelling please.</p>`;
    });
});

// Allow Enter key to trigger search
['city', 'state', 'country'].forEach(id => {
  document.getElementById(id).addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      document.getElementById('search').click();
    }
  });
});

// Auto-detect weather on page load
window.addEventListener('load', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.warn('Geolocation error or permission denied:', error.message);
      }
    );
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('✅ Service Worker registered:', reg.scope))
        .catch(err => console.error('❌ Service Worker registration failed:', err));
    });
  }
  
});
