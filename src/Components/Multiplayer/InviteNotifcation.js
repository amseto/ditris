import { child, set } from "@firebase/database";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getUsernameFromuid, myRoomRef, roomsRef } from "../../modules/firebase-config";
import { gameStateActions } from "../../store/GameState";
import { userInfoActions } from "../../store/UserInfo";

const InviteNotfication = ({ roomKey, opponentuid }) => {
   const dispatch = useDispatch();
   const [opponentName, setOpponentName] = useState(null);
   const getOpponentName = async () => {
      setOpponentName(await getUsernameFromuid(opponentuid));
   };

   const acceptInvite = () => {
      set(child(roomsRef, roomKey + "/accepted"), true);
      dispatch(
         gameStateActions.setMultiplayer({ playerNumber: 2, roomRef: child(roomsRef, roomKey) })
      );
      dispatch(userInfoActions.setRoomStatus("done waiting"));
   };

   getOpponentName();
   return <button onClick={acceptInvite}>{opponentName}</button>;
};

export default InviteNotfication;
