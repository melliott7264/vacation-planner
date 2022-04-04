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

// ************************************** Start of pseudocode *****************************************
// (name/date input function) get vacation name and start/end dates for trip.  Use a date picker for the dates.  Need to add a Build Trip button to process entered values.
    // On click of the build trip button, validate that the end date is within 16 days of current date.  If not, display a modal with an error msg 
        // and a box to enter another date.   Use a date picker.  Suggest that this modal have fields for both the start/end dates and populated
        // with the dates we have, if any.
    // If a vacation name is entered without start/end dates, (load function) check to see if it is already in local storage.  If so,  retrieve the start/end dates.
        // Otherwise display a model box with an error msg to enter dates.   May be the same box as above.

// ( save function) If it doesn't already exist, create an object with the vacation name and save that object with the start/end dates to local storage

// (day block display function) Use trip dates in a loop to:
    // (two existing API fetch functions) fetch the weather (will have to change endpoint to get 16 day forecast) for the location and 
        // (forecast extraction function) extract the correct day's weather from data returned (relative to current day) and pass it back to the display function
    // display a block for each day in the trip including the date, the location if we have one yet, an event description if we have one, 
        //the weather for that date if we have a loation, an edit button and a map icon.
        // Display code should be preceeded by code to clear any existing day blocks.
        // Create/recreate day blocks
            // write date
            // write activity description 
            // write weather data to include:
                // weather icon
                // high and low temperature
                // humidity
                // UVI
                // sunrise and sunset
            // map icon/link
            // edit button

// (function) On click of Edit button on any given day block, display modal and get the activity description and location and save it to the current vacation name object in local storage
    // Modal should have a save and cancel/close button
    // On click of save button, save the description and location to the appropriate vacation name object in local storage
    // Call the day block display function



fetchLocationData("Richmond,VA");

