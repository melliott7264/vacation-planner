var mapChange = function () {
    // Read the changeIndex and planIndex passed as a search string - first slice off "?"" then separate values on "&"" - an array results
    var searchStr = window.location.search.slice(1,window.location.search.length).split("&");
    // get the changeIndex
    changeIndex = searchStr[0];
    // get the planIndex
    planIndex = searchStr[1]; 
    // place the location as a subtitle
    $(".subtitle-map").text(tempVacationDataArray[planIndex][changeIndex].loc);
    // place the correct map url in the iframe
    $(".local-map-embed").attr("src", tempVacationDataArray[planIndex][changeIndex].map).attr("title",tempVacationDataArray[planIndex][changeIndex].loc);
    // place the planIndex is the search string passed back to index.html
    $("#back-href").attr("href", "index.html?" + changeIndex + "&" + planIndex);

    return;
}

mapChange();
