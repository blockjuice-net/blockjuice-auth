var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var io = require('../bin/www');

var dotenv  = require('dotenv');
dotenv.config();

var firebase_admin;

router.use(function (req, res, next) {
  firebase_admin = req.app.locals.firebase_admin;
  next();
});

router.post('/update', (req, res, next) => {
  
  var displayname = req.body.displayname;
  var uid = req.body.uid;

  var data = {
      displayName: displayname
  };

  firebase_admin.auth().updateUser(uid, data).then(user => {
    log('success','UPDATED User: ' + JSON.stringify(user.toJSON()));
    res.status(200).json(user.toJSON());
  }).catch(error => {
    res.status(400).json(JSON.stringify(error));
  });
  
});

router.get('/profile/:uid', (req, res, next) => {

  var uid = req.params.uid;

  firebase_admin.auth().getUser(uid).then(user => {

    res.render('dashboard', { 
      title: process.env.TITLE,
      user: user,
      uid: user.uid
    });
    
  }).catch(error => {

    res.render('error', { 
      title: process.env.TITLE,
      error: error
    });
    
  });

});

module.exports = router;
