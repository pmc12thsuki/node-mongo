const {User} = require('./../models/user');


// a authenticate middleware
const authenticate = (req, res, next) =>{
    const token = req.header('x-auth');
    
    User.findByToken(token).then(user=>{ //custom model method
        if(!user){
            return Promise.reject(); // instead of writing res.status(401).send(), we can return a reject so the catch block will be execute
        }
        // attach user and token we found in req
        req.user = user;
        req.token = token;
        next();
    })
    .catch(err=>{
        // 401 status : authentication is required
        res.status(401).send();
    })
}

module.exports = {
    authenticate
}