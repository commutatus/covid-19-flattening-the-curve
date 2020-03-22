$(document).ready(() => {
  var api_url = "https://coronavirus-19-api.herokuapp.com/all";
  const confirmed = document.getElementById("total-confirmed");
  const deaths = document.getElementById("total-deaths");
  const recovered = document.getElementById("total-recovered");
  const lastUpdated = document.getElementById("last-updated");
  let lastUpdatedValue;
  let countries = [];
  $.ajax({
    url: api_url,
    contentType: "application/json",
    dataType: "json",
    success: function(res) {
      const latest = res;
      confirmed.innerHTML = `${(latest.cases).toLocaleString()}`;
      deaths.innerHTML = `${(latest.deaths).toLocaleString()}`;
      recovered.innerHTML = `${(latest.recovered).toLocaleString()}`;
      lastUpdated.innerHTML = `${lastUpdatedValue}`;
    },
    error: function (error) {
      console.log(error);
    }
  });

  fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
      let countriesArray = Object.keys(data);
      let totalCountryCountArray = [];
      countriesArray.forEach(country => {
        let countryTimelineArray = data[country];
        let latestCountryCount =
          countryTimelineArray[countryTimelineArray.length - 1].confirmed - (countryTimelineArray[countryTimelineArray.length - 1].deaths + countryTimelineArray[countryTimelineArray.length - 1].recovered);
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

      const container = document.getElementById("country-graphs");

      sortedCountryArray.forEach((i, index) => {
        container.innerHTML += ` <div class='bg-light p-1 m-2 province-charts'> <button class="btn btn-star" id="chart-star-${index}"> <i class="fas fa-star"> </i> </button><div id='country-id-${index}' class='text-center'> <p class= "country-names"> ${i.country} </p> </div> <canvas id='myChart${index}' width='100%'></canvas> </div> `;
      })


      sortedCountryArray.forEach((i, index) => {
        let xlabels = [];
        let ylabels = [];
        countries.push(i.country);
        let dayCount = 0
        data[i.country].forEach(e => {
          if (e.confirmed !== 0) {
            dayCount = dayCount + 1
            ylabels.push(e.confirmed - (e.deaths + e.recovered));
            xlabels.push(`${dayCount}`);
          }
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
                title: function(tooltipItems, data) {
                  return '';
                },
                label: function(tooltipItem, data) {
                  return (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString();
                }
              },
              enabled: true,
              mode: 'nearest'
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
    });
});
