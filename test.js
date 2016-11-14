'use strict';
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // you will probably this from req.params
const hashed_password = bcrypt.hashSync(password, 10);

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

const users = {'asdf': { 'id': 'asdf',
                         'email': 'test@test.com',
                         'password': 'asdf',
                         'urls': {'b2xVn2': 'http://www.lighthouselabs.ca',
                                 '9sm5xK': 'http://www.google.com'}
                        },
                'test': { 'id': 'test',
                          'email': 'ta',
                          'password': 'asdf',
                          'urls': {'nsdnf': 'http://reddit.com',
                                 'nsdnfs': 'http://yahoo.com'}
                        }
              };

app.get('/', (req, res) => {
  const user = req['cookies']['user_id'];
  // if (!user) {
  //   res.redirect('/login');
  // } else {
  //   res.redirect('/urls');
  // };
  if (!user) {
    let templateVars = {'urls': urlDatabase,
                        'user': ''}
    res.render('urls_list', templateVars);
    // res.redirect('/login');
  } else {
    let templateVars = {'user': user,
                        'email': users[user]['email'],
                        'urls': urlDatabase}
    res.render('urls_list', templateVars);
  };

});

app.get('/urls', (req, res) => {
  const user = req['cookies']['user_id'];
  if (!user) {
    res.status(400);
    res.render('error-login');
  } else {
    if (!users[user].hasOwnProperty('urls')) {
      users[user]['urls'] = {};
    }
    let templateVars = { 'email': users[user]['email'],
                       'users': users,
                       'user': user};
    res.status(200);
    res.render('urls_index', templateVars);
  };
});

app.get('/urls/new', (req, res) => {
  const user = req['cookies']['user_id'];
  if(!user) {
    res.status(401);
    res.render('error-login');
  } else {
    res.status(200);
    res.render('urls_new');
  };
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const user = req['cookies']['user_id'];
  delete urlDatabase[req['params']['shortURL']];
  delete users[user]['urls'][req['params']['shortURL']]
  res.redirect('/urls');
});


app.get('/urls/:id', (req, res) => {
  const user = req['cookies']['user_id'];
  if(!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.status(404);
    res.render('404-error');
  } else if (!user) {
    res.status(401);
    res.render('error-login');
  } else if (!users[user]['urls'].hasOwnProperty(req['params']['id'])) {
    res.status(403);
    res.render('403-error');
  } else {
     let templateVars = { 'shortURL': req['params']['id'],
                          'longURL': urlDatabase[req['params']['id']],
                          'email': users[user]['email'],
                          'user': user
                        };
    res.status(200);
    res.render('urls_show', templateVars);
  };
})

app.get('/u/:id', (req, res) => {
  let longURL = urlDatabase[req['params']['id']];
  if (!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.status(404);
    res.render('404-error');
  } else {
    res.redirect(longURL);
  };
});

app.post('/urls', (req, res) => {
  const user = req['cookies']['user_id'];
  let templateVars = { 'email': users[user]['email'],
                       'user': user,
                       'users': users
                     };
  if (!user) {
    res.status(401);
    res.render('error-login');
  } else {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = req['body']['longURL']
    users[user]['urls'][shortURL] = req['body']['longURL']
    res.redirect(`/urls/${shortURL}`)
  };
})

app.post('/urls/:id', (req, res) => {
  const user = req['cookies']['user_id'];

  if (!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.status(404);
    res.render('404-error');
  } else if (!user) {
    res.status(401);
    res.render('error-login');
  } else if (!users[user]['urls'].hasOwnProperty(req['params']['id'])) {
    res.status(403);
    res.render('403-error');
  } else {
    let templateVars = { 'email': users[user]['email'],
                       'shortURL': req['params']['id'],
                       'longURL': req['body']['longURL'],
                       'user': user
                     };
    urlDatabase[req['params']['id']] = req['body']['longURL']
    users[user]['urls'][req['params']['id']] = req['body']['longURL']
    res.render('urls_show', templateVars);
  };
});

app.get('/login', (req, res) => {
  const user = req['cookies']['user_id'];
  if (user != 'a') {
    res.status(200);
    res.render('urls_login');
  } else {
    res.redirect('/');
  };
});

app.get('/register', (req, res) => {
  const user = req['cookies']['user_id'];
  if (!user) {
    res.status(200);
    res.render('urls_register');
  } else {
    res.redirect('/');
  };
});

app.post('/register', (req, res) => {
  let matchingEmail = false;
  if (req['body']['email'] === '' || req['body']['password'] === ''){
    res.status(400);
    res.render('register-blank-error');
  } else {
    Object.keys(users).forEach(function(user){
      if (users[user]['email'] === req['body']['email']) {
        matchingEmail = true;
        res.status(400);
        res.render('register-email-error');
      }
    });
  };

  if (matchingEmail === false) {
    const userID = generateRandomString();
    users[userID] = { 'id': userID,
                      'email': req['body']['email'],
                      'password': req['body']['password']
                    };
    res.cookie('user_id', userID);
    res.redirect('/');
  };
})

app.post('/login', (req, res) => {
  let loginMatch = false;
  Object.keys(users).forEach(function(user) {
    if (users[user]['email'] === req['body']['email'] && users[user]['password'] === req['body']['password']) {
      loginMatch = true;
      res.cookie('user_id', users[user]['id']);
    };
  });
    if (loginMatch === true) {
      res.redirect('/urls');
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