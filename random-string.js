'use strict';

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

console.log(generateRandomString());
