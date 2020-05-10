<template>
    <Layout>
        <!-- Navigation-->
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top py-1" id="mainNav">
        <a class="navbar-brand font-weight-light js-scroll-trigger" href="/">
            <h1 class="main-h1">
            Prediction Graphs
            </h1>
        </a>

        <div class="list-js-search">
            <label class="search-label-hidden" for="search">Search by country</label>
            <input class="search" type="text" id="search" placeholder="Search by country" />
            <i class="fas fa-search-location"></i>
        </div>
        </nav>

        <div class="notice-section prediction-notice">
            <div class="alert alert-danger mobile-alert" role="alert">
                <i style="color: #dc3545; margin-right: 5px;" class="fas fa-exclamation-circle"></i>
                This feature is still under development. 
            </div>
        </div>

    <section class="loading-section" id="chart-loader">
      <div class="spinner-grow text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="main-loading-text">Loading charts</div>
    </section>

    <!-- Flattening curve graphs section-->
    <section class="page-section graphs-section text-black" id="province-graphs">
      <div id="tab-choose" class="justify-content-center mb-4 row">
        <button type="button" class="btn btn-country active">All Countries</button>
        <button type="button" class="btn btn-starred">Starred</button>
      </div>
      <h2
        class="main-h2"
      >Dashboard to track the projected number of people who will contract COVID-19 / Coronavirus over a period of next 6 months by countries.</h2>
      <h3 class="text-center" id="results-not-found">No results found.</h3>
      <h3 class="text-center" id="starred-none"></h3>

      <div id="country-graphs" class="row province-chart-parent">
        <!-- content generated from app.js -->
        <div
          v-for="(item, index) in this.sortedPredictedArray"
          :key="index"
          class="bg-light p-1 m-2 province-charts content"
        >
          <button aria-label="Star a country" class="btn btn-star" :id="`chart-star-${index}`">
            <i class="fas fa-star" :id="`fa-star-${index}`"></i>
          </button>
          <div :id="`country-id-${index}`" class="text-center">
            <p class="country-names">{{item.country}}</p>
          </div>
          <chart
            :chartdata="item.chartData"
            :chartoptions="item.chartOptions"
          ></chart>
        </div>
      </div>
    </section>
    <!-- Footer-->
    <footer class="bg-light py-3">
      <div class="footer-container">
        <div class="small text-center text-muted">
          Crafted with ❤️ by
          <b>
            <a style="font-size:1.1em" href="https://www.commutatus.com">Commutatus</a>
          </b>
        </div>
        <div class="small text-center text-muted">
          Data Source:
          <cite>
            <a href="https://github.com/CSSEGISandData/COVID-19">CSSEGISandData</a> /
            <a href="https://github.com/NovelCOVID/API">NovelCOVID</a> /
            <a href="https://github.com/pomber/covid19">Pomber</a>
          </cite>
        </div>
      </div>
    </footer>

    </Layout>
</template>


<script>
import moment from "moment";
import Chart from "../components/Chart";
import PredictionData from "../../static/all-country-predictions.json";

