var express = require('express');
var app = express();
app.use('/static', express.static('public'));
app.use('/lib', express.static('lib'));
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const crypto = require("crypto");
//var Server = require('socket.io');
//var server = require('http').createServer(app);  
//var io = require('socket.io')(server);


//var sqlinjection = require('sql-injection');
//app.use(sqlinjection);
var mysql      = require('mysql');
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('lib'));
app.use(express.static('models'));
var db = require('./config/database');
var register = require('./lib/register.js');
app.use(session({secret: "Shh, its a secret!"}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const server = app.listen(8080, () => {
  console.log('listening on *:8080');
});

const io = require('socket.io')(server);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var allClients = [];

io.on('connection', (socket) => {
	socket.on('user', function (user) {
		socket["info"] = user;
		allClients.push(socket);
		console.log("user connected");
		db.query('UPDATE matcha.users SET derniereconnection= ? WHERE login= ?', ["en ligne", user.login]);
  	})

  	socket.on('message_send', function (user) {
  		var i = 0;
  		var notif = user.login + " vous à envoyé un message !";
  		user.notif = notif;
		db.query('UPDATE matcha.users SET notif= ? WHERE login= ?', ["yes", user.dest_user]);
		db.query('INSERT INTO notification (login, notif) VALUES (?, ?)', [user.dest_user, notif]);
		db.query('INSERT INTO message (envoi, recoi, msg) VALUES (?, ?, ?)', [user.login, user.dest_user, user.message]);
  		while (allClients[i])
  		{
  			if (allClients[i].info.login === user.dest_user)
  			{
  				allClients[i].emit('send_msg', user);
  				allClients[i].emit('notif', user);
  			}
  			i++;
  		}
  	})

  	socket.on('like', function (user) {
  		let Chat = require('./models/chat.js');
		var info = {login: user.login, login_ext: user.dest_user};
		Chat.Verif_like(info, function (data) {
			if (data === "no")
	  			var notif = user.login + " vous à liké !";
	  		else
	  			var notif = user.login + " vous à liké en retour, match !";
			db.query('UPDATE matcha.users SET notif= ? WHERE login= ?', ["yes", user.dest_user]);
			db.query('INSERT INTO notification (login, notif) VALUES (?, ?)', [user.dest_user, notif]);
  			user.notif = notif;
  		var i = 0;
  		while (allClients[i])
  		{
  			if (allClients[i].info.login === user.dest_user)
  				allClients[i].emit('notif', user);
  			i++;
  		}
		})
  	})

  	socket.on('dislike', function (user) {
  		var notif = user.login + " ne vous like plus :(";
		db.query('UPDATE matcha.users SET notif= ? WHERE login= ?', ["yes", user.dest_user]);
		db.query('INSERT INTO notification (login, notif) VALUES (?, ?)', [user.dest_user, notif]);
  		user.notif = notif;
  		var i = 0;
  		while (allClients[i])
  		{
  			if (allClients[i].info.login === user.dest_user)
  				allClients[i].emit('notif', user);
  			i++;
  		}
  	})

  	socket.on('visit', function (user) {
  		var notif = user.login_me + " a visité votre profil !";
  		user.notif = notif;
		db.query('UPDATE matcha.users SET notif= ? WHERE login= ?', ["yes", user.login_ext]);
		db.query('INSERT INTO notification (login, notif) VALUES (?, ?)', [user.login_ext, notif]);
		var i = 0;
		while (allClients[i])
  		{
  			if (allClients[i].info.login === user.login_ext)
  				allClients[i].emit('notif', user);
  			i++;
  		}
  	})

  	socket.on('activite', function (user) {
		db.query('UPDATE matcha.users SET notif= ? WHERE login= ?', ["no", user.login]);
  	})

  	socket.on('disconnect', function () {
  		console.log("user disconnect");
  		var i = allClients.indexOf(socket);
      	var info = allClients[i].info;
      	allClients.splice(i, 1);
		var temps = info.time + " à " + info.hour + "h" + info.minute;
		db.query('UPDATE matcha.users SET derniereconnection= ? WHERE login= ?', [temps, info.login]);
    })
});

 
app.get('/', function (req, res, next){
	req.session.destroy();
	if (req.session === 'undefined')
		console.log(req.session);
    res.render('index.ejs');
})

app.post('/register.js', function (req, res, next){
	let User = require('./models/inscription.js');
	var user = {prenom: req.body.prenom, nom: req.body.nom, login: req.body.login, password: req.body.password, email: req.body.email};
	User.Inscription(user, function (type_fail) {
    	res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});
})

app.get('/pass.oublie', function (req, res,next) {
	res.render('password_oublie.ejs');
})

app.post('/recup_password.js', function (req, res, next){
	let User = require('./models/inscription.js');
	var email = {email: req.body.email};
	User.Change_password(email, function (type_fail) {
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});
})

app.get('/change_password', function (req, res, next){
	res.render('users/change_password.ejs');
})

app.post('/change_password.js', function (req, res, next){
	let User = require('./models/inscription.js');
	var info = {email: req.body.email, password: req.body.password, email_get: req.body.email_get, hash_get: req.body.hash_get};
	User.New_password(info, function (type_fail) {
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});

})

app.post('/index.js', function (req, res, next){
	let User = require('./models/inscription.js');
	var info = {login: req.body.login, password: req.body.password};
	User.New_connection(info, function (type_fail) {
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});
	var hash = crypto.createHash('whirlpool').update(req.body.password).digest('hex');
	req.session.user = req.body.login;
	req.session.password = hash;
})

app.get('/index', function (req, res, next){
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let User = require('./models/profile.js');
		var info = {login: req.session.user, password: req.session.password};
		User.Donnees(info, function (data) {
			res.render('index_conn.ejs', {user: data});
			req.session.notif = data.notif;
		})
  	}
})

app.get('/edit', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let User = require('./models/profile.js');
		var info = {login: req.session.user, password: req.session.password};
		User.Donnees(info, function (data) {
			res.render('profile/edit_profile.ejs', {user: data});
		})
	}
})

