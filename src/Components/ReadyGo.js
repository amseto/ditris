import { useSelector } from "react-redux";

import styles from "./ReadyGo.module.css";

const ReadyGo = () =>{
    const gameState = useSelector((state) => state.gameState);
    return <div className = {styles.readyGo}>{gameState.displayMessage}</div>

}

export default ReadyGo