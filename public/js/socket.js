$(function() {
    var login = document.getElementById("login").value;
    var socket = io.connect();

    $(function() {
      var time = new Date ();
      function convertDate(inputFormat) {
  		  function pad(s) { return (s < 10) ? '0' + s : s; }
  		  var d = new Date(inputFormat);
  		  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
		  }
      var newtime = convertDate(time);
      var hour = time.getHours();
      socket.emit('user', {
    	login: login,
    	time: newtime,
    	hour: time.getHours(),
    	minute: time.getMinutes()
    })
    })


    $( document ).ready(function() {
      var test = document.getElementById("test").value;
      if (test === "profileok")
      {
        var login_me = document.getElementById("login").value;
        var login_ext = document.getElementById("login_ext").value;
        socket.emit('visit', {
          login_me: login_me,
          login_ext: login_ext
        })
      }
    });

    $("#send_message").click(function(){
      var message = document.getElementById("comment").value;
      message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var dest_user = document.getElementById("dest_user").value;
      $('#comment').val('');
      $('#comment').focus();
      $('#conversation').append('<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">' + message + '</div></div></div></div>');
      $('#conversation').animate({scrollTop : $('#conversation').prop('scrollHeight') }, 50);
      socket.emit('message_send', {
        message: message,
        dest_user: dest_user,
        login: login
      })
    })

    $("#button_like").click(function(){
      var dest_user = document.getElementById("login_ext").value;
      socket.emit('like', {
        dest_user: dest_user,
        login: login
      })
    })

    $("#button_dislike").click(function(){
      var dest_user = document.getElementById("login_ext").value;
      socket.emit('dislike', {
        dest_user: dest_user,
        login: login
      })
    })

    $("#activite").click(function(){
      socket.emit('activite', {
        login: login
      })
    })

    socket.on('notif', function (user) {
      noty({layout: 'bottomLeft', text: user.notif, maxVisible: 1, type: 'success', timeout : '2000', progressBar : true, theme: 'metroui', killer: true
      });
    })

    socket.on('send_msg', function (user) {
      $('#conversation').append('<div id="zone_msg" class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">' + user.message + '</div></div></div></div>');
      $('#conversation').animate({scrollTop : $('#conversation').prop('scrollHeight') }, 50);
    })
})


