const async = require('async');
const connection = require('../config/database.js');
const validator = require('validator');
const fs = require('fs');

const Profile = {

	Donnees: function(info, callback) {
		var tab = {nofitf: '', nom: '', prenom: '', age: '', sexe: '', orientation: '', bio: '', intere: '', popularite: '', sexe_homme: '', sexe_femme: '', ori_hommo: '', ori_hetero : '', ori_bi: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', lat: '', longi: ''};
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT notif, nom, prenom, age, sexe, orientation, email, bio, interests, popularite, photo1, photo2, photo3, photo4, photo5, lat, longi FROM matcha.users WHERE login= ?', [info.login], cb);
			return tab;
		},
		function(pak, res, cb){
			tab.email = pak[0].email;
			tab.nom = pak[0].nom;
			tab.prenom = pak[0].prenom;
			tab.age = pak[0].age;
			tab.sexe = pak[0].sexe;
			tab.orientation = pak[0].orientation;
			tab.bio = pak[0].bio;
			tab.intere = pak[0].interests;
			tab.popularite = pak[0].popularite;
			tab.photo1 = pak[0].photo1;
			tab.photo2 = pak[0].photo2;
			tab.photo3 = pak[0].photo3;
			tab.photo4 = pak[0].photo4;
			tab.photo5 = pak[0].photo5;
			tab.login = info.login;
			tab.lat = pak[0].lat;
			tab.notif = pak[0].notif;
			tab.longi = pak[0].longi;
			if (!pak[0].age)
				tab.age = '18';
			if (!pak[0].sexe)
				tab.sexe = 'inconnu';
			if (!pak[0].orientation)
				tab.orientation = 'inconnu';
			if (!pak[0].bio)
				tab.bio = 'inconnu';
			if (!pak[0].interests)
				tab.intere = 'inconnu';
			if (pak[0].popularité === 0)
				tab.popularite = '0';
			if (pak[0].sexe === 'homme')
				tab.sexe_homme = 'checked';
			if (pak[0].sexe === 'femme')
				tab.sexe_femme = 'checked';
			if (pak[0].orientation === 'hetero')
				tab.ori_hetero = 'checked';
			if (pak[0].orientation === 'hommo')
				tab.ori_hommo = 'checked';
			if (pak[0].orientation === 'bi')
				tab.ori_bi = 'checked';
			cb(null);
		},
		function(cb){
			return callback(tab);
		},
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Modification: function(info, callback) {
		var tags = [];
		var res;
		var a_ecrire = {type:"success", phrase:"Les changements ont bien était pris en compte :)", tim: 3000, err:"no"};
		async.waterfall([

		function(cb){
			if (info.login === '' || info.prenom === '' || info.nom === '' || info.email === '')
				{
					a_ecrire = {type:"error", phrase:"Veuillez completer tout les champs", tim: 3000, err:"yes"};
					return callback(a_ecrire);
				}
				else if (!validator.isEmail(info.email))
				{
					a_ecrire = {type:"error", phrase:"Adresse email incorrecte", tim: 3000, err:"yes"};
					return callback(a_ecrire);
				}
				else if (info.age < 18 || info.age > 99)
				{
					a_ecrire = {type:"error", phrase:"L'âge doit être compris entre 18 et 99 ans", tim: 3000, err:"yes"};
					return callback(a_ecrire);
				}
				cb(null);
		},
		function(cb){
			res = info.intere.split(" ");
			var j = 0;
			var i = 0;
			while (res[j])
			{
				i = j + 1;
				while (res[i - 1])
				{
					if (res[i] === res[j])
					{
						a_ecrire = {type:"error", phrase:"Vous avez mis deux fois le même interêt !", tim: 3000, err:"yes"};
						return callback(a_ecrire);
					}
					i++;
				}
				if (res[j].strlen > 240)
				{
					a_ecrire = {type:"error", phrase:"L'interêt est trop long !", tim: 3000, err:"yes"};
					return callback(a_ecrire);	
				}
				if (res[j][0] != '#')
				{
					a_ecrire = {type:"error", phrase:"Les interêts doivent commencer par '#'", tim: 3000, err:"yes"};
					return callback(a_ecrire);
				}
				j++;
			}
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT hashtag FROM matcha.interests', cb);
			return tab;
		},
		function(pak, res, cb){
			var i = 0;
			var j = 0;
			var a = 0;
			var oki = 0;
			res = info.intere.split(" ");
			if (pak[0])
			{
			while (res[i])
			{
				j = 0;
				oki = 0;
				while (pak[j])
				{
					if (pak[j].hashtag.indexOf(res[i]) >= 0)
						oki = 1;
					j++;
				}
				if (oki === 0)
				{
					tags[a] = res[i];
					a++;
				}
				i++;
			}
			}
			else
			{
				while (res[i])
				{
					tags[i] = res[i];
					i++;
				}
			}
			cb(null);
		},
		function(cb)
		{
			var i = 0;
			while (tags[i])
			{
				connection.query('INSERT INTO interests (hashtag) VALUES (?)', [tags[i]]);
				i++;
			}
			cb(null);
		},
		function(cb){
			connection.query('UPDATE matcha.users SET nom= ?, prenom= ?, email= ?, orientation= ?, bio= ?, interests= ?, sexe= ? WHERE login= ?', [info.nom, info.prenom, info.email, info.orientation, info.bio, info.intere, info.sexe, info.login], cb);
		},
		function(cb){
			return callback(a_ecrire);
		}
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Ajout_photo_profil: function(info, callback) {
		var a_ecrire = {type:"success", phrase:"Votre photo de profil a était mise à jour", tim: 3000, err:"no"};
		if (info.format === 'png')
			var image = '/image/user/' + info.login + 1 + '.png';
		if (info.format === 'jpg' || info.format === 'jpeg')
			var image = '/image/user/' + info.login + 1 + '.jpeg';
		var img = 'test';
		var chemin = 'test';
		async.waterfall([
		function(cb){
			if (info.err == 1)
			{
				a_ecrire = {type:"error", phrase:"Votre photo doit être au format jpg ou png :(", tim: 3000, err:"no"};
				return callback(a_ecrire);
			}
			else
				cb(null);
		},
		function(cb){
			if (info.format === 'png')
			{
				chemin = 'public/image/user/' + info.login + '1' + '.png';
				img = info.photo.replace('data:image/png;base64,', '');
			}
			if (info.format === 'jpg')
			{
				chemin = 'public/image/user/' + info.login + '1' + '.jpeg';
				img = info.photo.replace('data:image/jpeg;base64,', '');
			}
			
			cb(null);
		},
		function(cb){
			console.log(chemin);
			fs.writeFile(chemin, img, 'base64', function(err) {
    		if(err) {
        		return console.log(err);
   			}
    		console.log("The file was saved!");
			});
			cb(null);
		},
		function(cb){
			connection.query('UPDATE matcha.users SET photo1= ? WHERE login= ?', [image, info.login], cb);
		},
		function(cb){
			return callback(a_ecrire);
		}
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Ajout_photo: function (info, callback) {
		var a_ecrire = {type:"success", phrase:"Votre photo a était ajoutée", tim: 3000, err:"no"};
		var nb_photo = 2;
		var img = 'test';
		var image = 'test';

		async.waterfall([
		function(cb){
			if (info.err == 1)
			{
				a_ecrire = {type:"error", phrase:"Votre photo doit être au format jpg ou png :(", tim: 3000, err:"no"};
				return callback(a_ecrire);
			}
			else
				cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT photo2, photo3, photo4, photo5 FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0].photo5 !== '/image/img_vide.jpg')
			{
				a_ecrire = {type:"error", phrase:"Vous ne pouvez avoir que 5 photos :(", tim: 3000, err:"no"};
				return callback(a_ecrire);
			}
			else if (pak[0].photo2 === '/image/img_vide.jpg')
				nb_photo = 2;
			else if (pak[0].photo3 === '/image/img_vide.jpg')
				nb_photo = 3
			else if (pak[0].photo4 === '/image/img_vide.jpg')
				nb_photo = 4;
			else if (pak[0].photo5 === '/image/img_vide.jpg')
				nb_photo = 5;
			cb(null);
		},
		function(cb){
			if (info.format === 'png')
				image = '/image/user/' + info.login + nb_photo + '.png';
			if (info.format === 'jpg' || info.format === 'jpeg')
				image = '/image/user/' + info.login + nb_photo + '.jpeg';
			cb(null);
		},
		function(cb){
			if (info.format === 'png')
			{
				chemin = 'public/image/user/' + info.login + nb_photo + '.png';
				img = info.photo.replace('data:image/png;base64,', '');
			}
			if (info.format === 'jpg')
			{
				chemin = 'public/image/user/' + info.login + nb_photo + '.jpeg';
				img = info.photo.replace('data:image/jpeg;base64,', '');
			}
			cb(null);
		},
		function(cb){
			console.log(chemin);
			fs.writeFile(chemin, img, 'base64', function(err) {
    		if(err) {
        		return console.log(err);
   			}
    		console.log("The file was saved!");
			});
			cb(null);
		},
		function(cb){
			if (nb_photo === 2)
				connection.query('UPDATE matcha.users SET photo2= ? WHERE login= ?', [image, info.login], cb);
			else if (nb_photo === 3)
				connection.query('UPDATE matcha.users SET photo3= ? WHERE login= ?', [image, info.login], cb);
			else if (nb_photo === 4)
				connection.query('UPDATE matcha.users SET photo4= ? WHERE login= ?', [image, info.login], cb);	
			else if (nb_photo === 5)
				connection.query('UPDATE matcha.users SET photo5= ? WHERE login= ?', [image, info.login], cb);
		},
		function(cb){
			return callback(a_ecrire);
		}
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Delete_photo: function (info, callback) {
		var a_ecrire = {type:"success", phrase:"Votre photo a était ajoutée", tim: 3000, err:"no"};
		var chemin = 'test';
		async.waterfall([
		function(cb){
			if (info.nom === '/image/img_vide.jpg')
			{
				var a_ecrire = {type:"error", phrase:"Il n'y a pas de photo à supprimer", tim: 3000, err:"no"};
				return callback(a_ecrire);
			}
			else
				cb(null);
		},
		function(cb){
			if (info.photo === 'photo2')
				var chemin = connection.query('SELECT photo2 FROM matcha.users WHERE login= ?', [info.login], cb);
			else if (info.photo === 'photo3')
				var chemin = connection.query('SELECT photo3 FROM matcha.users WHERE login= ?', [info.login], cb);
			else if (info.photo === 'photo4')
				var chemin = connection.query('SELECT photo4 FROM matcha.users WHERE login= ?', [info.login], cb);
			else if (info.photo === 'photo5')
				var chemin = connection.query('SELECT photo5 FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (info.photo === 'photo2')
				chemin = 'public' + pak[0].photo2;
			else if (info.photo === 'photo3')
				chemin = 'public' + pak[0].photo3;
			else if (info.photo === 'photo4')
				chemin = 'public' + pak[0].photo4;
			else if (info.photo === 'photo5')
				chemin = 'public' + pak[0].photo5;
			cb(null);
		},
		function(cb){
			fs.unlink(chemin, function(err) {
   			if (err) {
      			return console.error(err);
  			}
   			console.log("File deleted successfully!");
			});
			cb(null);
		},
		function(cb){
			if (info.photo === 'photo2')
				connection.query('UPDATE matcha.users SET photo2= ? WHERE login= ?', ['/image/img_vide.jpg', info.login], cb);
			else if (info.photo === 'photo3')
				connection.query('UPDATE matcha.users SET photo3= ? WHERE login= ?', ['/image/img_vide.jpg', info.login], cb);
			else if (info.photo === 'photo4')
				connection.query('UPDATE matcha.users SET photo4= ? WHERE login= ?', ['/image/img_vide.jpg', info.login], cb);	
			else if (info.photo === 'photo5')
				connection.query('UPDATE matcha.users SET photo5= ? WHERE login= ?', ['/image/img_vide.jpg', info.login], cb);
		},
		function(pak, res, cb){
			return callback(a_ecrire);
			cb(null);
		}
], function(err){
	console.log("termine");
	connection.end();
});
	}
}

 module.exports = Profile;