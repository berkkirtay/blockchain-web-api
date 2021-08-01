const mongoose = require('mongoose');
const mocha = require('mocha');
const assert = require('assert');


const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("Connection has been made.");
    })
    .catch((error => {
        console.log(error);
    }));

const users = new Schema({
    name: String,
    balance: Number,
    hashValue: String
});

const database = mongoose.model('credential', users);

module.exports = database;


