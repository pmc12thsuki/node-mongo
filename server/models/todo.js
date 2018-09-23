'use strict';
const mongoose = require('mongoose');

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
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId, // ObjectId type
        required: true
    }
});

module.exports = {
    Todo
}