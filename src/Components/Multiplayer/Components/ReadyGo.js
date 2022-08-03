import { memo } from "react";
import { useSelector } from "react-redux";

import styles from "./ReadyGo.module.css";

const ReadyGo = () => {
   const displayMessage = useSelector((state) => state.gameState2.displayMessage);
   if (displayMessage === "in game") {
      return <div className={styles.readyGo}></div>;
   } else {
      return <div className={styles.readyGo}>{displayMessage}</div>;
   }
};

export default memo(ReadyGo);
