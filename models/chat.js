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
				var tab = pak[0].messagerie.split(",");
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
	}
};

module.exports = Chat;