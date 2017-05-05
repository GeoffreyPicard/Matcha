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

/*
console.log('Database matcha created')

connection.query('CREATE TABLE IF NOT EXISTS users (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, login VARCHAR(100) NOT NULL, prenom VARCHAR(100) NOT NULL, nom VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, sexe VARCHAR(25), orientation VARCHAR(25) DEFAULT \'Hetero\', bio TEXT, interests VARCHAR(255), age INT)')
console.log('Table users created')

connection.query('INSERT INTO users (name, login, email) VALUES (?, ?, ?)', ['Larry', '41', 'California, USA'], function(err, result) { } )
//connection.query('INSERT INTO users SET login="pedro", nom="michel", prenom="henri", email')
console.log('pedro created')
*/


