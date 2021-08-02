const mocha = require('mocha');
const assert = require('assert');
const Database = require('./database');


describe('some demo tests', function () {

    var char;

    beforeEach((done) => {
        char = new Database(
            { name: 'berk', balance: 100, hashValue: "asfaffbasd" }
        );

        char.save().then(() => {
            assert(char.isNew === false);
            done();
        });
    });

    it('Find a record', (done) => {
        Database.findOne({ name: 'berk' }).then((result) => {
            console.log("record is found: " + result);
            assert(result.name === 'berk');
            done();

        }).catch(done);
    })

});