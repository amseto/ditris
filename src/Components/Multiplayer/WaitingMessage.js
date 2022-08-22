import {  memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../UI/Modal";

import styles from './WaitingMessage.module.css'


const WaitingMessage = ({ cancelRoomHandler }) => {
   const opponentName = useSelector((state) => state.userInfo.opponentName);
   const roomKey = useSelector((state) => state.userInfo.roomKey);

   return (
      <Modal>
         <span className={styles["span"]}>Waiting for {opponentName} to join...</span>
         <button className={styles["cancel"]} onClick={cancelRoomHandler}>CANCEL</button>
      </Modal>
   );
};

export default memo(WaitingMessage);
