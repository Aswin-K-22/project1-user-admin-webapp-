const ejs = require("ejs");
const Users = require("../models/userDataScheme");




sessionActive = false;
//loginpage or home
const loginPage = async (req, res) => {
    try {
      if (sessionActive) {
        console.log("Login fn in controllers of userController");
      } else {
        res.render("Login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
//signup or home
  const Signup = async (req, res) => {
    try {
      if (sessionActive) {
        console.log("Signup fn in controllers of userController");
      } else {
        res.render("signup");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
//signup user
const insertUserData = async (req, res) => {
    
        console.log("3");
        const data = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mob,
            password: req.body.password,
            is_admin: 0,
        };
        try{
      // for checking existing user
      const existingUser = await Users.findOne({
        $or: [{ email: req.body.email }, { mobile: req.body.mob}],
      });
  
      if (existingUser) {
        return res.render("signup", {
          message: "Email ID or Phone Number already registered!",
        });
      }
  
    
        console.log(data);
      const userData = await Users.insertMany(data);
      console.log("data Succesfullyinserted in User")
      if (userData) {
        
        res.render("signup", {
          message:
            "You have succefully registered!"
        });
      } else {
        res.render("signup", { message: "Registration failed,may be your data not matching for the input areas" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //login user
  const verifyLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      console.log(email,password)
  
      const userData = await Users.findOne({email:email,password:password});
      console.log(userData);
      if (userData) {
        console.log("mail verification succesfull")
        req.session.user_id = userData._id;
        console.log(userData._id)
        res.redirect("/home");
          
        } else {
          res.render("login", { message: "Email and Password are incorrect" });
        }
      
    } catch (error) {
      console.log("the await fn is error")
      console.log(error.message);
    }
  };

  const loadHome = async (req, res) => {
    try {
        console.log(req.session.user_id)
      const userData = await Users.findOne({ _id: req.session.user_id });
      sessionActive = true;
      console.log(userData,"last step of home");
      res.render("home", { user: userData });
    } catch (error) {
      console.log(error.message);
    }
  };

//logouting
  const userLogout = async (req, res) => {
    try {
      req.session.destroy();
      sessionActive = false;
      res.redirect("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  module.exports = {
    loginPage,
    Signup,
    insertUserData,
    verifyLogin,
    loadHome,
    userLogout
    
  };