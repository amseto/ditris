import { useSelector } from "react-redux";

import styles from "./ReadyGo.module.css";

const ReadyGo = () => {
   const displayMessage = useSelector((state) => state.gameState.displayMessage);
   if (displayMessage === "in game") {
      return <div className={styles.readyGo}></div>;
   }
   return <div className={styles.readyGo}>{displayMessage}</div>;
};

export default ReadyGo;
