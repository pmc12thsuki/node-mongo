'use strict';

const express = require('express');
const bodyParser = require('body-parser'); //take json into object, attach on request object
const {ObjectID} = require('mongodb');
const PORT = process.env.PORT || 3000 ;

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
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



app.listen(PORT,()=>{
    console.log(`server start at ${PORT}`);
})

module.exports = {
    app
}