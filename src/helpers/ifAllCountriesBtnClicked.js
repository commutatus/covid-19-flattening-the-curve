function ifAllCountriesBtnClicked(sortedPredictedArray, localStorageVal){
    $("#tab-choose .btn-country").click(function() {
      $("#tab-choose .btn-starred").removeClass("active");
      $("#tab-choose .btn-country").addClass("active");
      $(".content").show();
      $("#starred-none").hide();
      $("#results-not-found").hide();
      sortedPredictedArray.forEach((i, index) => {
        if (typeof Storage !== "undefined") {
          if (localStorage.getItem(`${localStorageVal}`) === null) {
            //
          } else {
            let starredCountriesGenAddress = JSON.parse(
              localStorage.getItem(`${localStorageVal}`)
            );

            if (starredCountriesGenAddress.includes(i.country)) {
              $("#chart-star-" + index + "")
                .removeClass("inactive")
                .addClass("btn-star-active");
              $("#fa-star-" + index + "").addClass("star-color");
            }
          }
        } else {
          console.log(`Your browser doesn't support Web Storage!`);
        }
      });
    });
}

export default ifAllCountriesBtnClicked;