'use strict';

const {MongoClient, ObjectID}  = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{ // specify the db url
    if(err) return console.log(err);
    console.log("Connect to MongoDb server");

    //deleteMany
    db.collection('Todos').deleteMany({text:'feed coddee'})
    .then(result=>{
        console.log(result);
    }).catch(err=>{
        console.log(err);
    })

    //deleteOne
    db.collection('Todos').deleteOne({text:'feed coddee'})
    .then(result=>{
        console.log(result);
    }).catch(err=>{
        console.log(err);
    })

    //most useful
    //findOneAndDelete 
    db.collection('Todos').findOneAndDelete({completed: false})
    .then(result=>{
        console.log(result);
    }).catch(err=>{
        console.log(err);
    })

    // db.close();
})

