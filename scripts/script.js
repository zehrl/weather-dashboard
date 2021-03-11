$(function () {

    // ----- Element Inits -----

    // search form
    const $searchForm = $("#search-form");
    const $cityInput = $("#city-input");

    // search history
    $searchHistoryContainer = $("#search-history-container");

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

        // Auto load Seattle weather
        const data = await getData("Seattle");

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
            location.country,
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

        // Pull data from search value
        const cityInput = $cityInput.val().trim();

        // Clear Search Input
        $cityInput.val("");

        // Get data
        const { weather: { current, daily }, location } = await getData(cityInput);

        // Add to search history
        let searchHistory;

        searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

        // Filter any duplicates
        searchHistory = searchHistory.filter(entry => {
            return (
                (entry.city !== location.city) ||
                (entry.state !== location.state && entry.country !== location.country)
            )
        })

        searchHistory.unshift({ city: location.city || null, state: location.state || null, country: location.country || null });

        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Render Forecast
        renderTodaysForecast(
            location.city,
            location.state,
            location.country,
            current.temp,
            current.humidity,
            current.wind_speed,
            current.uvi
        );

        // Render search history
        renderSearchHistory();

        // Render 5-day forecast
        renderFiveDayForecast(daily);


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

        // Clear out search history container to prevent duplicates
        $searchHistoryContainer.empty();

        if (searchHistory.length > 0) {
            let $cards = $();

            searchHistory.forEach(search => {
                $searchHistoryContainer.append(getSearchHistoryCard(search.city, search.state, search.country));
            });
        } else {
            console.log("No search history found.")
        }
    }

    // Render today's forecast
    const renderTodaysForecast = (cityName, stateName, countryName, temp, humidity, windSpeed, uVIndex) => {
        let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
        let currentDate = `${month}/${date}/${year}`

        // update city name
        $todayCityName.text(`${cityName}, ${stateName || countryName}`);

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

        // Determine UV Index severity and change background accordingly
        $todayUVIndex.css('color', 'white');

        console.log("uVIndex: ", uVIndex)
        switch (true) {
            case (uVIndex === 0):
                updateUVIndexStyle("white", "black", false);
                $todayUVIndex.text("No data.")
                break;

            case (uVIndex < 3):
                updateUVIndexStyle("green", "white", true);
                break;

            case (uVIndex < 6):
                updateUVIndexStyle("yellow", "black", true);
                break;

            case (uVIndex < 8):
                updateUVIndexStyle("orange", "black", true);
                break;

            case (uVIndex < 11):
                updateUVIndexStyle("red", "white", true);
                break;

            case (uVIndex > 11):
                updateUVIndexStyle("purple", "white", true);
                break;

            default:
                console.log("No UV Index conditions detected.");
                break;
        }

    }

    const updateUVIndexStyle = (backgroundColor, fontColor, borderBoolean) => {
        $todayUVIndex.css('background-color', backgroundColor);
        $todayUVIndex.css('color', fontColor);
        if (borderBoolean) {
            $todayUVIndex.css('border', 'rgba(0, 0, 0, 0.75) solid 1px');
        } else {
            $todayUVIndex.css('border', 'white');
        }
    }

    // ----- API Calls & handling -----

    const getCoordinates = async (cityName) => {

        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
        let coordinates = { lat: "N/A", lon: "N/A" };
        let location = { city: "N/A", state: "N/A" };

        console.log("Fetching coordinates and location data...")
        await $.ajax({
            url: url,
            type: "get"
        }).done(function (response) {
            console.log("response: ", response)
            coordinates = {
                lat: response[0].lat,
                lon: response[0].lon
            }
            location = {
                city: response[0].name,
                state: response[0].state,
                country: response[0].country
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

        let weather = await getWeather(coordinates.lat, coordinates.lon);
        console.log("Weather data: ", weather)
        return { weather, location };
    }

    const getSearchHistoryCard = (cityName, stateName, countryName) => {

        // If there is a country, we will use it for searching
        let locationSearch = cityName;

        if (countryName) {
            locationSearch += `, ${countryName}`
        }

        console.log("getSearchHistoryCard, stateName: ", stateName);
        console.log("getSearchHistoryCard, countryName: ", countryName)

        console.log(`$.{stateName || countryName}: ${stateName || countryName}`)
        return (
            $.parseHTML(`<a href="" data-location-search="${locationSearch}"class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <p class="mb-1">${cityName}, ${stateName || countryName}</p>
                </div>
            </a>`)
        )
    }

    // ----- Listeners -----
    $searchForm.submit((event) => handleFormSubmit(event))

    $searchHistoryContainer.on("click", "a", function (event) {
        event.preventDefault();

        const location = $(this).data("location-search");
        console.log("location to search from history: ", location)

        // Change input value to search history card text
        $cityInput.val(location);

        // Call handleSubmit to read input and re-search
        $searchForm.submit();

    })

    // ----- Initialize -----
    handleInit();

})