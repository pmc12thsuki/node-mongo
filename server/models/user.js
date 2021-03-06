'use strict';
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// if we want to add instance mothed on Model, we need to create model by Schema
const UserSchema = new mongoose.Schema(
    {
    email:{
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate:{
            validator: validator.isEmail,
            // return true or false, equal to 
            // value =>  validator.isEmail(value);
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[{  // Array type is valid in mongoDB, may not valid in others 
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
})

//override toJSON function, this function will called when convert mongoose model to JSON value
UserSchema.methods.toJSON = function(){ 
    // we dont want to send 'password' and 'tokens' to user
    const user = this;
    const userObject = user.toObject(); // a function that convert user into a regular object where only the properties avaliable on the document exist
    return _.pick(userObject,['_id','email']); // return only id and email
};


//add instances method on UserSchema. instances method is different with model methods, instances need some instances data inside
UserSchema.methods.generateAuthToken = function(){
    //method function can bind this, but arrow function cannot
    const user = this; // binding to instance
    const access = 'auth';
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access
     }, process.env.JWT_SECRET).toString();

     // push token into user.tokens, but push may cause error in mongodb, so use concat instead
     user.tokens = user.tokens.concat([{access, token}]);

     // return a token (a promise that return a token) when server called this function
     return user.save().then(()=>{
         return token;
     });
}

UserSchema.methods.removeToken = function(delete_token){
    const user = this;
    return user.update({
        $pull: { // $pull let us remove items from an array that match certain criteria 
            tokens:{
                token: delete_token // remove the token that we want to delete from tokens array
            } 
        }
    })
}

// add a Model method
UserSchema.statics.findByToken = function(token){
    const User = this; // binding to model
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(e){ 
        return Promise.reject(); // if not a valid token, then reject it
        // Promise.reject() is equal to below: 
        // new Promise((resolve, reject)=>{ 
        //     reject();
        // });
    }

    return User.findOne({ // return a promise
        _id: decoded._id,
        'tokens.token': token, //find in tokens array with token object that equal to the token argument passed in above
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function(email, password){
    const User = this;
    return User.findOne({email}).then(user=>{
        if(!user) return Promise.reject();

        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err, result)=>{ // check if user's password is correct
                // res is true if password is correct
                if(result){
                    resolve(user); 
                }else{
                    reject();
                }
            })
        })
    })
};

// add middleware for user schema (hash password)
UserSchema.pre('save', function(next){ // a middleware called before save
    // before a document saved, we want to hash user password
    const user = this;
    if(user.isModified('password')){ // only hash password when user password is modify, otherwise the password will be hased again
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})

const User = mongoose.model('User',UserSchema);

module.exports = {
    User
}