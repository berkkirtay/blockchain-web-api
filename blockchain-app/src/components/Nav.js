import { Link } from 'react-router-dom'

const Nav = ({ currentUser, exitUser }) => {
    return (
        <div>
            <nav>
                <ul className="nav">
                    <li className="nav"><Link to="/">Home</Link></li>
                    {currentUser === undefined ?
                        <li id="createWalletButton"><Link to="/createwallet">Create Wallet</Link></li>
                        :
                        <li id="createWalletButton"><Link to="/mywallet">My Wallet</Link></li>
                    }
                    <li className="nav"><Link to="/users">Users</Link></li>
                    <li className="nav"><Link to="/transactions">Transactions</Link></li>
                    <li className="nav"><Link to="/chat">Blockchain Chat</Link></li>
                    <li className="nav"><Link to="/blockchain">Blockchain Status</Link></li>
                    {currentUser &&
                        <li id="exitButton" onClick={exitUser}><Link to="/">Log Out</Link></li>}
                </ul>
            </nav>
        </div>
    )
}

export default Nav
