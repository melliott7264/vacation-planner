var mapChange = function () {
    // Read the changeIndex passed as a search string
    changeIndex=window.location.search.charAt(1);
    console.log(tempVacationDataArray[1][changeIndex].loc);
    // place the location as a subtitle
    $(".subtitle-map").text(tempVacationDataArray[1][changeIndex].loc);
    // place the correct map url in the iframe
    $(".local-map-embed").attr("src", tempVacationDataArray[1][changeIndex].map).attr("title",tempVacationDataArray[1][changeIndex].loc);
    return;
}

mapChange();
