const express = require('express');

//const spawn = require('child_process').spawn;
// To enable promises for child processes, we can use await-spawn.
const spawn = require('await-spawn');

const app = express();

const fetch = require("node-fetch");

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

var path = require('path');

// To keep using html files with ejs engine.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


// Session 
const Session = require('./session');
const currentSession = new Session(app);
currentSession.initializeSession();


// DB

var wallets = [];
var transactionData = [];
var blocks = [];

const db = require('./database');
async function loadDatabase() {
    await db.getData();
    wallets = db.getWallets();
    transactionData = db.getTransactionData();
    blocks = db.getBlocks();
}


async function refreshCurrentUser(publicName, session) {
    if (publicName === "null") {
        session.isUserSpecified = false;
        session.currentUser = 'undefined';
    }
    else {
        await assignUser(publicName, session)
    }
}

async function assignUser(publicName, session) {
    for (var i = 0; i < wallets.length; i++) {
        if (wallets[i].name === publicName) {
            session.isUserSpecified = true;
            session.currentUser = wallets[i];
            return;
        }
    }
}

app.use((req, res, next) => {
    console.log("New Request ");
    console.log('Host name: ' + req.hostname);
    console.log('Request url: ' + req.path);
    console.log('Request http method: ' + req.method);
    console.log(req.session);
    console.log('--------------------------------------');
    next();
})

//Home page

app.get('/', async (req, res) => {
    await loadDatabase();

    var isUserSpecified = currentSession.getUserStatus(req.session);
    var currentUser = currentSession.getCurrentUser(req.session);

    if (isUserSpecified === true) {
        res.render("index", {
            title: "Home", isUserSpecified: true,
            user: currentUser, alert: false
        });
    }
    else if (isUserSpecified === undefined || isUserSpecified === false) {
        refreshCurrentUser("null", req.session);
        res.render("index", {
            title: "Home", isUserSpecified: false,
            user: "undefined", alert: false
        });
    }
})

app.post('/', async (req, res) => {
    const publicName = req.body.wallet.publicName;
    const publicPass = req.body.wallet.publicPass;
    // Handle privatekey!

    await refreshCurrentUser(publicName, req.session);

    var isUserSpecified = currentSession.getUserStatus(req.session);
    var currentUser = currentSession.getCurrentUser(req.session);

    if (isUserSpecified === false) {
        return res.render("index", {
            title: "Home", isUserSpecified,
            user: currentUser, alert: true
        });
    }
    else {
        return res.redirect('/users');
    }
})

// Users and wallet operations.

app.get('/createWallet', (req, res) => {
    var currentUser = currentSession.getCurrentUser(req.session);
    res.render("createWallet", {
        title: "Create wallet",
        isUserSpecified: false, user: currentUser
    });
})

app.post('/createWallet', async (req, res) => {
    const publicName = req.body.createWallet.publicName;
    const publicPass = req.body.createWallet.publicPass;
    const python = await spawn('python',
        ['../api-scripts/createWallet.py', publicName, publicPass]);

    console.log("New wallet created-> " + publicName);

    await loadDatabase();
    await refreshCurrentUser(publicName, req.session);

    res.redirect('/');
})

app.get('/users', async (req, res) => {
    var isUserSpecified = currentSession.getUserStatus(req.session);
    var currentUser = currentSession.getCurrentUser(req.session);

    await loadDatabase();

    res.render("users", {
        title: "Users", users: wallets,
        isUserSpecified, user: currentUser
    });
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    wallets.find((user) => {
        if (user.name === id) {
            return res.render('users', {
                title: id, users: [], user: user,
                isUserSpecified: currentSession.getUserStatus(req.session)
            });
        }
    });
})

app.get('/users/:id/delete', async (req, res) => {
    const id = req.params.id;
    const python = await spawn('python',
        ['../api-scripts/deleteWallet.py', id]);
    console.log("Wallet " + id + " is deleted.");
    res.redirect('/users');
})

app.get('/exit', (req, res) => {
    currentSession.destroy(req.session);
    res.redirect('/');
})

//Transactions
app.get('/transactions', async (req, res) => {
    var isUserSpecified = currentSession.getUserStatus(req.session);
    var currentUser = currentSession.getCurrentUser(req.session);

    if (isUserSpecified) {
        await loadDatabase();
        await refreshCurrentUser(currentUser.name, req.session);
        res.render("transactions", {
            title: "Transactions", isUserSpecified,
            user: currentUser, transactions: transactionData
        });
    }
    else {
        res.redirect("/");
    }
})

app.post('/transactions', async (req, res) => {
    const publicAddress = req.body.transactions.publicAddress;
    const coinAmount = req.body.transactions.coinAmount;

    var currentUser = currentSession.getCurrentUser(req.session);

    const python = await spawn('python',
        ['../api-scripts/handleTransaction.py', currentUser.name, publicAddress, coinAmount]);

    /* python.stdout.on('data', function (data) {
        console.log(data.toString());
    })*/
    res.redirect('/transactions');
})

// Requests about blockchain status/demonstration.

app.get('/blockchain', async (req, res) => {
    var isUserSpecified = currentSession.getUserStatus(req.session);
    var currentUser = currentSession.getCurrentUser(req.session);

    await loadDatabase();
    await refreshCurrentUser(currentUser.name, req.session);

    res.render("blockchainStatus", {
        title: "Blockchain",
        isUserSpecified, user: currentUser, blocks: blocks
    });
})

app.get('/transactionTest', async (req, res) => {
    const python = await spawn('python',
        ['../api-scripts/transactionTest.py']);
    console.log("Test is completed.");
    res.redirect('/');

})

app.get('/chat', async (req, res) => {
    var isUserSpecified = currentSession.getUserStatus(req.session);
    var currentUser = currentSession.getCurrentUser(req.session);

    await loadDatabase();
    await refreshCurrentUser(currentUser.name, req.session);

    res.render("blockchainChat", {
        title: "Chat", isUserSpecified,
        user: currentUser, transactions: transactionData
    });
})

app.post('/chat', async (req, res) => {
    var currentUser = currentSession.getCurrentUser(req.session);
    const textToBeSent = req.body.newMessage;
    if (currentUser === "undefined") {
        return res.redirect('/chat');
    }
    const python = await spawn('python',
        ['../api-scripts/handleChat.py', currentUser.name, textToBeSent]);

    await loadDatabase();
    res.redirect('/chat');
})

// If server receives an undefined request, it will return a 404 error.
app.use('/', (req, res) => {
    return res.status(404).render("404",
        { title: "404", user: "undefined", isUserSpecified: false });
})

app.listen(8000, () => {
    console.log('Listening')
});
