import { signInAnonymously, signOut } from "firebase/auth";
import { child, remove, set } from "firebase/database";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { auth, onlineUsersRef } from "../../modules/firebase-config";
import { myRoomRef } from "../../store/GameState";


const Login = () => {
   const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
   const [usernameInput, setUsernameInput] = useState("");
   const loginHandler = async (event) => {
      event.preventDefault();
      await signInAnonymously(auth);
      set(child(onlineUsersRef, auth.currentUser.uid), {username:usernameInput,inRoom:false});
      setUsernameInput("");

   };

   const logoutHandler = async () => {
      remove(child(onlineUsersRef, auth.currentUser.uid));
      if(myRoomRef){
         remove(myRoomRef)
      }
      
      signOut(auth);
   };

   if (!isLoggedIn) {
      return (
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
         </form>
      );
   } else {
      return <button onClick={logoutHandler}>Logout</button>;
   }
};
export default memo(Login);
