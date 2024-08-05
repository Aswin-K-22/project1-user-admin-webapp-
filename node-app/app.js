const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const nocache = require("nocache");
const adminRoutes = require('../routers/adminRoute');
const userRoutes = require('../routers/userRoute');

dotenv.config();

const app = express();

// Database connection
mongoose.connect("mongodb://localhost:27017/UserDatabase")
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


// Middleware ( JSON parsing, static files)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies



// Set the view engine for the app
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "../views"))

// Set up session middleware
app.use(session({
  secret: 'ecret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));



// Set up nocache middleware
app.use(nocache());

// Set up static files
app.use(express.static('public'));

app.use('/admin', adminRoutes);
app.use('/', userRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
  });

  // Error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('admin/error', {
	  message: err.message,
	  error: {}
	});
  });



// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});