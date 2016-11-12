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
  res.redirect('/');
});

// THIS WILL PRINT OUT ALL THE URLS AND THE SHORTENED FORMS
app.get('/urls', (req, res) => {
    // let cookieID = req['cookies']['user_id']
  const url = [];
  let user = req.cookies['user_id'];
  if(!user){
    // user = '';
    let templateVars = {
    urls: urlDatabase,
    user: '',
    email: '',
    users: users
  };
    res.render('urls_index', templateVars);
  } else if (!users[user]['urls']){
    res.redirect('/urls/new')
  } else {

  let templateVars = {
    urls: urlDatabase,
    user: user,
    email: users[user]['email'],
    users: users
  };
  url.push(req['body']['longURL'])
  users[['user_id']['urls']] = url
  res.render('urls_index', templateVars);
  }
});

// THIS WILL SEND THE USER TO MAKE THE NEW WEBPAGE
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// THIS WILL DELETE THE URL OFF THE DATABASE WHEN DELETE IS CLICKED
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req['params']['shortURL']];
  res.redirect('/urls');
});

// THIS ONE WILL DISPLAY A SINGLE URL AND ITS SHORTENED FORM
app.get('/urls/:id', (req, res) => {
  let cookieID = req['cookies']['user_id']
  let templateVars = { shortURL: req['params']['id'],
                       longURL: urlDatabase[req['params']['id']],
                       user: req['cookies']['user_id'],
                       email: users[cookieID]['email']
                    };
  res.render('urls_show', templateVars);
});

// THIS WILL REDIRECT YOU TO THE WEBSITE
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req['params']['shortURL']];
  res.render('urls_new');
});

// THIS WILL GET THE LONG URL FROM THE USER AND THEN SEND THEM TO THE
// SHORT URL PAGE THAT DISPLAYS THEIR LONG AND SHORT URLS
app.post('/urls', (req, res) => {
  const longURL = req['body']['longURL']
  const cookieID = req['cookies']['user_id']
  let userURL = users[req['cookies']['user_id']]
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  if (!userURL.hasOwnProperty('urls')){
    userURL['urls']= {};
    userURL['urls'][shortURL] = longURL
  } else
  userURL['urls'][shortURL] = longURL
  res.redirect(`urls/${shortURL}`);
});

// THIS WILL EDIT THE LONG URL
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req['params']['shortURL']
  const longURL = req['body']['longURL']
  urlDatabase[req['params']['shortURL']] = req['body']['longURL'];
  urlDatabase[req['cookies']['user_id']]
  res.redirect('/urls');
});

// THIS WILL
app.post('/login', (req, res) => {
  let exists = false;
  let cookieUser;
  Object.keys(users).forEach(function(user){
    if (users[user]['email'] == req['body']['login'] && users[user]['password'] == req['body']['password']){
      exists = true;
      cookieUser = users[user]['id']
    }
  })
  if (exists === true){
    res.cookie('user_id', cookieUser)
    res.redirect('/urls')
  } else {
    res.redirect('/urls/9sm5xK')
  }
});

app.get('/login', (req, res) => {
  res.render('urls_login')
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  res.render('urls_register');
});

app.post('/register', (req, res) => {
  let foundExisting = false;
  if (req['body']['email'] === '' || req['body']['password'] === ''){
      res.redirect(400, '/urls/9sm5xK');
      return
  } else {
    Object.keys(users).forEach(function(user){
      if (req['body']['email'] === users[user]['email']){
        foundExisting = true;
        // res.redirect(400, '/urls/b2xVn2')
      }
    })
  }
  if (foundExisting === false){
    let userID = generateRandomString();
    users[userID] = {
      'id': userID,
      'email': req['body']['email'],
      'password': req['body']['password']
    };
    res.cookie('user_id', userID);
    res.redirect('/urls');
  } else {
    res.redirect(400, '/urls/b2xVn2')
  }
});








app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});