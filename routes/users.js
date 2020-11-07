var express = require('express');
var router = express.Router();

import dotenv from 'dotenv';
dotenv.config();

const { 
  AUTH_CALLBACK, 
  SIGN_CALLBACK, 
  BACKGROUND_COLOR 
} = process.env;

/* GET users listing. */
router.get('/login/:logintype', (req, res, next) => {

  const provider = req.params.logintype;
  let authUrl = req.app.locals.auth.authUrl({ 
      provider: provider, 
      callbackUrl: AUTH_CALLBACK, 
      signCallbackUrl: SIGN_CALLBACK, 
      backgroundColor: BACKGROUND_COLOR 
    });

  res.redirect(authUrl);

});

router.get('/authcallback', req.app.locals.auth.authCallback(), (req, res, next) => {
  const { user } = req;

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(400).json({})
  }
});

app.use('/signcallback', auth.signCallback());

module.exports = router;
