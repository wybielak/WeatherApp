const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const weatherForecast = document.querySelector('.weather-forecast');

const forecastbtn = document.querySelector('.forecast button');

search.addEventListener('click', () => {

    const APIkey = '78448c0080cb7511f61c4371c831a80b';
    const city = document.querySelector('.search-box input').value;

    if (city === '') {
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`)
        .then(response => response.json()).then(json => {

            console.log(json);

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                weatherForecast.style.display = 'none';
                container.style.overflow = 'hidden';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            weatherForecast.style.display = 'none';
            container.style.overflow = 'hidden';
            forecastbtn.classList.remove('rotatenclick');
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');


            const img = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            const pressure = document.querySelector('.weather-details .pressure span');

            switch (json.weather[0].main) {
                case 'Clear':
                    img.src = 'img/clear.png';
                    break;

                case 'Rain':
                    img.src = 'img/rain.png';
                    break;

                case 'Snow':
                    img.src = 'img/snow.png';
                    break;

                case 'Clouds':
                    img.src = 'img/cloud.png';
                    break;

                case 'Haze':
                    img.src = 'img/mist.png';
                    break;

                default:
                    img.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`
            wind.innerHTML = `${parseFloat(Math.round(json.wind.speed) * (1 / 1000) / (1 / 3600))}km/h`;
            pressure.innerHTML = `${parseInt(json.main.pressure)}hPa`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '690px';

        });

});

forecastbtn.addEventListener('click', () => {

    const APIkey = '78448c0080cb7511f61c4371c831a80b';
    const city = document.querySelector('.search-box input').value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`)
        .then(response => response.json()).then(json => {

            console.log(json);


            for (i = 0; i < json.list.length; i++) {
                
                get_date = json.list[i].dt;
                date = new Date(get_date * 1000);

                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                time = `<b>${day}.${month}</b><br>${hours}:${minutes}`;
                temperature = `${parseInt(json.list[i].main.temp - 273.15)}°C`;
                min_temp = `${parseInt(json.list[i].main.temp_max - 273.15)}°C<br>${parseInt(json.list[0].main.temp_min - 273.15)}°C`;
                wind = `${parseFloat(Math.round(json.list[i].wind.speed) * (1 / 1000) / (1 / 3600))}km/h`;

                img = '';

                switch (json.list[i].weather[0].main) {
                    case 'Clear':
                        img = 'img/clear.png';
                        break;

                    case 'Rain':
                        img = 'img/rain.png';
                        break;

                    case 'Snow':
                        img = 'img/snow.png';
                        break;

                    case 'Clouds':
                        img = 'img/cloud.png';
                        break;

                    case 'Haze':
                        img = 'img/mist.png';
                        break;

                    default:
                        img = '';
                }

                weatherForecast.innerHTML += `
                <div class="forecast-row">
                    <p class="time" >${time}</p>
                    <img src="${img}">
                    <p class="temp" >${temperature}</p>
                    <p class="min-temp" >${min_temp}</p>
                    <p class="wind" >${wind}</p>
                </div>
            `;
            }

            forecastbtn.classList.add('rotatenclick');

            setTimeout(function () {
                container.style.overflow = 'scroll';
                container.style.height = '690px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                weatherForecast.style.display = '';
                weatherForecast.classList.add('fadeIn');
            }, 700);


        });


});