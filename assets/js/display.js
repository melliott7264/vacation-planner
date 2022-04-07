// display date blocks for each date in array
var displayDateBlocks = function() {
    // define overall container that holds temporary content
   var datesContainerEl = $("#dates-container")

   // clear old dates before writing new content
   if ($(".dates-content")) {
       $(".dates-content").remove();
   }

   //Build new temporary dates-content container 
   var tempContainerEl = $("<div>").addClass("dates-content m-4");
   datesContainerEl.append(tempContainerEl);

   // will need a for loop to populate all the day blocks
   for (var i = 0; i < tempVacationDataArray[1].length; i++) {
        //Build new day block
        var dayContentBlockEl = $("<div>").addClass("day-content is-flex is-flex-direction-column box");
        tempContainerEl.append(dayContentBlockEl);

        var rowOneContentEl = $("<div>").addClass("row-one is-flex columns");
        var rowTwoContentEl = $("<div>").addClass("row-two is-flex columns");
        dayContentBlockEl.append(rowOneContentEl, rowTwoContentEl);

        // Row 1 content
        var dateContentEl  = $("<p>").addClass("day-date column is-mobile").text(tempVacationDataArray[1][i].date);
        var activityContentEl = $("<p>").addClass("day-activity column is-three-fifths is-mobile").text(tempVacationDataArray[1][i].activity);
        var editButtonEl = $("<button>").addClass("js-modal-trigger button is-success is-outlined column is-one-fifth is-mobile edit-btn").attr("data-target","modal-edit").text("Edit");
        rowOneContentEl.append(dateContentEl, activityContentEl, editButtonEl);

        // Row 2 columns
        var weatherColumnEl = $("<div>").addClass("weather-column column");
        var tempColumnEl = $("<div>").addClass("temp-column column");
        var sunColumnEl = $("<div>").addClass("sun-column column");
        var mapButtonEl = $("<button>").addClass("button is-primary is-outlined column is-one-fifth map-btn").text("Map");
        rowTwoContentEl.append(weatherColumnEl, tempColumnEl, sunColumnEl, mapButtonEl);

        // weather column content
        var locationEl = $("<p>").addClass("location has-text-centered").text(tempVacationDataArray[1][i].loc);
        var weatherIconEl = $("<img>").addClass("weather-icon m-auto").attr("src", "http://openweathermap.org/img/w/" + tempVacationDataArray[1][i].icon + ".png");
        weatherColumnEl.append(locationEl, weatherIconEl);

        // temp column content
        var highTempEl = $("<p>").addClass("forecast-weather-data").text("High  " + tempVacationDataArray[1][i].hiTemp + " F");
        var lowTempEl = $("<p>").addClass("forecast-weather-data").text("Low   " + tempVacationDataArray[1][i].loTemp + " F");
        var humidityEl = $("<p>").addClass("forecast-weather-data").text("Humidity  " + tempVacationDataArray[1][i].humidity + " %");

        // Need to check UVI levels and set a status color; good, warning, danger
        if (tempVacationDataArray[1][i].uvi <= 2) {
            var uviEl = $("<p>").addClass("forecast-weather-data uvi has-background-success has-text-white").text("UV Index: " + tempVacationDataArray[1][i].uvi);
        } else if (tempVacationDataArray[1][i].uvi >2 && tempVacationDataArray[1][i].uvi <6) {
            var uviEl = $("<p>").addClass("forecast-weather-data uvi has-background-warning has-text-black").text("UV Index: " + tempVacationDataArray[1][i].uvi);
        } else {
            var uviEl = $("<p>").addClass("forecast-weather-data uvi has-background-danger has-text-white").text("UV Index: " + tempVacationDataArray[1][i].uvi);
        }

        tempColumnEl.append(highTempEl, lowTempEl, humidityEl, uviEl);

        // sunrise/sunset column
        var sunriseEl = $("<p>").addClass("forecast-weather-data").text("Sunrise  " + tempVacationDataArray[1][i].sunrise);
        var sunsetEl = $("<p>").addClass("forecast-weather-data").text("Sunset    " + tempVacationDataArray[1][i].sunset);
        var windEl = $("<p>").addClass("forecast-weather-data").text("Wind  " + tempVacationDataArray[1][i].wind + " MPH");
        sunColumnEl.append(sunriseEl, sunsetEl, windEl);
    } // end of for loop
   
    return;
}; // End of Display function

// add event listener to display Edit modal on click of edit buttons
$("#dates-container").on("click", ".js-modal-trigger", function(){
    console.log("clicked on edit button");
    $("#modal-edit").addClass("is-active");
});

// add event listener for map button
$("#dates-container").on("click", ".map-btn", function(){
    console.log("clicked on map button");
    
});

