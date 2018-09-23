'use strict';
const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');


// users
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'user1@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
},{
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
}]

const populateUsers = done =>{
    User.remove({}).then(()=>{
        // need call 'save' to fire out middleware
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]).then(()=>{ // wait for two user been saved
            done();
        })
    })
}

// todos
const todos =[{
    _id: new ObjectID(),
    text: 'first todo',
    _creator: userOneId
},{
    _id: new ObjectID(),
    text: 'second todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = done =>{ //a function to setup environment (default db) before test 
    Todo.remove({}).then(()=> { // clear our db, remove all documents in Todo collection
        return Todo.insertMany(todos); // add default todos
    }).then(()=>done()) 
}



module.exports = {todos, populateTodos, users, populateUsers};