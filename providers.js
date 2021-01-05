const log   = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

let getClientID = () => {
  
  var clientid = {
      google: process.env.GOOGLE_CONSUMER_KEY
  };

  // log('info', JSON.stringify(clientid))

  return clientid;
}

module.exports = getClientID