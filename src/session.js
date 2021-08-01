const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connection = mongoose.createConnection(
    'mongodb://localhost/testSession', { useNewUrlParser: true, useUnifiedTopology: true });

const store = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions',
    mongoUrl: 'mongodb://localhost/testSession'
})

class Session {
    constructor(app) {
        this.app = app;
    }

    initializeSession() {
        this.app.use(session({
            secret: "session",
            resave: false,
            saveUninitialized: false,
            store: store,
            cookie: {
                maxAge: 60 * 10000000
            }
        }))
    }

    /**
    * @param {req.session} currentSession
    * @param {boolean} currentSession.isUserSpecified
    */

    getCurrentUser(currentSession) {
        return currentSession.currentUser;
    }

    getUserStatus(currentSession) {
        return currentSession.isUserSpecified
    }

    destroy(currentSession) {
        currentSession.destroy();
    }
}


module.exports = Session;