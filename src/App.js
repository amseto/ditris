import { onAuthStateChanged } from "@firebase/auth";
import { off, remove} from "@firebase/database";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import KeyBindings from "./Components/KeyBindings/KeyBindings";
import { auth } from "./modules/firebase-config";
import SinglePlayer from "./Pages/SinglePlayer";
import TwoPlayer from "./Pages/TwoPlayer";
import { gameStateActions } from "./store/GameState";
import { gameStateActions2, myRoomRef } from "./store/GameState2";
import { opponentRef, userInfoActions } from "./store/UserInfo";
import NavigationBar from "./Components/UI/NavigationBar";

const App = () => {
   const dispatch = useDispatch();
   const [page, setPage] = useState(<SinglePlayer></SinglePlayer>);
   const [showKeyBindings,setShowKeyBindings] = useState(false)
   const changePageHandler = (pageName) => {
      if (pageName === "singleplayer") {
         dispatch(gameStateActions.reset());
         setPage(<SinglePlayer></SinglePlayer>);
      } else if (pageName === "two-player") {
         if(myRoomRef){
            remove(myRoomRef)
         }
         dispatch(gameStateActions2.reset())
         setPage(<TwoPlayer></TwoPlayer>);
      }
   };

   onAuthStateChanged(auth, (user) => {
      if (user) {
         dispatch(userInfoActions.login());
         dispatch(userInfoActions.reset())
         dispatch(userInfoActions.setRoomStatus("looking for room"))

      } else {
         dispatch(userInfoActions.logout());
         if(opponentRef){
            off(opponentRef)
         }
         dispatch(userInfoActions.reset())
      }
   });




   return (
      <React.Fragment>
         <NavigationBar setPage={changePageHandler} setShowKeyBindings={setShowKeyBindings}></NavigationBar>
         {page}
         {showKeyBindings&&<KeyBindings setShowKeyBindings={setShowKeyBindings}></KeyBindings>}
      </React.Fragment>
   );
};
export default App;