app.post('/edit', function (req, res, next){
	let User = require('./models/profile.js');
	var info = {age: req.body.age, sexe: req.body.sexe, nom: req.body.nom, prenom: req.body.prenom, email: req.body.email, orientation: req.body.orientation, bio: req.body.bio, intere: req.body.intere, login: req.session.user};
	User.Modification(info, function (type_fail) {
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});

})

app.post('/send_photo', function (req, res, next){
	let User = require('./models/profile.js');
	var info = {photo: req.body.photo, err: req.body.err, login: req.session.user, format: req.body.format};
	User.Ajout_photo_profil(info, function (type_fail) { 
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});


})

app.post('/send_photo_toute', function (req, res, next){
	let User = require('./models/profile.js');
	var info = {photo: req.body.photo, err: req.body.err, login: req.session.user, format: req.body.format};
	User.Ajout_photo(info, function (type_fail) { 
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});
})

app.post('/delete_photo', function (req, res, next){
	let User = require('./models/profile.js');
	var info = {photo: req.body.photo, login: req.session.user, nom: req.body.nom};
	User.Delete_photo(info, function (type_fail) { 
		res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
	});
})

app.post('/setlocation.js', function (req, res, next){
	if(!req.session.user)
		res.redirect('/');
	else
	{
		db.query('UPDATE matcha.users SET lat= ?, longi= ? WHERE login= ?', [req.body.lat, req.body.longi, req.session.user]);	
	}
})

app.post('/newlocation.js', function (req, res, next){
	if(!req.session.user)
		res.redirect('/');
	else
	{
		var a_ecrire = {type:"success", phrase:"Les changements ont bien était pris en compte :)", tim: 3000, err:"no"};
		res.json({phrase: 'Votre localisation à bien était changée :)', theme: 'success', time: 3000, erreur: 'yes'});
	}
})
app.get('/rencontre', function (req, res, next){
	if(!req.session.user)
		res.redirect('/');
	else
	{

		let Rencontre = require('./models/rencontre.js');
		var info = {login: req.session.user, password: req.session.password};
		var tags;
		var filtre;
		Rencontre.Filtre(info, function (dato) {
			filtre = dato;
		})
		Rencontre.Tags(info, function (data1) {
			tags = data1;
		})
		Rencontre.Choix(info, function (data) {
			Rencontre.Tri(data, function(data2) {
				data2.push(req.session.user);
				Rencontre.Tri2(data2, function(data3) {
					data2.push(req.session.user);
					Rencontre.Stocktri(data2, function(datafinal) {
						Rencontre.Trifinal(data2, function(trifinish) {
							res.render('./rencontre.ejs', {user: data2, tags: tags, filtre: filtre, myuser: req.session.user, notif: req.session.notif});
						})
					})
				})
			});
		})
	}
})

