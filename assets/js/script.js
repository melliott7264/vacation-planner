var tempVacationDataArray = [,[]];
var tempVacationDateObj = {};

// This function gets a vacation/adventure name and trip dates from which everthing else is initiated
var startUp = function () {

    $("#start-date").datepicker({
        minDate: 0
    });
    $("#end-date").datepicker({
        minDate: 0
    });

    $("#name-date-submit").on("click",function(){ // function is run when the name-date-submit button is pressed
        var today = dayjs();
        var endVal = dayjs($("#end-date").val()); // gets a value from the end date box
        var startVal = dayjs($("#start-date").val());
        var endDifference = endVal.diff(today, 'day');
        var startDifference = startVal.diff(today, 'day');
        var dateDifference = endVal.diff(startVal,'day'); // variable used for the number of days between dates

        if($("#start-date").val()>$("#end-date").val()){ // checks to make sure the end date is after the start date
            displayErrorMessage("Please choose a valid starting and ending date.")
            }
            else if($("#adventure-name").val() == "" || $("#adventure-name").val() == null){
                displayErrorMessage("Please enter an Adventure Name.")
            }
            else if(startDifference >= 7){
                displayErrorMessage("Please keep the Adventure dates within one week from today, so that a proper weather forecast can be made.")
            }
            else if(endDifference >= 7){
                displayErrorMessage("Please keep the Adventure dates within one week from today, so that a proper weather forecast can be made.")
            }
            else{
                tempVacationDataArray = [$("#adventure-name").val(),[]];
                
                for (i = 0; i < dateDifference+1; i++) { //the +1 is to allow the loop to count the current day as well
                    var currentDate = dayjs($("#start-date").val()).add(i,'day').toDate() //grabs the start date and add iteration number of days to it
                    tempVacationDateObj = { //this makes all of the objects for the array, and sets some values too
                        date: dayjs(currentDate).format("MM/DD/YYYY"), //makes the date format easier to read
                        loc: "Anywhere, USA",
                        activity: "No Scheduled Activities",
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
                saveData();
                displayDateBlocks();
            }
    })
};

// function to extract the weather data for a given location and date and save it to a temp object/array
var returnForecastData = function (vacationName, location, date, map_url, weatherData, changeIndex) {

    // need to find weather for date passed - using a for loop to check all the dates in the returned weatherData
    for (i=0; i < weatherData.daily.length; i++) {
        // check date against date passed
        if (date === dayjs(new Date(weatherData.daily[i].dt*1000)).format("MM/DD/YYYY")){

            tempVacationDataArray[1][changeIndex].loc = location,
            tempVacationDataArray[1][changeIndex].map = map_url,
            tempVacationDataArray[1][changeIndex].icon = weatherData.daily[i].weather[0].icon,
            tempVacationDataArray[1][changeIndex].hiTemp = Math.round(weatherData.daily[i].temp.max), 
            tempVacationDataArray[1][changeIndex].loTemp = Math.round(weatherData.daily[i].temp.min),
            tempVacationDataArray[1][changeIndex].humidity = weatherData.daily[i].humidity,
            tempVacationDataArray[1][changeIndex].uvi = weatherData.daily[i].uvi,
            tempVacationDataArray[1][changeIndex].wind = Math.round(weatherData.daily[i].wind_speed),
            tempVacationDataArray[1][changeIndex].sunrise = dayjs(new Date(weatherData.daily[i].sunrise*1000)).format("h:mm A"),
            tempVacationDataArray[1][changeIndex].sunset =  dayjs(new Date(weatherData.daily[i].sunset*1000)).format("h:mm A")
            
        } else {
            console.log("Matching date not found");
        }
    };
    saveData();
    displayDateBlocks();
 };


// function to retrieve weather data for a given location for a given date - note arguments to pass
var fetchWeatherData = function(vacationName, lat, lon, loc, units, date, map_url, changeIndex) {

    var apiKey = "12afd4d18f110d35ce3359c3e1919c84";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&appid=" + apiKey;

    fetch(forecastUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){

                returnForecastData(vacationName, loc, date, map_url, data, changeIndex)

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
var fetchLocationData = function(vacationName, location, date, changeIndex) {

    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "https://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";

    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){


                fetchWeatherData(vacationName, data.data[0].latitude,data.data[0].longitude, location, "imperial", date, data.data[0].map_url, changeIndex);    
                
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

var startUpMessage = function () {
    $("#modal-startup").addClass("is-active");
    $(".startup-msg-text").text("Please start your Adventure by entering an Adventure Name and a trip Start Date and an End Date on the next screen.  Click the Submit Name/Dates button when you are done.");
};

var saveData = function(){ // saves the id num and inner text to the local storage
    localStorage.setItem("vacation", JSON.stringify(tempVacationDataArray));
    return;
};
  
var loadData = function(){ // loads data from the local storage into our array
    if (localStorage.getItem("vacation")) {
        tempVacationDataArray = JSON.parse(localStorage.getItem("vacation"));
        loadNameDates();        
        displayDateBlocks();
    } else {
        startUpMessage();
        startUp();
    }
    
};

var loadNameDates = function(){
    $("#adventure-name").val(tempVacationDataArray[0]);
    $("#start-date").val(tempVacationDataArray[1][0].date);
    $("#end-date").val(tempVacationDataArray[1][tempVacationDataArray[1].length-1].date);
}
// Load array from localStorage before all other actions
loadData()
