const express = require('express');
const spawn = require('await-spawn');

const router = express.Router();

const db = require("../database/DatabaseController");


router.get('/', async (req, res) => {
    try {
        await db.loadDatabase();
        res.status(200).send(db.getTransactionData());
    }
    catch (err) {
        res.status(404).send(err);
    }
})

router.post('/', async (req, res) => {
    try {
        const publicAddress = req.body.publicAddress;
        const coinAmount = req.body.coinAmount;

        if (req.session.currentUser === undefined) {
            throw "undefined user";
        }

        const python = await spawn('python',
            ['../api-scripts/handleTransaction.py', req.session.currentUser.name, publicAddress, coinAmount]);
        res.status(200).send();
    }
    catch (err) {
        res.status(404).send(err);
    }
})

router.get('/test', async (req, res) => {
    const python = await spawn('python',
        ['../api-scripts/transactionTest.py']);
    console.log("Test is completed.");
})

module.exports = router