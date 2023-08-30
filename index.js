const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const weatherForecast = document.querySelector('.weather-forecast');
const details = document.querySelector('.details');

const forecastbtn = document.querySelector('.forecast button');
const detailsbtn = document.querySelector('.more-details button');

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
                details.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            weatherForecast.style.display = 'none';
            details.style.display = 'none';
            forecastbtn.classList.remove('clickn');
            detailsbtn.classList.remove('clickn');
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

            temperature.innerHTML = `${parseInt(Math.round(json.main.temp))}<span>°C</span>`;
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

function refresh(dayindex, json) {

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
            temperature = `${parseInt(json.list[i].main.temp)}°C`;
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

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIkey}`)
        .then(response => response.json()).then(json => {

            forecastbtn.classList.add('clickn');

            console.log(json);

            jsonglobal = json;

            i = 0;

            refresh(dayindex, json);

            setTimeout(function () {
                container.style.height = '690px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                details.style.display = 'none';
                weatherForecast.style.display = '';
                weatherForecast.classList.add('fadeIn');
            }, 500);
        });
});

function previousday() {

    if (steps > 0) {
        dayindex -= 1;
        steps -= 1;
        i -= j * 2;
        refresh(dayindex, jsonglobal);
    }
}

function nextday() {

    if (steps < 4) {
        dayindex += 1;
        steps += 1;
        refresh(dayindex, jsonglobal);
    }

}

detailsbtn.addEventListener('click', () => {

    const APIkey = '78448c0080cb7511f61c4371c831a80b';
    const city = document.querySelector('.search-box input').value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`)
        .then(response => response.json()).then(json => {

            detailsbtn.classList.add('clickn');

            console.log(json);

            const description = document.querySelector('.details .desc span');
            const clouds = document.querySelector('.details .clouds span');
            const temperature = document.querySelector('.details .temp span');
            const feelslike = document.querySelector('.details .feel span');
            const humidity = document.querySelector('.details .humidity span');
            const pressure = document.querySelector('.details .pressure span');
            const sunrise = document.querySelector('.details .sunrise span');
            const sunset = document.querySelector('.details .sunset span');
            const visibility = document.querySelector('.details .visibility span');
            const wind = document.querySelector('.details .wind span');
            const lon = document.querySelector('.details .lon span');
            const lat = document.querySelector('.details .lat span');

            description.innerHTML = `${json.weather[0].description}`;
            clouds.innerHTML = `${json.clouds.all}`;
            temperature.innerHTML = `${parseFloat(json.main.temp.toFixed(1))}`;
            feelslike.innerHTML = `${parseFloat(json.main.feels_like.toFixed(1))}`;
            humidity.innerHTML = `${json.main.humidity}`;
            pressure.innerHTML = `${json.main.pressure}`;

            get_date = json.sys.sunrise;
            date = new Date(get_date * 1000);

            hours = String(date.getHours()).padStart(2, '0');
            minutes = String(date.getMinutes()).padStart(2, '0');

            sunrise.innerHTML = `${hours}:${minutes}`;

            get_date = json.sys.sunset;
            date = new Date(get_date * 1000);

            hours = String(date.getHours()).padStart(2, '0');
            minutes = String(date.getMinutes()).padStart(2, '0');

            sunset.innerHTML = `${hours}:${minutes}`;

            visibility.innerHTML = `${parseFloat(json.visibility / 1000)}`;
            wind.innerHTML = `${parseFloat(Math.round(json.wind.speed) * (1 / 1000) / (1 / 3600))}`;

            lon.innerHTML = `${json.coord.lon}`;
            lat.innerHTML = `${json.coord.lat}`;

            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${json.coord.lat}&lon=${json.coord.lon}&appid=${APIkey}`)
                .then(response => response.json()).then(jsonair => {
                    console.log(jsonair)

                    const so2 = jsonair.list[0].components.so2;
                    const no2 = jsonair.list[0].components.no2;
                    const pm10 = jsonair.list[0].components.pm10;
                    const pm2_5 = jsonair.list[0].components.pm2_5;
                    const o3 = jsonair.list[0].components.o3;
                    const co = jsonair.list[0].components.co;

                    const air_pollution = document.querySelector('.details .air-pollution');

                    air_pollution.innerHTML += `
                        <p class="so2" >${so2}</p>
                        <p class="no2" >${no2}</p>
                        <p class="pm10" >${pm10}</p>
                        <p class="pm2_5" >${pm2_5}</p>
                        <p class="o3" >${o3}</p>
                        <p class="co" >${co}</p>
                    `;

                    if (so2 >= 0 & so2 < 20) document.querySelector('.air-pollution .so2').style.color = '#6bc926';
                    if (so2 >= 20 & so2 < 80) document.querySelector('.air-pollution .so2').style.color = '#d1cf1e';
                    if (so2 >= 80 & so2 < 250) document.querySelector('.air-pollution .so2').style.color = '#ef7120';
                    if (so2 >= 250 & so2 < 350) document.querySelector('.air-pollution .so2').style.color = '#ef2a36';
                    if (so2 >= 350) document.querySelector('.air-pollution .so2').style.color = '#770078';

                    if (no2 >= 0 & so2 < 40) document.querySelector('.air-pollution .no2').style.color = '#6bc926';
                    if (no2 >= 40 & so2 < 70) document.querySelector('.air-pollution .no2').style.color = '#d1cf1e';
                    if (no2 >= 70 & so2 < 150) document.querySelector('.air-pollution .no2').style.color = '#ef7120';
                    if (no2 >= 150 & so2 < 200) document.querySelector('.air-pollution .no2').style.color = '#ef2a36';
                    if (no2 >= 200) document.querySelector('.air-pollution .no2').style.color = '#770078';

                    if (pm10 >= 0 & so2 < 20) document.querySelector('.air-pollution .pm10').style.color = '#6bc926';
                    if (pm10 >= 20 & so2 < 50) document.querySelector('.air-pollution .pm10').style.color = '#d1cf1e';
                    if (pm10 >= 50 & so2 < 100) document.querySelector('.air-pollution .pm10').style.color = '#ef7120';
                    if (pm10 >= 100 & so2 < 200) document.querySelector('.air-pollution .pm10').style.color = '#ef2a36';
                    if (pm10 >= 200) document.querySelector('.air-pollution .pm10').style.color = '#770078';

                    if (pm2_5 >= 0 & so2 < 10) document.querySelector('.air-pollution .pm2_5').style.color = '#6bc926';
                    if (pm2_5 >= 10 & so2 < 25) document.querySelector('.air-pollution .pm2_5').style.color = '#d1cf1e';
                    if (pm2_5 >= 25 & so2 < 50) document.querySelector('.air-pollution .pm2_5').style.color = '#ef7120';
                    if (pm2_5 >= 50 & so2 < 75) document.querySelector('.air-pollution .pm2_5').style.color = '#ef2a36';
                    if (pm2_5 >= 75) document.querySelector('.air-pollution .pm2_5').style.color = '#770078';

                    if (o3 >= 0 & so2 < 60) document.querySelector('.air-pollution .o3').style.color = '#6bc926';
                    if (o3 >= 60 & so2 < 100) document.querySelector('.air-pollution .o3').style.color = '#d1cf1e';
                    if (o3 >= 100 & so2 < 140) document.querySelector('.air-pollution .o3').style.color = '#ef7120';
                    if (o3 >= 140 & so2 < 180) document.querySelector('.air-pollution .o3').style.color = '#ef2a36';
                    if (o3 >= 180) document.querySelector('.air-pollution .o3').style.color = '#770078';

                    if (co >= 0 & so2 < 4400) document.querySelector('.air-pollution .co').style.color = '#6bc926';
                    if (co >= 4400 & so2 < 9400) document.querySelector('.air-pollution .co').style.color = '#d1cf1e';
                    if (co >= 9400 & so2 < 12400) document.querySelector('.air-pollution .co').style.color = '#ef7120';
                    if (co >= 12400 & so2 < 15400) document.querySelector('.air-pollution .co').style.color = '#ef2a36';
                    if (co >= 15400) document.querySelector('.air-pollution .co').style.color = '#770078';
                });

            setTimeout(function () {
                container.style.height = '690px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                weatherForecast.style.display = 'none';
                details.style.display = '';
                details.classList.add('fadeIn');
            }, 500);

        });
});