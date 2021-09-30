import { useState } from "react"
import { Redirect } from 'react-router-dom'
import axios from "axios"

import apiUrl from "../ServerInfo"

const Index = ({ setCurrentUser, currentUser }) => {

    const [publicAddress, setPublicAddress] = useState('')
    const [publicPass, setPublicPass] = useState('')

    const userLogin = (wallet) => {
        axios.post(apiUrl + '/login', {
            publicAddress: wallet.publicAddress,
            publicPass: wallet.publicPass
        })
            .then(function (response) {
                if (response.data) {
                    setCurrentUser(wallet.publicAddress);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        userLogin({ publicAddress, publicPass });
        setPublicAddress('');
        setPublicPass('');
    }
    if (currentUser === undefined)
        return (
            <div id="createWallet">
                <h2>Enter your wallet credentials:</h2>
                <form onSubmit={onSubmit}>
                    <label>Public key:</label>
                    <input type="text" required
                        value={publicAddress} onChange={(e) => setPublicAddress(e.target.value)} />
                    <label>Private key:</label>
                    <input type="text" required value={publicPass} onChange={(e) => setPublicPass(e.target.value)} />
                    <button>Submit</button>
                </form>
            </div>
        )
    else
        return (
            <Redirect to={"/users/" + currentUser.name} />
        )
}

export default Index
