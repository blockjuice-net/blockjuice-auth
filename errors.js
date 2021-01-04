let log         = require('logbootstrap');
var dotenv      = require('dotenv');
dotenv.config();

let render = (res, view, error) => {

    var t;
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    var errorMsg = errorCode + '\n' +
                   errorMessage + '\n' + 
                   email + '\n' +
                   credential;

    log('error', 'Error: ' + errorMsg);
      
    if (view == 'signup') {
      t = 'Sign Up';
    } else if (view == 'signin') {
      t = 'Sign In';
    };
  
    res.render(view, { 
      title: process.env.TITLE,
      typeform: t,
      error: parseFirebaseError(error),
      message: ''
    });
  
};
  
// parse error 
let parseFirebaseError = error => {
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
    render
}
