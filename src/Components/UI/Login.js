import { signInAnonymously, signOut } from "firebase/auth";
import { child, remove, set } from "firebase/database";
import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { auth, onlineUsersRef } from "../../modules/firebase-config";
import { myRoomRef } from "../../store/GameState";
import Modal from "./Modal";

const Login = () => {
   const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
   const [loggingIn, setLoggingIn] = useState(false);
   const [usernameInput, setUsernameInput] = useState("");
   const [showError, setShowError] = useState(false);
   const loginHandler = async (event) => {
      event.preventDefault();
      if (usernameInput.trim().length === 0) {
         setShowError(true);
      } else {
         await signInAnonymously(auth);
         set(child(onlineUsersRef, auth.currentUser.uid), {
            username: usernameInput,
            inRoom: false,
         });
         setUsernameInput("");
         setLoggingIn(false)
         setShowError(false);
      }
   };

   const logoutHandler = async () => {
      remove(child(onlineUsersRef, auth.currentUser.uid));
      if (myRoomRef) {
         remove(myRoomRef);
      }

      signOut(auth);
   };

   const errorMessage = <p>Invalid Username</p>;

   if (!isLoggedIn) {
      return (
         <Fragment>
            <button onClick = {()=>{setLoggingIn(true)}}>Login</button>
            {loggingIn && (
               <Modal onClick = {()=>{setLoggingIn(false)}}>
                  <form onSubmit={loginHandler}>
                     <label id="name">Username: </label>
                     <input
                        id="name"
                        value={usernameInput}
                        onChange={(event) => {
                           setUsernameInput(event.target.value);
                        }}
                     ></input>

                     <button>Login</button>
                     {showError && errorMessage}
                  </form>
               </Modal>
            )}
         </Fragment>
      );
   } else {
      return <button onClick={logoutHandler}>Logout</button>;
   }
};
export default memo(Login);
