var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

var admin;

router.use(function (req, res, next) {
  admin = req.app.locals.firebase_admin.auth();
  next();
});

// ---------------------------------------------
// POST /check/displayName
// ---------------------------------------------
router.post('/check/displayName', (req, res, next) => {
  var name = req.body.displayName;
  res.send(checkDuplicateName(name));
});

// ---------------------------------------------
// POST /check/phoneNumber
// ---------------------------------------------
router.post('/check/phoneNumber', (req, res, next) => {
  var phoneNumber = req.body.phoneNumber;
  res.send(checkDuplicatePhoneNumber(phoneNumber));
});

// ---------------------------------------------
// POST /update
// ---------------------------------------------
router.post('/update', (req, res, next) => {
  
  var displayName = req.body.displayName;
  var phoneNumber = req.body.phoneNumber;
  var uid = req.body.uid;

  var data = {
      displayName: displayName,
      phoneNumber: phoneNumber
  };

  admin.updateUser(uid, data).then(user => {
    log('success','UPDATED User: ' + JSON.stringify(user.toJSON()));
    res.redirect('/user/dashboard/' + uid);
  }).catch(error => {
    res.render('error', { 
      title: process.env.TITLE,
      error: error
    });
  });
  
});

// ---------------------------------------------
// GET /dashboard/:uid
// ---------------------------------------------
router.get('/dashboard/:uid', (req, res, next) => {

  var uid = req.params.uid;

  getUser(uid, (error, user) => {
    if (error != null) {
      res.render('error', { 
        title: process.env.TITLE,
        error: error
      });
    } else {
      res.render('dashboard', { 
        title: process.env.TITLE,
        user: user,
        uid: user.uid
      });
    }

  });

});

// ---------------------------------------------
// GET /profile/:uid
// ---------------------------------------------
router.get('/profile/:uid', (req, res, next) => {

  var uid = req.params.uid;

  getUser(uid, (error, user) => {
    if (error != null) {
      res.render('error', { 
        title: process.env.TITLE,
        error: error
      });
    } else {
      res.render('profile', { 
        title: process.env.TITLE,
        user: user,
        uid: user.uid
      });
    }

  });

});

// =================================================
// Functions 

let getUser = (uid, callback) => {

  admin.getUser(uid).then(user => {
    callback(null, user)
  }).catch(error => {
    callback(error, null);
  });

};

const checkDuplicateName = (name, nextPageToken) => {
  // List batch of users, 1000 at a time.

  admin.listUsers(1000, nextPageToken).then((listUsersResult) => {
      
    listUsersResult.users.forEach((userRecord) => {
        log('info', 'check if ' + userRecord.toJSON().displayName + ' == ' + name);
        if (userRecord.toJSON().displayName == name) {
          log('info', 'user found');
          return true;
        }
      });

      if (listUsersResult.pageToken) {
        // List next batch of users.
        checkDuplicateName(name, listUsersResult.pageToken);
      } else {
        return false
      }

    }).catch((error) => {
      console.log('Error listing users:', error);
    });
};

const checkDuplicatePhoneNumber = (phoneNumber) => {

  admin.getUserByPhoneNumber(phoneNumber).then((userRecord) => {
    return true;
  }).catch((error) => {
    console.log('Error fetching user data:', error);
    return false;
  });

}

module.exports = router;
