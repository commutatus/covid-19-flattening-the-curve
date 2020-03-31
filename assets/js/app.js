var api_url = "https://corona.lmao.ninja/all";
const confirmed = document.getElementById("total-confirmed");
const deaths = document.getElementById("total-deaths");
const recovered = document.getElementById("total-recovered");
const lastUpdated = document.getElementById("last-updated");
let starredCountries = [];
let sortedCountryArray = [];
let hospitalBedCapacity = [129511, 241847, 138862, 670272, 390336, 125990, 172430.4679, 39205.4376, 629072.9, 6246665.188, 56887.77504, 66377.15326, 66756.22848, 19516.4676, 95110.22808, 34566.84351, 22420.3683, 467630.7174, 97919.55456, 15117.64722, 236992.7783, 26139.7157, 61495.3981, 71000.54403, 14615.84656, 26464.581, 132535.404, 2917.05748, 1650517.816, 250544.5648, 40335.18411, 18173.5616, 146579.9538, 43881.05734, 1044.20358, 93997.4517, 121197.4533, 328228.338, 1683.582, 966003.0695, 9355.221, 1174772.419, 109581.078, 166064.332, 52754.9664, 0, 14040.8208, 6221.44915, 9923.9641, 22989.4952]
let totalHospitalBedCapacity = {
  "US": 129511, 
  "Italy": 241847, 
  "Spain": 138862, 
  "Germany": 670272, 
  "France": 390336, 
  "Iran": 125990, 
  "United Kingdom": 172430.4679, 
  "Switzerland": 39205.4376, 
  "Netherlands": 56887.77504,
  "Turkey": 236992.7783,
  "Belgium": 66756.22848,
  "Austria": 66377.15326,
  "Canada": 95110.22808, 
  "Portugal": 34566.84351,
  "Israel": 26139.7157,
  "Norway": 19516.4676,
  "Brazil": 467630.7174,
  "Korea, South": 629072.9, 
  "Australia": 97919.55456,
  "Sweden": 22420.3683, 
  "China": 6246665.188, 
  "Czechia": 71000.54403,
  "Ireland": 14615.84656,
  "Denmark": 15117.64722,
  "Chile": 40335.18411,
  "Malaysia": 61495.3981,   
  "Poland": 250544.5648,
  "Luxembourg":2917.05748,
  "Ecuador":26464.581, 
  "Romania":121197.4533,
  "Russia":1174772.419,
  "Pakistan":132535.404,  
  "Philippines":109581.078,
  "Japan":1650517.816,   
  "Saudi Arabia":93997.4517,
  "Finland":18173.5616, 
  "South Africa":166064.332,
  "Thailand":146579.9538,
  "Indonesia":328228.338,
  "Greece":43881.05734,
  "India":966003.0695,
  "Panama":9923.9641,
  "Iceland":1044.20358,
  "Peru":52754.9664,
  "Slovenia":9355.221, 
  "Croatia":22989.4952,
  "Estonia":6221.44915,
  "Singapore":14040.8208,
  "Qatar":1683.582 
}
$(document).ready(() => {
  getLatestInfo();
  getAllCountryGraphs();
});

