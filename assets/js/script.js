var tempVacationDataArray = [];
var tempVacationDateObj = {};

// function to extract the weather data for a given location and date and save it to a temp object/array
var returnForecastData = function (vacationName, location, date, map_url, weatherData,) {

    console.log(location, weatherData);

    // need to find weather for date passed - using a for loop to check all the dates in the returned weatherData
    for (i=0; i < weatherData.daily.length; i++) {
        // check date against date passed
        if (date === dayjs(new Date(weatherData.daily[i].dt*1000)).format("YYYYMMDD")){
            // example data returned
            console.log(vacationName, location, dayjs(new Date(weatherData.daily[i].dt*1000)).format("MM/DD/YYYY"));
            console.log(map_url);
            console.log(weatherData.daily[i].weather[0].icon);
            // HTML format for icon:  "http://openweathermap.org/img/w/" + weatherData.daily[i].weather[0].icon + ".png"
            console.log(Math.round(weatherData.daily[i].temp.min), Math.round(weatherData.daily[i].temp.max));
            console.log(weatherData.daily[i].humidity);
            console.log(weatherData.daily[i].uvi);
            console.log(dayjs(new Date(weatherData.daily[i].sunrise*1000)).format("h:mm A"), dayjs(new Date(weatherData.daily[i].sunset*1000)).format("h:mm A"));

            // load data for a given date in a temporary object
            tempVacationDateObj = {
                name: vacationName,
                date: dayjs(new Date(weatherData.daily[i].dt*1000)).format("MM/DD/YYYY"),
                loc: location,
                map: map_url,
                icon: weatherData.daily[i].weather[0].icon,
                hiTemp: Math.round(weatherData.daily[i].temp.max), 
                loTemp: Math.round(weatherData.daily[i].temp.min),
                humidity: weatherData.daily[i].humidity,
                uvi: weatherData.daily[i].uvi,
                sunrise: dayjs(new Date(weatherData.daily[i].sunrise*1000)).format("h:mm A"),
                sunset:  dayjs(new Date(weatherData.daily[i].sunset*1000)).format("h:mm A")
            };
            //  push that temporary object on an array under the vacation name
            //  
            tempVacationDataArray.push(tempVacationDateObj);

        } else {
            console.log("Matching date not found");
        }
    }
 };
// function to retrieve weather data for a given location for a given date - note arguments to pass
var fetchWeatherData = function(vacationName, lat, lon, loc, units, date, map_url) {

    var apiKey = "12afd4d18f110d35ce3359c3e1919c84";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&appid=" + apiKey;

    fetch(forecastUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){

                returnForecastData(vacationName, loc, date, map_url, data)

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

// function to get location data for location and pass it on to the weather fetch function
var fetchLocationData = function(vacationName, location, date) {

    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "https://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";

    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){


                fetchWeatherData(vacationName, data.data[0].latitude,data.data[0].longitude, location, "imperial", date, data.data[0].map_url);    
                
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


// hard coded values for testing fetches of API data
var date = dayjs(new Date()).format("YYYYMMDD");

// initiate fetch of weather data for a given location and date - also passing the vacation name for saving the information to an array, then local storage
fetchLocationData("Vacation One", "Mechanicsville,VA", date);

// ************************************** Start of pseudocode *****************************************
// (name/date input function) get vacation name and start/end dates for trip.  Use a date picker for the dates.  Need to add a Build Trip button to process entered values.
    // On click of the build trip button, validate that the end date is within 16 days of current date.  If not, display a modal with an error msg 
        // and a box to enter another date.   Use a date picker.  Suggest that this modal have fields for both the start/end dates and populated
        // with the dates we have, if any.
    // If a vacation name is entered without start/end dates, (load function) check to see if it is already in local storage.  If so,  retrieve the start/end dates.
        // Otherwise display a model box with an error msg to enter dates.   May be the same box as above.

// ( save function) If it doesn't already exist, create an object with the vacation name and save that object with the start/end dates to local storage

// (day block display function) Use trip dates in a loop to:

    // (two existing API fetch functions) fetch the weather for the location and date - must validate date passed to be within 7 days of the current date - otherwise get a new end date.
        // (forecast extraction function) extract the correct day's weather from data returned (relative to current day) and pass it back to the display function via a temp object array
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
