import { memo } from "react";
import { useSelector } from "react-redux";

const WhoseTurnText = () => {
   const gameRunning = useSelector((state) => state.gameState2.gameRunning);
   const myTurn = useSelector((state) => state.gameState2.myTurn);
   const opponentName = useSelector((state) => state.userInfo.opponentName);
   if (!gameRunning) {
      return <div style={{ textAlign: "center",height:"24px"}}> </div>;;
   } else if (myTurn) {
      return <div style={{ textAlign: "center" }}>{`Your Turn`}</div>;
   } else {
      return <div style={{ textAlign: "center" }}>{`${opponentName}'s Turn`}</div>;
   }
};
export default memo(WhoseTurnText);
