const express = require('express');

const db = require("../database/DatabaseController");

const services = require("../services/Services");
const refreshCurrentUser = services.refreshCurrentUser;
const currentSession = services.currentSession;

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        await db.loadDatabase();
        const publicName = req.body.publicAddress;
        const publicPass = req.body.publicPass;
        // Handle privatekey!
        await refreshCurrentUser(publicName, req.session);

        res.status(200).send(req.session.isUserSpecified);
    }
    catch (err) {
        res.status(404).send(err);
    }

})

router.get('/checksession', (req, res) => {
    try {
        if (req.session.isUserSpecified === true) {
            res.status(200).send(req.session.currentUser.name);
            console.log("Session data is sent.");
        }
        else {
            console.log("Undefined session error!");
            throw "Undefined session error!";
        }
    }
    catch (err) {
        res.status(404).send(err);
    }
})

router.get('/exit', (req, res) => {
    try {
        currentSession.destroy(req.session);
        res.send("Session is ended");
    }
    catch (err) {
        res.status(404).send(err);
    }
})

module.exports = router;
