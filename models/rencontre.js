const async = require('async');
const connection = require('../config/database.js');
const validator = require('validator');

const Rencontre = {

	Choix: function(info, callback) {
		var res = new Object();
		var tab = {nom: '', prenom: '', age: '', sexe: '', orientation: '', bio: '', intere: '', popularite: '', sexe_homme: '', sexe_femme: '', ori_hommo: '', ori_hetero : '', ori_bi: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: ''};
		async.waterfall([
		function(cb){
			
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT nom, prenom, age, sexe, orientation, email, bio, interests, popularite, photo1, photo2, photo3, photo4, photo5 FROM matcha.users', cb);
			return tab;
		},
		function(pak, res, cb){
			var user;
			var i = 0;
			if (pak[0])
			{
			while (pak[i])
			{
			user = 'user' + i;
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
			tab.login = info.login;
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
			if (!pak[i].popularité)
				tab.popularite = 'inconnu';
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
			res[user] = tab;
			i++;
			}
			}
			return callback(res);
			cb(null);
		},
		function(cb){
			return callback(res);
		},
], function(err){
	console.log("termine");
	connection.end();
});
}

}

module.exports = Rencontre;