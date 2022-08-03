import { memo } from "react";
import { useSelector } from "react-redux";

import styles from "./LineClearedCounter.module.css"

const LineClearedCounter = ({ player }) => {
   const opponentCounter = useSelector((state) => state.gameState2.opponentLinesCleared);
   const myCounter = useSelector((state) => state.gameState2.myLinesCleared);
   if (player === "opponent") {
      console.log('here')
      return <div className = {styles.counterOpponent}>{opponentCounter}</div>;
   }
   if (player === "mine") {
      return <div className = {styles.counterMyself}>{myCounter}</div>;
   }
};

export default memo(LineClearedCounter);
