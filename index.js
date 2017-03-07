var express = require('express');
var app = express();
app.use('/static', express.static('public'));
var session = require('cookie-session');
var bodyParser = require('body-parser');
var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));
var mysql      = require('mysql');
app.use(express.static('public'));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'matcha'
})

connection.connect()



var urlencodedParser = bodyParser.urlencoded({ extended: false });



app.get('/', function(req, res){
    res.render('index.ejs');
})

app.listen(8080);