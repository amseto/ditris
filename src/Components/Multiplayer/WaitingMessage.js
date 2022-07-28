import {  memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../UI/Modal";


const WaitingMessage = ({ cancelRoomHandler }) => {
   const opponentName = useSelector((state) => state.userInfo.opponentName);
   const roomKey = useSelector((state) => state.userInfo.roomKey);

   return (
      <Modal>
         Waiting for {opponentName} to join
         <button onClick={cancelRoomHandler}>Cancel</button>
      </Modal>
   );
};

export default memo(WaitingMessage);
