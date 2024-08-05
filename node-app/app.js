
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const path = require("path");

// Database connection
mongoose.connect("mongodb://localhost:27017/UserDatabase", {
   
});

const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
});
db.once('open', () => {
    console.log("Database connected Successfully");
});






app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'hi',
		cookie: { maxAge: 24 * 60 * 60 * 1000 * 30, sameSite: true }, // = 30 days (hh:mm:ss:ms)*days
		saveUninitialized: false,
		resave: false,
	})
);

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// Correct way to use connect-mongo with express-session


const userRoute = require('../routers/userRoute')
const adminRoute = require('../routers/adminRoute')

app.use('/admin', adminRoute);
app.use('/', userRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
