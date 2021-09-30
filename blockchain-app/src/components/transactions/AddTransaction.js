import { useState } from "react"
import { Redirect } from 'react-router-dom'
import axios from "axios"

import apiUrl from "../../ServerInfo"

const AddTransaction = ({ currentUser, showTransactions, refresher }) => {
    const [publicAddress, setPublicAddress] = useState('')
    const [coinAmount, setCoinAmount] = useState(0)

    const newTransaction = (transaction) => {
        axios.post(apiUrl + '/transactions', {
            publicAddress: transaction.publicAddress,
            coinAmount: transaction.coinAmount
        })
            .then(function (response) {
                //   showTransactions();
                if (response.status === 200) {
                    refresher();
                    // alert("Transaction is carried out.");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        newTransaction({ publicAddress, coinAmount });
        setPublicAddress('');
        setCoinAmount(0);
    }

    if (currentUser !== undefined)
        return (
            <div>
                <button id="transactionButton" onClick={showTransactions}>Show Transactions</button>
                <div id="newTransaction">
                    <h2>New Transaction</h2>
                    <h2>Your balance({currentUser.name}): {currentUser.balance} coins</h2>

                    <form className="newTransaction" onSubmit={onSubmit}>
                        <label>Public address:</label>
                        <input type="text" className="newTransaction" required
                            value={publicAddress} onChange={(e) => setPublicAddress(e.target.value)} />
                        <label>Coin Amount</label>
                        <input type="number" className="newTransaction" required
                            value={coinAmount} onChange={(e) => setCoinAmount(e.target.value)} />
                        <button id="transactionButton" style={{ float: "left" }}>Send</button>
                    </form>
                </div >
            </div>
        )
    else
        return (<Redirect to='/' />)
}

export default AddTransaction
