function getWeather(){
    const apiKey = "cd819b9f27d6e022da6fca764a5b6562";
    const city = document.getElementById('city').value;

    if(!city){
            alert("Please enter a city");
            return;
        }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data); //if data exists, call the function to make weather details
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error); //just like catching an exception in java, if we catch error, alert user.
            alert("Error fetching current weather data. Please try again");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list); //if data exists call the function to make hourly data details.
        })
        .catch(error => {
            console.error("Error fetching hourly forecast data:", error); //just like catching an exception in java, if we catch error, alert user.
            alert("Error fetching hourly forecast data. Please try again");
        });
}

function displayWeather(data){

    /*
    * recieve CURRENT DATA (THIS HOUR OF WEATHER DETAILS)
    * assign each div their name so they can be modified
    * reset data, since we may change cities
    * change text of all divs containing humidity, temp, etc to the exact weather data we extracted
    */

    const tempDivInfo = document.getElementById("temp-div");
    const humidityDivInfo = document.getElementById("humidity-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const cityNameDiv = document.getElementById("city-name");

    //Clear previous content
    weatherInfoDiv.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";
    tempDivInfo.innerHTML = "";

    //check if data is error
    if(data.cod === "404"){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`
    }

    //if data is not error, extract data we will use
    else{

        const cityName = data.name;
        const temperature = parseInt(data.main.temp); //conversion to celcius
        const humidity = data.main.humidity;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;

        const humidityHTML= `<p>Humidity: ${humidity}%</p>`

        const cityNameHTML = `<p><b>${cityName}<b></p>`;

        const weatherInfoHtml = `<p>${description}</p>`;

        cityNameDiv.innerHTML = cityNameHTML;
        tempDivInfo.innerHTML = temperatureHTML;
        humidityDivInfo.innerHTML = humidityHTML;
        weatherInfoDiv.innerHTML = weatherInfoHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();

    }

}

function displayHourlyForecast(hourlyData){

    /*
    * Function recieves a list of items, that is hourly data.
    * So we can refer to each item/object of hour as item.
    * First we loop through each item and extract the data
    * then form a new class that is basically a hours worth of data into one
    * add it to the hourly div and repeat till all hourly data is extracted
    */
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const next24Hours = hourlyData.slice(0,8); //extract first 8 items so we have 3 hour intervals

    //looping through each item of data and assigning it info and adding it to our forecast const
    next24Hours.forEach(item =>{

        const dateTime = new Date(item.dt * 1000);
        const hour24 = dateTime.getHours();
        const hour12 = convertTo12HourFormat(hour24); // Convert to 12-hour format DONT USE THIS IF I WANT TO USE 24 HOUR
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;


        //TO MAKE A BUTTON FOR 12/24 HOUR CLOCK MAKE AN IF AND HAVE TWO OF THESE: ONE FOR 12: OR FOR 24
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour12}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>`;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage(){
    //for some reason it doesnt show initially so you have to block it, it is probably hidden initially.
    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.style.display = "block"; //block makes the image visible
}

function convertTo12HourFormat(hour24) {
    //function that converts 24 hour time to 12 with pm and am.

    let hour12;
    let period;

    if (hour24 === 0) {
        hour12 = 12; // Midnight
        period = "AM";
    } else if (hour24 < 12) {
        hour12 = hour24; // Morning hours (1 AM to 11 AM)
        period = "AM";
    } else if (hour24 === 12) {
        hour12 = 12; // Noon
        period = "PM";
    } else {
        hour12 = hour24 - 12; // Afternoon hours (1 PM to 11 PM)
        period = "PM";
    }

    return `${hour12}:00 ${period}`; // returns the time as how i would need it to embedd into hourlyitemhtml
}
//replace file locations with custom images
// const iconUrl = customIconMap[iconCode], then use this for finding image
// const customIconMap = {
//     "01d": "images/clear_sky_day.png",  // Clear sky (day)
//     "01n": "images/clear_sky_night.png", // Clear sky (night)
//     "02d": "images/few_clouds_day.png",  // Few clouds (day)
//     "02n": "images/few_clouds_night.png", // Few clouds (night)
//     "03d": "images/scattered_clouds.png", // Scattered clouds
//     "09d": "images/shower_rain.png",     // Shower rain
//     "10d": "images/rain_day.png",        // Rain (day)
//     "10n": "images/rain_night.png",      // Rain (night)
//     "11d": "images/thunderstorm.png",    // Thunderstorm
//     "13d": "images/snow.png",            // Snow
//     "50d": "images/mist.png"             // Mist
// };