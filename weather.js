const api_key = 'c58ffa4e35044edebad212026251805';
const api_url = 'http://api.weatherapi.com/v1/current.json?key=' + api_key + '&';
const api_url_forecast = 'http://api.weatherapi.com/v1/forecast.json?key=' + api_key + '&';

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Handle form submission
document.getElementById('get-weather-button').addEventListener('click', function (e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        // Save to localStorage
        localStorage.setItem('lastCity', city);
        getWeatherCurrent(city);
        getWeatherForecast(city);
        document.getElementById('city-input').value = '';
    } else {
        alert('Please enter a city name.');
    }
});

// Fetch weather for the last searched city on page load
window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        getWeatherCurrent(lastCity);
        getWeatherForecast(lastCity);
    }
});

function getWeatherCurrent(city) {
    const url = api_url + 'q=' + city;
    console.log(url);
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const weather = data.current;
            const location = data.location.name;
            const country = data.location.country;
            const temperature = weather.temp_c;
            const condition = weather.condition.text;
            const humidity = weather.humidity;
            const windSpeed = weather.wind_kph;

            document.getElementById('weather-info-current').innerHTML = `
                <h2>Weather in ${location}, ${country}</h2>
                <div class="centering-container">
                    <div class="weather-card">
                        <h3>Current Weather</h3>
                        <img src="${weather.condition.icon}" alt="${condition}">
                        <p>Temperature: ${temperature}°C</p>
                        <p>Condition: ${condition}</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind Speed: ${windSpeed} kph</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function getWeatherForecast(city) {
    const url = api_url_forecast + 'q=' + city + '&days=3';
    console.log(url);
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const forecast = data.forecast.forecastday;
            const location = data.location.name;
            const country = data.location.country;

            let forecastHTML = `<h2>3-Day Weather Forecast for ${location}, ${country}</h2>`;
            forecastHTML += '<div class="is-flex">';
            forecast.forEach(day => {
                const date = new Date(day.date);
                const temperatureMax = day.day.maxtemp_c;
                const temperatureMin = day.day.mintemp_c;
                const condition = day.day.condition.text;

                forecastHTML += `
                    <div class="weather-card forecast-day">
                        <h3>${date.toDateString()}</h3>
                        <p>Max Temperature: ${temperatureMax}°C</p>
                        <p>Min Temperature: ${temperatureMin}°C</p>
                        <p>Condition: ${condition}</p>
                    </div>
                `;
            });
            forecastHTML += '</div>';

            document.getElementById('forecast-weather').innerHTML = forecastHTML;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
