const express = require('express');
const user_route = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const ejs = require('ejs');
const path = require('path');

const nocache = require('nocache');

user_route.use(
	session({
		secret: 'hi',
		cookie: { maxAge: 24 * 60 * 60 * 1000 * 30, sameSite: true }, // = 30 days (hh:mm:ss:ms)*days
		saveUninitialized: false,
		resave: false,
	})
);

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.use(express.static('public') );
user_route.set('view engine', 'ejs');
user_route.set('views', path.join(__dirname, '../views','users'));


user_route.use(nocache());



//for login page
user_route.get('/', userAuth.isLogout , userController.loginPage );
//for signup page
user_route.get('/signup', userAuth.isLogout , userController.Signup);
//for siginup
user_route.post('/signup', userController.insertUserData);

//for login
user_route.post('/login',userController.verifyLogin)

user_route.get('/login',userAuth.isLogout,userController.loginPage);
//redirecting home page 

user_route.get('/home',userAuth.isLogin,userController.loadHome);

//logout
user_route.post('/logout',userAuth.isLogin,userController.userLogout);


module.exports = user_route;