var express = require('express');
var app = express();
var session = require('cookie-session');
var bodyParser = require('body-parser');
var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root'
});

connection.connect();


connection.query('CREATE DATABASE IF NOT EXISTS matcha')
console.log('Database matcha created')

app.get('/', function(req, res){
    res.render('index.ejs');
})

app.listen(8080);