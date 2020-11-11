// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase  = require("firebase/app");

var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();
var twitter = new firebase.auth.TwitterAuthProvider();
var github = new firebase.auth.GithubAuthProvider();

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const dotenv  = require('dotenv');
const log     = require('logbootstrap');

dotenv.config();

// Initialize Firebase
let init = (config) => {
  firebase.initializeApp(config);
};

let login = (email, password, create, callback) => {

  if (create) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      errorSign(error, callback);
    });
  } else {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
      errorSign(error, callback);
    });
  }

}

let errorSign = (error, callback) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  log('error','Code: ' + errorCode + ' Message: ' + errorMessage);
  callback(error);
};

let logout = (callback) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    callback(false);
  }).catch(error => {
    // An error happened.
    errorSign(error, callback);
  });
}

module.exports = {
  init,
  logout,
  login
};

