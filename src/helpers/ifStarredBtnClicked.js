function ifStarredBtnClicked(sortedPredictedArray, localStorageVal){

    let starFound = document.getElementById("starred-none");
    $("#tab-choose .btn-starred").click(function() {
      $("#tab-choose .btn-starred").addClass("active");
      $("#tab-choose .btn-country").removeClass("active");
      $(".content").hide();
      $("#starred-none").show();
      $("#results-not-found").hide();
      if (localStorage.getItem(`${localStorageVal}`) === null) {
        starFound.innerHTML = `You haven't starred any country.`;
      } else {
        let starredCountriesArray = JSON.parse(
          localStorage.getItem(`${localStorageVal}`)
        );

        if (starredCountriesArray && starredCountriesArray.length) {
          starFound.innerHTML = ``;
        } else {
          starFound.innerHTML = `You haven't starred any country.`;
        }

        starredCountriesArray.forEach(i => {
          $('.content .country-names:contains("' + i + '")')
            .closest(".content")
            .show();
        });

        sortedPredictedArray.forEach((i, index) => {
          if (typeof Storage !== "undefined") {
            if (localStorage.getItem(`${localStorageVal}`) === null) {
              //
            } else {
              let starredCountriesGenStarred = JSON.parse(
                localStorage.getItem(`${localStorageVal}`)
              );

              if (starredCountriesGenStarred.includes(i.country)) {
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
      }
    });

}

export default ifStarredBtnClicked;