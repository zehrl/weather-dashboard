$(function () {
    const apiKey = "e452aa651bd80481f1b2311b6f81f11d"

    // Handle initial loading of data

    // Handle form submit

    // Render search history

    // Render today's forecast

    // Render 5-day forecast

    // get today's forecast

    const getCoordinates = async (cityName) => {

        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
        let coordinates = {lat: "N/A", lon: "N/A"};

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

    const getData = async() => {
        let coordinates = await getCoordinates("Fort Wayne");
        console.log("Await coordinates: ", coordinates);
        let weather = await getWeather(coordinates.lat, coordinates.lon);
        console.log("Await weather: ", weather);

        return weather;
    }

    getData();

})