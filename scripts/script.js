$(function () {

    // ----- Element Inits -----

    // search form
    const $searchForm = $("#search-form");
    const $cityInput = $("#city-input");

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
    // const $fiveDayForecastContainer = $("#five-day-forecast-container")
    console.log("$fiveDayForecastCards: ", $fiveDayForecastCards[0], typeof ($fiveDayForecastCards));

    // apiKey
    const apiKey = "e452aa651bd80481f1b2311b6f81f11d"

    // Handle initial loading of data
    const handleInit = async () => {

        // Auto load Seattle weather
        const data = await getData("Seattle");
        console.log("handleInit data: ", data);

        // Initialize search history if there isn't any
        if (!JSON.parse(localStorage.getItem('searchHistory'))) {
            localStorage.setItem('searchHistory', "[]");
        }

        // Render search history
        renderSearchHistory();

        // Render today's forecast
        const { weather: { current } } = data;
        const { location } = data;

        renderTodaysForecast(
            location.city,
            location.state,
            current.temp,
            current.humidity,
            current.wind_speed,
            current.uvi
        );

        // Render 5-day forecast
        const { weather: { daily } } = data;
        renderFiveDayForecast(daily);


    }

    // Handle form submit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        console.log("Form submitted!");

        // Pull data from search value
        const cityInput = $cityInput.val().trim();
        console.log("city input: ", cityInput);

        // Get data
        const { weather: { current }, location } = await getData(cityInput);

        // Add to search history
        let searchHistory;

        searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

        console.log("searchHistory before: ", searchHistory)
        searchHistory.push({ city: location.city, state: location.state });

        console.log("searchHistory after: ", searchHistory)
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Render Forecast
        renderTodaysForecast(
            location.city,
            location.state,
            current.temp,
            current.humidity,
            current.wind_speed,
            current.uvi
        );

        // Render search history


        // Render 5-day forecast
    }

    // Render 5-day forecast
    const renderFiveDayForecast = (weatherAr) => {

        // Current date
        let currentDate = new Date();

        // Loop over each card and add data
        let dayIndex = 1;
        let date = new Date();
        let card;

        $fiveDayForecastCards.each(function (index) {

            $cardDataAr = $(this).find(".data");

            // Date
            date.setDate(currentDate.getDate() + dayIndex);
            const [month, day, year] = date.toLocaleDateString("en-US").split("/");
            dateFormatted = `${month}/${day}/${year}`

            // Icon
            const iconCode = weatherAr[dayIndex - 1].weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`

            // Temperature - reound to nearest degree
            const temp = Math.round(parseInt(weatherAr[dayIndex - 1].temp.day)).toString();

            // Humidity
            const humidity = weatherAr[dayIndex - 1].humidity

            // Update card info
            $($cardDataAr[0]).attr('src', iconUrl);
            $($cardDataAr[1]).text(dateFormatted);
            $($cardDataAr[2]).text(`${temp}°F`);
            $($cardDataAr[3]).text(`${humidity}%`);

            dayIndex++;
        });

    }

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
        let location = { city: "N/A", state: "N/A" };

        console.log("Fetching coordinates and location data...")
        await $.ajax({
            url: url,
            type: "get"
        }).done(function (response) {
            console.log("getCoordinates: ", response)
            coordinates = {
                lat: response[0].lat,
                lon: response[0].lon
            }
            location = {
                city: response[0].name,
                state: response[0].state
            }
        });

        return { coordinates, location };
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
        let { coordinates, location } = await getCoordinates(cityName);
        console.log("Await coordinates: ", coordinates);

        let weather = await getWeather(coordinates.lat, coordinates.lon);
        console.log("Await weather: ", weather);

        return { weather, location };
    }

    const getSearchHistoryCard = (cityName, stateName) => {


        return (
            $.parseHTML(`<a href="#" class="list-group-item list-group-item-action active">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${cityName}, ${stateName}</h5>
                </div>
            </a>`)
        )
    }

// ----- Listeners -----
$searchForm.submit((event) => handleFormSubmit(event))
console.log($searchForm);

// ----- Initialize -----
handleInit();

})