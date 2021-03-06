const async = require('async');
const connection = require('../config/database.js');
const validator = require('validator');
const fs = require('fs');

const Profiles = {

	Donnees: function(info, callback) {
		var tab = {nom: '', prenom: '', age: '', sexe: '', orientation: '', bio: '', intere: '', popularite: '', sexe_homme: '', sexe_femme: '', ori_hommo: '', ori_hetero : '', ori_bi: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: '', lat: '', longi: ''};
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT nom, prenom, age, sexe, orientation, bio, interests, popularite, photo1, photo2, photo3, photo4, photo5, lat, longi FROM matcha.users WHERE login= ?', [info.login_ext], cb);
			return tab;
		},
		function(pak, res, cb){
			if (pak[0])
			{
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
			tab.login = info.login_ext;
			tab.lat = pak[0].lat;
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
			}
			else
				return callback("error");
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

	Profil_liker: function (info, callback) {
		var res;
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT likes FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0])
			{
				if (pak[0].likes)
					var pos = pak[0].likes.indexOf(info.login_ext);
				if (pos !== -1)
				{
					res.like = "display:none";
					res.dislike = "";
				}
				else
				{
					res.like = "";
					res.dislike = "display:none";
				}
				if (!pak[0].likes)
				{
					res.like = "";
					res.dislike = "display:none";
				}
			}
			return callback(res);
		},
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Like: function (info, callback) {
		var str;
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT likes FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0])
				str = pak[0].likes;
			cb(null);
		},
		function(cb){
			if (str !== null)
			{
				tab = str.split(",");
				tab.push(info.login_ext);
				var res = tab.toString();
				if (res[0] === ',')
					res = res.slice(1, res.length);
				connection.query('UPDATE matcha.users SET likes= ? WHERE login= ?', [res, info.login]);
			}
			if (str === null)
				connection.query('UPDATE matcha.users SET likes= ? WHERE login= ?', [info.login_ext, info.login]);
			cb(null);
		},
		function(cb){
			return callback(info);
		},
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Dislike: function (info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT likes FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0])
				str = pak[0].likes;
			cb(null);
		},
		function(cb){
			if (str !== null)
			{
				tab = str.split(",");
				var i = 0;
				while (tab[i])
				{
					if (tab[i] === info.login_ext)
						tab.splice(i, 1);
					i++;
				}
				var res = tab.toString();
				if (res === null)
					connection.query('UPDATE matcha.users SET likes= NULL WHERE login= ?', [info.login]);
				else
					connection.query('UPDATE matcha.users SET likes= ? WHERE login= ?', [res, info.login]);
			}
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT messagerie FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0])
			{
				if (pak[0].messagerie)
				{
					var str = pak[0].messagerie;
					tab = str.split(",");
					var i = 0;
					while (tab[i])
					{
						if (tab[i] === info.login_ext)
							tab.splice(i, 1);
						i++;
					}
					var res = tab.toString();
				if (res === null)
					connection.query('UPDATE matcha.users SET messagerie= NULL WHERE login= ?', [info.login]);
				else
					connection.query('UPDATE matcha.users SET messagerie= ? WHERE login= ?', [res, info.login]);
				}
			}
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT messagerie FROM matcha.users WHERE login= ?', [info.login_ext], cb);
		},
		function(pak, res, cb){
			if (pak[0])
			{
				if (pak[0].messagerie)
				{
					var str = pak[0].messagerie;
					tab = str.split(",");
					var i = 0;
					while (tab[i])
					{
						if (tab[i] === info.login)
							tab.splice(i, 1);
						i++;
					}
					var res = tab.toString();
				if (res === null)
					connection.query('UPDATE matcha.users SET messagerie= NULL WHERE login= ?', [info.login_ext]);
				else
					connection.query('UPDATE matcha.users SET messagerie= ? WHERE login= ?', [res, info.login_ext]);
				}
			}
			return callback(info);
		},
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Block: function (info, callback) {
		var str;
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT block FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0])
				str = pak[0].block;
			cb(null);
		},
		function(cb){
			if (str !== null)
			{
				tab = str.split(",");
				tab.push(info.login_ext);
				var res = tab.toString();
				if (res[0] === ',')
					res = res.slice(1, res.length);
				connection.query('UPDATE matcha.users SET block= ? WHERE login= ?', [res, info.login]);
			}
			if (str === null)
				connection.query('UPDATE matcha.users SET block= ? WHERE login= ?', [info.login_ext, info.login]);
			cb(null);
		},
		function(cb){
			return callback(info);
		},
], function(err){
	console.log("termine");
	connection.end();
});
	},

	Fauxprofil: function (info, callback) {
		let a_ecrire = {type:"success", phrase:"Vous venez de reporter se profil comme étant un faux, nous allons l'analyser dans les plus brefs délais :)", tim: 3000, err:"yes"};
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT profil FROM matcha.fauxprofil WHERE login= ? && profil=?', [info.login, info.login_ext], cb);
		},
		function(pak, res, cb){
			if (pak[0])
				a_ecrire = {type:"error", phrase:"Vous avez déjà reporté se profil", tim: 3000, err:"yes"};
			else
			{
				console.log("jamais fait");
				connection.query('INSERT INTO fauxprofil (login, profil) VALUES (?, ?)', [info.login, info.login_ext]);
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
	},

	Testphoto: function (info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT photo1 FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (pak[0].photo1 === "/image/photo_profil_vide.png")
				return callback("no_photo");
			else
				return callback("yes_photo");
		},
	], function(err){
	console.log("termine");
	connection.end();
	});
	},

	Like_message: function (info, callback) {
		async.waterfall([
		function(cb){
			connection.query('SELECT likes FROM matcha.users WHERE login= ?', [info.login_ext], cb);
		},
		function(pak, res, cb){
			if (pak[0])
			{
				if (pak[0].likes)
				{
					if (pak[0].likes.indexOf(info.login) >= 0)
						connection.query('SELECT messagerie FROM matcha.users WHERE login= ?', [info.login], cb);
				}				
			}
			return callback();
		},
		function(pak, res, cb){
			str = pak[0].messagerie;
			if (str !== null)
			{
				tab = str.split(",");
				tab.push(info.login_ext);
				var res = tab.toString();
				if (res[0] === ',')
					res = res.slice(1, res.length);
				connection.query('UPDATE matcha.users SET messagerie= ? WHERE login= ?', [res, info.login]);
			}
			if (str === null)
				connection.query('UPDATE matcha.users SET messagerie= ? WHERE login= ?', [info.login_ext, info.login]);
			cb(null);
		},
		function(cb){
			connection.query('SELECT messagerie FROM matcha.users WHERE login= ?', [info.login_ext], cb);
		},
		function(pak, res, cb){
			str = pak[0].messagerie;
			if (str !== null)
			{
				tab = str.split(",");
				tab.push(info.login);
				var res = tab.toString();
				if (res[0] === ',')
					res = res.slice(1, res.length);
				connection.query('UPDATE matcha.users SET messagerie= ? WHERE login= ?', [res, info.login_ext]);
			}
			if (str === null)
				connection.query('UPDATE matcha.users SET messagerie= ? WHERE login= ?', [info.login, info.login_ext]);
			return callback();
		},
], function(err){
	console.log("termine");
	connection.end();
});
	}
}

module.exports = Profiles;