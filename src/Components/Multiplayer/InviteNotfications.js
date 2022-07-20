import { memo } from "react";
import { useSelector } from "react-redux";
import InviteNotfication from "./InviteNotifcation";

const InviteNotifications = () => {
   let invitations = useSelector((state) => state.userInfo.invitationKeys);
   if (invitations.length!==0) {
      invitations = invitations.payload.map(({ roomKey, opponentuid }, index) => (
         <InviteNotfication
            key={index}
            roomKey={roomKey}
            opponentuid={opponentuid}
         ></InviteNotfication>
      ));
   }
   return <div>{invitations}</div>;
};

export default memo(InviteNotifications);
