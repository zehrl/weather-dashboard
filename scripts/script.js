const cityName = "Fort Wayne"
const apiKey = "e452aa651bd80481f1b2311b6f81f11d"


// Weather

const findWeather = () => {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`
    
    $.ajax({
        url: weatherUrl,
        type: "get"
    }).done(function (response) {
        // Current Temperature
        console.log(`Current Temp = ${response.main.temp} F`)
        
        // Current Humidity
        console.log(`Current Humidity = ${response.main.humidity}%`)
        
        // Current Wind Speed
        console.log(`Current Wind Speed = ${response.wind.speed} mph`)
        
        // Coordinates
        console.log(`Lat: ${response.coord.lat}, Long: ${response.coord.lon}`)
        findUvIndex(response.coord.lat, response.coord.lon)
        
        
        // console.log(response)
    });
    
}

const findUvIndex = (lat, lon) => {

    // UV Index
    const uvIndexUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

    $.ajax({
        url: uvIndexUrl,
        type: "get"
    }).done(function (response) {
        // Current UV Index
        console.log(`Current UV Index = ${response.value}`)

        // console.log(response)
    });

}
