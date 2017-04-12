const async = require('async');
const connection = require('../config/database.js');
const validator = require('validator');

const Rencontre = {

	Choix: function(info, callback) {
		var tab = {nom: '', prenom: '', age: '', sexe: '', orientation: '', bio: '', intere: '', popularite: '', sexe_homme: '', sexe_femme: '', ori_hommo: '', ori_hetero : '', ori_bi: '', photo1: '', photo2: '', photo3: '', photo4: '', photo5: ''};
		async.waterfall([
		function(cb){
			
			cb(null);
		},
		function(cb){
			var tab = connection.query('SELECT nom, prenom, age, sexe, orientation, email, bio, interests, popularite, photo1, photo2, photo3, photo4, photo5 FROM matcha.users WHERE login= ?', [info.login], cb);
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
			if (!pak[0].popularité)
				tab.popularite = 'inconnu';
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
}

}

module.exports = Rencontre;