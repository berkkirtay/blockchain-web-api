import { Link } from "react-router-dom"

const Users = ({ users }) => {
    return (
        <div id="usersList">
            <h1>Users</h1>
            <ul className="userList">
                {users.map((user) => (
                    <Link to={`/users/${user.name}`} key={user._id}><li className="userList">
                        {user.name}
                    </li></Link>
                ))}
            </ul>
        </div >
    )
}

export default Users
