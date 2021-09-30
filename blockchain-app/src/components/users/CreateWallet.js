import { useState } from "react"
import { Redirect } from 'react-router-dom'
import axios from "axios"

import apiUrl from "../../ServerInfo"

const CreateWallet = ({ refresher, currentUser }) => {
    const [publicAddress, setPublicAddress] = useState('')
    const [publicPass, setPublicPass] = useState('')

    axios.defaults.withCredentials = true;
    const createWallet = async (wallet) => {
        await axios.post(apiUrl + '/users/createwallet', {
            publicAddress: wallet.publicAddress,
            publicPass: wallet.publicPass
        })
            .then(function (response) {
                console.log(response.data);
                refresher();
                alert(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        createWallet({ publicAddress, publicPass });
        setPublicAddress('');
        setPublicPass('');
    }


    if (currentUser !== undefined) {
        return (
            <Redirect to='/' />
        )
    }
    else {
        return (
            <div id="createWallet">
                <h2>Create a new Wallet</h2>
                <form onSubmit={onSubmit}>
                    <label>Public name:</label>
                    <input type="text" required
                        value={publicAddress} onChange={(e) => setPublicAddress(e.target.value)} />
                    <label>Public password:</label>
                    <input type="text" required value={publicPass} onChange={(e) => setPublicPass(e.target.value)} />
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}

export default CreateWallet
