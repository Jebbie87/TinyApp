'use strict';
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const generateRandomString = function (){
  const alphaNumeric = "01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";
  let randomNum;
  for (let i = 0; i <= 6; i++){
    randomNum = Math.floor((Math.random() * alphaNumeric.length) + 1);
    password += alphaNumeric.charAt(randomNum);
  };
  return password;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

// THIS WILL PRINT OUT ALL THE URLS AND THE SHORTENED FORMS
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const message = "Sorry that page did not exist"
  res.render("urls_new");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req['params']['shortURL']]
  res.redirect("/urls")
})

// THIS ONE WILL DISPLAY A SINGLE URL AND ITS SHORTENED FORM
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       message: "test" };
  const message = "Sorry that page did not exist"
  if (!urlDatabase.hasOwnProperty(req['params']['id'])) {
    res.render('urls_new');
  } else {
    res.render("urls_show", templateVars);
  }
});

// THIS WILL REDIRECT YOU TO THE WEBSITE
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req['params']['shortURL']]
  const message = "test";
  if (urlDatabase[req['params']['shortURL']]) {
    res.redirect(longURL);
  } else {
    res.render('urls_new')
  }
});

// THIS WILL GET THE LONG URL FROM THE USER AND THEN SEND THEM TO THE
// SHORT URL PAGE THAT DISPLAYS THEIR LONG AND SHORT URLS
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req['body']['longURL'];
  res.redirect(`urls/${shortURL}`)
});



app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});