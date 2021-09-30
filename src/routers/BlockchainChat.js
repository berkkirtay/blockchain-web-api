const express = require('express');

const db = require("../database/DatabaseController");

const services = require("../services/Services");
const refreshCurrentUser = services.refreshCurrentUser;

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await db.loadDatabase();
        await refreshCurrentUser(req.session.currentUser.name, req.session);
        res.status(200).send(db.getTransactionData());
    }
    catch (err) {
        res.status(404).send(err);
    }

})

router.post('/', async (req, res) => {
    try {
        const textToBeSent = req.body.balance;

        if (req.session.currentUser === undefined) {
            throw "undefined user";
        }

        const python = await spawn('python',
            ['../api-scripts/handleChat.py', req.session.currentUser.name, textToBeSent]);

        res.status(200).send();
    }
    catch (err) {
        res.status(404).send(err);
    }
})



module.exports = router;
