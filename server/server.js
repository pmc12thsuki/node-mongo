'use strict';

const express = require('express');
const bodyParser = require('body-parser'); //take json into object, attach on request object

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
    const todo = new Todo({
        text: req.body.text // req.body is save by bodyParser
    })
    todo.save().then(result=>{
        res.send(result);
    },e =>{
        res.status(400).send(e);
    })
})



app.listen(3000,()=>{
    console.log('server start');
})