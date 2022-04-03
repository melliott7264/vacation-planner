
// function to retrieve weather data required for application
var fetchWeatherData = function(lat, lon, loc, units) {

    var apiKey = "12afd4d18f110d35ce3359c3e1919c84";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&appid=" + apiKey;

    fetch(forecastUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){

            console.log(loc, data);
        });
        }  else {
            alert("Error: OpenWeather User Not Found  " + response.status);
        }
    })
    .catch(function(error){
        // notice this .catch() is getting chained on the end of the .then() method
        alert("Unable to connect to OpenWeather  " + error);
    });
};

// function to get location data for city entered in search box
var fetchLocationData = function(location) {

   
    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "https://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";

    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){

                console.log(data);

            var lat =data.data[0].latitude;
            var lon =data.data[0].longitude;
            var loc = location;
       
            // call fetch of weather data for current city
            fetchWeatherData(lat, lon, loc, "imperial");
        });
        }  else {
            alert("Error: positionstack User Not Found  " + response.status);
        }
    })
    .catch(function(error){
        // notice this .catch() is getting chained on the end of the .then() method
        alert("Unable to connect to positionstack  " + error);
    });
    
};

fetchLocationData("Richmond,VA");