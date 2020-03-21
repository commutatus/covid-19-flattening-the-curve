$(document).ready(() => {
  var api_url = "https://coronavirus-tracker-api.herokuapp.com/v2/latest";
  const stats = document.getElementById("stats-div");
  $.ajax({
    url: api_url,
    contentType: "application/json",
    dataType: "json",
    success: function(res) {
      console.log(res);
      const latest = res.latest;
      stats.innerHTML = `
            <p id="confirmed" class="font-weight-light">Global Stats - Confirmed : ${latest.confirmed} Deaths : ${latest.deaths} Recovered : ${latest.recovered}</p>`;
    },
    error: function(error) {
      console.log(error);
    }
  });
});

function sortByProperty(property) {
  return function(a, b) {
    if (a[property] > b[property]) return -1;
    else if (a[property] < b[property]) return 1;

    return 0;
  };
}

fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(response => response.json())
  .then(data => {
    Object.keys(data).forEach((i, index) => {
      var xlabels = [];
      var ylabels = [];
      data[i].forEach(e => {
        ylabels.push(e.confirmed);
        xlabels.push(moment(e.date).format("DD/MM"));
      });
      var ctx = document.getElementById(`myChart${index}`);
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: xlabels,
          datasets: [
            {
              label: `Confirmed Cases in ${i}`,
              data: ylabels,
              backgroundColor: ["rgba(255, 159, 64, 0.2)"],
              borderColor: ["rgba(255, 159, 64, 1)"],
              lineTension: 0.4,
              borderWidth: 1,
              pointRadius: 0
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    });
  });
