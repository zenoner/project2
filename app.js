var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var session = require('express-session')

var db = pgp('postgres://Seiji@localhost:5432/auth2');

/* BCrypt stuff here */
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//--SESSION PART---
app.use(session({
  secret: 'quotation rulez',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//-----HOMEPAGE-----(enter the pager after log in)------
app.get('/', function(req, res){
  var logged_in,
      email;
    if(req.session.user){
      logged_in = true;
      email = req.session.user.email;
    }
  var data = {
    'logged_in': logged_in,
    'email': email
  }
  res.render('home/index.html',data);
});

//---LOGIN PAGE-----when user got correct then goes into page
app.post('/login', function(req, res){
  var data = req.body;
  var error = 'Authorization failed. Check your email/password';

  db.one(
    'SELECT * FROM users WHERE email = $1',
    [data.email]
    ).catch(function(){
      res.send(error);
    }).then(function(user){
       bcrypt.compare(
        data.password,
        user.password_digest,
        function(err, match){
        //if it is > logged in
        //if it is not matched > error
          if(match){
            req.session.user = user; //to match the session
            req.session.foobarbatbaz = "whateverman"
            res.redirect('/');
          } else {
            res.send(error)
          }
       });
    });

});

//=====LOGOUT BUTTON======(first add logout butoon in webpage)
app.get('/logout', function(req, res){
  req.session.user = null;
  res.redirect('/')
})

//-----ROUTER FOR SIGNUP------
app.get('/signup', function(req,res){
  res.render('signup/index');
});
//------TO POST THE DATA FROM SIGNUP TO BELOW(BCRYPT)------
app.post('/signup', function(req,res){
  var data = req.body;

//----WITH BCRYPT TOOL --------
  bcrypt.hash(data.password, 10, function(err, hashed_password){
    db.none("INSERT INTO users (email, password_digest) VALUES ($1, $2)",
    [data.email,hashed_password] //to storage the data
    ).catch(function(){
      res.send('Error. The user could not be created')
    }).then(function(){
      res.send('User created!')
    });
  });
});

//----- Test Route -----(where to get API DATA)
app.get('/search/', function(req, res){
  res.render('search/index.html');
});



//-----SERVER-----
app.listen(3000, function(){
  console.log('it is running');
});
