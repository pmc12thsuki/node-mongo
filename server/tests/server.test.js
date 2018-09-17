'use strict';
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos =[{
    _id: new ObjectID(),
    text: 'first todo'
},{
    _id: new ObjectID(),
    text: 'second todo'
}];


beforeEach((done)=>{ //setup environment (default db) before test 
    Todo.remove({}).then(()=> { // clear our db, remove all documents in Todo collection
        return Todo.insertMany(todos); // add default todos
    }).then(()=>done()) 
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
            expect(res.body.todo.text).toBe(text); // check response correct
        })
        .end((err, res)=>{  //not end yet, need to check db
            if(err) return done(err);

            //then check db operation is correct
            Todo.find({text}).then((todos)=>{
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
                expect(todos.length).toBe(2);
                done();
            }).catch(e=>{
                done(e);
            })
        })
    })
});


describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect(res=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    })
})

describe('GET /todos/:id', ()=>{
    it('should return todo doc', done=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    })

    it('should return 404 if todo not found', (done)=>{
        const id = new ObjectID();
        request(app)
        .get(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done);
    })

    it('should return 404 if invalid', (done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    })

})


describe('DELETE /todos/:id', ()=>{
    it('should remove a todo',(done)=>{
        const hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,result)=>{
            if(err){
                return done(err)
            }

            Todo.findById(hexId).then(todo=>{
                expect(todo).toNotExist(); // has been delete
                done();
            }).catch(err=> done(err))
        })
    })

    it('should return 404 if todo not found', (done)=>{
        const id = new ObjectID();
        request(app)
        .delete(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done);
    })

    it('should return 404 if object id is invalid',done=>{
        request(app)
        .delete(`/todos/1234`)
        .expect(404)
        .end(done);
    })
})