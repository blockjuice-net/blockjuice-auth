var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

const { 
  AUTH_CALLBACK, 
  SIGN_CALLBACK, 
  BACKGROUND_COLOR 
} = process.env;

/* GET users listing. */
router.get('/login/:logintype', (req, res, next) => {

  const provider = req.params.logintype;
  log('info', 'API /login/:logintype: ' + provider);

  let authUrl = req.app.locals.auth.authUrl({ 
      provider: provider, 
      callbackUrl: AUTH_CALLBACK, 
      signCallbackUrl: SIGN_CALLBACK, 
      backgroundColor: BACKGROUND_COLOR 
  });

  log('info', 'AuthUrl -> ' + authUrl);

  res.redirect(authUrl);

});

router.get('/authcallback', (req, res, next) => {
  
  const { user } = req;
  log('info', 'API /authcallback ' + JSON.stringify(user));

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(400).json({})
  }
  
});

router.get('/', (req, res, next) => {
  
  // let message = 'Start login flow using /login route. Try it like this: {http://yourserver:port}/login/facebook';
  // return res.status(200).send(message);
  log('info', 'API HOME ...')
  res.render('index', { title: 'Express' });
});

module.exports = router;
