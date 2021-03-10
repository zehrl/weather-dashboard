$(function () {

    // Element Inits
    // search input
    // search history list items

    // today's forecast
    const $todayCityName = $("#todayCityName"); // City Name span
    const $todayDate = $("#todayDate"); // Today Date
    const $todayTemp = $("#todayTemp"); // Temperature span
    const $todayHumidity = $("#todayHumidity"); // Humidity span
    const $todayWindSpeed = $("#todayWindSpeed"); // Wind Speed span
    const $todayUVIndex = $("#todayUVIndex"); // UV Index span

    // 5-day forecast card children
    const $fiveDayForecastCards = $(".five-day-card")

    // apiKey
    const apiKey = "e452aa651bd80481f1b2311b6f81f11d"

    // Handle initial loading of data
    const handleInit = async () => {
        const data = await getData("Seattle");
        console.log("handleInit data: ", data);

        // Render search history
        renderSearchHistory();

        // Render today's forecast
        renderTodaysForecast("Fort Wayne", "IN", 34, 35, 3, 4);

        // Render 5-day forecast


    }
    
    // Handle form submit
        // Pull data from search value
        // Get data
        // Render search history
        // Render 5-day forecast

    // Render 5-day forecast


    // Render search history
    const renderSearchHistory = () => {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

        if (searchHistory) {
            console.log("searchHistory: ", searchHistory);
        } else {
            console.log("No search history found.")
        }

    }

    // Render today's forecast
    const renderTodaysForecast = (cityName, stateName, temp, humidity, windSpeed, uVIndex) => {
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
        let currentDate = `${month}/${date}/${year}`

        // update city name
        $todayCityName.text(`${cityName}, ${stateName}`);

        // update date
        $todayDate.text(currentDate);

        // update temperature
        $todayTemp.text(`${temp}°F`);

        // update humidity
        $todayHumidity.text(`${humidity}%`);

        // update wind speed
        $todayWindSpeed.text(`${windSpeed} mph`);

        // update uv index
        $todayUVIndex.text(uVIndex);

        // update icon
        // URL: https://openweathermap.org/weather-conditions#How-to-get-icon-URL

    }

    // Render 5-day forecast


    const getCoordinates = async (cityName) => {

        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
        let coordinates = { lat: "N/A", lon: "N/A" };

        await $.ajax({
            url: url,
            type: "get"
        }).done(function (response) {
            coordinates = {
                lat: response[0].lat,
                lon: response[0].lon
            }
        });

        return coordinates;
    }



    const getWeather = async (lat, lon) => {

        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`
        let weather;

        await $.ajax({
            url: url,
            type: "get"
        }).done(function (response) {
            weather = response;
        });

        return weather
    }

    const getData = async (cityName) => {
        let coordinates = await getCoordinates(cityName);
        console.log("Await coordinates: ", coordinates);
        let weather = await getWeather(coordinates.lat, coordinates.lon);
        console.log("Await weather: ", weather);

        return weather;
    }

    handleInit();

})