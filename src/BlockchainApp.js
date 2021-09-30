const services = require("./services/Services");
const app = services.app;

const walletUsers = require('./routers/WalletUsers');
const transactions = require('./routers/Transactions');
const userAuth = require('./routers/userAuth');
const blockchain = require('./routers/Blockchain');
const blockchainChat = require('./routers/BlockchainChat');


const apiUrl = "/blockchain-api/v1";

app.use(apiUrl + '/users', walletUsers);
app.use(apiUrl + '/transactions', transactions);
app.use(apiUrl + '/blockchain', blockchain);
app.use(apiUrl + '/chat', blockchainChat);
app.use(apiUrl + '/', userAuth);

// If server receives an undefined request, it will return a 404 error.

app.use('/', (req, res) => {
    return res.status(404).send("The requested url does not exist!")
})

app.listen(8000, () => {
    console.log('Listening on :8000')
});
