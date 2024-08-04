
const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id){
           console.log("the user hve sessionis in login auth");
        }
        else{

            console.log("the user dont have sesseion id in login auth");
        
            return res.redirect('/');
        }
        next();
    }catch (error) {
        console.log("error in login auth");
        console.log(error.message);
    }
}



const isLogout = async(req,res,next)=>{
    try {
        if(req.session.user_id){
            console.log("user alredy logined")
            res.redirect('/home');
        }
        console.log("the user dont have sessionis in logout auth");
        next();
    } catch (error) {
        console.log("error in logout auth");
        console.log(error.message);
    }
}




module.exports = {
    isLogin,
    isLogout
}