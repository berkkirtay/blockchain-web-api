const express = require('express');

const db = require("../database/DatabaseController");

const router = express.Router();

// Requests about blockchain status/demonstration.

router.get('/', async (req, res) => {
    try {
        await db.loadDatabase();
        res.status(200).send(db.getBlocks());
    }
    catch (err) {
        res.status(404).send(err);
    }
})

module.exports = router;