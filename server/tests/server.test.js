'use strict';
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:ids',()=>{
    it('should update a todo',(done)=>{
        const id = todos[0]._id.toHexString();
        const text = 'update in test';
        request(app)
        .patch(`/todos/${id}`)
        .send({text, completed: true})
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    })

    it('should clear completedAt when task not completed',done=>{
        const id = todos[1]._id.toHexString();
        const text = 'update in test';
        request(app)
        .patch(`/todos/${id}`)
        .send({text, completed: false})
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    })
});

describe('GET /users/me',()=>{
    it('should return user if authenticated', done=>{
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token) // set headers
        .expect(200)
        .expect(res=>{
            expect(res.body.user._id).toBe(users[0]._id.toHexString());
            expect(res.body.user.email).toBe(users[0].email);
        })
        .end(done);
    })

    it('should return 402 if not authenticated', done=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect(res=>{
            expect(res.body).toEqual({}); // send an empty object back
        })
        .end(done);
    })
})

describe('POST /users', ()=>{
    const user = {email:'test@gmail.com', password: 'testUser'}
    it('should create a user', done=>{
        request(app)
        .post('/users')
        .send(user)
        .expect(200)
        .expect(res=>{
            expect(res.headers['x-auth']).toExist(); // check auth exist in header
            expect(res.body.user._id).toExist();
            expect(res.body.user.email).toBe(user.email);
        })
        .end((err, res)=>{
            if(err) return done(err);

            User.findOne({email: user.email}).then(result_user=>{
                expect(result_user).toExist();
                expect(result_user.password).toNotBe(user.password); // because we hashed the password
                done();
            })
        })
    })

    it('should return validation errors if request invalid', done=>{
        const user = {email:'123', password:"test"};
        request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end(done);
    })

    it('should not create user if email in use', done=>{
        const user = {email:users[0].email, password:'testUser'};
        request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end(done);
    })
})