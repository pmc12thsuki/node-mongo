'use strict';

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID}  = require('mongodb');


// dont need to create 'TodoApp' db first, mongo will auto add this db if we add data into it
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{ // specify the db url
    if(err) return console.log(err);
    console.log("Connect to MongoDb server");

    // add a collection and insert a document into this collection in TodoApp db
    db.collection('Todos').insertOne({
        text: "Something",
        completed: false
    }, (err, result)=>{
        if(err) return console.log(err);
        console.log(JSON.stringify(result.ops, undefined, 2)) // result.ops is the document we insert
    });


    db.collection('Users').insertOne({
        name: 'suki',
        age: 23,
        location: 'Taipei'
    }, (err, result)=>{
        if(err) return console.log(err);
        console.log(JSON.stringify(result.ops, undefined, 2)) // result.ops is the document we insert
    });

    db.close();
})

