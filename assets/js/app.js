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
 
//   $(document).ready(()=>{
//     var api_url="https://coronavirus-tracker-api.herokuapp.com/v2/locations"
//     const show = document.getElementById("people-names")
//     $.ajax({
//         url: api_url,
//         contentType: "application/json",
//         dataType: 'json',
//         success: function(locations){
//             console.log(locations);
//             const list=locations.locations
//             const names =  list.map(person => `<li>${person.country}</li>`).join("\n");
//             show.innerHTML = `<ul>${names}</ul>` 
//         },
//         error: function(error){
//             console.log(error);
//         }
//     })
// })