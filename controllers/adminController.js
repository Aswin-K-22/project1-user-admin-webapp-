
const ejs = require('ejs');
const Admin = require('../models/adminSchema');
const Users = require("../models/userDataScheme");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
//const config = require('../config/config');





adminSessionActive = false;
//securePassword creation
const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };



  //for sending email for verificaton and this for admin
// const sendVerifyMail = async (name, email, admin_id) => {
//     try {
//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         requireTLS: true,
//         auth: {
//           user: config.emailUser,
//           pass: config.emailPassword,
//         },
//       });
//       const mailOptions = {
//         from: config.emailUser,
//         to: email,
//         subject: "Reset Password",
//         html:
//           "<p>Hello " +
//           name +
//           ', Please click here to <a href="http://localhost:3000/forget-password?token=' +
//           token +
//           '">Reset </a> your password.</p>',
//       };
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email has been sent:-", info.response);
//         }
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//login page of admin
const loadLogin = async(req,res)=>{

    try {

        if(adminSessionActive){
            console.log(" after 'isLogout adminauth'loadlogin function ifcontion satisfied(get-'/')")
           

        }else{

        res.render('admin/login')

        }
        

    } catch (error){
        console.log(error.message);
    }
}
//adming login verification

const verifyLogin = async(req,res)=>{
  console.log("verifylogin fn (post.'/') -admin login tring")
    try {

        const email = req.body.email;
        const password = req.body.password;

        const adminData = await Admin.findOne({email:email});
        console.log(' fn Veryfylogin try case ',adminData);
       
        
            
        if(adminData){

          const passwordMatch = await bcrypt.compare(password,adminData.password);

          console.log(typeof passwordMatch,passwordMatch,"password matching checking verfyfylogin in adminside");

          if(passwordMatch){

            
            req.session.admin_id = adminData._id;
            console.log("Session created:", adminData._id,req.session.admin_id);
            adminSessionActive = true;  

            res.redirect("/admin/home");
          }else {

            res.render('/login',{message:"Email and password is incorrect"})

        }}else{

            res.render('/login',{message:"Email and password is incorrect"})

          }

    } catch (error) {
        console.log("The veryfylogin (post'/') catch condition satisfied(error occuring)")
        console.log(error.message);
    }

}
//loading home page

const loadDashboard = async(req,res)=>{

    try {
        console.log("loadDashboard with upadated or current documents, with the session is ", req.session.admin_id);
        const adminData = await Admin.findById({_id:req.session.admin_id})
        console.log(adminData,"loadDashboard adming with session")
        res.render('admin/home',{admin:adminData})
    } catch (error){
        console.log(error.message)
    }
}
//disboard display
const adminDashboard = async(req,res)=>{

    try {
        console.log("adminDashboard data loading with admin session is ", req.session.admin_id);
        const userData = await Users.find({is_admin:0});
        res.render('admin/dashboard',{users:userData});

} catch (error) {

    console.log(error.message);

}
}

//signup admin

const loadRegister = async (req, res) => {
  try {
    if (sessionActive) {
    } else {
      res.render("admin/signin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//signuping admin
const insertAdmin = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
        console.log(spassword);
    // for existing user
    const existingAdmin = await Admin.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mob }],
    });

    if (existingAdmin) {
      return res.render("admin/signup", {
        message: "Email ID or Phone Number already registered!",
      });
    }

    const admin = Admin({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mob,
      password: spassword,
      is_admin: 1,
    });
    const adminData = await admin.save();
    // if (adminData) {
    //     console.log("admin data saved in databse")
    //   sendVerifyMail(req.body.name, req.body.email, adminData._id);
    //   console.log("message sende to the mail verification");
    //   res.render("admin/signin", {
    //     message:
    //       "You have succefully registered!",
    //   });
    
    // } else {
    //   res.render("admin/signin", { message: "Registration failed" });
    // }
    res.redirect('/admin');
  } catch (error) {
    console.log(error.message);
  }
};


//logout admin
const logout = async(req,res)=>{

    try {

        req.session.destroy();
        adminSessionActive=false;
        res.redirect('/admin');

    }catch (error) {

        console.log(error.message);

    }

}

const searchList = async (req, res) => {

    try {
    const searchTerm = req.body.searchTerm;
    const users = await Users.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } }
        ]
    });
    res.render('admin/searchResult',{users: users});
} catch (error) {
    console.log(error.message)
}
}


const editUserLoad = async(req,res)=>{

    try {
        console.log("after chcking login auth editin person")
        const id = req.query.id;
        const userData = await Users.findById({_id:id});
        if(userData){
        res.render('admin/edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard')
        }
    } catch (error) {
        console.log(error.message)
    }

}

const updateUsers = async(req,res)=>{

    try {

      const userData =  await Users.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mob, is_verified:req.body.verify}})
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message)
    }

}
//deleting user

const deleteUser = async(req,res)=>{

    try {

        const id = req.query.id;
        await Users.deleteOne({_id:id})
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message)
    }
}
//add new userpage

const newUserLoad = async(req,res)=>{
    try {
      console.log("loading updated Dashboard with admin session 1 ",req.session.admin_id);
        res.render('admin/new-user');

    } catch (error) {
        console.log(error.message);
    }
}
//adding new user

    const addUser = async(req,res)=>{
      console.log('In addUser, session:', req.session);
            console.log("new user adding addUser -fn ")
            console.log("loading updated Dashboard with admin session 1 ",req.session.admin_id);
        
            try {
              console.log("new user adding addUser -fn inside try")
              const name = req.body.name;
              const email = req.body.email;
              const mob = req.body.mob;
              const password = req.body.password;
              const is_verified = req.body.is_verified;

              
            const existingUser = await Users.findOne({
                $or: [{ email: req.body.email }, { mobile: req.body.mob }]
            });
            console.log("addUser - going to check exiisting user or not ")
            if (existingUser) {
                console.log("the new user data admin entered exixsting user data ")
                
                return res.render('admin/new-user',{message:"Email ID or Phone Number already registered!"}); 
            }
            console.log("addUser new data is not exists ,its goind to insert in DB")

            const user = new Users({
              name:name,
              email:email,
              mobile:mob,
              password:password,
              is_admin: 0,
              is_verified : is_verified 
            });

            
            console.log("new user details befor insertion = ",user)
            console.log("loading updated Dashboard with admin session 2",req.session.admin_id);
            const userData = await Users.insertMany(user);
            console.log("loading updated Dashboard with admin session 3",req.session.admin_id);

            console.log("after insertion the output of insertion = ",userData);
            
            

            if(userData){
                console.log("loading updated Dashboard with admin session 4",req.session.admin_id);
                
                res.redirect('/admin/dashboard')

            }else{
                res.render('admin/new-user',{message:'Something wrong'});
            }

        } catch (error) {
            console.log("new user adding try error")
            console.log(error.message)
        }

    }

module.exports = {
    loadLogin,
    verifyLogin,
    loadRegister,
    insertAdmin,
    loadDashboard,
    adminDashboard,
    logout,
    searchList,
    editUserLoad,
    updateUsers,
    deleteUser,
    newUserLoad,
    addUser
  };