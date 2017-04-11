function verif ()
{
	var prenom = document.getElementById("prenom").value;
	var nom = document.getElementById("nom").value;
	var login = document.getElementById("loginn").value;
	var password = document.getElementById("passwordd").value;
	var email = document.getElementById("email").value;
  event.preventDefault();
  var dataToSend = {prenom: prenom, nom: nom, login: login, password: password, email: email};

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/register.js',            
    success: function(data) {
      if (data.erreur === 'yes')
        $('.contentmid').noty({text: data.phrase, maxVisible: 1, type: data.theme, timeout : data.time, progressBar : true, theme: 'metroui', killer: true

});

    }
    });
}

function recup_password ()
{
  var email = document.getElementById("email").value;
  event.preventDefault();
  var dataToSend = {email: email};
  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/recup_password.js',            
    success: function(data) {
    $('.back_ground').noty({text: data.phrase, maxVisible: 1, type: data.theme, timeout : data.time, progressBar : true, theme: 'metroui', killer: true
});
    }
    });
}

function change_password ()
{
  var url = document.location.href.split("?");
  var params = url[1].split("&");
  var get = new Object;
  for(var i in params)
        {
          var tmp = params[i].split("=");
          get[tmp[0]] = unescape(tmp[1].replace("+", " "));
        }

  var email = document.getElementById("email").value;
  var password = document.getElementById("new_password").value;
  event.preventDefault();
  var dataToSend = {email: email, password: password, email_get: get.email, hash_get: get.hash};
  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/change_password.js',
    success: function(data) {
    $('.pass_oublie').noty({text: data.phrase, maxVisible: 1, type: data.theme, timeout : data.time, progressBar : true, theme: 'metroui', killer: true
});
    }
    });
}

function connection ()
{
  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;
  event.preventDefault();
  var dataToSend = {login: login, password: password};
  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/index.js',
    success: function(data) {
      if (data.theme === 'error')
      {
        $('.back_ground').noty({text: data.phrase, maxVisible: 1, type: data.theme, timeout : data.time, progressBar : true, theme: 'metroui', killer: true
});
      }
      else
        document.location.href='/index';
    }
    });
}