$("#button_like").click(function(){
	var login_ext = document.getElementById("button_like").value;
	$('#button_like').hide();
	$('#button_dislike').show();
    var dataToSend = {login_ext: login_ext, type: "like"};

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/like',            
    success: function(data) {
        noty({layout: 'center', text: "Vous devez posseder une photo de profil pour liker les autres utilisateurs", maxVisible: 1, type: "error", timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});
	$('#button_dislike').hide();
	$('#button_like').show();

    }
    });
});

$("#button_dislike").click(function(){
    var login_ext = document.getElementById("button_dislike").value;
    var dataToSend = {login_ext: login_ext, type: "dislike"};
    $('#button_dislike').hide();
    $('#button_like').show();

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/like',            
    success: function(data) {
        //noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
//});

    }
    });
});

$("#button_block").click(function(){
	var login_ext = document.getElementById("button_block").value;
	$('#button_dislike').hide();
	$('#button_like').show();
    var dataToSend = {login_ext: login_ext, type: "dislike"};

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/block',            
    success: function(data) {
        //noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
//});

    }
    });
});

$("#button_fauxprofil").click(function(){
    var login_ext = document.getElementById("button_fauxprofil").value;
    $('#button_dislike').hide();
    $('#button_like').show();
    var dataToSend = {login_ext: login_ext};

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/fauxprofil',            
    success: function(data) {
        noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});

    }
    });
});

//$("#button_fauxprofil").click(function(){
  //  var dataToSend = {login_ext: login_ext};

  /*$.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/fauxprofil',            
    success: function(data) {
        noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});

    }
    }); */
//});
