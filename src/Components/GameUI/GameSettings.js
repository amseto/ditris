import { useDispatch, useSelector } from "react-redux";
import useInput from "../../Hooks/use-input";
import { gameStateActions } from "../../store/GameState";
import Modal from "../UI/Modal";

import styles from "./GameSettings.module.css";

const GameSettings = ({ onClick }) => {
   const dispatch = useDispatch();
   const currentGameSpeed = useSelector((state) => state.gameState.gameSpeed);
   const currentLines = useSelector((state) => state.gameState.linesToClear);

   const validateSpeed = (speed) => {
      return speed >= 1;
   };
   const validateLines = (lines) => {
      return lines >= 1;
   };
   const {
      value: speedToDisplay,
      hasError: speedHasError,
      valueChangeHandler: speedChangeHandler,
      blurHandler: speedBlurHandler,
      setValue:setSpeed
   } = useInput(validateSpeed, currentGameSpeed);

   const {
      value: linesToDisplay,
      hasError: linesHasError,
      valueChangeHandler: linesChangeHandler,
      blurHandler: linesBlurHandler,
      setValue: setLines,
   } = useInput(validateLines, currentLines);

   const speedInputClass = speedHasError ? styles["invalid"] : styles["valid"];

   const linesInputClass = linesHasError ? styles["invalid"] : styles["valid"];

   return (
      <Modal
         onClick={() => {
            onClick();
         }}
      >
         <div className={styles["everything"]}>
            <h1>Game Settings</h1>
            <div>
               <label htmlFor="Game Speed">Game Speed </label>
               <input
                  className={speedInputClass}
                  type="number"
                  value={speedToDisplay}
                  onChange={(event) => {
                     speedChangeHandler(event);
                  }}
                  onBlur={() => {
                     speedBlurHandler();
                  }}
                  id="Game Speed"
               ></input>
            </div>
            <div>
               <label htmlFor="Lines to Clear">Lines to Clear </label>
               <input
                  className={linesInputClass}
                  type="number"
                  value={linesToDisplay}
                  onChange={(event) => {
                     linesChangeHandler(event);
                  }}
                  onBlur={() => {
                     linesBlurHandler();
                  }}
                  id="Lines to Clear"
               ></input>
            </div>
            <div>
               <button
                  onClick={() => {
                     dispatch(
                        gameStateActions.setSettings({
                           linesToClear: linesToDisplay,
                           gameSpeed: speedToDisplay,
                        })
                     );
                  }}
                  disabled={speedHasError || linesHasError}
               >
                  Save
               </button>
               <button
                  onClick={() => {
                     dispatch(gameStateActions.setSettingsDefault());
                     setSpeed(currentGameSpeed)
                     setLines(currentLines)
                  }}
               >
                  Default
               </button>
            </div>
         </div>
      </Modal>
   );
};

export default GameSettings;
