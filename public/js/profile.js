function modification ()
{
	var prenom = document.getElementById("prenom").value;
	var nom = document.getElementById("nom").value;
	var email = document.getElementById("email").value;
	var sexe = $('input[name=sexe]:checked').val();
	var orientation = $('input[name=orientation]:checked').val();
	var bio = document.getElementById("bio").value;
	var intere = document.getElementById("intere").value;
  var age = document.getElementById("age").value;
 	event.preventDefault();
  var dataToSend = {age: age, sexe: sexe, prenom: prenom, nom: nom, email: email, orientation: orientation, bio: bio, intere: intere};

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/edit',            
    success: function(data) {
        noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});

    }
    });
}

var photo = 'test';

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("img").src       = e.target.result;
      var elmt = document.getElementById("img");
      elmt.style.width = "150px";
      photo = e.target.result;
    }); 
    FR.readAsDataURL( this.files[0] );
  }
  
}
document.getElementById("inp").addEventListener("change", readFile);

function upload_photo_profil ()
{

  var chaine = photo.substr(1, 25);
  var login = document.getElementById("login_cache").value;
  var err = 1;
  var format = 'test';
  if (chaine.search("image/png") > 0 || chaine.search("image/jpg") > 0 || chaine.search("image/jpeg") > 0)
    err = 0;
  if (chaine.search("image/png") > 0)
    format = 'png';
  if (chaine.search("image/jpg") > 0 || chaine.search("image/jpeg") > 0)
    format = 'jpg';
  var dataToSend = {photo: photo, err: err, format: format};
  if (format === 'png')
      var image = '/image/user/' + login + 1 + '.png';
  if (format === 'jpg' || format === 'jpeg')
      var image = '/image/user/' + login + 1 + '.jpeg';

  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/send_photo',            
    success: function(data) {
        $('#img_prof').attr('src', image);
        if (format === 'png' || format === 'jpg' || format === 'jpeg')
          setTimeout(function(){ location.reload(); }, 1200);
      noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});
    }
    });
  
}

function readFile2() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("img2").src       = e.target.result;
      var elmt = document.getElementById("img2");
      elmt.style.width = "150px";
      photo = e.target.result;
    }); 
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("np").addEventListener("change", readFile2);

function upload_photo ()
{
  var chaine = photo.substr(1, 25);
  var login = document.getElementById("login_cache").value;
  var err = 1;
  var format = 'test';
  if (chaine.search("image/png") > 0 || chaine.search("image/jpg") > 0 || chaine.search("image/jpeg") > 0)
    err = 0;
  if (chaine.search("image/png") > 0)
    format = 'png';
  if (chaine.search("image/jpg") > 0 || chaine.search("image/jpeg") > 0)
    format = 'jpg';
  var dataToSend = {photo: photo, err: err, format: format};


  $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/send_photo_toute',            
    success: function(data) {
        if (format === 'png' || format === 'jpg' || format === 'jpeg')
          setTimeout(function(){ location.reload(); }, 1200);
      noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});
    }
    });
  
}

$(document).on('click', '.browse', function(){
  var file = $(this).parent().parent().parent().find('.file');
  file.trigger('click');
});
$(document).on('change', '.file', function(){
  $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
});

$('.les_photos').click(function(){
   id = this.id;
   nom = this.name;
   var dataToSend = {photo: id, nom: nom};
   $.ajax({
    type: 'POST',
    data: dataToSend,
    url: '/delete_photo',            
    success: function(data) {
      if (data.phrase !== 'Il n\'y a pas de photo à supprimer')
          setTimeout(function(){ location.reload(); }, 200);
      noty({layout: 'center', text: data.phrase, maxVisible: 1, type: data.theme, timeout : '2000', progressBar : true, theme: 'metroui', killer: true
});
    }
    });
});


