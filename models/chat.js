const async = require('async');
const connection = require('../config/database.js');
const validator = require('validator');
const fs = require('fs');

const Chat = {

	Donnees: function(info, callback) {
		async.waterfall([
		function(cb){
			var tab = connection.query('SELECT messagerie FROM matcha.users WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			if (!pak[0])
				return callback();
			else
			{
				if (pak[0].messagerie)
					var tab = pak[0].messagerie.split(",");
				else
					var tab = "";
				info = tab;
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

	Message: function(info, callback) {
		var tab;
		async.waterfall([
		function(cb){
			connection.query('SELECT msg, envoi, recoi FROM matcha.message WHERE (envoi= ? || envoi=?) && (recoi= ? || recoi= ?)', [info.login, info.dest_user, info.login, info.dest_user], cb);
		},
		function(pak, res, cb){
			return callback(pak);
		},
		], function(err){
			console.log("termine");
			connection.end();
		});
	},

	Notification: function(info, callback) {
		async.waterfall([
		function(cb){
			connection.query('SELECT login, notif FROM matcha.notification WHERE login= ?', [info.login], cb);
		},
		function(pak, res, cb){
			pak.reverse();
			return callback(pak);
		},
		], function(err){
			console.log("termine");
			connection.end();
		});
	},

	Verif_like: function(info, callback) {
		async.waterfall([
		function(cb){
			connection.query('SELECT likes FROM matcha.users WHERE login= ?', [info.login_ext], cb);
		},
		function(pak, res, cb){
			if (pak[0])
			{
				if (pak[0].likes != null)
				{
				if (pak[0].likes.indexOf(info.login) >= 0)
					return callback("yes");
				}
			}
			return callback("no");
		},
		], function(err){
			console.log("termine");
			connection.end();
		});
	},

	Verif_profil: function(info, callback) {
		async.waterfall([
		function(cb){
			connection.query('SELECT login FROM matcha.users WHERE login= ?', [info.dest_user], cb);
		},
		function(pak, res, cb){
			if (pak[0])
				return callback("yes");
			return callback("no");
		},
		], function(err){
			console.log("termine");
			connection.end();
		});
	}
};

module.exports = Chat;