import { memo } from "react";
import { useSelector } from "react-redux";
import Card from "../UI/Card";
import InviteNotfication from "./InviteNotifcation";

const InviteNotifications = () => {
   let invitations = useSelector((state) => state.userInfo.invitationKeys);
   if (invitations.length!==0) {
      invitations = invitations.map(({ roomKey, opponentuid }, index) => (
         <InviteNotfication
            key={index}
            roomKey={roomKey}
            opponentuid={opponentuid}
         ></InviteNotfication>
      ));
   }
   return <Card>
      <p style = {{margin:0}}>Room Invitations</p>{invitations}</Card>;
};

export default memo(InviteNotifications);
