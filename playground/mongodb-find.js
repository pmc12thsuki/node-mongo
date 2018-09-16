'use strict';

const {MongoClient, ObjectID}  = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{ // specify the db url
    if(err) return console.log(err);
    console.log("Connect to MongoDb server");

    db.collection('Todos').find().toArray() //fetch all
    .then(docs=>{
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch(err=>{
        console.log(err);
    })

    db.collection('Todos').find({completed: false}).toArray() //fetch with condition
    .then(docs=>{
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch(err=>{
        console.log(err);
    })

    db.collection('Todos').find({
        _id: new ObjectID("5b9e456fda4643cacb935618") //_id is not a string but ObjectID object
    }).toArray() //fetch with specify ObjectID
    .then(docs=>{
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch(err=>{
        console.log(err);
    })


    db.collection('Todos').find().count() //count
    .then(count=>{
        console.log(count);
    }).catch(err=>{
        console.log(err);
    })

    // db.close();
})

