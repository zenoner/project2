var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');

var db = pgp('postgres://Seiji@localhost:5432/*********');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('HELLOOOOOOOO')
  res.render('home/index.html');


})


//-----SERVER
app.listen(3000, function(){
  console.log('it is running');
});
