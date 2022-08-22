import { onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import { child, remove, set } from "firebase/database";
import { Fragment, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, onlineUsersRef } from "../../modules/firebase-config";
import { myRoomRef } from "../../store/GameState2";
import Modal from "./Modal";

import styles from "./Login.module.css";

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
         await set(child(onlineUsersRef, auth.currentUser.uid), {
            username: usernameInput,
            inRoom: false,
         });
         setUsernameInput("");
         setShowError(false);
      }
   };

   const logoutHandler = async () => {
      setLoggingIn(false);
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
            <li
               className={styles["login"]}
               onClick={() => {
                  setLoggingIn(true);
               }}
            >
               Login
            </li>
            {loggingIn && (
               <Modal
                  onClick={() => {
                     setLoggingIn(false);
                  }}
               >
                  <form className={styles["login"]} onSubmit={loginHandler}>
                     <label htmlFor="name">Username: </label>
                     <input
                        id="name"
                        value={usernameInput}
                        onChange={(event) => {
                           setUsernameInput(event.target.value);
                        }}
                     ></input>

                     <button>Login</button>
                  </form>
                  {showError && <div className={styles["error-text"]}>{errorMessage}</div>}
               </Modal>
            )}
         </Fragment>
      );
   } else {
      return (
         <li className={styles["login"]} onClick={logoutHandler}>
            Logout
         </li>
      );
   }
};
export default memo(Login);
