import moment from "moment";
function updateSortedActiveCount(totalPredictedCountArray, predictedData) {
  let updatedCountryArray = JSON.parse(
    JSON.stringify(totalPredictedCountArray)
  );
  updatedCountryArray.forEach((i, index) => {
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
      .format("YYYY-MM-DD HH:mm:ss");
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
          predictedTimelineArray.push(valuesArray[1]);
        }
      });
    });
    i.count = predictedTimelineArray[predictedTimelineArray.length - 1];
  });
  return updatedCountryArray;
}

export default updateSortedActiveCount;
