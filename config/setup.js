const mysql = require('mysql'),
	  async = require('async');
	  

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root'
});

async.waterfall([
	function(cb){
		connection.connect(cb);
	},
	function(pak, cb){
		connection.query('CREATE DATABASE IF NOT EXISTS matcha', cb);
	},
	function(pak, res, cb){
		connection.query('USE matcha', cb);
	},
	function(pak, res, cb){
		connection.query(
			`CREATE TABLE IF NOT EXISTS users (
				id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
				login VARCHAR(100) DEFAULT '',
				prenom VARCHAR(100) DEFAULT '',
				nom VARCHAR(100) DEFAULT '',
				email VARCHAR(255) DEFAULT '',
				password VARCHAR(255) DEFAULT '',
				sexe VARCHAR(255) DEFAULT '',
				orientation VARCHAR(25) DEFAULT '',
				bio TEXT,
				interests TEXT,
				popularite INT(9) DEFAULT 0,
				age INT DEFAULT NULL,
				lat VARCHAR(255) DEFAULT '',
				longi VARCHAR(255) DEFAULT '',
				filtre VARCHAR(255) DEFAULT '',
				likes TEXT,
				photo1 VARCHAR(255) DEFAULT '/image/photo_profil_vide.png',
				photo2 VARCHAR(255) DEFAULT '/image/img_vide.jpg',
				photo3 VARCHAR(255) DEFAULT '/image/img_vide.jpg',
				photo4 VARCHAR(255) DEFAULT '/image/img_vide.jpg',
				photo5 VARCHAR(255) DEFAULT '/image/img_vide.jpg')`,
			cb);
	},
	function(pak, res, cb){
		connection.query(
			`CREATE TABLE IF NOT EXISTS secure (
				email VARCHAR(255) DEFAULT '',
				hashi TEXT)`,
			cb);
	},
	function(pak, res, cb){
		connection.query(
			`CREATE TABLE IF NOT EXISTS interests (
				hashtag VARCHAR(255) DEFAULT '')`,
			cb);
	},
	function(res, pak, cb){
		console.log("all created");
		connection.end();
	}
], function(err){
	console.log({
		err: err,
		args: Array.prototype.slice.call(arguments, 1)
	});
	connection.end();
});



