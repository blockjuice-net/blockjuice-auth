// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase  = require('firebase/app');
const firebase_admin = require('firebase-admin');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// -----------------------------------------------------------
// FIREBASE Initialization

let init = (firebase_config, serviceAccountKey) => {

  firebase.initializeApp(firebase_config);

  firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccountKey),
    databaseURL: firebase_config.databaseURL
  });  

};

// ----------------------------------------------------
// parse error 
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

module.exports = {
  init,
  firebase,
  firebase_admin,
  getError
};

