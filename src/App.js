import { onAuthStateChanged } from "@firebase/auth";
import { child, get, onChildAdded, onChildRemoved, onValue } from "@firebase/database";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, onlineUsersRef, roomsRef } from "./modules/firebase-config";
import SinglePlayer from "./Pages/SinglePlayer";
import TwoPlayer from "./Pages/TwoPlayer";
import { gameStateActions } from "./store/GameState";
import { userInfoActions } from "./store/UserInfo";
import NavigationBar from "./UI/NavigationBar";

const App = () => {
   const dispatch = useDispatch();
   const [page, setPage] = useState(<SinglePlayer></SinglePlayer>);
   const changePageHandler = (pageName) => {
      dispatch(gameStateActions.reset());
      if (pageName === "singleplayer") {
         setPage(<SinglePlayer></SinglePlayer>);
      } else if (pageName === "two-player") {
         setPage(<TwoPlayer></TwoPlayer>);
      }
   };

   onAuthStateChanged(auth, (user) => {
      if (user) {
         dispatch(userInfoActions.login());
         dispatch(userInfoActions.setRoomStatus("looking for room"));
      } else {
         dispatch(userInfoActions.logout());
         dispatch(userInfoActions.setRoomStatus(null));
      }
   });

   onChildAdded(roomsRef, () => {
      if (auth.currentUser)
         get(roomsRef).then((snapshot) => {
            if (snapshot.exists())
               dispatch(
                  userInfoActions.setInvitiationKeys(
                     Object.entries(snapshot.val())
                        .filter(
                           (room) => !room[1].accepted && room[1].player2 === auth.currentUser.uid
                        )
                        .map((room) => {
                           return { opponentuid: room[1].player1, roomKey: room[0] };
                        })
                  )
               );
         });
   });

   onChildRemoved(roomsRef, () => {
      if (auth.currentUser)
         get(roomsRef).then((snapshot) => {
            if (snapshot.exists()) {
               dispatch(
                  userInfoActions.setInvitiationKeys(
                     Object.entries(snapshot.val())
                        .filter(
                           (room) => !room[1].accepted && room[1].player2 === auth.currentUser.uid
                        )
                        .map((room) => {
                           return { opponentuid: room[1].player1, roomKey: room[0] };
                        })
                  )
               );
            } else {
               dispatch(userInfoActions.setInvitiationKeys([]));
            }
         });
   });

   onValue(onlineUsersRef, () => {
      if (auth.currentUser) {
         get(onlineUsersRef).then((snapshot) => {
            if (snapshot.val()) {
               dispatch(
                  userInfoActions.setOtherUsers(
                     Object.entries(snapshot.val()).filter(
                        (pair) => pair[0] !== auth.currentUser.uid && !pair[1].inRoom
                     )
                  )
               );
            }
         });
      }
   });

   const roomKey = useSelector((state) => state.userInfo.roomKey);
   if (roomKey) {
      onValue(child(roomsRef, roomKey.payload + "/accepted"), (snapshot) => {
         if (!snapshot.exists()) {
            dispatch(userInfoActions.setRoomStatus("looking for room"));
         } else if (snapshot.val()) {
            dispatch(gameStateActions.setMultiplayer({playerNumber:1,roomRef:child(roomsRef, roomKey.payload)}))
            dispatch(userInfoActions.setRoomStatus("done waiting"));
         } else {
            dispatch(userInfoActions.setRoomStatus("waiting"));
         }
      });
   }

   return (
      <React.Fragment>
         <NavigationBar setPage={changePageHandler}></NavigationBar>
         {page}
      </React.Fragment>
   );
};
export default App;
