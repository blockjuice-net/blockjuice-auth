// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase  = require("firebase/app");
const admin = require('firebase-admin');

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

// ---------------------------------------------------------------------------
// Create Key Store for Token

var nJwt = require('njwt');
var secureRandom = require('secure-random');
const log = require("logbootstrap");

let getToken = (data) => {
  var signingKey = secureRandom(256, {type: 'Buffer'});
  var jwt = nJwt.create(data, signingKey);

  return {
    token: jwt,
    auth: jwt.compact()   
  };

};

let getUser = (email, callback) => {
  admin.auth().getUserByEmail(email)
    .then(userRecord => {
      callback(null, userRecord.toJSON());
    }).catch(error => {
      callback(error, null);
    });
};

// ---------------------------------------------------------------------------
// Initialize Firebase
let init = (config) => {
  firebase.initializeApp(config);
  admin.initializeApp();
};

let signIn = (email, password, callback) => {
  firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
    callback(null, result.user);
  }).catch(error => {
    callback(error, null);
  });
};

let signUp = (email, password, callback) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
    callback(null, result.user);
  }).catch(error => {
    callback(error, null);
  });
};

let logOut = (callback) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    callback(false);
  }).catch(error => {
    // An error happened.
    callback(error, null);
  });
};

let verifyMail = (email, options, callback) => {

  firebase.auth().sendSignInLinkToEmail(email, options).then(() => {
      // Verification email sent.
      callback(null)
  }).catch(error => {
    // Error occurred. Inspect error.code.
    callback(error)
  });
};

let checkMail = (email, url, callback) => {

  firebase.auth().signInWithEmailLink(email, url)
  .then(result => {
    callback(null, result.user);
  })
  .catch(error => {
    callback(error, null);
  });

};

let passwordReset = (email, options, callback) => {
  
  firebase.auth().sendPasswordResetEmail(email, options).then(() => {
    callback(null);
  }).catch(error => {
    // Handle Errors here.
    callback(error);
  });
};

// ----------------------------------------------------
let getError = error => {
  if ((error.errorCode == 'auth/email-already-in-use') || 
      (error.errorCode == 'auth/invalid-email') || 
      (error.errorCode == 'auth/operation-not-allowed') ||
      (error.errorCode == 'auth/weak-password') || 
      (error.errorCode == 'auth/expired-action-code') || 
      (error.errorCode == 'auth/invalid-email') || 
      (error.errorCode == 'auth/user-disabled') ||
      (error.errorCode == 'auth/user-not-found') ||
      (error.errorCode == 'auth/missing-android-pkg-name') ||
      (error.errorCode == 'auth/missing-continue-uri') ||
      (error.errorCode == 'auth/missing-ios-bundle-id') ||
      (error.errorCode == 'auth/invalid-continue-uri') ||
      (error.errorCode == 'auth/unauthorized-continue-uri')) {
        return error.errorMessage;
  } else {
        return 'unidentified error or unknow user';
  }
};

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
  logOut,
  signIn,
  signUp,
  getError,
  verifyMail,
  checkMail,
  getToken,
  passwordReset,
  getUser
};

