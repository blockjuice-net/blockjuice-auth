const dotenv  = require('dotenv');
dotenv.config();

const FIREBASE_API_KEY = 'AIzaSyAH6Zasrg4iZ0t71JvoDtSfHX3LvkiKRLo'; 
const FIREBASE_AUTHDOMAIN = 'sage-buttress-288414.firebaseapp.com'; 
const FIREBASE_DATABASEURL = 'https://sage-buttress-288414.firebaseio.com'; 
const FIREBASE_PROJECT_ID = 'sage-buttress-288414'; 
const FIREBASE_STORAGEBUCKET = 'sage-buttress-288414.appspot.com'; 
const FIREBASE_MESSAGESENDERID = '366752711003'; 
const FIREBASE_APP_ID = '1:366752711003:web:6d355418d6d700ba6e9a7e'; 
const FIREBASE_MEASUREMENTID = 'G-WS7QDR22XJ'; 

const FIREBASE_EMAIL_VERIFY = 'http://localhost:' + process.env.PORT + '/auth/check';
const FIREBASE_RESET_PWD = 'http://localhost:' + process.env.PORT + '/signin';
const FIREBASE_ADMIN_DBURL = 'https://sage-buttress-288414.firebaseio.com';

const config = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    databaseURL: FIREBASE_DATABASEURL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGEBUCKET,
    messagingSenderId: FIREBASE_MESSAGESENDERID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENTID
};

module.exports = {
    config,
    FIREBASE_EMAIL_VERIFY,
    FIREBASE_RESET_PWD,
    FIREBASE_ADMIN_DBURL
};