function getLatestInfo() {
  $.ajax({
    url: api_url,
    contentType: "application/json",
    dataType: "json",
    success: function (res) {
      let globalStatsBoxLoader = document.getElementsByClassName(
        "global-stats-spinner"
      );
      for (i = 0; i < globalStatsBoxLoader.length; i++) {
        globalStatsBoxLoader[i].style.display = "none";
      }
      const latest = res;
      confirmed.innerHTML = `${latest.cases.toLocaleString()}`;
      deaths.innerHTML = `${latest.deaths.toLocaleString()}`;
      recovered.innerHTML = `${latest.recovered.toLocaleString()}`;
      lastUpdated.innerHTML = `${moment(latest.updated).format(
        "DD-MM-YY hh:mm A"
      )}`;
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function getAllCountryGraphs() {
  fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
      getSortedCountryArray(data);
      generateGraphCanvas();
      generateGraphContent(data);
    })
    .then(() => {
      userFunctions();
    });
}

function getSortedCountryArray(data) {
  let ChartsContainer = document.getElementById("province-graphs");
  ChartsContainer.style.display = "block";
  let mainLoaderContainer = document.getElementById("chart-loader");
  mainLoaderContainer.style.display = "none";
  let countriesArray = Object.keys(data);
  let totalCountryCountArray = [];
  countriesArray.forEach(country => {
    let countryTimelineArray = data[country];
    let countryRecoveredArray = countryTimelineArray.filter((item) => (item.recovered !== null))
    let latestRecoveredCount = countryRecoveredArray.length > 0 ? (countryRecoveredArray[countryRecoveredArray.length - 1]).recovered : 0
    let latestCountryCount =
      countryTimelineArray[countryTimelineArray.length - 1].confirmed -
      (countryTimelineArray[countryTimelineArray.length - 1].deaths +
        latestRecoveredCount);
    let latestDate = countryTimelineArray[countryTimelineArray.length - 1].date;
    totalCountryCountArray.push({
      country: country,
      count: latestCountryCount,
      lastUpdated: latestDate,
    });
  });
  sortedCountryArray = totalCountryCountArray.sort((a, b) =>
    a.count < b.count ? 1 : b.count < a.count ? -1 : 0
  );
  sortedCountryArray = sortedCountryArray.slice(0,50);
}

function generateGraphCanvas() {
  let container = document.getElementById("country-graphs");
  sortedCountryArray.forEach((i, index) => {
    if (typeof Storage !== "undefined") {
      if (localStorage.getItem("starred") === null) {
        container.innerHTML += `<div class='bg-light p-1 m-2 province-charts content' > 
            <button class="btn btn-star" id="chart-star-${index}"> 
              <i class="fas fa-star" id="fa-star-${index}"> </i> 
            </button>
            <div id='country-id-${index}' class='text-center' > 
              <p class= "country-names">${i.country}</p> 
            </div> 
            <canvas id='myChart${index}' width='100%'></canvas> 
            </div> `;
      } else {
        let starredCountriesGen = JSON.parse(localStorage.getItem("starred"));

        if (starredCountriesGen.includes(i.country)) {
          container.innerHTML += `<div class='bg-light p-1 m-2 province-charts content' > 
                  <button class="btn btn-star btn-star-active" id="chart-star-${index}"> 
                    <i class="fas fa-star star-color" id="fa-star-${index}"> </i> 
                  </button>
                  <div id='country-id-${index}' class='text-center' > 
                    <p class= "country-names">${i.country}</p> 
                  </div> 
                  <canvas id='myChart${index}' width='100%'></canvas> 
                </div> `;
        } else {
          container.innerHTML += `<div class='bg-light p-1 m-2 province-charts content' > 
              <button class="btn btn-star" id="chart-star-${index}"> 
                <i class="fas fa-star" id="fa-star-${index}"> </i> 
              </button>
              <div id='country-id-${index}' class='text-center' > 
                <p class= "country-names">${i.country}</p> 
              </div> 
              <canvas id='myChart${index}' width='100%'></canvas> 
              </div> `;
        }
      }
    } else {
      console.log(`Your browser doesn't support Web Storage!`);
    }
  });
}

function generateGraphContent(data) {
  sortedCountryArray.forEach((i, index) => {
    let xlabels = [];
    let ylabels = [];
    let dayCount = 0;
    let recentRecovered = 0
    data[i.country].forEach(e => {
      if (e.confirmed !== 0) {
        dayCount = dayCount + 1;
        ylabels.push(e.confirmed - (e.deaths + (e.recovered !== null ? e.recovered : recentRecovered)));
        xlabels.push(`${dayCount}`);
        if (e.recovered !== null) recentRecovered = e.recovered
      }
    });

    lastUpdatedValue = moment(
      sortedCountryArray[index].lastUpdated,
      "YYYY-MM-DD"
    ).format("DD/MM/YY");

    starredButtonOnClick(i, index);
    generateAllCharts(i, index, xlabels, ylabels);
  });
}

function starredButtonOnClick(i, index) {
  let starredClick = document.getElementById(`chart-star-${index}`);

  $("#chart-star-" + index + "").click(function () {
    $(this)
      .removeClass("inactive")
      .addClass("btn-star-active");
    $("#fa-star-" + index + "").addClass("star-color");
  });

  starredClick &&
    starredClick.addEventListener("click", e => {
      if (typeof Storage !== "undefined") {
        if (localStorage.getItem("starred") === null) {
          starredCountries.push(i.country);
          localStorage.setItem("starred", JSON.stringify(starredCountries));
        } else {
          starredCountries = JSON.parse(localStorage.getItem("starred"));

          if (starredCountries.includes(i.country)) {
            starredCountries = starredCountries.filter(e => e !== i.country);
            localStorage.setItem("starred", JSON.stringify(starredCountries));
            $("#chart-star-" + index + "").removeClass("btn-star-active");
            $("#fa-star-" + index + "").removeClass("star-color");
          } else {
            starredCountries.push(i.country);
            localStorage.setItem("starred", JSON.stringify(starredCountries));
          }
        }
      } else {
        console.log(`Your browser doesn't support Web Storage!`);
      }
    });
}

function generateAllCharts(i, index, xlabels, ylabels) {
  let ctx = document.getElementById(`myChart${index}`);
  var thresholdValue = hospitalBedCapacity[index];
  var thresholdHighArray = new Array(ylabels.length).fill(thresholdValue);
  let myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xlabels,
      datasets: [
        {
          label: `Active cases: ${sortedCountryArray[
            index
          ].count.toLocaleString()}`,
          data: ylabels,
          backgroundColor: ["rgba(255, 99, 132, 0.3)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          lineTension: 0.4,
          borderWidth: 1,
          pointRadius: 2,
          pointBackgroundColor: "rgba(255, 99, 132, 0.8)"
        },
        {
          label: `Hospital Beds: ${hospitalBedCapacity[index].toLocaleString()}`,
          data: thresholdHighArray,
          backgroundColor: ['rgba(235, 235, 235, 0.3)'],
          borderColor: ['rgba(255, 159, 64, 1)'],
          lineTension: 0.4,
          borderWidth: 1,
          pointRadius: 0,
        },
      ]
    },
    options: {
      tooltips: {
        callbacks: {
          title: function (tooltipItems, data) {
            return "";
          },
          label: function (tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].data[
              tooltipItem.index
            ].toLocaleString();
          }
        },
        enabled: true,
        mode: "nearest"
      },
      animation: {
        duration: 1000,
        easing: "easeOutSine"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: `Days since first confirmed case in ${i.country}`
            },
            ticks: {
              maxTicksLimit: 12
            }
          }
        ]
      }
    }
  });
}

