import { child, set } from "@firebase/database";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, getUsernameFromuid, onlineUsersRef, roomsRef } from "../../modules/firebase-config";
import { gameStateActions2 } from "../../store/GameState2";
import { userInfoActions } from "../../store/UserInfo";

import styles from './InviteNotification.module.css'

const InviteNotification = ({ roomKey, opponentuid }) => {
   const dispatch = useDispatch();
   const [opponentName, setOpponentName] = useState(null);
   const getOpponentName = async () => {
      setOpponentName(await getUsernameFromuid(opponentuid));
   };

   const acceptInvite = async () => {
      await set(child(roomsRef, roomKey + "/accepted"), true);
      await set(child(roomsRef, roomKey + "/displayMessage"), "");
      dispatch(userInfoActions.setOpponentid(opponentuid));
      dispatch(userInfoActions.setRoomStatus("in room"));
      dispatch(userInfoActions.setRoomKey(roomKey));
      dispatch(userInfoActions.setOpponentName(opponentName));
      dispatch(
         gameStateActions2.setMultiplayer({ playerNumber: 2, roomRef: child(roomsRef, roomKey) })
      );
      await set(child(onlineUsersRef, auth.currentUser.uid + "/inRoom"), true);
   };

   const declineInvite = async () => {
      await set(child(roomsRef, roomKey + "/accepted"), "declined");
   };

   getOpponentName();
   return (
      <div className={styles["invite"]}>
         <span>{opponentName}</span>
         <span> sent you an invite</span>
         <button className = {styles["accept"]} onClick={acceptInvite}>ACCEPT</button>
         <button className = {styles["decline"]}  onClick={declineInvite}>DECLINE</button>
      </div>
   );
};

export default InviteNotification;
