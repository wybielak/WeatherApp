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
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            weatherForecast.style.display = 'none';
            forecastbtn.classList.remove('clickn');
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');


            const img = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            //const pressure = document.querySelector('.weather-details .pressure span');

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
            //pressure.innerHTML = `${parseInt(json.main.pressure)}hPa`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '690px';

        });

});

var dayindex = 0;
var jsonglobal = {};

var i = 0;
var j = 0;

var steps = 0;

function refresh (dayindex, json) {
    
    const weekdays = [
        'Sunday', 'Monday', 'Tuesday', 'Wenesday', 'Thursday', 'Friday', 'Saturday'
    ];

    get_date = json.list[i].dt;
    date = new Date(get_date * 1000);
    
    dayindex = date.getDay();
    daynumber = dayindex;

    weatherForecast.innerHTML = `
        <div class="switch-day">
            <button onclick="previousday()" class="fa-solid fa-chevron-left"></button>
            <p><b>${weekdays[dayindex]}</b></p>
            <button onclick="nextday()" class="fa-solid fa-chevron-right"></button>
        </div>
    `;

    j = 0;

    while (dayindex == daynumber & i < 40) {

        get_date = json.list[i].dt;
        date = new Date(get_date * 1000);

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        daynumber = date.getDay();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        if (dayindex == daynumber) {

            time = `<b>${day}.${month}</b><br>${hours}:${minutes}`;
            temperature = `${parseInt(json.list[i].main.temp - 273.15)}°C`;
            humidity = `${parseInt(json.list[i].main.humidity)}%`;
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
                    <p class="humidity" >${humidity}</p>
                    <p class="wind" >${wind}</p>
                </div>
            `;
            i++;
            j++;
        }
    }
}

forecastbtn.addEventListener('click', () => {

    const APIkey = '78448c0080cb7511f61c4371c831a80b';
    const city = document.querySelector('.search-box input').value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}`)
        .then(response => response.json()).then(json => {

            console.log(json);

            jsonglobal = json;

            i = 0;

            refresh(dayindex, json);

            forecastbtn.classList.add('clickn');

            setTimeout(function () {
                container.style.height = '690px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                weatherForecast.style.display = '';
                weatherForecast.classList.add('fadeIn');
            }, 500);
        });
});

function previousday () { 
    
    if (steps > 0) {
        dayindex -= 1;
        steps -= 1;
        i -= j*2;
        refresh(dayindex, jsonglobal);
    } 
}

function nextday () { 
    
    if (steps < 4) {
        dayindex += 1;
        steps += 1;
        refresh(dayindex, jsonglobal);
    }

}