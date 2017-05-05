console.log("pouet");

$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 18,
      max: 99,
      values: [ 18, 99 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "" + $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
  } );

  $( function() {
    $( "#slider-range2" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 0, 500 ],
      slide: function( event, ui ) {
        $( "#amount2" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount2" ).val( "" + $( "#slider-range2" ).slider( "values", 0 ) +
      " - " + $( "#slider-range2" ).slider( "values", 1 ) );
  } );

  $( function() {
    $( "#slider-range3" ).slider({
      range: true,
      min: 0,
      max: 3000,
      values: [ 0, 300 ],
      slide: function( event, ui ) {
        $( "#amount3" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount3" ).val( "" + $( "#slider-range3" ).slider( "values", 0 ) +
      " - " + $( "#slider-range3" ).slider( "values", 1 ) );
  } );