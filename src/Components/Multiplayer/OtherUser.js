import { off, push, set } from "firebase/database";
import { useDispatch } from "react-redux";
import { auth,  roomsRef } from "../../modules/firebase-config";
import { userInfoActions } from "../../store/UserInfo";

import styles from './OtherUser.module.css'

const OtherUser = ({ username, uid }) => {
   const dispatch = useDispatch();
   const pushRoomsRef = push(roomsRef);
   const createRoomHandler = async () => {
      off(roomsRef)
      await set(pushRoomsRef, { player1: auth.currentUser.uid, player2: uid, accepted: false });
      dispatch(userInfoActions.setRoomStatus("waiting"));
      dispatch(userInfoActions.setRoomKey(pushRoomsRef.key));
      dispatch(userInfoActions.setOpponentName(username));
      dispatch(userInfoActions.setOpponentid(uid));
   };
   return (
      <li className={styles["OtherUser"]}>
         <button className={styles["OtherUser"]} onClick={createRoomHandler}>{username}</button>
      </li>
   );
};

export default OtherUser;
