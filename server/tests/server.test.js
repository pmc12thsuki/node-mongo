'use strict';
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done)=>{ //setup environment before test , eg: clear our db
    Todo.remove({}).then(()=> done()); // remove all documents in Todo collection
})

describe('Post /todos',()=>{
    it('should create a new todo',(done)=>{
        const text = 'Test todo text';
        // first check http response is correct
        request(app)
        .post('/todos')
        .send({text}) //send data for post request
        .expect(200) //check status code correct
        .expect((res)=>{
            expect(res.body.text).toBe(text); // check response correct
        })
        .end((err, res)=>{  //not end yet, need to check db
            if(err) return done(err);

            //then check db operation is correct
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text); //check database correct
                done();
            }).catch(e=>done(e));
        })
    })




    it('should not create todo with invalid body data',(done)=>{

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if (err) return done(err);

            Todo.find().then(todos=>{
                expect(todos.length).toBe(0);
                done();
            }).catch(e=>{
                done(e);
            })
        })
    })
});