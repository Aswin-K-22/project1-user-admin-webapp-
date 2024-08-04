const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/UserDatabase');
console.log("inseritng user data")

const db = mongoose.connection;

    
db.on('error', (err) => {
    console.error(err);
  });
  
  db.once('open', () => {
    console.log("Database connected Successfully in imprted module");
  });

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
    type:String,
    default:''
    }

});

const Users = mongoose.model("Users", userSchema);
module.exports = Users;