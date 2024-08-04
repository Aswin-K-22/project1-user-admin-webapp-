const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache');
const userAuth = require('../middleware/userAuth');
const user_route = express();
const ejs = require('ejs');
const path = require('path');
const userController = require('../controllers/userController');

user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));

user_route.use(express.static('public') );
user_route.set('view engine', 'ejs');
user_route.set('views', path.join(__dirname, '../views','users'));

user_route.use(session({
    secret:'keyboard cat',
    resave : false , 
    saveUninitialized : true ,
}))

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