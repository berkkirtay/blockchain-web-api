import { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import axios from "axios"
import Users from "./components/users/Users"
import Nav from "./components/Nav"
import User from "./components/users/User"
import Index from "./components/Index"
import Transactions from "./components/transactions/Transactions"
import AddTransaction from "./components/transactions/AddTransaction"
import CreateWallet from "./components/users/CreateWallet"
import BlockchainStatus from "./components/blockchain/BlockchainStatus"
import BlockchainChat from "./components/transactions/BlockchainChat"

import apiUrl from "./ServerInfo"


function App() {
  axios.defaults.withCredentials = true;

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUserState] = useState(undefined);
  const [showTransaction, setShowTransaction] = useState(true);
  const [refresher, setRefresher] = useState(true);

  useEffect(async () => {
    await getUsers();
    checkForSession();
    setRefresher(false);
  }, [refresher])

  const getUsers = async () => {
    await axios.get(apiUrl + '/users')
      .then(response => {
        if (response.status === 200) {
          setUsers(response.data);
        }
        else {
          throw response.status;
        }

      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const checkForSession = () => {
    axios.get(apiUrl + '/checksession')
      .then(response => {
        if (response.status === 200) {
          setCurrentUser(response.data);
        }
        else {
          throw response.data;
        }
      })
      .catch(error => {
        console.log(error);
      })
  }


  const setCurrentUser = (publicAddress) => {
    var user = users.find((user => user.name === publicAddress));
    setCurrentUserState(user);
  }

  const exitUser = () => {
    setCurrentUserState(undefined);
    axios.get(apiUrl + '/exit')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    axios.get(apiUrl + '/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  return (
    <Router>
      <div>
        <Nav currentUser={currentUser} exitUser={exitUser} />

        <Route exact path={['/', '/mywallet']}>
          <Index setCurrentUser={setCurrentUser} currentUser={currentUser} />
        </Route>

        <Switch>
          <Route path='/users/:name'>
            <User users={users} transactions={transactions}
              refresher={() => setRefresher(true)} />
          </Route>

          <Route path='/users'>
            <Users users={users} />
          </Route>

        </Switch>

        <Route path='/transactions'>
          {showTransaction ? <Transactions
            showTransactions={() => setShowTransaction(!showTransaction)}
          />
            :
            <AddTransaction
              currentUser={currentUser}
              showTransactions={() => setShowTransaction(!showTransaction)}
              refresher={() => setRefresher(true)}
            />
          }
        </Route>

        <Route path='/createwallet'>
          <CreateWallet refresher={() => setRefresher(true)}
            currentUser={currentUser} />
        </Route>

        <Route path='/blockchain'>
          <BlockchainStatus />
        </Route>

        <Route path="/chat">
          <BlockchainChat currentUser={currentUser} />
        </Route>

      </div>

      <footer>
        {currentUser !== undefined ?
          <p>Wallet account: {currentUser.name}</p>
          :
          <p>Hey there!</p>
        }
      </footer>
    </Router>
  );
}

export default App;
