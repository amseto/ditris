import { memo } from "react";
import { useSelector } from "react-redux";
import OtherUser from "./OtherUser";

const OtherUsers = () => {
   const otherUsersList = useSelector((state) => state.userInfo.otherUsers);
   const otherUserListDisplay = otherUsersList
      ? otherUsersList.map((pair, index) => (
           <OtherUser key={index} username={pair[1].username} uid={pair[0]}></OtherUser>
        ))
      : null;
   if (otherUserListDisplay) {
      return <ul>{otherUserListDisplay}</ul>;
   }
};
export default memo(OtherUsers);
