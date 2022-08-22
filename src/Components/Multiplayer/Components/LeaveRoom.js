import styles from "./LeaveRoom.module.css"

const LeaveRoom = ({ leaveRoomHandler }) => {
   return <button className = {styles["leave-room"]} onClick={leaveRoomHandler}>Leave Room</button>;
};

export default LeaveRoom;
