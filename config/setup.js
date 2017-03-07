var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root'
});

connection.connect();

connection.query('CREATE DATABASE IF NOT EXISTS matcha')
console.log('Database matcha created')
connection.query('USE matcha')

connection.end()
