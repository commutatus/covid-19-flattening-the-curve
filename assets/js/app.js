/*
 * Created Date: Friday March 20th 2020
 * Author: Gurubalan Harikrishnan
 * Email-ID: gurubalan.work@gmail.com
 * -----
 * Copyright (c) 2020 Gurubalan Harikrishnan
 */

 console.log(`Inside App console`);


 $(document).ready(()=>{
    var api_url="https://coronavirus-tracker-api.herokuapp.com/v2/latest"
    const stats = document.getElementById("stats-div")
    $.ajax({
        url: api_url,
        contentType: "application/json",
        dataType: 'json',
        success: function(res){
            console.log(res);
            const latest = res.latest
            stats.innerHTML = `
            <p id="confirmed" class="text-white-75 font-weight-light">Confirmed : ${latest.confirmed}</p>
            <p id="deaths" class="text-white-75 font-weight-light">Deaths : ${latest.deaths}</p>
            <p id="recovered" class="text-white-75 font-weight-light">Recovered : ${latest.recovered}</p> `
            // const list=locations.locations
            // const names =  list.map(person => `<li>${person.country}</li>`).join("\n");
            // show.innerHTML = `<ul>${names}</ul>` 
        },
        error: function(error){
            console.log(error);
        }
    })
})
 

// function getData() {
//         var api_url="https://coronavirus-tracker-api.herokuapp.com/v2/locations"
//         const show = document.getElementById("people-names")
//         $.ajax({
//             url: api_url,
//             contentType: "application/json",
//             dataType: 'json',
//             success: function(locations){
//                 console.log(locations);
//                 const list=locations.locations
//                 //const names =  list.map(person => `<li>${person.country}</li>`).join("\n");
//                 //show.innerHTML = `<ul>${names}</ul>` 
//             },
//             error: function(error){
//                 console.log(error);
//             }
//         })
//     }


    // $(document).ready(()=>{
    //     var xlabels = []
    //     var ylabels = []
    //     var api_url="https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1"
    //     $.ajax({
    //         url: api_url,
    //         contentType: "application/json",
    //         dataType: 'json',
    //     })
    //     .done(function(locations) {
    //         const list=locations.locations[0].timelines.confirmed.timeline 
    //         values = Object.values(list)
    //         keys = Object.keys(list)
    //         keys.forEach((key)=>{
    //                 xlabels.push(moment(key).format('DD/MM'))
    //             })   
    //         values.forEach((value)=>{
    //                 ylabels.push(value)
    //             })  
    //     })
    //     .done(function(data) {
    //         var ctx = document.getElementById('myChart');
    //         var myChart = new Chart(ctx, {
    //             type: 'line',
    //             data: {
    //                 labels: xlabels,
    //                 datasets: [{
    //                     label: 'Confirmed cases',
    //                     data: ylabels,
    //                     backgroundColor: [
    //                         'rgba(255, 99, 132, 0.2)',
                    
    //                     ],
    //                     borderColor: [
    //                         'rgba(255, 99, 132, 1)',
    //                     ],
    //                     lineTension: 0.2,
    //                     borderWidth: 2
    //                 }]
    //             },
    //             options: {
    //                 scales: {
    //                     yAxes: [{
    //                         ticks: {
    //                             beginAtZero: true
    //                         }
    //                     }]
    //                 }
    //             }
    //         });  
    //     })
    // })    


    $(document).ready(()=>{
        const graphDiv = document.getElementById("country-graphs")
        var xlabels = []
        var ylabels = []
        var api_url="https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1"
        $.ajax({
            url: api_url,
            contentType: "application/json",
            dataType: 'json',
        })
        .done(function(locations){
            var list=locations.locations.map(location => location.timelines.confirmed.timeline) 
            list.slice(0,25).forEach((list, index )=>{

                var values = Object.values(list)
                var keys = Object.keys(list)
                keys.forEach((key)=>{
                    xlabels.push(moment(key).format('DD/MM'))
                })   
                values.forEach((value)=>{
                    ylabels.push(value)
                })
                
                var ctx = document.getElementById(`myChart${index}`);
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: xlabels,
                        datasets: [{
                            label: 'Confirmed cases',
                            data: ylabels,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                        
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                            ],
                            lineTension: 0.2,
                            borderWidth: 2
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                }); 
                    
            })
        })
        .fail(function(err) {
            console.log(err);
        })
    })



    // var api_url="https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1"
    // $.ajax({
    //     url: api_url,
    //     contentType: "application/json",
    //     dataType: 'json',
    //     success: function(locations){
    //         const list=locations.locations.map(location => location.timelines.confirmed.timeline) 
    //         list.forEach((value)=>{

    //         })
    //         console.log(list);
            
    //     },
    //     error: function(error){
    //         console.log(error);
    //     }
    // })