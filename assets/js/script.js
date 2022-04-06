var tempVacationDataArray = [,[]];
var tempVacationDateObj = {};

$("#start-date").datepicker({
    minDate: 1
});
$("#end-date").datepicker({
    minDate: 1
});

$("#name-date-submit").on("click",function(){ // function is run when the name-date-submit button is pressed
    
    var tempDifference = dayjs($("#end-date").val()); // gets a value from the end date box
    var dateDifference = tempDifference.diff($("#start-date").val(),'day') // variable used for the number of days between dates
    
    if($("#start-date").val()>$("#end-date").val()){ // checks to make sure the end date is after the start date
        displayErrorMessage("Please choose a valid starting and ending date.")
    }
    else if(dateDifference > 7){ // makes sure that the dates are not more than a week apart
        displayErrorMessage("Please choose dates that are 7 days apart max.")
    }
    else if($("#adventure-name").val() == "" || $("#adventure-name").val() == null){
        displayErrorMessage("Please enter an Adventure Name.")
    }
    else{
        tempVacationDataArray = [$("#adventure-name").val(),[]];
        
        for (i = 0; i < dateDifference+1; i++) { //the +1 is to allow the loop to count the current day as well
            var currentDate = dayjs($("#start-date").val()).add(i,'day').toDate() //grabs the start date and add iteration number of days to it
            tempVacationDateObj = { //this makes all of the objects for the array, and sets some values too
                date: dayjs(currentDate).format("MM/DD/YYYY"), //makes the date format easier to read
                loc: "",
                activity: "",
                map: "",
                icon: "",
                hiTemp: null, 
                loTemp: null,
                humidity: null,
                uvi: null,
                wind: null,
                sunrise: "",
                sunset:  ""
            }; 
            tempVacationDataArray[1].push(tempVacationDateObj); 
            // initiate fetch of weather data for a given location and date - also passing the vacation name for saving the information to an array, then local storage  
        }
        fetchLocationData("Mechanicsville,VA");
        saveData();
        //makeBlocksFunction()
    }
})

// function to extract the weather data for a given location and date and save it to a temp object/array
var returnForecastData = function (location, map_url, weatherData,) {

    // need to find weather for date passed - using a for loop to check all the dates in the returned weatherData
    for (i=0; i < tempVacationDataArray[1].length; i++) {
        tempVacationDataArray[1][i].loc = location,
        tempVacationDataArray[1][i].map = map_url,
        tempVacationDataArray[1][i].icon = weatherData.daily[i].weather[0].icon,
        tempVacationDataArray[1][i].hiTemp = Math.round(weatherData.daily[i].temp.max), 
        tempVacationDataArray[1][i].loTemp = Math.round(weatherData.daily[i].temp.min),
        tempVacationDataArray[1][i].humidity = weatherData.daily[i].humidity,
        tempVacationDataArray[1][i].uvi = weatherData.daily[i].uvi,
        tempVacationDataArray[1][i].wind = Math.round(weatherData.daily[i].wind_speed),
        tempVacationDataArray[1][i].sunrise = dayjs(new Date(weatherData.daily[i].sunrise*1000)).format("h:mm A"),
        tempVacationDataArray[1][i].sunset =  dayjs(new Date(weatherData.daily[i].sunset*1000)).format("h:mm A")
    }
 };


// function to retrieve weather data for a given location for a given date - note arguments to pass
var fetchWeatherData = function(lat, lon, loc, units, map_url) {

    var apiKey = "12afd4d18f110d35ce3359c3e1919c84";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&appid=" + apiKey;

    fetch(forecastUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){

                returnForecastData(loc, map_url, data)

            });
        }  else {
            displayErrorMessage("OpenWeather User Not Found  " + response.status);
        }
    })
    .catch(function(error){
        // notice this .catch() is getting chained on the end of the .then() method
        displayErrorMessage("Unable to connect to OpenWeather  " + error);
    });
};

// function to get location data for location and pass it on to the weather fetch function
var fetchLocationData = function(location) {

    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "https://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";

    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){


                fetchWeatherData(data.data[0].latitude, data.data[0].longitude, location, "imperial", data.data[0].map_url);    
                
            });            

        }  else {
            displayErrorMessage("Positionstack User Not Found  " + response.status);
        }
    })
    .catch(function(error){
        // notice this .catch() is getting chained on the end of the .then() method
        displayErrorMessage("Unable to connect to positionstack  " + error);
    });
    
};

// a function to display an error message through the error message modal
var displayErrorMessage = function (message) {
    $("#modal-error").addClass("is-active");
    $(".error-msg-text").text(message);
};

var saveData = function(){ // saves the id num and inner text to the local storage
    console.log(tempVacationDataArray);
    localStorage.setItem("vacation", JSON.stringify(tempVacationDataArray))
}
  
var loadData = function(){ // loads data from the local storage into our array
    if(tempVacationDataArray !== null){
        tempVacationDataArray = localStorage.getItem("vacation", JSON.stringify(tempVacationDataArray));
        tempVacationDataArray = JSON.parse(tempVacationDataArray);
        //makeBlocksFunction()
    }
}

loadData()
// ************************************** Start of pseudocode *****************************************
// (name/date input function) get vacation name and start/end dates for trip.  Use a date picker for the dates.  Need to add a Build Trip button to process entered values.
    // On click of the build trip button, validate that the end date is within 7 days of current date.  If not, display a modal with an error msg 
        // and a box to enter another date.  Use a date picker.  Suggest that this modal have fields for both the start/end dates and populated
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
