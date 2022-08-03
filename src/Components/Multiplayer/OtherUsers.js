import { memo } from "react";
import { useSelector } from "react-redux";
import Card from "../UI/Card";
import OtherUser from "./OtherUser";

const OtherUsers = () => {
   const otherUsersList = useSelector((state) => state.userInfo.otherUsers);
   const otherUserListDisplay = otherUsersList
      ? otherUsersList.map((pair, index) => (
           <OtherUser key={index} username={pair[1].username} uid={pair[0]}></OtherUser>
        ))
      : null;
   if (otherUserListDisplay) {
      return (
         <Card>
            <div>Available Users</div>
            {otherUserListDisplay}
         </Card>
      );
   }
};
export default memo(OtherUsers);