let starredCountries = [];
export default {
  components: {
    Chart
  },
  created() {
    this.sortCountriesData();
  },
  mounted() {
    window.$ = require("jquery");
    let mainLoaderContainer = document.getElementById("chart-loader");
    mainLoaderContainer.style.display = "none";
    this.userFunctions();
    setTimeout(() => {
      $("#tab-choose .btn-country").click();
    }, 500);
  },
  data() {
    return {
      sortedPredictedArray: this.sortedPredictedArray,
      PredictionData
    };
  },
  methods: {
    sortCountriesData: function() {   
      let predictedData = PredictionData;
      let sortedPredictedArray = [];
      let totalPredictedCountArray = [];
      let predictedCountriesArray = Object.keys(predictedData);
      predictedCountriesArray.forEach((country)=>{
        let predictedTimelineArray = Object.values(predictedData[country]);
        let predictedDateArray = Object.keys(predictedData[country]);
        predictedDateArray.forEach((e)=>{
          moment(e).format("DD-MM-YY")
        })
        let predictedActiveCount = 
        (predictedTimelineArray[predictedTimelineArray.length - 1].Infected + 
        predictedTimelineArray[predictedTimelineArray.length - 1].Recovered);
        let latestDate =
          predictedDateArray[predictedDateArray.length - 1];
        totalPredictedCountArray.push({
            country: country,
            recovered: predictedTimelineArray[predictedTimelineArray.length - 1].Recovered,
            deaths: predictedTimelineArray[predictedTimelineArray.length - 1].Fatal,
            confirmed: (predictedTimelineArray[predictedTimelineArray.length - 1].Infected + 
        predictedTimelineArray[predictedTimelineArray.length - 1].Recovered + 
        predictedTimelineArray[predictedTimelineArray.length - 1].Fatal),
            count: predictedActiveCount,
            lastUpdated: latestDate
          });
      });
      sortedPredictedArray = totalPredictedCountArray.sort((a, b) =>
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
      );
      this.sortedPredictedArray = sortedPredictedArray;
      console.log(sortedPredictedArray);
      this.generateGraphContent(sortedPredictedArray, predictedData);      
    },
    generateGraphContent: function(sortedPredictedArray, predictedData) {
      sortedPredictedArray.forEach((i, index) => {
        let xlabels = [];
        let ylabels = [];
        let dayCount = 0;
        let recentRecovered = 0;
        let predictedTimelineArray = Object.values(predictedData[i.country]);
        predictedTimelineArray.forEach(e => {
          let confirmed = (e.Infected + e.Recovered + e.Fatal);
          let active = (e.Infected + e.Recovered);
          if (confirmed !== 0) {
            dayCount = dayCount + 1;
            ylabels.push(active);
            xlabels.push(`${dayCount}`);
          }
        });
        this.generateAllCharts(i, index, xlabels, ylabels, sortedPredictedArray);
      });
    },
    generateAllCharts: function(
      i,
      index,
      xlabels,
      ylabels,
      sortedPredictedArray
    ) {
      let tempObj = sortedPredictedArray[index];
      tempObj["chartData"] = {
        labels: xlabels,
        datasets: [
          {
            label: `Active cases: ${sortedPredictedArray[
              index
            ].count.toLocaleString()}`,
            data: ylabels,
            backgroundColor: ["rgba(255, 99, 132, 0.3)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            lineTension: 0.4,
            borderWidth: 1,
            pointRadius: 1,
            pointBackgroundColor: "rgba(255, 99, 132, 0.8)"
          }
        ]
      };
      tempObj["chartOptions"] = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            title: function(tooltipItems, data) {
              return "";
            },
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].toLocaleString();
            }
          },
          enabled: true,
          mode: "nearest"
        },
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0,
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
      };
      this.sortedPredictedArray[index] = tempObj;
    },
    starredButtonOnClick: function(i, index) {
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
            if (localStorage.getItem("starred") === null) {
              starredCountries.push(i.country);
              localStorage.setItem("starred", JSON.stringify(starredCountries));
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
    },
    userFunctions: function() {
      this.sortedPredictedArray.forEach((i, index) => {
        this.starredButtonOnClick(i, index);
      });
      this.searchCountries();
      this.ifAllCountriesBtnClicked();
      this.ifStarredBtnClicked();
    },
    searchCountries: function() {
      $("#results-not-found").hide();
      $("#search").keyup(function() {
        var text = $(this)
          .val()
          .toLowerCase();
        if (text.length === 0) {
          $("#tab-choose .btn-country").click();
        }
        $(".content").hide();
        var resultCount = 0;
        $("#results-not-found").hide();
        $(".content .country-names").each(function() {
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
    },
    ifAllCountriesBtnClicked: function() {
      let that = this;
      $("#tab-choose .btn-country").click(function() {
        $("#tab-choose .btn-starred").removeClass("active");
        $("#tab-choose .btn-country").addClass("active");
        $(".content").show();
        $("#starred-none").hide();
        $("#results-not-found").hide();
        that.sortedPredictedArray.forEach((i, index) => {
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
    },
    ifStarredBtnClicked: function() {
      let that = this;
      let starFound = document.getElementById("starred-none");
      $("#tab-choose .btn-starred").click(function() {
        $("#tab-choose .btn-starred").addClass("active");
        $("#tab-choose .btn-country").removeClass("active");
        $(".content").hide();
        $("#starred-none").show();
        $("#results-not-found").hide();
        if (localStorage.getItem("starred") === null) {
          starFound.innerHTML = `You haven't starred any country.`;
        } else {
          let starredCountriesArray = JSON.parse(
            localStorage.getItem("starred")
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

          that.sortedPredictedArray.forEach((i, index) => {
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
  }
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
