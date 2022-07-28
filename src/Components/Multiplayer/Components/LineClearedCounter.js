import { memo } from "react";
import { useSelector } from "react-redux";

const LineClearedCounter = ({ player }) => {
   const opponentCounter = useSelector((state) => state.gameState2.opponentLinesCleared);
   const myCounter = useSelector((state) => state.gameState2.myLinesCleared);
   if (player === "opponent") {
      return <div style={{ display: "flex", justifyContent: "flex-end" }}>{opponentCounter}</div>;
   }
   if (player === "mine") {
      return <div>{myCounter}</div>;
   }
};

export default memo(LineClearedCounter);
