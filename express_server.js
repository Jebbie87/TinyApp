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
                                 '9sm5xK': 'http://www.google.com'} }};

app.get('/', (req, res) => {
  const user = 'asdf' //req['cookies']['user_id'];
  if (!user) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  };
});

app.get('/urls', (req, res) => {
  const user = 'asdf' //req['cookies']['user_id'];
  let templateVars = { shortURL: users[user]['urls'],
                       longURL: users[user]['urls']
                    };
  if (!user) {
    res.status(400);
    res.render('error-page');
  } else {
    res.status(400);
    res.render('urls_index');
  };
});

app.get('/urls/new', (req, res) => {
  const user = 'asdf' // req.cookies['user_id'];
  if(!user) {
    res.status(401);
    res.render('error-page');
  } else {
    res.status(200);
    res.render('urls_new');
  };
});

app.get('/urls/:id', (req, res) => {
  const user = 'asdf' //
  if(!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.response(404).send('Sorry this page does not exist');
  } else if (!user) {
    res.response(401);
  }
})

app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req['params']['id']];
  if (!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.status(404);
    res.render('404-error');
  } else {
    res.redirect(longURL)
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});