import { Fragment, useState } from "react";
import GameSettings from "./GameSettings";

import styles from "./GameSettingsButton.module.css"

const GameSettingsButton = () => {



   const [showOverlay, setShowOverLay] = useState(false);


   return (
      <Fragment>
         {showOverlay && <GameSettings onClick= {()=>{setShowOverLay(false)}}/>}
         <button className={styles["button"]}
            onClick={() => {
               setShowOverLay(true);
            }}
         >
            Settings
         </button>
      </Fragment>
   );
};

export default GameSettingsButton;
