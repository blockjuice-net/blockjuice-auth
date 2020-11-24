// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase  = require("firebase/app");
const admin = require('firebase-admin');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const dotenv  = require('dotenv');

dotenv.config();

var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();
var twitter = new firebase.auth.TwitterAuthProvider();
var github = new firebase.auth.GithubAuthProvider();

// ---------------------------------------------------------------------------
// Administration Users
let updateUser = (user, data, callback) => {

  /*
  Examples of data
  https://firebase.google.com/docs/auth/web/manage-users?authuser=2#update_a_users_profile

  {
    displayName: "Jane Q. User",
    photoURL: "https://example.com/jane-q-user/profile.jpg"
  }

  */

  user.updateProfile(data).then(() => {
    // Update successful.
    callback(null, user)
  }).catch((error) => {
    // An error happened.
    callback(error, null);
  });
};

let updateUserMail = (user, email, callback) => {

  user.updateEmail(email).then(() => {
    // Update successful.
    callback(null, user);
  }).catch(error => {
    // An error happened.
    callback(error, null);
  });

}

// ---------------------------------------------------------------------------
// Create Key Store for Token

var nJwt = require('njwt');
var secureRandom = require('secure-random');

// create token
let getToken = (data) => {
  var signingKey = secureRandom(256, {type: 'Buffer'});
  var jwt = nJwt.create(data, signingKey);

  return {
    token: jwt,
    auth: jwt.compact()   
  };

};

// ---------------------------------------------------------------------------
// Administration Users


let adminInit = (path, databaseURL) => {

  var serviceAccount = require(path);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
  });

};

let getUserInfo = (uid, callback) => {

  admin.auth().getUser(uid).then(user => {
    callback(null, user);
  }).catch((error) => {
    callback(error, null);
  });

};

let updateUserbyID = (uid, data, callback) => {

  /*
    Examples data user profile

    {
      email: 'modifiedUser@example.com',
      phoneNumber: '+11234567890',
      emailVerified: true,
      password: 'newPassword',
      displayName: 'Jane Doe',
      photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: true
    }

  */

  admin.auth().updateUser(uid, data).then(user => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
    callback(null, user.toJSON());
  }).catch(error => {
    callback(error, null);
  });

};


// ---------------------------------------------------------------------------
// Initialize Firebase
let init = (config) => {
  firebase.initializeApp(config);
  adminInit(config.admin_path, config.admin_databaseURL);
};

// signin with email and password
let signIn = (email, password, callback) => {
  firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
    callback(null, result.user);
  }).catch(error => {
    callback(error, null);
  });
};

// signup with email and password
let signUp = (email, password, callback) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
    callback(null, result.user);
  }).catch(error => {
    callback(error, null);
  });
};

// logout
let logOut = (callback) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    callback(false);
  }).catch(error => {
    // An error happened.
    callback(error, null);
  });
};

// send email verification
let verifyMail = (email, options, callback) => {

  firebase.auth().sendSignInLinkToEmail(email, options).then(() => {
      // Verification email sent.
      callback(null)
  }).catch(error => {
    // Error occurred. Inspect error.code.
    callback(error)
  });
};

// loginin with email link
let checkMail = (email, url, callback) => {

  firebase.auth().signInWithEmailLink(email, url)
    .then(result => {
      callback(null, result.user);
    })
    .catch(error => {
      callback(error, null);
    });

};

// reset password
let passwordReset = (email, options, callback) => {
  
  firebase.auth().sendPasswordResetEmail(email, options).then(() => {
    callback(null);
  }).catch(error => {
    // Handle Errors here.
    callback(error);
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
  logOut,
  signIn,
  signUp,
  getError,
  verifyMail,
  checkMail,
  getToken,
  passwordReset,
  updateUser,
  updateUserMail,
  getUserInfo,
  updateUserbyID
};

