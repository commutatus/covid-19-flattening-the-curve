function generatePredictedCharts(
  i,
  index,
  xlabels,
  ylabels,
  sortedPredictedArray,
  currentYlabels,
  currentActive,
  activeCasesToday,
  active
) {
  let tempObj = sortedPredictedArray[index];
  let predictedData = activeCasesToday
    ? currentActive > activeCasesToday.Infected
      ? currentActive - activeCasesToday.Infected
      : activeCasesToday.Infected - currentActive
    : currentActive;
  tempObj["chartData"] = {
    labels: xlabels,
    datasets: [
      {
        label: `Active cases: ${
          activeCasesToday
            ? activeCasesToday.Infected.toLocaleString()
            : active.toLocaleString()
        }`,
        data: ylabels,
        fill: 1,
        backgroundColor: ["rgba(255, 99, 132, 0.3)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        lineTension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        pointBackgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: `Predicted cases: ${predictedData.toLocaleString()}`,
        data: currentYlabels,
        backgroundColor: ["rgba(54, 162, 235, 0.3)"],
        borderColor:  ["rgba(255, 99, 132, 1)"],
        lineTension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        pointBackgroundColor: "rgba(54, 162, 235, 0.3)",
      },
    ],
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
        },
      },
      enabled: true,
      mode: "nearest",
    },
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [
        {
          ticks: {
            callback: function(label, index, labels) {
              return Number(label).toLocaleString();
            },
            maxTicksLimit: 8,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: `Predicted # of Active cases in ${
              i.country
            } (Total cases: ${active.toLocaleString()})`,
          },
          ticks: {
            maxTicksLimit: 12,
          },
        },
      ],
    },
  };
  return tempObj;
}

export default generatePredictedCharts;
