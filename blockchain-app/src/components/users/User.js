import { useParams } from "react-router-dom"
import { useEffect } from "react"

const User = ({ users, transactions, refresher }) => {
    useEffect(() => {
        refresher();
    }, [])

    const { name } = useParams();
    const user = users.find((user => user.name === name))
    var transactionFlag = false;

    if (user !== undefined)
        return (
            <div id="userInformation">
                <h1>User Wallet: {user.name}</h1>
                <h3>Balance: {user.balance}</h3>
                <h3>Public Key: {user.publicAddress}</h3>
                <h3>Private Key: {user.privateAddress}</h3>
                <ul id="transactionList">
                    <h1>User Transactions:</h1>
                    {transactions.slice(0).reverse().map((transaction) =>
                        Number.isInteger(transaction.balance) === true && transaction.source !== "null" && (transaction.source === user.name || transaction.destination === user.name) && (
                            <li id="transactionBlock" key={transaction._id}>
                                <h4>From <span style={{ color: "red" }}>{transaction.source}
                                </span> to <span style={{ color: "red" }}> {transaction.destination}</span>,
                                    <span style={{ color: "red" }}>Transaction amount: {transaction.balance}</span>
                                    <span style={{ float: "right" }}>Validation Time: {transaction.validationTime}</span>
                                </h4>
                                <h4>Transaction Hash:{transaction.transactionHash}
                                </h4>
                                {transactionFlag = true}
                            </li>
                        )
                    )}

                </ul>
                {transactionFlag === false &&
                    <h3>This user does not have any transaction.</h3>
                }
            </div>
        )
    else
        return (<></>)

}

export default User
