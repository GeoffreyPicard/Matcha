$( function() {
    var age1 = document.getElementById("amount").value;
    var age2 = document.getElementById("amount").name;
    var age_min = parseInt(age1);
    var age_max = parseInt(age2);
    $( "#slider-range" ).slider({
      range: true,
      min: 18,
      max: 99,
      values: [ age_min, age_max ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "" + $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
  } );

  $( function() {
    var pop1 = document.getElementById("amount2").value;
    var pop2 = document.getElementById("amount2").name;
    var pop_min = parseInt(pop1);
    var pop_max = parseInt(pop2);
    $( "#slider-range2" ).slider({
      range: true,
      min: 0,
      max: 100,
      values: [ pop_min, pop_max ],
      slide: function( event, ui ) {
        $( "#amount2" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount2" ).val( "" + $( "#slider-range2" ).slider( "values", 0 ) +
      " - " + $( "#slider-range2" ).slider( "values", 1 ) );
  } );


  $( function() {
    var loc1 = document.getElementById("amount3").value;
    var loc2 = document.getElementById("amount3").name;
    var loc_min = parseInt(loc1);
    var loc_max = parseInt(loc2);
    $( "#slider-range3" ).slider({
      range: true,
      min: 0,
      max: 3000,
      values: [ loc_min, loc_max ],
      slide: function( event, ui ) {
        $( "#amount3" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount3" ).val( "" + $( "#slider-range3" ).slider( "values", 0 ) +
      " - " + $( "#slider-range3" ).slider( "values", 1 ) );
  } );


function filtre (id) {
  var dataToSend = {id: id};
  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/rencontre',            
    success: function(data) {
      document.location.href='/rencontre'
    }
    });
}

function filtre2 () {
  var age = document.getElementById("amount").value;
  var pop = document.getElementById("amount2").value;
  var loc = document.getElementById("amount3").value;
  var tag1 = document.getElementById("tag1").value;
  var tag2 = document.getElementById("tag2").value;
  var tag3 = document.getElementById("tag3").value;
  var tab_age = age.split(' ');
  var tab_pop = pop.split(' ');
  var tab_loc = loc.split(' ');
  var age_min = tab_age[0];
  var age_max = tab_age[2];
  var pop_min = tab_pop[0];
  var pop_max = tab_pop[2];
  var loc_min = tab_loc[0];
  var loc_max = tab_loc[2];

  var dataToSend = {age_min: age_min, age_max: age_max, pop_min: pop_min, pop_max: pop_max, loc_min: loc_min, loc_max: loc_max, tag1: tag1, tag2: tag2, tag3: tag3};
  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/rencontre',            
    success: function(data) {
      document.location.href='/rencontre'
    }
    });
}