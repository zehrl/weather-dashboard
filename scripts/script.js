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
            console.log(`Coordinate Response: `, response)
            coordinates = {
                lat: response[0].lat,
                lon: response[0].lon
            }
        });

        return coordinates;
    }

    const getData = async() => {
        let coordinates = await getCoordinates("Fort Wayne");
        // let weather = await getWeather();
        console.log("Await coordinates: ", coordinates);
    }

    getData();

    // const getWeather = async (lat, lon) => {

    //     // UV Index
    //     const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    //     console.log("getting weather...")

    //     // await $.ajax({
    //     //     url: url,
    //     //     type: "get"
    //     // }).done(function (response) {
    //     //     // Current UV Index

    //     //     console.log('Weather Response: ', response)
    //     //     console.log(`Current UV Index = ${response.value}`)

    //     //     // console.log(response)
    //     // });

    //     setTimeout(()=>{return "test"}, 5000)

    // }

})