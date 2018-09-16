'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // default use callback
mongoose.connect('mongodb://localhost:27017/TodoApp'); // not need to write operation in callback, mongoose will wait for connection complete

module.exports = {
    mongoose
}