function starredButtonOnClick(i, index, localStorageVal, starredCountries){
    let starredClick = document.getElementById(`chart-star-${index}`);

    $("#chart-star-" + index + "").click(function() {
      $(this)
        .removeClass("inactive")
        .addClass("btn-star-active");
      $("#fa-star-" + index + "").addClass("star-color");
    });

    starredClick &&
      starredClick.addEventListener("click", e => {
        if (typeof Storage !== "undefined") {
          if (localStorage.getItem(`${localStorageVal}`) === null) {
            starredCountries.push(i.country);
            localStorage.setItem(`${localStorageVal}`, JSON.stringify(starredCountries));
          } else {
            starredCountries = JSON.parse(localStorage.getItem(`${localStorageVal}`));

            if (starredCountries.includes(i.country)) {
              starredCountries = starredCountries.filter(
                e => e !== i.country
              );
              localStorage.setItem(
                `${localStorageVal}`,
                JSON.stringify(starredCountries)
              );
              $("#chart-star-" + index + "").removeClass("btn-star-active");
              $("#fa-star-" + index + "").removeClass("star-color");
            } else {
              starredCountries.push(i.country);
              localStorage.setItem(
                `${localStorageVal}`,
                JSON.stringify(starredCountries)
              );
            }
          }
        } else {
          console.log(`Your browser doesn't support Web Storage!`);
        }
      });
}

export default starredButtonOnClick;