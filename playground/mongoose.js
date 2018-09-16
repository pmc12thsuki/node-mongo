'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // default use callback
mongoose.connect('mongodb://localhost:27017/TodoApp'); // not need to write operation in callback, mongoose will wait for connection complete

//create model
const Todo = mongoose.model('Todo',{ // collection name
    // add field
    text:{
        type: String,
        required: true,
        minlength: 1,
        trim : true // will remove leading and trailing whitespace
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    }
});

const newTodo = new Todo({
    text: "buy earphone",
})

newTodo.save().then(result=>{
    console.log(result)
}, error=>{
    console.log(error)
});


const User = mongoose.model('User',{
    email:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

const newUser = new User({
    email: 'pmc12thsuki@gmail.com'
})

newUser.save().then(result=>{
    console.log(result)
})
