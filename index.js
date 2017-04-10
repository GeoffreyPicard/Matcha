var express = require('express');
var app = express();
app.use('/static', express.static('public'));
app.use('/lib', express.static('lib'));
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const crypto = require("crypto");
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




var urlencodedParser = bodyParser.urlencoded({ extended: false });
 



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

app.listen(8080);