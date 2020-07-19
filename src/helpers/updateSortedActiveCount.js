import moment from "moment";
function updateSortedActiveCount(totalPredictedCountArray, predictedData) {
    let updatedCountryArray = JSON.parse(JSON.stringify(totalPredictedCountArray));
    updatedCountryArray.forEach((i, index) => {
        let predictedDateArray = Object.keys(predictedData[i.country]);
        let reformatDatesArray = [];
        let sortedDatesArray = [];
        let predictedTimelineArray = [];
        let formatedDates = [];

        //Format and sorting for the whole timeline array
        predictedDateArray.forEach(e => {
          let date = null;
          date = new Date(e);
          date = moment(date).format("MM-DD-YYYY HH:mm:ss");
          reformatDatesArray.push(date);
        });
        let SortedDates = reformatDatesArray.sort();

        let primaryDate = SortedDates[0];
        let tempLastDate = new Date(primaryDate);
        let formattedLastDate = moment(tempLastDate).add(1, 'month').format("MM-DD-YYYY HH:mm:ss");
        
        SortedDates.forEach((e) => {
          let date = null;
          date = new Date(e);
          let formattedEndDate = new Date(formattedLastDate);
          if(date.getMonth() <= formattedEndDate.getMonth() && date.getDate() <= formattedEndDate.getDate()){
            date = moment(date).format("YYYY-MM-DD HH:mm:ss");
            sortedDatesArray.push(date);
          }
        })

        sortedDatesArray.forEach(e => {
            predictedDateArray.forEach(k => {
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