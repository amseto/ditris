import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import "../modules/firebase-config";
import Login from "../Components/Multiplayer/Login";
import OtherUsers from "../Components/Multiplayer/OtherUsers";

import WaitingMessage from "../Components/Multiplayer/WaitingMessage";
import InviteNotification from "../Components/Multiplayer/InviteNotfications";
import Game from "../Components/GameUI/Game";
import {
   child,
   get,
   off,
   onChildAdded,
   onChildRemoved,
   onDisconnect,
   onValue,
   remove,
   set,
} from "@firebase/database";
import { userInfoActions } from "../store/UserInfo";
import { auth, onlineUsersRef, roomsRef } from "../modules/firebase-config";
import LeaveRoom from "../Components/GameUI/LeaveRoom";
import GameShared from "../Components/Multiplayer/GameShared";
import { gameStateActions2, myRoomRef } from "../store/GameState2";

const TwoPlayer = () => {
   const dispatch = useDispatch();
   const userStatus = useSelector((state) => state.userInfo.roomStatus);

   const playerNumber = useSelector((state) => state.gameState2.playerNumber);
   const roomKey = useSelector((state) => state.userInfo.roomKey);
   if (roomKey) {
      onDisconnect(child(roomsRef, roomKey)).remove();
   }

   //when list of other users changes
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

   //when someone accepts your invite
   if (roomKey) {
      onValue(child(roomsRef, roomKey + "/accepted"), (snapshot) => {
         if (!snapshot.exists()) {
         } else if (snapshot.val()) {
            if (playerNumber !== 2) {
               dispatch(
                  gameStateActions2.setMultiplayer({
                     playerNumber: 1,
                     roomRef: child(roomsRef, roomKey),
                  })
               );
               dispatch(userInfoActions.setRoomStatus("in room"));
               set(child(onlineUsersRef, auth.currentUser.uid + "/inRoom"), true);
            }
            // off(child(onlineUsersRef, opponentID))
         } else {
            dispatch(userInfoActions.setRoomStatus("waiting"));
         }
      });
   }
   //someone sends you an invite
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

   const opponentID = useSelector((state) => state.userInfo.opponentID);
   const cancelRoomHandler = async () => {
      off(child(onlineUsersRef, opponentID));
      dispatch(gameStateActions2.reset());
      await remove(child(roomsRef, roomKey));
      dispatch(userInfoActions.reset());
      if (auth.currentUser) {
         set(child(onlineUsersRef, auth.currentUser.uid + "/inRoom"), false);
      }
   };

   //check if opponent log out or is in another room or leaves
   if (opponentID) {
      onValue(child(onlineUsersRef, opponentID), async (snapshot) => {
         if (!snapshot.exists()) {
            cancelRoomHandler();
         } else if (snapshot.val().inRoom) {
            // if (myRoomRef){
            let skip = false;
            await get(child(myRoomRef, "accepted")).then((snapshot) => {
               skip = snapshot.val();
            });
            if (!skip) {
               cancelRoomHandler();
            }
            // }
         }
      });
   }
   if (userStatus === "in room") {
      onValue(myRoomRef, (snapshot) => {
         //room is removed
         if (!snapshot.exists()) {
            off(child(roomsRef, roomKey));
            off(child(onlineUsersRef, opponentID));
            dispatch(userInfoActions.reset());

            if (auth.currentUser) {
               set(child(onlineUsersRef, auth.currentUser.uid + "/inRoom"), false);
            }
            dispatch(gameStateActions2.reset());
         }
      });
   }

   return (
      <Fragment>
         <h1>Ditris Two-Player</h1>
         {userStatus === "looking for room" && <InviteNotification />}
         {userStatus === "looking for room" && <OtherUsers />}
         {userStatus === "waiting" && <WaitingMessage cancelRoomHandler={cancelRoomHandler} />}
         <Login></Login>
         {userStatus === "in room" && <LeaveRoom leaveRoomHandler={cancelRoomHandler}></LeaveRoom>}
         {/* {userStatus === "in room" && playerNumber === 1 && <Game></Game>}
         {userStatus === "in room" && playerNumber === 2 && <GetGame></GetGame>} */}
         {userStatus === "in room" && <GameShared></GameShared>}
      </Fragment>
   );
};

export default TwoPlayer;