function userFunctions() {
  $(document).ready(function () {
    searchCountries();
    ifAllCountriesBtnClicked();
    ifStarredBtnClicked();
  });
}

function searchCountries() {
  $("#results-not-found").hide();
  $("#search").keyup(function () {
    var text = $(this)
      .val()
      .toLowerCase();
    $(".content").hide();
    var resultCount = 0;
    $("#results-not-found").hide();
    $(".content .country-names").each(function () {
      if (
        $(this)
          .text()
          .toLowerCase()
          .indexOf("" + text + "") != -1
      ) {
        $(this)
          .closest(".content")
          .show();
        $("#results-not-found").hide();
        resultCount++;
      }

      if (resultCount == 0) {
        $("#results-not-found").show();
      }
    });
  });
}

function ifAllCountriesBtnClicked() {
  $("#tab-choose .btn-country").click(function () {
    $(".content").show();
    $("#starred-none").hide();
    $("#results-not-found").hide();
    sortedCountryArray.forEach((i, index) => {
      if (typeof Storage !== "undefined") {
        if (localStorage.getItem("starred") === null) {
          //
        } else {
          let starredCountriesGenAddress = JSON.parse(
            localStorage.getItem("starred")
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

function ifStarredBtnClicked() {
  let starFound = document.getElementById("starred-none");
  $("#tab-choose .btn-starred").click(function () {
    $(".content").hide();
    $("#starred-none").show();
    $("#results-not-found").hide();
    if (localStorage.getItem("starred") === null) {
      starFound.innerHTML = `You haven't starred any country.`;
    } else {
      let starredCountriesArray = JSON.parse(localStorage.getItem("starred"));

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

      sortedCountryArray.forEach((i, index) => {
        if (typeof Storage !== "undefined") {
          if (localStorage.getItem("starred") === null) {
            //
          } else {
            let starredCountriesGenStarred = JSON.parse(
              localStorage.getItem("starred")
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
