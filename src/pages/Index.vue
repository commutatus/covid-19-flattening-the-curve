<template>
  <Layout>
    <!-- Navigation-->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top py-1" id="mainNav">
      <a class="navbar-brand font-weight-light js-scroll-trigger" href="/">
        <h1 class="main-h1">
          Flattening the Curve Dashboard |
          COVID-19
        </h1>
      </a>
      <div class="list-js-search">
        <label class="search-label-hidden" for="search">Search by country</label>
        <input class="search" type="text" id="search" placeholder="Search by country" />
        <i class="fas fa-search-location"></i>
      </div>
    </nav>

    <section class="global-stats-section bg-dark text-white">
      <div class="global-stats" id="stats-div">
        <!-- content generated from app.js -->
        <div class="stats-box">
          <p>Total confirmed cases</p>
          <hr class="bg-light global-stats-hr" />
          <p
            id="total-confirmed"
            class="text-warning font-weight-light number-global-stats"
          >{{($page.allGlobalData.edges[0].node.fullData.cases).toLocaleString()}}</p>
        </div>

        <div class="stats-box">
          <p>Total deaths</p>
          <hr class="bg-light global-stats-hr" />
          <p
            id="total-deaths"
            class="text-danger font-weight-light number-global-stats"
          >{{($page.allGlobalData.edges[0].node.fullData.deaths).toLocaleString()}}</p>
        </div>

        <div class="stats-box">
          <p>Total recovered</p>
          <hr class="bg-light global-stats-hr" />
          <p
            id="total-recovered"
            class="text-success font-weight-light number-global-stats"
          >{{($page.allGlobalData.edges[0].node.fullData.recovered).toLocaleString()}}</p>
        </div>

        <div class="stats-box">
          <p>Last updated</p>
          <hr class="bg-light global-stats-hr" />
          <p
            id="last-updated"
            class="text-light font-weight-light number-global-stats"
          >{{$page.allGlobalData.edges[0].node.fullData.updated | moment("DD-MM-YY hh:mm A")}}</p>
        </div>
      </div>
    </section>

    <div class="notice-section">
      <div class="alert alert-info mobile-alert" role="alert">
        <i style="color: #0c5460; margin-right: 5px;" class="fas fa-exclamation-circle"></i>
        We've fixed the data in-consistency issue reported earlier. Feel free to drop your suggestions
        <a
          style="color: #0c5460; text-decoration: underline"
          href="mailto:chandan@commutatus.com?cc=mkv@commutatus.com&subject=Flattening%20the%20Curve%20Dashboard-Feedback/Suggestions"
        >here</a>.
      </div>
      <a href="https://flattening-the-curve.commutatus.com/predictions" target="_blank" style="display: flex;">
        <div class="new-graphs-link" role="alert">
          <i style="margin-right: 5px;">
            <g-image style="height: 30px; width: 30px;" alt="new icon" src="~/images/new-icon.png" />
          </i>
          COVID-19 Predictions →
        </div>
      </a>
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
      >Dashboard to track the projected number of people who will contract COVID-19 / Coronavirus over a period of time by countries.</h2>
      <h3 class="text-center" id="results-not-found">No results found.</h3>
      <h3 class="text-center" id="starred-none"></h3>

      <div id="country-graphs" class="row province-chart-parent">
        <!-- content generated from app.js -->
        <div
          v-for="(item, index) in this.sortedCountryArray"
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
    <section class="content-main">
      <div class="content-main-text">
        <h2>Flattening the Curve</h2>
        <p>
          COVID-19 / Coronavirus has led to a pandemic that is threatening every country today. The promising strategy
          to
          limit the damage caused by this pandemic is to flatten the curve.
        </p>
        <figure class="figure-container">
          <g-image
            alt="representation of flattening the curve of COVID-19 epidemic"
            class="curve-gif"
            src="~/images/covid-flattening-the-curve.gif"
          />
          <figcaption class="fig-text">
            Source:
            <a
              href="https://commons.wikimedia.org/wiki/File:Covid-19-curves-graphic-social-v3.gif"
            >Wikipedia</a>
          </figcaption>
        </figure>
        <h3>What is an epidemic curve?</h3>
        <p>
          During any pandemic, healthcare resources like hospitals, ICU beds, and healthcare staff can be overwhelmed
          by
          the more number of patients, beyond the baseline number of patients who are already being cared for by the
          healthcare system. An epidemic curve is drawn to visualize the progress of a disease outbreak over time.
          This curve gives us a brief regarding the number of new outbreak cases by date of onset of the disease and
          hence
          the overall shape of the curve can reveal the type of outbreak we're dealing with.
        </p>

        <h4>Healthcare capacity line:</h4>
        <p>
          The horizontal line represents the capacity of the country’s healthcare system. This capacity can be defined
          as
          the number of beds, staffing, and other measures available for patient care. Today, due to COVID-19 most of
          the
          countries are already operating close to the capacity line and the curve posses a threat of crossing this
          line
          as the virus spreads very rapidly.
        </p>

        <h4>What happens when the line is crossed?</h4>
        <p>
          When the epidemic curve crosses the healthcare capacity line, the healthcare system can no longer meet the
          needs
          of COVID-19 patients and the other types of patients. At this point, people may not get the best care and
          the
          mortality rate starts to rise rapidly.
        </p>
        <h4>What is flattening the curve?</h4>
        <p>
          A large number of lives can be saved by just ensuring that people get sick at a slower rate. This is termed
          as
          flattening the epidemic curve. A flattened curve indicates that the same number of people ultimately get
          infected with coronavirus but spread over a longer period which leads to a less stressed health care system.
        </p>

        <h4>When does flattening the COVID-19 epidemic curve take place?</h4>
        <p>
          The most important key factor to flatten the curve is social distancing. The objective of social distancing
          or
          self-isolation is to reduce the probability of close contact between persons carrying an infection, and
          others
          who are not infected, thus minimizing the virus transmission. This is the underlying reason why governments
          are
          closing schools, non-critical businesses, social/sports events and other places where a ton people gather.
        </p>

        <h4>Can social distancing alone flatten the curve?</h4>
        <p>
          By limiting interactions between individuals, we can limit the spread of the disease but that doesn’t mean
          it is
          the only effective way to flatten the curve. There are several other factors that you can do to aid flatten
          the
          curve such as practicing good hygiene by washing your hands, using sanitizers, cleaning frequently touched
          surfaces and self-isolating in confirmed and suspected cases.
        </p>

        <h4>How can we help in flattening the curve?</h4>As the severity of COVID-19 rises, it's clear that our best option is to flatten the epidemic curve. So here
        is
        the list of things every individual is recommended to follow :
        <ul>
          <li>Wash your hands as frequently as you can.</li>
          <li>Practice efficient social distancing.</li>
          <li>Stay home.</li>
          <li>Proper usage of sanitizers.</li>
          <li>Don’t go for hospitals unless necessary.</li>
          <li>
            Don’t overbuy essential medical supplies like N95 masks which are required by healthcare providers
            while
            treating patients.
          </li>
          <li>
            Most importantly,
            <b>don't panic!</b>
          </li>
        </ul>
        <figure class="figure-container">
          <g-image
            alt="Recommendations by WHO to help in flattening the curve of COVID-19 epidemic"
            class="who-recommendation"
            src="~/images/flattening-the-curve-covid.jpg"
          />
          <figcaption class="fig-text">
            Source:
            <a
              href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public"
            >WHO</a>
          </figcaption>
        </figure>
        <p
          class="last-quote"
        >" Let's all unite against the COVID-19 pandemic and fight ourselves out of the difficult times."</p>
      </div>
      <div class="custom-data-table">
        <h3>Flattening the curve dashboard | List of all countries affected with COVID-19 sorted by highest number of active cases</h3>
        <table class="table table-striped table-hover">
          <caption>Flattening the curve dashboard | COVID-19 Table showing - Confirmed, Recovered, Deaths and Active count data by country</caption>
          <thead>
            <tr>
              <th scope="col">Country</th>
              <th scope="col">Confirmed</th>
              <th scope="col">Recovered</th>
              <th scope="col">Deaths</th>
              <th scope="col">Active</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.sortedCountryArray" :key="index">
              <th scope="row">{{(item.country).toLocaleString()}}</th>
              <td>{{(item.confirmed).toLocaleString()}}</td>
              <td>{{(item.recovered).toLocaleString()}}</td>
              <td>{{(item.deaths).toLocaleString()}}</td>
              <td>{{(item.count).toLocaleString()}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <!-- Footer-->
    <footer class="bg-light py-3">
      <div class="footer-container">
        <div class="small text-center text-muted">
          Crafted with ❤️ &nbsp; by 
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
import generateCountryCharts from "../helpers/generateCountryCharts";
import starredButtonOnClick from "../helpers/starredButtonOnClick";
import ifAllCountriesBtnClicked from "../helpers/ifAllCountriesBtnClicked";
import ifStarredBtnClicked from "../helpers/ifStarredBtnClicked";

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
      sortedCountryArray: this.sortedCountryArray
    };
  },
  methods: {
    sortCountriesData: function() {
      let data = JSON.parse(this.$page.allCountriesData.edges[0].node.fullData);
      let sortedCountryArray = [];
      let countriesArray = Object.keys(data);
      let totalCountryCountArray = [];
      countriesArray.forEach(country => {
        let countryTimelineArray = data[country];
        let countryRecoveredArray = countryTimelineArray.filter(
          item => item.recovered !== null
        );
        let latestRecoveredCount =
          countryRecoveredArray.length > 0
            ? countryRecoveredArray[countryRecoveredArray.length - 1].recovered
            : 0;
        let latestCountryCount =
          countryTimelineArray[countryTimelineArray.length - 1].confirmed -
          (countryTimelineArray[countryTimelineArray.length - 1].deaths +
            latestRecoveredCount);
        let latestDate =
          countryTimelineArray[countryTimelineArray.length - 1].date;
        totalCountryCountArray.push({
          country: country,
          recovered: latestRecoveredCount,
          deaths: countryTimelineArray[countryTimelineArray.length - 1].deaths,
          confirmed:
            countryTimelineArray[countryTimelineArray.length - 1].confirmed,
          count: latestCountryCount,
          lastUpdated: latestDate
        });
      });
      sortedCountryArray = totalCountryCountArray.sort((a, b) =>
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
      );
      this.sortedCountryArray = sortedCountryArray;
      this.generateGraphContent(sortedCountryArray, data);
    },
    generateGraphContent: function(sortedCountryArray, data) {
      sortedCountryArray.forEach((i, index) => {
        let xlabels = [];
        let ylabels = [];
        let dayCount = 0;
        let recentRecovered = 0;
        data[i.country].forEach(e => {
          if (e.confirmed !== 0) {
            dayCount = dayCount + 1;
            ylabels.push(
              e.confirmed -
                (e.deaths +
                  (e.recovered !== null ? e.recovered : recentRecovered))
            );
            xlabels.push(`${dayCount}`);
            if (e.recovered !== null) recentRecovered = e.recovered;
          }
        });
        this.sortedCountryArray[index] = generateCountryCharts(
          i,
          index,
          xlabels,
          ylabels,
          sortedCountryArray
        );
      });
    },
    userFunctions: function() {
      const localStorageVal = "starred";
      this.sortedCountryArray.forEach((i, index) => {
        starredButtonOnClick(i, index, localStorageVal, starredCountries);
      });
      this.searchCountries();
      ifAllCountriesBtnClicked(this.sortedCountryArray, localStorageVal);
      ifStarredBtnClicked(this.sortedCountryArray, localStorageVal);
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
  },
  metaInfo: {
    title:
      "Flattening the Curve (Live) | COVID-19/Coronavirus affected countries",
    meta: [
      {
        name: "description",
        content:
          "Flattening the curve | Dashboard to track the projected number of people who will contract COVID-19 / Coronavirus over a period of time by countries."
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:url",
        content: "https://flattening-the-curve.commutatus.com/"
      },
      {
        property: "og:title",
        content:
          "Flattening the Curve (Live) | COVID-19/Coronavirus affected countries"
      },
      {
        property: "og:description",
        content:
          "Flattening the curve | Dashboard to track the projected number of people who will contract COVID-19 / Coronavirus over a period of time by countries."
      },
      {
        property: "og:image",
        content:
          "https://flattening-the-curve.commutatus.com/assets/covid-dashboard-min.png"
      },
      {
        property: "twitter:card",
        content: "summary_large_image"
      },
      {
        property: "twitter:url",
        content: "https://flattening-the-curve.commutatus.com/"
      },
      {
        property: "twitter:title",
        content:
          "Flattening the Curve (Live) | COVID-19/Coronavirus affected countries"
      },
      {
        property: "twitter:description",
        content:
          "Flattening the curve | Dashboard to track the projected number of people who will contract COVID-19 / Coronavirus over a period of time by countries."
      },
      {
        property: "twitter:image",
        content:
          "https://flattening-the-curve.commutatus.com/assets/covid-dashboard-min.png"
      }
    ],
    link: [
      { rel: "canonical", href: "https://flattening-the-curve.commutatus.com/" }
    ],
    script: [
      {
        innerHTML:
          '{"@context":"https://schema.org","@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://flattening-the-curve.commutatus.com/"},"headline":"Flattening the Curve updates (Live) by country charts | COVID-19","description":"Shows flattening the curve updates by each country. A flattened curve indicates that the same number of people ultimately get infected with coronavirus but spread over a longer period which leads to a less stressed health care system.","image":"https://flattening-the-curve.commutatus.com/assets/covid-dashboard-min.png","author":{"@type":"Organization","name":"Commutatus"},"publisher":{"@type":"Organization","name":"Commutatus","logo":{"@type":"ImageObject","url":"https://www.commutatus.com/images/Group.png","width":300,"height":40}},"datePublished":"2020-03-23","dateModified":"2020-04-10"}',
        type: "application/ld+json"
      },
      {
        innerHTML: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is an epidemic curve?","acceptedAnswer":{"@type":"Answer","text":"During any pandemic, healthcare resources like hospitals, ICU beds, and healthcare staff can be overwhelmed by the more number of patients, beyond the baseline number of patients who are already being cared for by the healthcare system. An epidemic curve is drawn to visualize the progress of a disease outbreak over time. This curve gives us a brief regarding the number of new outbreak cases by date of onset of the disease and hence the overall shape of the curve can reveal the type of outbreak we're dealing with."}},{"@type":"Question","name":"What is Healthcare capacity line?\n","acceptedAnswer":{"@type":"Answer","text":"The horizontal line represents the capacity of the country’s healthcare system. This capacity can be defined as the number of beds, staffing, and other measures available for patient care. Today, due to COVID-19 most of the countries are already operating close to the capacity line and the curve posses a threat of crossing this line as the virus spreads very rapidly."}},{"@type":"Question","name":"What happens when the line is crossed?\n","acceptedAnswer":{"@type":"Answer","text":"When the epidemic curve crosses the healthcare capacity line, the healthcare system can no longer meet the needs of COVID-19 patients and the other types of patients. At this point, people may not get the best care and the mortality rate starts to rise rapidly."}},{"@type":"Question","name":"What is flattening the curve?\n","acceptedAnswer":{"@type":"Answer","text":"A large number of lives can be saved by just ensuring that people get sick at a slower rate. This is termed as flattening the epidemic curve. A flattened curve indicates that the same number of people ultimately get infected with coronavirus but spread over a longer period which leads to a less stressed health care system.\n"}},{"@type":"Question","name":"When does flattening the curve happen?\n","acceptedAnswer":{"@type":"Answer","text":"The most important key factor to flatten the curve is social distancing. The objective of social distancing or self-isolation is to reduce the probability of close contact between persons carrying an infection, and others who are not infected, thus minimizing the virus transmission. This is the underlying reason why governments are closing schools, non-critical businesses, social/sports events and other places where a ton people gather."}},{"@type":"Question","name":"Can social distancing alone flatten the curve?","acceptedAnswer":{"@type":"Answer","text":"By limiting interactions between individuals, we can limit the spread of the disease but that doesn’t mean it is the only effective way to flatten the curve. There are several other factors that you can do to aid flatten the curve such as practicing good hygiene by washing your hands, using sanitizers, cleaning frequently touched surfaces and self-isolating in confirmed and suspected cases."}},{"@type":"Question","name":"How can we help in flattening the curve?","acceptedAnswer":{"@type":"Answer","text":"As the severity of COVID-19 rises, it's clear that our best option is to flatten the epidemic curve. So here is the list of things every individual is recommended to follow :\nWash your hands as frequently as you can.\nPractice efficient social distancing.\nStay home.\nProper usage of sanitizers.\nDon’t go for hospitals unless necessary.\nDon’t overbuy essential medical supplies like N95 masks which are required by healthcare providers while treating patients.\nMost importantly, don't panic!"}}]}`,
        type: "application/ld+json"
      }
    ]
  }
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>

<page-query>
query {
  allGlobalData {
    edges {
      node {
        title
        fullData{
          recovered
          cases
          updated
          deaths
        }
      }
    }
  }
  allCountriesData {
    edges {
      node {
        title
        fullData
      }
    }
  }
}
</page-query>