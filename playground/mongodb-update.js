'use strict';

const {MongoClient, ObjectID}  = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{ // specify the db url
    if(err) return console.log(err);
    console.log("Connect to MongoDb server");

    // findOneAndUpdate
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5b9e456fda4643cacb935618")
    },{
        $set:{ // need this update operators
            completed: false
        }
    },{
        returnOriginal: false // return the update one, not the original one
    }).then(result=>{
        console.log(result);
    })


    // findOneAndUpdate
    db.collection('Users').findOneAndUpdate({
        name: 'suki'
    },{
        $set:{ // need this update operators
            name: 'coffee'
        },
        $inc: {
            age: 3
        }
    },{
        returnOriginal: false // return the update one, not the original one
    }).then(result=>{
        console.log(result);
    })



    // db.close();
})

