const express = require('express');
const user_route = express.Router();
const path = require('path');
const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const nocache = require("nocache");
const bodyParser = require('body-parser');


// Set the view engine for user views
//user_route.set('view engine', 'ejs');
//user_route.set('views', path.join(__dirname, '../views/user'));

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.use(express.static('public'));
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