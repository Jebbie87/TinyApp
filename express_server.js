'use strict';
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

const generateRandomString = function (){
  const alphaNumeric = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let password = '';
  let randomNum;
  for (let i = 0; i < 6; i++){
    randomNum = Math.floor((Math.random() * alphaNumeric.length) + 1);
    password += alphaNumeric.charAt(randomNum);
  };
  return password;
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  'asdfasfd': 'http://reddit.com'
};

const users = {'asdf': {'id': 'asdf',
                        'email': 'test@test.com',
                        'password': 'asdf',
                        'urls': {'b2xVn2': 'http://www.lighthouselabs.ca',
                                 '9sm5xK': 'http://www.google.com'}
                        },
                'test': {'id': 'hello',
                         'email': 'test@test',
                         'password': 'hello',
                         'urls': {'nsdnf': 'http://reddit.com',
                                  'nsdnfs': 'http://yahoo.com'}
                        }
              };

app.get('/', (req, res) => {
  let user = req['cookies']['user_id'];
  if (!user) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  };
});

app.get('/urls', (req, res) => {
  let user = req['cookies']['user_id'];
  let templateVars = { email: users[user]['email'] };
  if (!user) {
    res.status(400);
    res.render('error-login');
  } else {
    res.status(200);
    res.render('urls_index', templateVars);
  };
});

app.get('/urls/new', (req, res) => {
  let user = 'asdf' // req.cookies['user_id'];
  if(!user) {
    res.status(401);
    res.render('error-login');
  } else {
    res.status(200);
    res.render('urls_new');
  };
});

app.get('/urls/:id', (req, res) => {
  let user = 'asdf'
  if(!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.response(404).send('Sorry this page does not exist');
  } else if (!user) {
    res.response(401);
  }
})

app.get('/u/:id', (req, res) => {
  let longURL = urlDatabase[req['params']['id']];
  if (!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.status(404);
    res.render('404-error');
  } else {
    res.redirect(longURL);
  }
});

app.post('/urls', (req, res) => {
  let user = 'asdf' // req.cookies['user_id'];
  if (!user) {
    res.status(401);
    res.render('error-login');
  } else {
    // NEED TO ASSOCIATE THE NEW URL WITH USER
    res.redirect('/urls/:id');
  }
})

app.post('/urls/:id', (req, res) => {
  let user = 'asdf' // req.cookies['user_id'];
  if (!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.status(404);
    res.render('404-error');
  } else if (!user) {
    res.status(401);
    res.render('error-login');
  }
})

app.get('/login', (req, res) => {
  let user = 'asdf' // req.cookies['user_id'];
  if (user != 'a') {
    res.status(200);
    res.render('urls_login');
  } else {
    res.redirect('/')
  }
})

app.get('/register', (req, res) => {
  let user = 'asdf' // req.cookies['user_id'];
  if (!user) {
    res.response(200);
    res.render('/urls_register');
  } else {
    res.redirect('/');
  };
});

// app.post('/register', (req, res) => {

// })

app.post('/login', (req, res) => {
  let loginMatch = false;
  Object.keys(users).forEach(function(user) {
    if (users[user]['email'] === req['body']['email'] && users[user]['password'] === req['body']['password']) {
      loginMatch = true;
      res.cookie('user_id', users[user]['id']);
    };
  });
    if (loginMatch === true) {
      res.redirect('/');
    } else {
      res.status(401);
      res.render('error-login');
    };
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});