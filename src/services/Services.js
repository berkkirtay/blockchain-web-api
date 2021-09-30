const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cross-origin resource sharing

const cors = require("cors");
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// DB

const db = require("../database/DatabaseController");

// Session 

const Session = require('../database/Session');
const currentSession = new Session(app);
currentSession.initializeSession();

async function refreshCurrentUser(publicName, session) {
    if (publicName === "null" || publicName === undefined || publicName === "") {
        session.isUserSpecified = false;
        session.currentUser = 'undefined';
    }
    else {
        await assignUser(publicName, session)
    }
}

async function assignUser(publicName, session) {
    const wallets = db.getWallets();
    for (var i = 0; i < wallets.length; i++) {
        if (wallets[i].name === publicName) {
            session.isUserSpecified = true;
            session.currentUser = wallets[i];
            return;
        }
    }
}

// Middleware for client requests

app.use(async (req, res, next) => {
    console.log("New Request ");
    console.log('Host name: ' + req.hostname);
    console.log('Request url: ' + req.path);
    console.log('Request http method: ' + req.method);
    console.log(req.session);
    console.log('--------------------------------------');
    next();
})

module.exports = {
    app: app,
    refreshCurrentUser: refreshCurrentUser,
    currentSession: currentSession
} 