var express         = require('express');
var router          = express.Router();
const log           = require('logbootstrap');
const errors        = require('../errors');

var dotenv  = require('dotenv');
dotenv.config();

var provider, auth;

router.use(function (req, res, next) {
  
    auth = req.app.locals.firebase.auth();

    provider = new req.app.locals.firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // firebase.auth().languageCode = 'it';
    // To apply the default browser preference instead of explicitly setting it.
    auth.useDeviceLanguage();
    
    next();
});


router.post('/:token', (req, res, next) => {

  log('info', 'LogIn with provider Google with token ' + req.body.token);

  auth.signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    log('info', 'Provider ' + provider);
    log('info', 'User info: ' + JSON.stringify(result.user));

    res.redirect('/user/dashboard/' + result.user.uid);

    // ...
  }).catch(error => {
    errors.render(res, 'signup', error);
  });

});

router.get('/callback', (req, res, next) => {

    log('info', JSON.stringify(req.body));

    onSignIn(req.body.googleUser, (error, user) => {
        if (error) {
            errors.render(res, 'signup', error);
        } else {
            res.redirect('/user/dashboard/' + user.uid);
        }
    });
  
});

// ----------------------------------------------------------------

let onSignIn = (googleUser, callback) => {

    log('info', 'Google Auth Response', googleUser);

    var unsubscribe = auth.onAuthStateChanged(firebaseUser => {

      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.

      if (!isUserEqual(googleUser, firebaseUser)) {

        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).catch((error) => {
            callback(error, null);
        });

      } else {
        console.log('User already signed-in Firebase.');
        callback(null, firebaseUser);
      }
    });
};

// [START auth_google_checksameuser]
let isUserEqual = (googleUser, firebaseUser) => {

    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }

    return false;
}

module.exports = router;
