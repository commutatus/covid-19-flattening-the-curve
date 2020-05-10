<template>
  <Layout>
    <!-- Navigation-->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top py-1" id="mainNav">
      <a class="navbar-brand font-weight-light js-scroll-trigger" href="/">
        <h1 class="main-h1">Prediction Graphs</h1>
      </a>

    <search></search>

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
          <chart :chartdata="item.chartData" :chartoptions="item.chartOptions"></chart>
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
import Search from "../components/Search"
import PredictionData from "../../static/all-country-predictions.json";
import generatePredictedCharts from "../helpers/generatePredictedCharts";
import starredButtonOnClick from "../helpers/starredButtonOnClick";
import ifAllCountriesBtnClicked from "../helpers/ifAllCountriesBtnClicked";
import ifStarredBtnClicked from "../helpers/ifStarredBtnClicked";

let starredCountries = [];
export default {
  components: {
    Chart,
    search : Search
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
      predictedCountriesArray.forEach(country => {
        let predictedTimelineArray = Object.values(predictedData[country]);
        let predictedDateArray = Object.keys(predictedData[country]);
        let predictedActiveCount =
          predictedTimelineArray[predictedTimelineArray.length - 1].Infected +
          predictedTimelineArray[predictedTimelineArray.length - 1].Recovered;
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
        let confirmed = 0;
        let active = 0;
        let predictedTimelineArray = Object.values(predictedData[i.country]);
        let predictedDateArray = Object.keys(predictedData[i.country]);
        let formatedDates = [];
        predictedDateArray.forEach((e)=>{
          let date = null;
          date = new Date(e);
          date = moment(date).format("DD/MM");
          formatedDates.push(date);
        })
        predictedTimelineArray.forEach((e, k) => {
          confirmed = e.Infected + e.Recovered + e.Fatal;
          active = e.Infected + e.Recovered;
          if (confirmed !== 0) {
            dayCount = dayCount + 1;
            ylabels.push(active);
            xlabels.push(formatedDates[k]);
          }
        });
        this.generatePredictedCharts(     
          i,
          index,
          xlabels,
          ylabels,
          sortedPredictedArray);
      });
    },
    generatePredictedCharts,
    starredButtonOnClick,
    userFunctions: function() {
      const localStorageVal = "predicted-starred"
      this.sortedPredictedArray.forEach((i, index) => {
        this.starredButtonOnClick(i, index, localStorageVal, starredCountries);
      });
      this.ifAllCountriesBtnClicked.call(this, this.sortedPredictedArray, localStorageVal);
      this.ifStarredBtnClicked.call(this, this.sortedPredictedArray, localStorageVal);
    },
    ifAllCountriesBtnClicked,
    ifStarredBtnClicked
  }
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
