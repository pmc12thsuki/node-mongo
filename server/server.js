'use strict';

require('./config/config');

const express = require('express');
const bodyParser = require('body-parser'); //take json into object, attach on request object
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
    const todo = new Todo({
        text: req.body.text, // req.body is parsed and save by bodyParser
        _creator: req.user._id
    })
    todo.save().then(todo=>{
        res.send({todo});
    },e =>{
        res.status(400).send(e);
    })
})

app.get('/todos', authenticate, (req, res)=>{
    Todo.find({
        _creator: req.user._id // only return todo which was created by that user
    }).then(todos=>{
        res.send({todos}); // send result back in object
    },e=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id', authenticate, (req, res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){ // valid id
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then(todo=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    },error=>{
        res.status(400).send();
    })
})

app.delete('/todos/:id', authenticate, (req, res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then(todo=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, e=>{
        res.status(400).send();
    })
})

//update
app.patch('/todos/:id', authenticate, (req, res)=>{
    const id = req.params.id;
    const body = _.pick(req.body,['text','completed']); //pick up the field that we allows user to update, then if user send _id in request body, we wont and should not upadte it.
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){ //user completed this task
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false,
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body // use set operator to update field
    },{
        new: true // return new instead of return original document, same as returnOriginal
    })
    .then(todo=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(e=>{
        res.status(400).send();
    })
})

app.post('/users',(req, res)=>{

    const body = _.pick(req.body,['email','password']); //pick up the field that we allows user to update, then if user send _id in request body, we wont and should not upadte it.
    const user = new User(body);

    user.save().then(()=>{
        return user.generateAuthToken(); // user without token
    }).then(token=>{
        res.header('x-auth', token).send({user}); // user with token
    }).catch(err=>{
        res.status(400).send(err);
    })
})


// private route which check for auth(x-auth in header) first
app.get('/users/me', authenticate, (req, res)=>{
    const user = req.user;
    res.send({user});
})

// login route
app.post('/users/login', (req, res)=>{
    const body = _.pick(req.body, ['email','password']);
    User.findByCredentials(body.email, body.password).then(user=>{
        return user.generateAuthToken().then(token=>{ // need to chain then in here so we can access both user and token
            res.header('x-auth', token).send({user}); // user with token
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(400).send();
    })
})

app.delete('/users/me/token', authenticate, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },err=>{
        res.status(400).send();
    })
})


app.listen(PORT,()=>{
    console.log(`server start at ${PORT}`);
})

module.exports = {
    app
}