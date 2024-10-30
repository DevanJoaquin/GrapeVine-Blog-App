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
        <>
          Hello, {loggedInUserDisplayName()}
          <img
            src = {user.photoURL}
            style = {{ width: 30, height: 30, borderRadius: '50%'}}
          />
        </>
      )}
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}