require('dotenv').config();
const mongoose = require("mongoose")
const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');


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

const app = express();

const userRoute = require('../routers/userRoute');
const adminRoute = require('../routers/adminRoute');

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Correct way to use connect-mongo with express-session


app.use('/admin', adminRoute);
app.use('/', userRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
