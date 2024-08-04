const isLogin = async (req, res, next) => {
    try {
        console.log(req.session.admin_id, "this adminAuth islogin");
        if (req.session.admin_id) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(req.session.admin_id, "--< ISLOGIN fn error in adminAuth");
        console.log(error.message);
    }
}


const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            res.redirect('/admin/home');
        } else {
            console.log("No session.admin_id ,ISLOGOUT else condition adminAuth");
            next();
        }
    } catch (error) {
        console.log("ISLOGOUT adminAuth fn erro(try)");
        console.log(error.message);
    }
}

module.exports = {

    isLogin,
    isLogout

}

