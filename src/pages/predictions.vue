<template>
  <Layout>
    <!-- Navigation-->
    <nav
      class="navbar navbar-expand-lg navbar-dark fixed-top py-1"
      id="mainNav"
    >
      <a class="navbar-brand font-weight-light js-scroll-trigger" href="/">
        <h1 class="main-h1">COVID-19 | Predictions</h1>
      </a>

      <div class="list-js-search">
        <label class="search-label-hidden" for="search"
          >Search by country</label
        >
        <input
          class="search"
          type="text"
          id="search"
          placeholder="Search by country"
        />
        <i class="fas fa-search-location"></i>
      </div>
    </nav>

    <div class="notice-section prediction-notice">
      <div class="alert alert-danger mobile-alert" role="alert">
        <i
          style="color: #dc3545; margin-right: 5px"
          class="fas fa-exclamation-circle"
        ></i>
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
    <section
      class="page-section graphs-section text-black"
      id="province-graphs"
    >
      <div id="tab-choose" class="justify-content-center mb-4 row">
        <button type="button" class="btn btn-country active">
          All Countries
        </button>
        <button type="button" class="btn btn-starred">Starred</button>
      </div>
      <h2 class="main-h2">
        Dashboard to track the projected number of people who will contract
        COVID-19 / Coronavirus over a period of the next 1 month by countries.
      </h2>
      <h3 class="text-center" id="results-not-found">No results found.</h3>
      <h3 class="text-center" id="starred-none"></h3>

      <div id="country-graphs" class="row province-chart-parent">
        <!-- content generated from app.js -->
        <div
          v-for="(item, index) in this.sortedPredictedArray"
          :key="index"
          class="bg-light p-1 m-2 province-charts content"
        >
          <button
            aria-label="Star a country"
            class="btn btn-star"
            :id="`chart-star-${index}`"
          >
            <i class="fas fa-star" :id="`fa-star-${index}`"></i>
          </button>
          <div :id="`country-id-${index}`" class="text-center">
            <p class="country-names">{{ item.country }}</p>
          </div>
          <div class="custom-legends text-center" :id="`legend-id-${index}`">
            <div>
              <div class="active-cases-indicator"></div>
              <p>Active cases:</p>
              &nbsp;
              <p>{{ item.currentActiveCases }}</p>
            </div>
            <div>
              <div class="predicted-cases-indicator"></div>
              <div class="custom-delta"></div>
              <p>Active cases:</p>
              &nbsp;
              <p
                v-bind:style="[
                  item.predictedActiveCases !== 0 &&
                    (item.predictedActiveCases < 0
                      ? { color: 'red' }
                      : { color: 'green' }),
                ]"
              >
                {{
                  item.predictedActiveCases > 0
                    ? "+" + item.predictedActiveCases.toLocaleString()
                    : item.predictedActiveCases.toLocaleString()
                }}
              </p>
            </div>
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
          Crafted with ❤️ &nbsp; by
          <b>
            <a style="font-size: 1.1em" href="https://www.commutatus.com"
              >Commutatus</a
            >
          </b>
        </div>
        <div class="small text-center text-muted">
          Data Source:
          <cite>
            <a href="https://github.com/CSSEGISandData/COVID-19"
              >CSSEGISandData</a
            >
            / <a href="https://github.com/NovelCOVID/API">NovelCOVID</a> /
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
import generatePredictedCharts from "../helpers/generatePredictedCharts";
import starredButtonOnClick from "../helpers/starredButtonOnClick";
import ifAllCountriesBtnClicked from "../helpers/ifAllCountriesBtnClicked";
import ifStarredBtnClicked from "../helpers/ifStarredBtnClicked";
import updateSortedActiveCount from "../helpers/updateSortedActiveCount";
let starredCountries = [];
export default {
  components: {
    Chart,
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
    };
  },
  methods: {
    sortCountriesData: function () {
      let predictedData = JSON.parse(
        this.$page.allPredictedData.edges[0].node.fullData
      );
      let sortedPredictedArray = [];
      let totalPredictedCountArray = [];
      let predictedCountriesArray = Object.keys(predictedData);
      predictedCountriesArray.forEach((country) => {
        let predictedTimelineArray = Object.values(predictedData[country]);
        let predictedDateArray = Object.keys(predictedData[country]);
        let predictedActiveCount =
          predictedTimelineArray[predictedTimelineArray.length - 1].Infected;
        let latestDate = predictedDateArray[predictedDateArray.length - 1];
        totalPredictedCountArray.push({
          country: country,
          recovered:
            predictedTimelineArray[predictedTimelineArray.length - 1].Recovered,
          deaths:
            predictedTimelineArray[predictedTimelineArray.length - 1].Fatal,
          confirmed:
            predictedTimelineArray[predictedTimelineArray.length - 1].Infected +
            predictedTimelineArray[predictedTimelineArray.length - 1]
              .Recovered +
            predictedTimelineArray[predictedTimelineArray.length - 1].Fatal,
          count: predictedActiveCount,
          lastUpdated: latestDate,
          currentActiveCases: null,
          predictedActiveCases: null,
        });
      });
      let updatedPredictedCountryArray = updateSortedActiveCount(
        totalPredictedCountArray,
        predictedData
      );
      sortedPredictedArray = updatedPredictedCountryArray.sort((a, b) =>
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
      );
      this.sortedPredictedArray = sortedPredictedArray;
      this.generateGraphContent(sortedPredictedArray, predictedData);
    },
    generateGraphContent: function (sortedPredictedArray, predictedData) {
      sortedPredictedArray.forEach((i, index) => {
        let xlabels = [];
        let ylabels = [];
        let currentYlabels = [];
        let confirmed = 0;
        let active = 0;
        let predictedDateArray = Object.keys(predictedData[i.country]);
        let reformatDatesArray = [];
        let sortedDatesArray = [];
        let predictedTimelineArray = [];
        let formatedDates = [];

        //Format and sorting for the whole timeline array
        predictedDateArray.forEach((e) => {
          let date = null;
          date = new Date(e);
          date = moment(date).format("MM-DD-YYYY HH:mm:ss");
          reformatDatesArray.push(date);
        });
        let SortedDates = reformatDatesArray.sort();

        let primaryDate = moment().format("MM-DD-YYYY HH:mm:ss");
        let tempLastDate = new Date(primaryDate);
        let formattedLastDate = moment(tempLastDate)
          .add(1, "month")
          .format("MM-DD-YYYY HH:mm:ss");

        SortedDates.forEach((e) => {
          let date = null;
          date = new Date(e);
          let formattedEndDate = new Date(formattedLastDate);
          let startingDate = new Date(primaryDate);
          if (
            date.getMonth() <= formattedEndDate.getMonth() &&
            date.getMonth() >= startingDate.getMonth()
          ) {
            if (date.getMonth() == formattedEndDate.getMonth()) {
              if (date.getDate() <= formattedEndDate.getDate()) {
                date = moment(date).format("YYYY-MM-DD HH:mm:ss");
                sortedDatesArray.push(date);
              }
            } else {
              date = moment(date).format("YYYY-MM-DD HH:mm:ss");
              sortedDatesArray.push(date);
            }
          }
        });

        sortedDatesArray.forEach((e) => {
          predictedDateArray.forEach((k) => {
            if (e === k) {
              let valuesArray = Object.values(predictedData[i.country][e]);
              predictedTimelineArray.push({
                date: e,
                Susceptible: valuesArray[0],
                Infected: valuesArray[1],
                Recovered: valuesArray[2],
                Fatal: valuesArray[3],
                count: valuesArray[1],
                country: i.country,
              });
            }
          });
        });
        predictedTimelineArray.forEach((e) => {
          let date = null;
          date = new Date(e.date);
          date = moment(date).format("DD/MM");
          formatedDates.push(date);
        });
        predictedTimelineArray.forEach((e, k) => {
          confirmed = e.Infected + e.Recovered + e.Fatal;
          active = e.Infected;
          if (confirmed !== 0 && active > 0) {
            ylabels.push(active);
            xlabels.push(formatedDates[k]);
          }
        });
        // Formating sorted Array from current date
        let currentSortedTimelineArray = [];
        let currentActive = 0;
        let predictedCurrentTimeLineArray = JSON.parse(
          JSON.stringify(predictedTimelineArray)
        );
        sortedDatesArray.forEach((e) => {
          let date = new Date(e);
          let currentDate = new Date();
          if (
            date.getMonth() >= currentDate.getMonth() &&
            date.getFullYear() >= currentDate.getFullYear()
          ) {
            if (date.getMonth() == currentDate.getMonth()) {
              if (date.getDate() >= currentDate.getDate()) {
                date = moment(date).format("YYYY-MM-DD HH:mm:ss");
                currentSortedTimelineArray.push(date);
              }
            } else {
              date = moment(date).format("YYYY-MM-DD HH:mm:ss");
              currentSortedTimelineArray.push(date);
            }
          }
        });

        predictedCurrentTimeLineArray.forEach((e) => {
          e.date = e.date;
          e.Susceptible = 0;
          e.Infected = 0;
          e.Recovered = 0;
          e.Fatal = 0;
          e.count = 0;
        });

        currentSortedTimelineArray.forEach((e) => {
          predictedCurrentTimeLineArray.forEach((k, index) => {
            if (k.date === e) {
              k.date = e;
              k.Susceptible = predictedTimelineArray[index].Infected;
              k.Infected = predictedTimelineArray[index].Infected;
              k.Recovered = predictedTimelineArray[index].Recovered;
              k.Fatal = predictedTimelineArray[index].Fatal;
              k.count =
                predictedTimelineArray[index].Infected +
                predictedTimelineArray[index].Recovered;
            }
          });
        });

        let activeCasesToday = predictedCurrentTimeLineArray.filter(
          (data) => data.count !== 0
        )[0];

        predictedCurrentTimeLineArray.forEach((e, k) => {
          let currentconfirmed = e.Infected + e.Recovered + e.Fatal;
          currentActive = e.Infected;
          if (currentActive >= 0) {
            currentYlabels.push(currentActive);
          }
        });

        i.currentActiveCases = activeCasesToday
          ? activeCasesToday.Infected.toLocaleString()
          : active.toLocaleString();

        i.predictedActiveCases = activeCasesToday
          ? currentActive > activeCasesToday.Infected
            ? currentActive - activeCasesToday.Infected
            : (activeCasesToday.Infected - currentActive) * -1
          : currentActive;

        this.sortedPredictedArray[index] = generatePredictedCharts(
          i,
          index,
          xlabels,
          ylabels,
          sortedPredictedArray,
          currentYlabels,
          currentActive,
          activeCasesToday,
          active
        );
      });
    },
    userFunctions: function () {
      const localStorageVal = "predicted-starred";
      this.sortedPredictedArray.forEach((i, index) => {
        starredButtonOnClick(i, index, localStorageVal, starredCountries);
      });
      this.searchCountries();
      ifAllCountriesBtnClicked(this.sortedCountryArray, localStorageVal);
      ifStarredBtnClicked(this.sortedCountryArray, localStorageVal);
    },
    searchCountries: function () {
      $("#results-not-found").hide();
      $("#search").keyup(function () {
        var text = $(this).val().toLowerCase();
        if (text.length === 0) {
          $("#tab-choose .btn-country").click();
        }
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
            $(this).closest(".content").show();
            $("#results-not-found").hide();
            resultCount++;
          }

          if (resultCount == 0) {
            $("#results-not-found").show();
          }
        });
      });
    },
  },
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>

<page-query>
query {
  allPredictedData {
    edges {
      node {
        title
        fullData
      }
    }
  }
}
</page-query>