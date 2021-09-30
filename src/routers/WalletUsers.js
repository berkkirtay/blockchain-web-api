const express = require('express');

//const spawn = require('child_process').spawn;
// To enable promises for child processes, we can use await-spawn.
const spawn = require('await-spawn');

const router = express.Router();

const db = require("../database/DatabaseController");
const refreshCurrentUser = require("../services/Services").refreshCurrentUser;

// Users and wallet operations.

router.get('/', async (req, res) => {
    try {
        await db.loadDatabase();
        res.status(200).send(db.getWallets());
    }
    catch (err) {
        res.status(404).send(err);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    var owner = false;
    if (id == req.session.currentUser.name) {
        owner = true
    }
    const wallets = db.getWallets();
    wallets.find((user) => {
        if (user.name === id) {
            res.status(200).send(user);
        }
    });
})

router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    if (id === req.session.currentUser.name) {
        const python = await spawn('python',
            ['../api-scripts/deleteWallet.py', id]);

        console.log("Wallet " + id + " is deleted.");
        res.status(200).send("Wallet " + id + " is deleted.");
    }
    else {
        res.status(404).send("Error! Only owners can delete their wallet!");
    }
})

router.post('/createwallet', async (req, res) => {
    try {
        const publicName = req.body.publicAddress;
        const publicPass = req.body.publicPass;
        const python = await spawn('python',
            ['../api-scripts/createWallet.py', publicName, publicPass]);

        await db.loadDatabase();
        await refreshCurrentUser(publicName, req.session);

        res.status(200).json(python.toString());
        console.log("New wallet created-> " + publicName);
    }
    catch (err) {
        res.status(404).json(err);
        console.log(err);
    }
})

module.exports = router