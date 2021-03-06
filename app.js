var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var session = require('express-session')

//var db = pgp('postgres://Seiji@localhost:5432/auth2');
var psqldb = process.env.DATABASE_URL || 'postgres://Seiji@localhost:5432/auth2';
var db = pgp(psqldb);


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
  secret: 'book rulez',
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
  console.log(req.session.user)
  // Do you understand what this line if statment is doing?
  if(req.session.user){
    data.user = req.session.user;
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

//----- Test Route(SEARCH PAGE) -----(where to get API DATA)
app.get('/search/', function(req, res){
  res.render('search/index.html');
});

//------FAVORITE USER PAGE------
// app.get('/favorite/', function(req, res){
//   //res.send('Hello World!!')
//   res.render('favorite/index.html');
// });

//------LINKING WITH USER ID FOR THE FAVORITE PAGE-----TEST
// app.get('/favorite/:id', function(req,res){
//   var id = req.params.id;
//   db.one('SELECT * FROM FAVORITE users').then(function(data){
//     console.log(data)
//     res.render('/favorite/show.html',data);
//   });
// });

//------insert  THE DATA TO TABLE ----
app.post('/favorite/', function(req, res, next){
  //console.log(req.body)
  var favorites = req.body
  console.log(req.session.user)
  //console.log(favorites.title)
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-")
  console.log(favorites)
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-")
  // you need to edit this line to have all the new coulmns
  db.none(
    'INSERT INTO favorites ' +
    '(title, author, image, description, publisher, publisherdate, ' +
    'categories, page_num, isbm, buy_book, sample_book, fav_id) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
  [favorites.title,
   favorites.author,
   favorites.image,
   favorites.description,
   favorites.publisher,
   favorites.publisherdate,
   favorites.categories,
   favorites.pageCount,
   favorites.isbm,
   favorites.buy_book,
   favorites.sample_book,
   req.session.user.id]
  ).then(function(){
      res.success = 'favorite created one';
      next();
  }).catch(function(error){
    console.log(error)
    res.error = 'Error. The favorite could not be created'
  });

  if (res.error){
    var response = res.error;
  } else {
    var response = "yay"
    console.log(res.success)
  }
  res.send(response)
})

//-----LINKING WITH USER ID FOR THE FAVORITE PAGE------
app.get('/favorite/:id', function(req,res){
  // res.send("hello world")
  console.log(req.params.id);
  db.any('SELECT * FROM favorites WHERE fav_id=$1',[req.params.id]).then(function(data){
    console.log(data)
    var favorite_data ={
      'test': 'IT IS WORKING!!!!',
      'titles': data
    }
    console.log(favorite_data.titles)
    res.render('favorite/index.html',favorite_data)
  })
})

//-----DELETE ITEM IN FAVORITE DB------
app.delete('/favorite/:id', function(req,res){
  id = req.params.id
  db.none('DELETE FROM favorites WHERE id=$1',[id]).then(function(data){
    console.log("DELETE DONE!!!!")
    res.render('favorite/index.html')
  })
})


//-----SERVER-----
// app.set('port', (process.env.PORT || 3000));
// app.listen(3000, function(){
//   console.log('it is running');
// });

//heroku...
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
 console.log('Node app is running on port ', app.get('port'));
});


