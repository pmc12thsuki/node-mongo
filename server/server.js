'use strict';

require('./config/config');

const express = require('express');
const bodyParser = require('body-parser'); //take json into object, attach on request object
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
    const todo = new Todo({
        text: req.body.text // req.body is save by bodyParser
    })
    todo.save().then(todo=>{
        res.send({todo});
    },e =>{
        res.status(400).send(e);
    })
})

app.get('/todos',(req, res)=>{
    Todo.find().then(todos=>{
        res.send({todos}); // send result back in object
    },e=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){ // valid id
        return res.status(404).send();
    }
    Todo.findById(id).then(todo=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    },error=>{
        res.status(400).send();
    })
})

app.delete('/todos/:id', (req, res)=>{
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then(todo=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, e=>{
        res.status(400).send();
    })
})

//update
app.patch('/todos/:id', (req, res)=>{
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

    Todo.findByIdAndUpdate(id, {
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



app.listen(PORT,()=>{
    console.log(`server start at ${PORT}`);
})

module.exports = {
    app
}