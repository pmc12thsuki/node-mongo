'use strict';
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const id = '5b9e767ea960f5b237a6222f';

if(!ObjectID.isValid(id)){
    console.log('Id not valid');
}

//find(all)
Todo.find({
    _id: id //mongoose will transerform id(string) to id(objectID) automatically
}).then(todos=>{
    console.log(todos);
})

//findOne
Todo.findOne({
    _id: id //mongoose will transerform id(string) to id(objectID) automatically
}).then(todos=>{
    console.log(todos);
})

//most use
//findById
Todo.findById(id).then(todo=>{
    if(!todo){ //todo is empty because this id not exist
        return console.log('Id not found');
    }
    console.log(todo);
},e=>{
    console.log(e);
})