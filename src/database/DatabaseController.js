var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/test";


var wallets = [];
var transactionData = [];
var blocks = [];

function loadDatabase() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject("err");
            var database = db.db("BlockchainWebServer");

            database.collection("UsersCollection").find({}).toArray((err, result) => {
                if (err) reject(err);
                wallets = result;
            });

            database.collection("transactionsCollection").find({}).toArray((err, result) => {
                if (err) reject(err);
                transactionData = result;
            });

            database.collection("BlocksCollection").find({}).toArray((err, result) => {
                if (err) reject(err);
                blocks = result;
                db.close();
                resolve(result);
            });
        });
    })

}

module.exports = {
    loadDatabase: async function getData() {
        await loadDatabase()
            .then((result) => console.log("DB load is successful."))
            .catch((err) => console.log(err));
    },
    getWallets: function getWallets() {
        return wallets;
    },
    getTransactionData: function getTransactionData() {
        return transactionData;
    },
    getBlocks: function getBlocks() {
        return blocks;
    }
}
