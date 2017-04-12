var previousPosition = null;
	
		function initialize() {
			var lat = document.getElementById("db_lat").value;
			var longi = document.getElementById("db_longi").value;
			if (!lat)
			{
			map = new google.maps.Map(document.getElementById("map"), {
			      zoom: 10,
			     // center: new google.maps.LatLng(48.858565, 2.347198),
			      mapTypeId: google.maps.MapTypeId.ROADMAP
			    });	
			}
			else
			{
				map = new google.maps.Map(document.getElementById("map"), {
			      zoom: 10,
			      center: new google.maps.LatLng(lat, longi),
			      mapTypeId: google.maps.MapTypeId.ROADMAP
			    });	
			}
		}
		  
		if (navigator.geolocation)
			var watchId = navigator.geolocation.watchPosition(successCallback, null, {enableHighAccuracy:true});
		else
			alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
			
		function successCallback(position){
			var lat = document.getElementById("db_lat").value;
			var longi = document.getElementById("db_longi").value;
			if (lat)
			{
				map.panTo(new google.maps.LatLng(lat, longi));
				var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, longi), 
				map: map
			});  

			}
			else
			{
			map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
				map: map
			});  
			if (previousPosition){
				var newLineCoordinates = [
					 new google.maps.LatLng(previousPosition.coords.latitude, previousPosition.coords.longitude),
					 new google.maps.LatLng(position.coords.latitude, position.coords.longitude)];
				
				var newLine = new google.maps.Polyline({
					path: newLineCoordinates,	       
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2
				});
				newLine.setMap(map);
			}
			previousPosition = position;


  			var dataToSend = {lat: position.coords.latitude, longi: position.coords.longitude};

			$.ajax({
    			type: 'POST',
    			data: dataToSend,
    			url: '/setlocation.js',            
    			success: function(data) {

    			}
    			});
			}
		};


