import { useState, useEffect } from "react"
import axios from "axios"

import apiUrl from "../../ServerInfo"

const BlockchainChat = ({ currentUser }) => {
    const [chatTransactions, setChatTransactions] = useState([])
    const [newTransactionCount, setNewTransactionCount] = useState(true);

    const getTransactions = () => {
        axios.get(apiUrl + '/transactions')
            .then(response => {
                setChatTransactions(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {
        getTransactions();
        setNewTransactionCount(false);
    }, [newTransactionCount]);

    const [balance, setBalance] = useState('')

    const newTransaction = (transaction) => {
        axios.post(apiUrl + '/chat', {
            balance: transaction.balance
        })
            .then(function (response) {
                if (response.status === 200) {
                    setNewTransactionCount(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        newTransaction({ balance });
        setBalance('');
    }


    return (
        <div id="chatParent">
            <h2>New Message on Blockchain</h2>
            {currentUser !== undefined ?
                <form className="newTransaction" onSubmit={onSubmit}>
                    <label>Your Message</label>
                    <input type="text" name="newMessage" required
                        value={balance} onChange={(e) => setBalance(e.target.value)} />
                    <button id="transactionButton" style={{ marginRight: "20px" }}>Send</button>
                </form>
                :
                <p>To send a new message, you need to log into your wallet account.</p>
            }
            <h2>Messages on Blockchain</h2>
            <ul id="transactionList">
                {chatTransactions.slice(0).reverse().map((transaction) =>
                    Number.isInteger(transaction.balance) === false && (
                        <li id="transactionBlock" key={transaction._id}>
                            <h4><span style={{ color: "black" }}>
                                {transaction.source} says:
                            </span> <span style={{ color: "red" }}>
                                    {transaction.balance}
                                </span>
                                <span style={{ float: "right" }}> Validation Time: {transaction.validationTime}
                                </span>
                            </h4>
                            <h4>Transaction Hash: {transaction.transactionHash}
                            </h4>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default BlockchainChat
