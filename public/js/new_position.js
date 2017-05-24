/* Déclaration des variables  */
  var geocoder;
  var map;
  var markers = new Array();
  var i = 0;

  function initialize() {
  var lat = document.getElementById('db_lat').value;
  var longi = document.getElementById('db_longi').value;


   geocoder = new google.maps.Geocoder();
   var paris = new google.maps.LatLng(lat, longi);
   var myOptions = {
    zoom: 10,
    center: paris,
    mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   map = new google.maps.Map(document.getElementById("map"), myOptions);
   map.panTo(new google.maps.LatLng(lat, longi));
        var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, longi), 
        map: map
      });
  }

  function codeAddress() {
   var address = document.getElementById("address").value;
    address = address.replace(/</g, "&lt;").replace(/>/g, "&gt;");
   geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
     document.getElementById('lat').value = results[0].geometry.location.lat();
     document.getElementById('lng').value = results[0].geometry.location.lng();
     map.setCenter(results[0].geometry.location);
     var marker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location
     });
     markers.push(marker);
     if(markers.length > 1)
      markers[(i-1)].setMap(null);
      i++;
     } else {
      alert("Le geocodage n\'a pu etre effectue pour la raison suivante: " + status);
     }
    });
  }

  function loca() {
    var latitude = document.getElementById("lat").value;
    var longitude = document.getElementById("lng").value;
    latitude = latitude.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    longitude = longitude.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    var dataToSend = {lat: latitude, longi: longitude};

      $.ajax({
          type: 'POST',
          data: dataToSend,
          url: '/newlocation.js',            
          success: function(data) {
            noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
            });
          }
          });
    
  }

  function loca_here() {
    var watchId = navigator.geolocation.getCurrentPosition(
      function(position){
        document.getElementById('lat').value = position.coords.latitude;
        document.getElementById('lng').value = position.coords.longitude;
        var lat = position.coords.latitude;
        var longi = position.coords.longitude;

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: new google.maps.LatLng(lat, longi),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }); 
      map.panTo(new google.maps.LatLng(lat, longi));
        var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, longi), 
        map: map
      });


      }, null, {enableHighAccuracy:true});
  }

