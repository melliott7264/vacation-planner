var tempVacationDataArray = [[]];
var tempVacationDateObj = {};
var planIndex = 0;

// This function finds the index for the current trip plan in the tempVacationDataArray - returns planIndex used by the rest of the scripts/functions
var findIndex = function (name) {
    if (localStorage.getItem("vacation")) {
        for (var i=0; i< tempVacationDataArray.length; i++) {
                if (tempVacationDataArray[i][0].name === name){
                    return i;
                }
            }

    }
    return false;
}

// This function gets a vacation/adventure name and trip dates from which everything else is initiated
var startUp = function () {

    $("#start-date").datepicker({
        minDate: 0
    });
    $("#end-date").datepicker({
        minDate: 0
    });

    $("#name-date-submit").off().on("click",function(){ // function is run when the name-date-submit button is pressed
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
            else{  // if no other name exists in the array create a new entry in the array for a trip plan 
                  
                planIndex = findIndex($("#adventure-name").val());

                if (planIndex === false){

                    // if array is not empty then set currentIndex to tempVacationDataArray.length
                    if (tempVacationDataArray[0].length > 0) {
                        currentIndex = tempVacationDataArray.length;
                        tempVacationDataArray[currentIndex] = [];
                    } else {
                        currentIndex = 0;
                    }
                    for (i = 0; i < dateDifference+1; i++) { //the +1 is to allow the loop to count the current day as well
                        var currentDate = dayjs($("#start-date").val()).add(i,'day').toDate() //grabs the start date and add iteration number of days to it
                        tempVacationDateObj = { //this makes all of the objects for the array, and sets some values too
                            name: $("#adventure-name").val(),
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
                
                        tempVacationDataArray[currentIndex].push(tempVacationDateObj);

                        // initiate fetch of weather data for a given location and date - also passing the vacation name for saving the information to an array, then local storage  
                    }
                    saveData();
                    displayDateBlocks($("#adventure-name").val());
                } else {
                    displayDateBlocks($("#adventure-name").val());
                }
             
            }
    })
};

// function to extract the weather data for a given location and date and save it to a temp object/array
var returnForecastData = function (vacationName, location, date, map_url, weatherData, changeIndex) {
    planIndex=findIndex(vacationName);
    // need to find weather for date passed - using a for loop to check all the dates in the returned weatherData
    for (i=0; i < weatherData.daily.length; i++) {
        // check date against date passed
        if (date === dayjs(new Date(weatherData.daily[i].dt*1000)).format("MM/DD/YYYY")){

            tempVacationDataArray[planIndex][changeIndex].loc = location,
            tempVacationDataArray[planIndex][changeIndex].map = map_url,
            tempVacationDataArray[planIndex][changeIndex].icon = weatherData.daily[i].weather[0].icon,
            tempVacationDataArray[planIndex][changeIndex].hiTemp = Math.round(weatherData.daily[i].temp.max), 
            tempVacationDataArray[planIndex][changeIndex].loTemp = Math.round(weatherData.daily[i].temp.min),
            tempVacationDataArray[planIndex][changeIndex].humidity = weatherData.daily[i].humidity,
            tempVacationDataArray[planIndex][changeIndex].uvi = weatherData.daily[i].uvi,
            tempVacationDataArray[planIndex][changeIndex].wind = Math.round(weatherData.daily[i].wind_speed),
            tempVacationDataArray[planIndex][changeIndex].sunrise = dayjs(new Date(weatherData.daily[i].sunrise*1000)).format("h:mm A"),
            tempVacationDataArray[planIndex][changeIndex].sunset =  dayjs(new Date(weatherData.daily[i].sunset*1000)).format("h:mm A")
            
        } else {
            console.log("Matching date not found");
        }
    };
    saveData();
    displayDateBlocks(vacationName);
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

var selectedPlan = ""

// This function uses the modal-selection to get a selected plan for a list passed to this function.  
var getPlanSelection = function  () {
    // check to see if more than one vacation plan
    if (tempVacationDataArray.length >= 1) {
        var planListArray = [];
        // find and list all vacation names
        for (i=0; i < tempVacationDataArray.length; i++) {
            // Just getting the name from the first entry 
            planListArray.push(tempVacationDataArray[i][0].name);
        }
    }

    // call function to display modal with drop-down menu generated from planList
    displayPlanSelection(planListArray);
    $("#trip-plan").selectmenu();

    // get selection on click of selection button - listen on div #plan-selection for modal-selection-btn
    $("#modal-selection").on("click", ".modal-selection-btn", function(){
        console.log("clicked on plan selection");
        // get selected plan
        selectedPlan = $("#trip-plan :selected").val();
        // close modal
        $("#modal-selection").removeClass("is-active");
        // get the index of the selected plan to send to loadNameDates and displayDateBlocks
        planIndex = findIndex(selectedPlan);
       
        loadNameDates(planIndex);        
        displayDateBlocks(tempVacationDataArray[planIndex][0].name);

        });

    // Remove selection on click of button        
    $("#modal-selection").off().on("click", ".modal-selection-remove-btn", function(){  
        // get selected plan
        selectedPlan = $("#trip-plan :selected").val();
        // identify planIndex
        planIndex = findIndex(selectedPlan);
        // check if last trip in array.  If so,  must delete file vacation file
        if (tempVacationDataArray.length <= 1){
            localStorage.removeItem("vacation");
        } else {
            // remove entry for planIndex from the array
            tempVacationDataArray.splice(planIndex,1);
            saveData();
        } 
        
        }); 
};

var saveData = function(){ // saves the id num and inner text to the local storage
    localStorage.setItem("vacation", JSON.stringify(tempVacationDataArray));
    return;
};
  
var loadData = function(){ 
    // if it exists, load data from the local storage into our temp array
    if (localStorage.getItem("vacation")) {
        tempVacationDataArray = JSON.parse(localStorage.getItem("vacation"));
        // Must check first to see if planIndex has been passed in search string and give that priority
        if (window.location.search) {
            var searchStr = window.location.search.slice(1,window.location.search.length).split("&");
            // get the changeIndex
            changeIndex = searchStr[0];
            // get the planIndex
            planIndex = searchStr[1];
            loadNameDates(planIndex);        
            displayDateBlocks(tempVacationDataArray[planIndex][0].name);

        } else {
            // display list of plans and accept a selection - call function getPlanSelection - Will redirect execution to loadNameDates and displayDateBlocks
            getPlanSelection();
        }

    } else {
        startUpMessage();
        startUp();
    }  
};

var loadNameDates = function(index){
    $("#adventure-name").val(tempVacationDataArray[index][0].name);
    $("#start-date").val(tempVacationDataArray[index][0].date);
    $("#end-date").val(tempVacationDataArray[index][tempVacationDataArray[index].length-1].date);
};

// Load array from localStorage before all other actions
loadData();