app.post('/rencontre', function (req, res, next){
	let Rencontre = require('./models/rencontre.js');
	if (req.body.id)
	{
		var info = {id: req.body.id, login: req.session.user};
		Rencontre.Modiftri(info, function (data) {
			res.json({reponse: "yes"});
		});
	}
	else
	{
		var info = {login: req.session.user, age_min: req.body.age_min, age_max: req.body.age_max, pop_min: req.body.pop_min, pop_max: req.body.pop_max, loc_min: req.body.loc_min, loc_max: req.body.loc_max, tag1: req.body.tag1, tag2: req.body.tag2, tag3: req.body.tag3};
		Rencontre.Modiffiltre(info, function (data) {
			res.json({reponse: "yes"});
		});
	}
})

app.get('/profile/:login', function (req, res, next){
	if(!req.session.user)
		res.redirect('/');
	else
	{
		var dusplay;
		let Users = require('./models/profiles.js');
		var info = {login: req.session.user, password: req.session.password, login_ext: req.params.login};
		Users.Profil_liker(info, function (data1) {
			dusplay = data1;
		})
		Users.Donnees(info, function (data) {
			res.render('./profiles.ejs', {user: data, dusplay: dusplay, myuser: req.session.user, notif: req.session.notif});
		})
	}
})

app.post('/like', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let Users = require('./models/profiles.js');
		var info = {login: req.session.user, login_ext: req.body.login_ext};
		if (req.body.type === "like")
		{
			Users.Testphoto (info, function (data) {
			if (data === "yes_photo")
			{
				Users.Like_message (info, function (data) {})
				Users.Like (info, function (data) {})
			}
			else
				res.json({data});
		})
		}
		else
			Users.Dislike (info, function (data) {})
	}
})

app.post('/testphoto', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let Users = require('./models/profiles.js');
		var info = {login: req.session.user, login_ext: req.body.login_ext};
		Users.Testphoto (info, function (data) {
			console.log(data);
		})
	}
})

app.post('/block', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let Users = require('./models/profiles.js');
		var info = {login: req.session.user, login_ext: req.body.login_ext};
		Users.Block (info, function (data) {})
	}
})

app.post('/fauxprofil', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let Users = require('./models/profiles.js');
		var info = {login: req.session.user, login_ext: req.body.login_ext};
		Users.Fauxprofil (info, function (type_fail) {
			res.json({phrase: type_fail.phrase, theme: type_fail.type, time: 3000, erreur: type_fail.err});
		})
	}
})

app.get('/chat', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let Chat = require('./models/chat.js');
		var info = {login: req.session.user};
		Chat.Donnees (info, function (data) {
			res.render('./chat_menu.ejs', {user: data, myuser: req.session.user, notif: req.session.notif});
		})
	}
})

app.get('/chat/:profil', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		let Chat = require('./models/chat.js');
		var info = {login: req.session.user, dest_user: req.params.profil};

		Chat.Donnees (info, function (data) {
			Chat.Message (info, function (messages) {
				res.render('./chat.ejs', {user: data, myuser: req.session.user, dest_user: req.params.profil, message: messages, notif: req.session.notif});
			})
		})
	}
})

app.get('/activite', function (req, res, next) {
	if(!req.session.user)
		res.redirect('/');
	else
	{
		var info = {login: req.session.user};
		req.session.notif = "no";
		let Chat = require('./models/chat.js');
		Chat.Notification (info, function (notif) {
			res.render('./activite.ejs', {myuser: req.session.user, notif: notif});
		})
	}
})

server.listen(8080);
