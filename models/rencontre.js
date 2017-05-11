const async = require('async');
const connection = require('../config/database.js');
const validator = require('validator');

const Rencontre = {

	Choix: function(info, callback) {
		var res = new Array;
		var longi;
		var lat;
		var tab = {distance: '', nom: '', prenom: '', age: '', sexe: '', orientation: '', bio: '', intere: '', popularite: '', sexe_homme: '', sexe_femme: '', ori_hommo: '', ori_hetero : '', ori_bi: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: ''};
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT lat, longi FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			lat = pak[0].lat;
			longi = pak[0].longi;
			var tab = connection.query('SELECT login, lat, longi, nom, prenom, age, sexe, orientation, email, bio, interests, popularite, photo1, photo2, photo3, photo4, photo5 FROM matcha.users', cb);
			return tab;
		},
		function(pak, res, cb){
			var i = 0;
			if (pak[0])
			{
			while (pak[i])
			{
			tab.email = pak[i].email;
			tab.nom = pak[i].nom;
			tab.prenom = pak[i].prenom;
			tab.age = pak[i].age;
			tab.sexe = pak[i].sexe;
			tab.orientation = pak[i].orientation;
			tab.bio = pak[i].bio;
			tab.intere = pak[i].interests;
			tab.popularite = pak[i].popularite;
			tab.photo1 = pak[i].photo1;
			tab.photo2 = pak[i].photo2;
			tab.photo3 = pak[i].photo3;
			tab.photo4 = pak[i].photo4;
			tab.photo5 = pak[i].photo5;
			tab.login = pak[i].login;
 
    lat_a = lat * Math.PI / 180;
    lon_a = longi * Math.PI / 180;
    lat_b = pak[i].lat * Math.PI / 180;
    lon_b = pak[i].longi * Math.PI / 180;
    var theta = lon_a - lon_b;
    var rtheta = Math.PI * theta/180;
     
    var dist = Math.sin(lat_a) * Math.sin(lat_b) + Math.cos(lat_a) * Math.cos(lat_b) * Math.cos(rtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;

    dist = dist = dist * 1.609344;
    dist = Math.round(dist);
			tab.distance = dist;
			if (!pak[i].age)
				tab.age = '18';
			if (!pak[i].sexe)
				tab.sexe = 'inconnu';
			if (!pak[i].orientation)
				tab.orientation = 'inconnu';
			if (!pak[i].bio)
				tab.bio = 'inconnu';
			if (!pak[i].interests)
				tab.intere = 'inconnu';
			if (pak[i].popularité === 0)
				tab.popularite = 0;
			if (pak[i].sexe === 'homme')
				tab.sexe_homme = 'checked';
			if (pak[i].sexe === 'femme')
				tab.sexe_femme = 'checked';
			if (pak[i].orientation === 'hetero')
				tab.ori_hetero = 'checked';
			if (pak[i].orientation === 'hommo')
				tab.ori_hommo = 'checked';
			if (pak[i].orientation === 'bi')
				tab.ori_bi = 'checked';
			res[i] = tab;
			tab = {login: '', distance: '', nom: '', prenom: '', age: '', sexe: '', orientation: '', bio: '', intere: '', popularite: '', sexe_homme: '', sexe_femme: '', ori_hommo: '', ori_hetero : '', ori_bi: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: ''};
			i++;
			}
			}
			res.unshift(i);
			return callback(res);
		},
], function(err){
	console.log("termine");
	connection.end();
});
},

	Tri: function(info, callback) {
		var i = 0;
		var j = 0;
		var res = new Array;
		while (i <= info[0])
		{
			if (info[i].distance != 4848)
			{
				res[j] = info[i];
				j++;
			}
			i++;
		}
		res.shift();
		return callback(res);
	},

	Tags: function(info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT hashtag FROM matcha.interests', cb);
		},
		function(pak, res, cb){
			var tab = new Array;
			tab[0] = "aucun";
			for (x in pak) {
    			tab.push(pak[x].hashtag);
			}
			return callback(tab);
		},
], function(err){
	console.log("termine");
	connection.end();
});
},
	Filtre: function(info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT filtre FROM matcha.users WHERE login= ?',[info.login] , cb);
		},
		function(pak, res, cb){
			var str = pak[0].filtre;
			var tab = str.split(' ');
			return callback(tab);
		},
	], function(err){
		console.log("termine");
		connection.end();
	});
	},
	
	Tri2: function(info, callback) {
		var login = info[info.length - 1];
		info.pop();
		var i = 0;
		while (i < info.length)
		{
			if (info[i].login === login)
				info.splice(i, 1)
			i++;
		}
		i = 0;
		var j = 0;
		var tmp;
		while (j < info.length - 1)
		{
			i = 0;
			while (i < info.length - 1)
			{
				if (info[i].distance > info[i + 1].distance)
				{
					tmp = info[i];
					info[i] = info[i + 1];
					info[i + 1] = tmp;
				}
				i++;
			}
			j++;
		}
		return callback(info);
	},

	Stocktri: function(info, callback) {
		login = info[info.length - 1];
		var tg = 0;
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT filtre FROM matcha.users WHERE login= ?', [login], cb);
		},
		function(pak, res, cb){
			var seriali = "reset 18 99 0 500 0 3000 aucun aucun aucun";
			if (pak[0])
			{
				if (pak[0].filtre === '')
					connection.query('UPDATE matcha.users SET filtre= ? WHERE login= ?', [seriali, login]);
			}
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

	Trifinal: function(info, callback) {
		login = info[info.length - 1];
		var tg = 0;
		info.pop();
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT filtre FROM matcha.users WHERE login= ?', [login], cb);
		},
		function(pak, res, cb){
			var str = pak[0].filtre;
			var tab = str.split(' ');
			var tri;
			var i = 0;
			var j = 0;
			if (tab[0] === "reset")
				tri = "reset";
			else if (tab[0] === "age")
				tri = "age";
			else if (tab[0] === "location")
				tri = "location";
			else if (tab[0] === "popularite")
				tri = "popularite";
			else if (tab[0] === "tags")
				tri = "tags";
			var age_min = tab[1];
			var age_max = tab[2];
			var pop_min = tab[3];
			var pop_max = tab[4];
			var loc_min = tab[5];
			var loc_max = tab[6];
			var tag1 = tab[7];
			var tag2 = tab[8];
			var tag3 = tab[9];
			var tmp;

			while (info[i])
			{
				if (info[i].age < age_min || info[i].age > age_max)
				{
					info.splice(i, 1);
					i--;
					
				}
				i++;
			}
			i = 0;
			while (info[i])
			{
				if (info[i].popularite < pop_min || info[i].popularite > pop_max)
				{
					info.splice(i, 1);
					i--;
					
				}
				i++;
			}
			i = 0;

			while (info[i])
			{
				if (info[i].distance < loc_min || info[i].distance > loc_max)
				{
					info.splice(i, 1);
					i--;
				}
				i++;
			}
			i = 0;
			if (tag1 != "aucun" || tag2 != "aucun" || tag3 != "aucun")
			{
			while (info[i])
			{
				if (info[i].intere.indexOf(tag1) === -1 && info[i].intere.indexOf(tag2) === -1 && info[i].intere.indexOf(tag3) === -1)
				{
					info.splice(i, 1);
					i--;
				}
				i++;
			}
		}
			
			i = 0;
			if (tri === "reset" || tri === "location")
			{
				while (j < info.length - 1)
				{
					i = 0;
					while (i < info.length - 1)
					{
						if (info[i].distance > info[i + 1].distance)
						{
							tmp = info[i];
						info[i] = info[i + 1];
						info[i + 1] = tmp;
						}
					i++;
					}
				j++;
				}
			}
			else if (tri === "age")
			{
				while (j < info.length - 1)
				{
					i = 0;
					while (i < info.length - 1)
					{
						if (info[i].age > info[i + 1].age)
						{
							tmp = info[i];
							info[i] = info[i + 1];
							info[i + 1] = tmp;
						}
					i++;
					}
				j++;
				}
			}
			else if (tri === "localisation")
			{
				while (j < info.length - 1)
				{
					i = 0;
					while (i < info.length - 1)
					{
						if (info[i].localisation > info[i + 1].localisation)
						{
							tmp = info[i];
							info[i] = info[i + 1];
							info[i + 1] = tmp;
						}
					i++;
					}
				j++;
				}
			}
			else if (tri === "popularite")
			{
				while (j < info.length - 1)
				{
					i = 0;
					while (i < info.length - 1)
					{
						if (info[i].popularite < info[i + 1].popularite)
						{
							tmp = info[i];
							info[i] = info[i + 1];
							info[i + 1] = tmp;
						}
					i++;
					}
				j++;
				}
			}
			else if (tri === "tags")
			{
				tg = 1;
			}
			else
				tg = 0;
			cb(null);
			},
			function(cb){
				var tab = connection.query('SELECT interests FROM matcha.users WHERE login= ?', [login], cb);
			},
			function(pak, res, cb){
				if (tg === 1)
				{
					str = pak[0].interests;
					if (str != null)
					{
					var tab = str.split(' ');
					var i = 0;
					var j = 0;
					var k = 0;
					function nb_occ (tableau, chaine) {
						var i = 0;
						var j = 0;
						var count = 0;
						while (tableau[i])
						{
							if (chaine.indexOf(tableau[i]) >= 0)
								count++;
							i++;
						}
						return (count);
					}
					while (j < info.length - 1)
					{
						i = 0;
						while (i < info.length - 1)
						{
							if (nb_occ(tab, info[i].intere) < nb_occ(tab, info[i + 1].intere))
							{
								tmp = info[i];
								info[i] = info[i + 1];
								info[i + 1] = tmp;
							}
						i++;
						}
					j++;
					}
				}
				}
				return callback(info);
			},
		], function(err){
			console.log("termine");
			connection.end();
		});
	},

	Modiftri: function(info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT filtre FROM matcha.users WHERE login= ?', [login], cb);
		},
		function(pak, res, cb){
			var str = pak[0].filtre;
			var tab = str.split(' ');
			tab[0] = info.id;
			var str2 = tab.toString();
			var res = str2.replace(/,/g, " ");
			connection.query('UPDATE matcha.users SET filtre= ? WHERE login= ?', [res, login], cb);
		},
		function(cb){
			return callback(info);
		},
		], function(err){
			console.log("termine");
			connection.end();
		});
	},

	Modiffiltre: function(info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT filtre FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			var str = pak[0].filtre;
			var tab = str.split(' ');
			var tri = tab[0];
			var str = tri + ' ' + info.age_min + ' ' + info.age_max + ' ' + info.pop_min + ' ' + info.pop_max + ' ' + info.loc_min + ' ' + info.loc_max + ' ' + info.tag1 + ' ' + info.tag2 + ' ' + info.tag3;
			connection.query('UPDATE matcha.users SET filtre= ? WHERE login= ?', [str, login], cb);
		},
		function(cb){
			return callback(info);
		},
		], function(err){
			console.log("termine");
			connection.end();
		});
	}

}

module.exports = Rencontre;