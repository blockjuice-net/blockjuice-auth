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
const { indexOf } = require("lodash");

dotenv.config();

// Initialize Firebase
let init = (config) => {
  firebase.initializeApp(config);
};

let login = (email, password, create, callback) => {

  if (create) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        callback(null, user);
      }).catch(error => {
        errorSign(error, callback);
    });
  } else {
    firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
      callback(null, user);
    }).catch(error => {
      errorSign(error, callback);
    });
  }

}

let errorSign = (error, callback) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  
  /*

  ERROR CODES
  -----------
  auth/email-already-in-use
    Thrown if there already exists an account with the given email address.
  
  auth/invalid-email
    Thrown if the email address is not valid.
  
  auth/operation-not-allowed
    Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
  
  auth/weak-password
    Thrown if the password is not strong enough.

  */

  callback(error, null);
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

