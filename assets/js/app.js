$(document).ready(() => {
  var api_url = "https://coronavirus-tracker-api.herokuapp.com/v2/latest";
  const confirmed = document.getElementById("total-confirmed");
  const deaths = document.getElementById("total-deaths");
  const recovered = document.getElementById("total-recovered");
  const lastUpdated = document.getElementById("last-updated");
  let lastUpdatedValue;
  let starredCountries = [];
  let sortedCountryArray = [];
  let buttonIDs = [];
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
        sortedCountryArray = totalCountryCountArray.sort((a, b) =>
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
      );

      

      const container = document.getElementById("country-graphs");
      sortedCountryArray.forEach((i, index) => {
        container.innerHTML += `<div class='bg-light p-1 m-2 province-charts content' > 
                  <button class="btn btn-star" id="chart-star-${index}"> 
                    <i class="fas fa-star" id="fa-star-${index}"> </i> 
                  </button>
                  <div id='country-id-${index}' class='text-center' > 
                    <p class= "country-names">${i.country}</p> 
                  </div> 
                  <canvas class='myCharts${index}' width='100%'></canvas> 
          </div> `;
      });

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



        let starredClick = document.getElementById(`chart-star-${index}`)

        $('#chart-star-'+index+'').click(function(){
           $(this).removeClass('inactive').addClass('btn-star-active');
           $('#fa-star-'+index+'').addClass('star-color');
        });

        starredClick.addEventListener( 'click' ,(e)=>{

          if (typeof Storage !== "undefined") {
            if (localStorage.getItem("starred") === null) {
              starredCountries.push(i.country);
              localStorage.setItem("starred", JSON.stringify(starredCountries));
            }else{
              starredCountries = JSON.parse(localStorage.getItem("starred"));

              if(starredCountries.includes(i.country)){
                starredCountries = starredCountries.filter(e => e !== i.country );
                localStorage.setItem("starred", JSON.stringify(starredCountries));
                $('#chart-star-'+index+'').removeClass('btn-star-active');
                $('#fa-star-'+index+'').removeClass('star-color');
              }else{
                starredCountries.push(i.country);
                localStorage.setItem("starred", JSON.stringify(starredCountries));
              }
            
            }
          } else {
            console.log(`Your browser doesn't support Web Storage!`);
          }
        })

        let ctx = document.getElementsByClassName(`myCharts${index}`);
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
              display: true
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
    })
    .then(() => {
      $(document).ready(function() {
        $("#search").keyup(function() {
          var text = $(this).val().toLowerCase();
          $(".content").hide();
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
            }
          });
        });

        $('#tab-choose .btn-country').click(function(){
          $(".content").show();
        });

        $('#tab-choose .btn-starred').click(function(){
            $(".content").hide();

            if (localStorage.getItem("starred") === null) {
                console.log(`0 countries are starred!`);
              }
              else
              {
                let starredCountriesArray = JSON.parse(localStorage.getItem("starred"));
                starredCountriesArray.forEach((i)=>{
                  $('.content .country-names:contains("'+i+'")').closest('.content').show();

                })
              }

          });
      });

      });  
});


