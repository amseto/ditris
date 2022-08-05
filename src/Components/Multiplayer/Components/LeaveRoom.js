import Card from "../../UI/Card";

const LeaveRoom = ({ leaveRoomHandler }) => {
   return (
      <Card>
         <button onClick={leaveRoomHandler}>Leave Room</button>
      </Card>
   );
};

export default LeaveRoom;
