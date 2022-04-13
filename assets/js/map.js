var mapChange = function () {
    // Read the changeIndex passed as a search string
    changeIndex=window.location.search.charAt(1);
    // place the location as a subtitle
    $(".subtitle-map").text(tempVacationDataArray[planIndex][changeIndex].loc);
    // place the correct map url in the iframe
    $(".local-map-embed").attr("src", tempVacationDataArray[planIndex][changeIndex].map).attr("title",tempVacationDataArray[planIndex][changeIndex].loc);
    return;
}

mapChange();
