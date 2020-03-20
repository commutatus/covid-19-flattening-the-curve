/*
 * Created Date: Friday March 20th 2020
 * Author: Gurubalan Harikrishnan
 * Email-ID: gurubalan.work@gmail.com
 * -----
 * Copyright (c) 2020 Gurubalan Harikrishnan
 */

 console.log(`Inside console`);
 
//  $(document).ready(()=>{
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

$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 72)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 75
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-scrolled");
    } else {
      $("#mainNav").removeClass("navbar-scrolled");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);