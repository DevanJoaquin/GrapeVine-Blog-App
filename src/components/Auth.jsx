import { login, logout, loggedInUserDisplayName } from "../services/authService"
import { auth } from "../firebaseConfig";

export function SignIn() {
  return <button onClick={login}>Sign In</button>
}

export function SignOut() {
  const user = auth.currentUser
  return (
    <div>
      {user && (
        <div className="user-info">
          Hello, {loggedInUserDisplayName()}
          <img
            src = {user.photoURL}
            style = {{ width: 40, height: 40, borderRadius: '50%'}}
          />
          <button className="action-button delete-button" onClick={logout}>Sign Out</button>
        </div>
      )}
    </div>
  ) 
}