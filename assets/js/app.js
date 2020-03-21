$(document).ready(() => {
    var api_url = "https://coronavirus-tracker-api.herokuapp.com/v2/latest";
    const stats = document.getElementById("stats-div");
    $.ajax({
        url: api_url,
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            console.log(res);
            const latest = res.latest;
            stats.innerHTML = `            
            <div class="card bg-light border-warning mb-3 text-center w-20" style="border-radius: 10px;">
            <div class="card-header">Confirmed</div>
            <div class="card-body">
              <h3 class="card-title text-warning">${latest.confirmed}</h5>
            </div>
          </div>

  
            <div class="card bg-light border-danger mb-3 text-center w-20" style="border-radius: 10px;">
                <div class="card-header">Deaths</div>
                <div class="card-body">
                  <h3 class="card-title text-danger">${latest.deaths}</h5>
                </div>
              </div>
       

            <div class="card bg-light border-success mb-3 text-center w-20" style="border-radius: 10px;">
                <div class="card-header">Recovered</div>
                <div class="card-body">
                  <h3 class="card-title text-success">${latest.recovered}</h5>
                </div>
            </div>`;
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property]) return -1;
        else if (a[property] < b[property]) return 1;

        return 0;
    };
}

fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
        let countriesArray = Object.keys(data)
        localStorage.setItem('totalCountries', countriesArray.length)
        let totalCountryCountArray = []
        countriesArray.forEach((country) => {
            let countryTimelineArray = data[country]
            let latestCountryCount = (countryTimelineArray[countryTimelineArray.length - 1]).confirmed
            let latestDate = (countryTimelineArray[countryTimelineArray.length - 1]).date
            totalCountryCountArray.push({ country: country, count: latestCountryCount, lastUpdated: latestDate })
        })
        let sortedCountryArray = totalCountryCountArray.sort((a, b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));

        sortedCountryArray.forEach((i, index) => {
            var xlabels = []
            var ylabels = []
            data[i.country].forEach((e) => {

                ylabels.push(e.confirmed)
                xlabels.push(moment(e.date,'YYYY-MM-DD').format('DD/MM'))


            })
            var ctx = document.getElementById(`myChart${index}`);
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: xlabels,
                    datasets: [{
                        label: `Total confirmed cases: ${((sortedCountryArray[index]).count).toLocaleString()} (last updated: ${moment((sortedCountryArray[index]).lastUpdated, 'YYYY-MM-DD').format('DD/MM/YY')})`,
                        data: ylabels,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.3)',

                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                        ],
                        lineTension: 0.4,
                        borderWidth: 1,
                        pointRadius: 0,
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: `${i.country}`
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutSine'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                maxTicksLimit: 8,
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                maxTicksLimit: 12,
                            },
                        }],
                    }
                }
            });
        })
    })
