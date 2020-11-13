// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase  = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const dotenv  = require('dotenv');
const _ = require("lodash");

dotenv.config();

var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();
var twitter = new firebase.auth.TwitterAuthProvider();
var github = new firebase.auth.GithubAuthProvider();

// Initialize Firebase
let init = (config) => {
  firebase.initializeApp(config);
};

let login = (email, password, create, callback) => {

  if (create) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      callback(null, user);
    }).catch(error => {
      callback(error, null);
    });
  } else {
    firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
      callback(null, user);
    }).catch(error => {
      callback(error, null);
    });
  }

}

let logout = (callback) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    callback(false);
  }).catch(error => {
    // An error happened.
    callback(error, null);
  });
}

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

module.exports = {
  init,
  logout,
  login
};

