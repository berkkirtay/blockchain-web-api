import { useState, useEffect } from "react"
import axios from "axios"

import apiUrl from "../../ServerInfo"

const Transactions = ({ showTransactions }) => {
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
        <>
            {transactions !== undefined ?
                <ul id="transactionList">
                    <button id="transactionButton" onClick={showTransactions}>New transaction</button>
                    <h2>Transaction History</h2>
                    {transactions.slice(0).reverse().map((transaction) =>
                        Number.isInteger(transaction.balance) === true && transaction.source !== "null" && (
                            <li id="transactionBlock" key={transaction._id}>
                                <h4>From <span style={{ color: "red" }}>{transaction.source}
                                </span> to <span style={{ color: "red" }}> {transaction.destination}</span>,
                                    <span style={{ color: "red" }}>Transaction amount: {transaction.balance}</span>
                                    <span style={{ float: "right" }}>Validation Time: {transaction.validationTime}</span>
                                </h4>
                                <h4>Transaction Hash:{transaction.transactionHash}
                                </h4>
                            </li>
                        )
                    )}
                </ul>
                : <p>No transactions</p>}
        </>
    )
}

export default Transactions
