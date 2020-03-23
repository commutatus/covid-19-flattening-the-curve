$(document).ready(() => {
    var api_url = "https://corona.lmao.ninja/all";
    const confirmed = document.getElementById("total-confirmed");
    const deaths = document.getElementById("total-deaths");
    const recovered = document.getElementById("total-recovered");
    const lastUpdated = document.getElementById("last-updated");
    let lastUpdatedValue;
    let starredCountries = [];
    let sortedCountryArray = [];
    let starFound = document.getElementById("starred-none");
    getLatestInfo();
    getAllCountryGraphs();

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

})


function getAllCountryGraphs() {

    fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(response => response.json())
        .then(data => {
            getSortedCountryArray(data)
        })
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
        let latestCountryCount =
            countryTimelineArray[countryTimelineArray.length - 1].confirmed -
            (countryTimelineArray[countryTimelineArray.length - 1].deaths +
                countryTimelineArray[countryTimelineArray.length - 1].recovered);
        let latestDate =
            countryTimelineArray[countryTimelineArray.length - 1].date;
        totalCountryCountArray.push({
            country: country,
            count: latestCountryCount,
            lastUpdated: latestDate
        });
    });
    sortedCountryArray = totalCountryCountArray.sort((a, b) =>
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
    );
    generateGraphCanvas(data)
}

function generateGraphCanvas(data) {
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
                let starredCountriesGen = JSON.parse(
                    localStorage.getItem("starred")
                );

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
    generateGraphContent(data)
}

function generateGraphContent(data) {
    sortedCountryArray.forEach((i, index) => {
        let xlabels = [];
        let ylabels = [];
        let dayCount = 0;
        data[i.country].forEach(e => {
            if (e.confirmed !== 0) {
                dayCount = dayCount + 1;
                ylabels.push(e.confirmed - (e.deaths + e.recovered));
                xlabels.push(`${dayCount}`);
            }
        });

        lastUpdatedValue = moment(
            sortedCountryArray[index].lastUpdated,
            "YYYY-MM-DD"
        ).format("DD/MM/YY");

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
                        localStorage.setItem(
                            "starred",
                            JSON.stringify(starredCountries)
                        );
                    } else {
                        starredCountries = JSON.parse(localStorage.getItem("starred"));

                        if (starredCountries.includes(i.country)) {
                            starredCountries = starredCountries.filter(
                                e => e !== i.country
                            );
                            localStorage.setItem(
                                "starred",
                                JSON.stringify(starredCountries)
                            );
                            $("#chart-star-" + index + "").removeClass("btn-star-active");
                            $("#fa-star-" + index + "").removeClass("star-color");
                        } else {
                            starredCountries.push(i.country);
                            localStorage.setItem(
                                "starred",
                                JSON.stringify(starredCountries)
                            );
                        }
                    }
                } else {
                    console.log(`Your browser doesn't support Web Storage!`);
                }
            });

        let ctx = (document.getElementById(`myChart${index}`))
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
                    }
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
    });
}

