$(document).ready(() => {
  var api_url = "https://coronavirus-tracker-api.herokuapp.com/v2/latest";
  const confirmed = document.getElementById("total-confirmed");
  const deaths = document.getElementById("total-deaths");
  const recovered = document.getElementById("total-recovered");
  const lastUpdated = document.getElementById("last-updated");
  let lastUpdatedValue;
  $.ajax({
    url: api_url,
    contentType: "application/json",
    dataType: "json",
    success: function(res) {
      const latest = res.latest;
      confirmed.innerHTML = `${latest.confirmed}`;
      deaths.innerHTML = `${latest.deaths}`;
      recovered.innerHTML = `${latest.recovered}`;
      lastUpdated.innerHTML = `${lastUpdatedValue}`;
    },
    error: function(error) {
      console.log(error);
    }
  });

  fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
      let countriesArray = Object.keys(data);
      localStorage.setItem("totalCountries", countriesArray.length);
      let totalCountryCountArray = [];
      countriesArray.forEach(country => {
        let countryTimelineArray = data[country];
        let latestCountryCount =
          countryTimelineArray[countryTimelineArray.length - 1].confirmed;
        let latestDate =
          countryTimelineArray[countryTimelineArray.length - 1].date;
        totalCountryCountArray.push({
          country: country,
          count: latestCountryCount,
          lastUpdated: latestDate
        });
      });
      let sortedCountryArray = totalCountryCountArray.sort((a, b) =>
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
      );

      let totalCountries = localStorage.getItem("totalCountries") || 150;
      const container = document.getElementById("country-graphs");
      for (i = 0; i <= totalCountries - 1; i++) {
        container.innerHTML += ` <div class='bg-light p-1 m-2 province-charts'> <button class="btn btn-star"> <i class="fas fa-star" id="chart-star-${i}"> </i></button>  <canvas id='myChart${i}' width='100%'></canvas> </div> `;
      }

      sortedCountryArray.forEach((i, index) => {
        let xlabels = [];
        let ylabels = [];
        data[i.country].forEach(e => {
          ylabels.push(e.confirmed);
          xlabels.push(moment(e.date, "YYYY-MM-DD").format("DD/MM"));
        });

        lastUpdatedValue = moment(
          sortedCountryArray[index].lastUpdated,
          "YYYY-MM-DD"
        ).format("DD/MM/YY");

        let ctx = document.getElementById(`myChart${index}`);
        let myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: xlabels,
            datasets: [
              {
                label: `Total confirmed cases: ${sortedCountryArray[
                  index
                ].count.toLocaleString()}`,
                data: ylabels,
                backgroundColor: ["rgba(255, 99, 132, 0.3)"],
                borderColor: ["rgba(255, 99, 132, 1)"],
                lineTension: 0.4,
                borderWidth: 1,
                pointRadius: 0
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: `${i.country}`
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
                  ticks: {
                    maxTicksLimit: 12
                  }
                }
              ]
            }
          }
        });
      });
    });
});
