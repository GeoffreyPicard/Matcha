const async = require('async');
const crypto = require("crypto");
var promise = require('promise');
const validator = require('validator');
const connection = require('../config/database.js');
var session = require('express-session');

const User = {

	Inscription: function(user, callback)
	{
		let a_ecrire = {type:"success", phrase:"Super ! Vous êtes maintenant inscrit, connectez vous dès à présent :)", tim: 3000, err:"yes"};
		var err = 0;

		async.waterfall([
		function(cb){
			var tab = cb;

			if (user.login === '' || user.password === '' || user.prenom === '' || user.nom === '' || user.email === '')
				{
					a_ecrire = {type:"error", phrase:"Veuillez completer tout les champs", tim: 3000, err:"yes"};
					err = 1;
				}
				else if (user.password.length < 6 || user.password.length >= 254 || user.password.toLowerCase() === user.password)
				{
					a_ecrire = {type:"error", phrase:"Votre mot de passe doit contenir au moins une majuscule et posséder au moins 6 caractères", tim: 3000, err:"yes"};
					err = 1
				}
				else if (user.login.length < 4 || user.login.length >= 254)
				{
					a_ecrire = {type:"error", phrase:"Votre mot de login doit contenir au moins 4 caractères", tim: 3000, err:"yes"};
					err = 1;
				}
				else if (!validator.isEmail(user.email))
				{
					a_ecrire = {type:"error", phrase:"Adresse email incorrecte", tim: 3000, err:"yes"};
					err = 1;
				}
				cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT login, email FROM matcha.users WHERE login= ? OR email = ?', [user.login, user.email], cb);
 			return tab;
		},
		function(tab, res, cb){
			if (err === 0 && tab[0])
			{
			if (tab[0].login)
			{
				a_ecrire = {type:"error", phrase:"Désolé, ce login est déjà utilisé :(", tim: 3000, err:"yes"};
				err = 1;
			}
			if (tab[0].email === user.email)
			{
				a_ecrire = {type:"error", phrase:"Désolé, cette email est déjà utilisé :(", tim: 3000, err:"yes"};
				err = 1;
			}
			}
			cb(null);
		},
		function(cb){
			if (err === 0)
			{
				var hash = crypto.createHash('whirlpool').update(user.password).digest('hex');
				connection.query('INSERT INTO users (login, nom, prenom, email, password) VALUES (?, ?, ?, ?, ?)', [user.login, user.nom, user.prenom, user.email, hash]);
			}
			cb(null);
		},
		function(cb){
			return callback(a_ecrire);
		},
], function(err){
	console.log("termine");
	connection.end();
});
;},


	Change_password: function(email, callback)
	{
		var sendmail = require('sendmail')();
		var mail = 'test';
		var mail_hash = mail.replace('@', 'pedro');
 		var hashe = crypto.createHash('whirlpool').update(mail_hash).digest('hex');
		error_mail = 1;
		var err_hash = 0;
		let a_ecrire = {type:"error", phrase:"Adresse email incorrecte :(", tim: 3000, err:"yes"};
 
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT email FROM matcha.users WHERE email = ?', [email.email], cb);
			return tab;
		},
		function(pak, res, cb){
			if (pak[0])
			{
			if (pak[0].email)
			{
				mail = pak[0].email;
 				error_mail = 0;
 				cb(null);
 			}
 			}
 			else		
 				return callback(a_ecrire);
		},
		function(cb){
			if (error_mail === 0)
			{
				var pedro = hashe;
				var tab2 = connection.query('SELECT hashi FROM matcha.secure', cb);
				return tab2;
			}		
		},
		function(pak, res, cb){
			for (i in pak)
			{
				if (pak[i].hashi === hashe)
					err_hash = 1;
			}
			cb(null);
		},
		function(pak, res, cb){
			if (err_hash === 0)
			{
				var mail_hash = mail.replace('@', 'pedro');
 				hash = crypto.createHash('whirlpool').update(mail_hash).digest('hex');
				connection.query('INSERT INTO secure (hashi, email) VALUES (?, ?)', [hashe, mail]);
			}
			if (error_mail === 0)
			{
				var tosend = 'Cliquez sur le lien afin de réinitialiser votre mot de passe : http://localhost:8080/change_password?email=' + email.email + '&hash=' + hashe;
				sendmail({
    			from: 'geoffrey.picardpro@gmail.com',
    			to: email.email,
    			subject: 'Réinitialisation de mot de passe',
    			html: tosend,
  				}, function(err, reply) {
    			console.log(err && err.stack);
    			console.dir(reply);
				});
				a_ecrire = {type:"success", phrase:"Super ! Un mail vient de vous être envoyé afin de modifier votre mot de passe :)", tim: 3000, err:"yes"};
			}
			return callback(a_ecrire);
			cb(null);
		}
], function(err){
	console.log("termine");
	connection.end();
});

	},

	New_connection: function(info, callback)
	{
		var a_ecrire = {type:"success", phrase:"Les identifiants de connection sont incorrects :(", tim: 3000, err:"no"};
		var hash = 'test';
			async.waterfall([
		function(cb){
			hash = crypto.createHash('whirlpool').update(info.password).digest('hex');
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT login, password FROM matcha.users WHERE login= ? AND password= ?', [info.login, hash], cb);
			return tab;
		},
		function(pak, res, cb){
			if (!pak[0])
				a_ecrire = {type:"error", phrase:"Les identifiants de connection sont incorrects :(", tim: 3000, err:"yes"};
			cb(null);
		},
		function(cb){
			return callback(a_ecrire);
		},
		function(cb){
		}
], function(err){
	console.log("termine");
	connection.end();
});
		
		
	},

	New_password: function(info, callback)
	{
		a_ecrire = {type:"success", phrase:"Super ! Votre mot de passe a était changé :)", tim: 3000, err:"yes"};
		var err = 0;
		var hash = crypto.createHash('whirlpool').update(info.password).digest('hex');
		async.waterfall([
		function(cb){
			if (info.hash_get === '' || info.email_get === '')
			{
				a_ecrire = {type:"error", phrase:"Error, veuillez cliquer sur le lien du mail svp :(", tim: 3000, err:"yes"};
				err = 1;
				return callback(a_ecrire);
			}
			else if (info.email !== info.email_get)
			{
				a_ecrire = {type:"error", phrase:"Adresse email incorrecte :(", tim: 3000, err:"yes"};
				err = 1;
				return callback(a_ecrire);
			}
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT hashi, email FROM matcha.secure WHERE hashi= ? OR email = ?', [info.hash_get, info.email], cb);
			return tab;
			
		},
		function(pak, res, cb){
			if (pak[0] && err === 0)
				connection.query('UPDATE matcha.users SET password= ? WHERE email= ?', [hash, pak[0].email], cb);
			else
			{
				a_ecrire = {type:"error", phrase:"Pour changer de mot de passe, veuillez cliquer sur 'mot de passe oublié ?'", tim: 3000, err:"yes"};
				return callback(a_ecrire);
			}
		},
		function(pak, res, cb){
			connection.query('DELETE FROM matcha.secure WHERE hashi= ? OR email = ?', [info.hash_get, info.email], cb);
		},
		function(cb){
			return callback(a_ecrire);
		}
], function(err){
	console.log("termine");
	connection.end();
});
	}

 }

 module.exports = User;