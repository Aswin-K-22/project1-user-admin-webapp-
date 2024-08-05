const express = require('express');
const admin_route = express();
const session = require('express-session');
const ejs = require('ejs');
const nocache = require("nocache")
const bodyParser = require('body-parser');
const path = require('path');
const adminController = require('../controllers/adminController') 
const adminAuth = require('../middleware/adminAuth');

admin_route.use(
	session({
		secret: 'hi',
		cookie: { maxAge: 24 * 60 * 60 * 1000 * 30, sameSite: true }, // = 30 days (hh:mm:ss:ms)*days
		saveUninitialized: false,
		resave: false,
	})
);

admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.set('view engine', 'ejs');
admin_route.set('views', path.join(__dirname, '../views','admin'));
admin_route.use(express.static('public') );



//admint routes
admin_route.get('/', adminAuth.isLogout, adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.use(nocache());
admin_route.get('/adminreg', adminAuth.isLogout, adminController.loadRegister);
admin_route.post('/adminsignup', adminController.insertAdmin);

admin_route.get('/home', adminController.loadDashboard);
admin_route.get('/logout', adminAuth.isLogin, adminController.logout);

admin_route.get('/dashboard', adminAuth.isLogin, adminController.adminDashboard);
admin_route.get('/new-user', adminAuth.isLogin, adminController.newUserLoad);
admin_route.post('/new-user',(req, res, next) => {
    console.log('Before middleware, session:', req.session);},adminAuth.isLogin, adminController.addUser);


admin_route.post('/search', adminController.searchList);
admin_route.get('/edit-user', adminAuth.isLogin, adminController.editUserLoad);
admin_route.post('/edit-user', adminController.updateUsers);
admin_route.get('/delete-user', adminController.deleteUser);
admin_route.post('/new-user', adminController.addUser);

module.exports = admin_route;