'use strict';
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const id = '5b9e7bab15408f395145f9b5';

if(!ObjectID.isValid(id)){
    console.log('Id not valid');
}

//remove(all)
Todo.remove({}).then(result=>{
    console.log(result);
})

//findOneAndRemove
Todo.findOneAndRemove({_id:id}).then(result=>{
    console.log(result);
})


//findByIdAndRemove
Todo.findByIdAndRemove(id).then(result=>{
    console.log(result);
})

