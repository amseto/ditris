import { child, onDisconnect, onValue, remove } from "@firebase/database";
import { Fragment, memo } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { onlineUsersRef, roomsRef } from "../../modules/firebase-config";
import { userInfoActions } from "../../store/UserInfo";

import styles from "./WaitingMessage.module.css";
const Backdrop = () => {
   return <div className={styles.backdrop}></div>;
};

const ModalOverlay = ({ children }) => {
   return <div className={styles.modal}>{children}</div>;
};
const portalElement = document.getElementById("overlays");

const WaitingMessage = () => {
   const dispatch = useDispatch();
   const opponentName = useSelector((state) => state.userInfo.opponentName.payload);
   const opponentID = useSelector((state) => state.userInfo.opponentID.payload);
   const roomKey = useSelector((state) => state.userInfo.roomKey.payload);
   const cancelRoomHandler = async () => {
      await remove(child(roomsRef, roomKey));
      dispatch(userInfoActions.setRoomKey(null));
      dispatch(userInfoActions.setOpponentName(""));
   };
   
   onDisconnect(child(roomsRef, roomKey)).remove();
   onValue(child(onlineUsersRef, opponentID), (snapshot) => {
      if (!snapshot.exists() || snapshot.val().inRoom) {
         cancelRoomHandler();
         console.log("error")
      }
   });

   return (
      <Fragment>
         {createPortal(<Backdrop />, portalElement)}
         {createPortal(
            <ModalOverlay>
               Waiting for {opponentName} to join
               <button onClick={cancelRoomHandler}>Cancel</button>
            </ModalOverlay>,
            portalElement
         )}
      </Fragment>
   );
};

export default memo(WaitingMessage);
