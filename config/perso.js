const mysql = require('mysql'),
	  async = require('async');
const crypto = require("crypto");


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
		connection.query('USE matcha', cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Manutkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Manu", "Macron", "Emmanuel", "manutkt@gmail.com", hash, "Homme", "Hetero", "Moi c'est manu, et je suis d'accord avec vous Monsieur", "#argent #banque #rothschild #enmarche", "100", "48.856614", "2.3522219000000177", "39", "/image/macron1.jpg", "/image/macron2.jpg", "/image/macron3.jpg", "/image/macron4.jpg", "/image/macron5.jpg"], cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Francoistkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Hollande", "Francois", "Hollande", "francoistkt@gmail.com", hash, "Homme", "Hetero", "Moi c'est Francois, et je suis vous le jure j'ai étais prédident", "#president #pluspresident #poleemploi #allezmacron", "1", "45.26565", "1.7716970000000174", "62", "/image/hollande1.jpg", "/image/hollande2.jpg", "/image/hollande3.jpg", "/image/hollande4.jpg", "/image/hollande5.jpg"], cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Fillontkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Fillon", "Francois", "Fillon", "fillontkt@gmail.com", hash, "Homme", "Hetero", "Moi c'est Francois, et je me suis fais chopper", "#mince #rendpaslargent", "33", "48.856614", "2.3522219000000177", "63", "/image/fillon1.jpg", "/image/fillon2.jpg", "/image/fillon3.jpg", "/image/fillon4.jpg", "/image/fillon5.jpg"], cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Marinetkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Lepen", "Marine", "Lepen", "marinetkt@gmail.com", hash, "Femme", "Hetero", "Moi c'est Marine, et j'ai perdu", "#papa #pascontente #patriote", "40", "48.856614", "2.3522219000000177", "48", "/image/marine1.jpg", "/image/marine2.jpg", "/image/marine3.jpg", "/image/marine4.jpg", "/image/marine5.jpg"], cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Jeanluctkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Melanchon", "Jean-luc", "Melanchon", "melanchontkt@gmail.com", hash, "Homme", "Hetero", "Moi c'est Jean-luc, et je suis pas content !", "#lepeuple #rendezlargent", "35", "48.856614", "2.3522219000000177", "65", "/image/melanchon1.jpg", "/image/melanchon2.jpg", "/image/melanchon3.jpg", "/image/melanchon4.png", "/image/melanchon5.jpg"], cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Angelatkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Merkel", "Angela", "Merkel", "angelatkt@gmail.com", hash, "Femme", "Hetero", "Mon petit Francois il s'en va, bonjour mon petit Emmanuel", "#europe #anllemagne", "68", "52.52000659999999", "13.404953999999975", "62", "/image/merkel1.jpg", "/image/merkel2.jpg", "/image/merkel3.jpg", "/image/merkel4.jpg", "/image/merkel5.jpg"], cb);
	},
	function(pak, res, cb){
		var hash = crypto.createHash('whirlpool').update("Sarkozitkt").digest('hex');
		connection.query('INSERT INTO users (login, nom, prenom, email, password, sexe, orientation, bio, interests, popularite, lat, longi, age, photo1, photo2, photo3, photo4, photo5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ["Sarkozi", "Nicolas", "Sarkozi", "sarkotkt@gmail.com", hash, "Homme", "Hetero", "Un jour je renviendrais", "#comeback #maybe #oneday #neverbackdown", "5", "48.856614", "2.3522219000000177", "62", "/image/sarko1.jpg", "/image/sarko2.jpg", "/image/sarko3.jpg", "/image/sarko4.jpg", "/image/sarko5.jpg"], cb);
	},
	function(pak, res, cb){
			var i = 0;
			var tags;
			tags = ["#argent", "#banque", "#rothschild", "#enmarche", "#president", "#pluspresident", "#poleemploi", "#allezmacron", "#mince", "#rendpaslargent", "#papa", "#pascontente", "#patriote", "#lepeuple", "#rendezlargent", "#europe", "#allemagne", "#comeback", "#maybe", "#oneday", "#neverbackdown"];
			while (tags[i])
			{
				connection.query('INSERT INTO interests (hashtag) VALUES (?)', [tags[i]]);
				i++;
			}
			cb(null);
	},
	
	function(cb){
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

