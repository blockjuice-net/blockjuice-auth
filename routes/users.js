var express = require('express');
var router = express.Router();

import dotenv from 'dotenv';
dotenv.config();

//Load settings
const { 
        AUTH_CALLBACK, 
        SIGN_CALLBACK, 
        BACKGROUND_COLOR 
      } = process.env;

/* GET users listing. */
router.get('/login/:logintype', function(req, res, next) {

  //redirect browser to OAuth flow
function loginHandler(oreId) {
  return asyncHandler(async function(req, res, next) {
    const provider = req.params.logintype;
    let authUrl = await oreId.getOreIdAuthUrl({ provider, callbackUrl: AUTH_CALLBACK, signCallbackUrl: SIGN_CALLBACK, backgroundColor: BACKGROUND_COLOR });
    //redirect browser
    res.redirect(authUrl);
  });
}

});

app.use('/login/:logintype', usersRouter);
app.use('/authcallback', auth.authCallback, usersRouter);
app.use('/signcallback', auth.signCallback);

//Generic async handler for Express Middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


module.exports = router;
