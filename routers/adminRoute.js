const express = require('express');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const adminAuth = require('../middleware/adminAuth');
const admin_route = express();
const ejs = require('ejs');
const path = require('path');
const adminController = require('../controllers/adminController') 
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');


mongoose.connect('mongodb://localhost:27017/UserDatabase', {
   
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

admin_route.use(bodyParser.urlencoded({ extended: true }));
admin_route.use(bodyParser.json());

admin_route.use(express.static('public') );
admin_route.set('view engine', 'ejs');
admin_route.set('views', path.join(__dirname, '../views','admin'));

admin_route.use(nocache());

admin_route.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/UserDatabase',
        collectionName: 'sessions'
    })
}));






//admint routes
admin_route.get('/', adminAuth.isLogout, adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);

admin_route.get('/adminreg', adminAuth.isLogout, adminController.loadRegister);
admin_route.post('/adminsignup', adminController.insertAdmin);

admin_route.get('/home', adminController.loadDashboard);
admin_route.get('/logout', adminAuth.isLogin, adminController.logout);

admin_route.get('/dashboard', adminAuth.isLogin, adminController.adminDashboard);
admin_route.get('/new-user', adminAuth.isLogin, adminController.newUserLoad);
admin_route.post('/new-user',adminAuth.isLogin, adminController.addUser);


admin_route.post('/search', adminController.searchList);
admin_route.get('/edit-user', adminAuth.isLogin, adminController.editUserLoad);
admin_route.post('/edit-user', adminController.updateUsers);
admin_route.get('/delete-user', adminController.deleteUser);
admin_route.post('/new-user', adminController.addUser);

module.exports = admin_route;