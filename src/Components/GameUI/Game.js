import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyControls, {
   keyIsDisabled,
   keyIsPressed,
   keyShiftCounter,
} from "../../modules/KeyControls";
import { gameStateActions } from "../../store/GameState";
import GameSettingsButton from "./GameSettingsButton";
import Grid from "./Grid";
import HeldBlock from "./HeldBlock";
import LinesCleared from "./LinesCleared";
import PieceQueue from "./PieceQueue";
import StopWatch from "./StopWatch";

let startButtonLocked = false;
let controlsLocked = false;
const Game = () => {
   const dispatch = useDispatch();

   const controls = useSelector((state) => state.controls);

   const displayMessage = useSelector((state) => state.gameState.displayMessage);
   const gameRunning = useSelector((state) => state.gameState.gameRunning);
   const currentGameStatus = useSelector((state) => state.gameState.currentGameStatus);
   const gettingPiece = useSelector((state) => state.gameState.gettingPiece);
   const linesCleared = useSelector((state) => state.gameState.linesCleared);
   const linesToClear = useSelector((state) => state.gameState.linesToClear);
   const endTurn = useSelector((state) => state.gameState.endTurn);

   const gameSpeed = useSelector((state) => state.gameState.gameSpeed);

   useEffect(() => {
      if (displayMessage === "READY") {
         dispatch(gameStateActions.gettingReadySP());
      }
   }, [displayMessage, dispatch]);

   const beginGame = async () => {
      dispatch(gameStateActions.setDisplayMessageSP("READY"));
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(gameStateActions.setDisplayMessageSP("GO"));
      await new Promise((resolve) => setTimeout(resolve, 500));
      startButtonLocked = false;
      dispatch(gameStateActions.setDisplayMessageSP("in game"));
      dispatch(gameStateActions.newGameSP());
   };

   document.onkeydown = (keycode) => {
      if (startButtonLocked) {
         return;
      }
      if (keycode.key === controls["newGame"]) {
         startButtonLocked = true;
         beginGame();
      }
   };
   useEffect(() => {
      if (currentGameStatus === "FROZEN") {
         dispatch(gameStateActions.clearLinesSP());
      }
   }, [currentGameStatus, dispatch]);

   useEffect(() => {
      if (endTurn) {
         dispatch(gameStateActions.resetRotationSP());
         if (linesCleared >= linesToClear) {
            dispatch(gameStateActions.setGettingNewPieceSP(false));
            dispatch(gameStateActions.gameWonSP());
         } else {
            dispatch(gameStateActions.setGettingNewPieceSP(true));
         }
      }
   }, [linesCleared, linesToClear, dispatch, endTurn]);

   useEffect(() => {
      if (gettingPiece) {
         dispatch(gameStateActions.getNewPieceSP());
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
      }
   }, [gettingPiece, dispatch]);

   const gameLoop = () => {
      dispatch(gameStateActions.dropPieceSP());
   };

   const keyHandler = async () => {
      if (keyIsPressed[controls["rotateLeft"]] && !keyIsDisabled[controls["rotateLeft"]]) {
         dispatch(gameStateActions.rotatePieceSP(true));
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["rotateLeft"]] = true;
      }
      if (keyIsPressed[controls["rotateRight"]] && !keyIsDisabled[controls["rotateRight"]]) {
         dispatch(gameStateActions.rotatePieceSP(false));
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["rotateRight"]] = true;
      }
      if (keyIsPressed[controls["hold"]] && !keyIsDisabled[controls["hold"]]) {
         dispatch(gameStateActions.holdPieceSP());
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["hold"]] = true;
      }
      if (keyIsPressed[controls["hardDrop"]] && !keyIsDisabled[controls["hardDrop"]]) {
         controlsLocked = true;
         dispatch(gameStateActions.hardDropSP());
         keyIsDisabled[controls["hardDrop"]] = true;
      }
      if (keyIsPressed[controls["softDrop"]] && !keyIsDisabled[controls["softDrop"]]) {
         keyShiftCounter[controls["softDrop"]] = 1;
         dispatch(gameStateActions.dropPieceSP());
         keyIsDisabled[controls["softDrop"]] = true;
      }
      if (keyIsPressed[controls["moveRight"]] && !keyIsDisabled[controls["moveRight"]]) {
         keyShiftCounter[controls["moveRight"]] = 1;
         dispatch(gameStateActions.shiftRightSP());
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["moveRight"]] = true;
      }
      if (keyIsPressed[controls["moveLeft"]] && !keyIsDisabled[controls["moveLeft"]]) {
         keyShiftCounter[controls["moveLeft"]] = 1;
         dispatch(gameStateActions.shiftLeftSP());
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["moveLeft"]] = true;
      }
   };

   const keyShiftHandler = () => {
      for (let key in keyShiftCounter) {
         if (keyShiftCounter[key]) {
            keyShiftCounter[key] += 1;
         }
      }
      if (
         keyIsPressed[controls["softDrop"]] &&
         keyIsDisabled[controls["softDrop"]] &&
         keyShiftCounter[controls["softDrop"]] > 32
      ) {
         dispatch(gameStateActions.dropPieceSP());
         keyIsDisabled[controls["softDrop"]] = true;
         keyShiftCounter[controls["softDrop"]] = 28;
      }
      if (
         keyIsPressed[controls["moveRight"]] &&
         keyIsDisabled[controls["moveRight"]] &&
         keyShiftCounter[controls["moveRight"]] > 32
      ) {
         dispatch(gameStateActions.shiftRightSP());
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["moveRight"]] = true;
         keyShiftCounter[controls["moveRight"]] = 28;
      }
      if (
         keyIsPressed[controls["moveLeft"]] &&
         keyIsDisabled[controls["moveLeft"]] &&
         keyShiftCounter[controls["moveLeft"]] > 32
      ) {
         dispatch(gameStateActions.shiftLeftSP());
         dispatch(gameStateActions.getGhostCoordsSP());
         dispatch(gameStateActions.showGhostPieceSP());
         keyIsDisabled[controls["moveLeft"]] = true;
         keyShiftCounter[controls["moveLeft"]] = 28;
      }
   };

   useEffect(() => {
      if (gameRunning) {
         const dropPieceInterval = setInterval(() => {
            gameLoop();
         }, gameSpeed);
         const handleInputInterval = setInterval(() => {
            keyHandler();
         }, 1);
         const shiftInputInterval = setInterval(() => {
            keyShiftHandler();
         }, 1);
         return () => {
            clearInterval(dropPieceInterval);
            clearInterval(handleInputInterval);
            clearInterval(shiftInputInterval);
         };
      }
   }, [gameRunning, dispatch, controls]);

   return (
      <Fragment>
         <KeyControls />
         <div
            style={{
               display: "flex",
               flexWrap: "nowrap",
               justifyContent: "center",
            }}
         >
            <HeldBlock />
            <Grid></Grid>
            <PieceQueue />
         </div>
         <div style={{display:"flex",flexDirection:"column", textAlign: "center" }}>
            <StopWatch />
            <LinesCleared />
            <GameSettingsButton />
         </div>
      </Fragment>
   );
};

export default Game;
