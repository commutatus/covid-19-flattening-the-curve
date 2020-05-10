function generatePredictedCharts(i, index, xlabels, ylabels, sortedPredictedArray) {
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
        pointBackgroundColor: "rgba(255, 99, 132, 0.8)",
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
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: `Days since first confirmed case in ${i.country}`,
          },
          ticks: {
            maxTicksLimit: 12,
          },
        },
      ],
    },
  };
  this.sortedPredictedArray[index] = tempObj;
}

export default generatePredictedCharts;
