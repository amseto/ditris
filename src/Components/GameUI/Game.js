import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameStateActions } from "../../store/GameState";
import Grid from "./Grid";
import PieceQueue from "./PieceQueue";
import HeldBlock from "./HeldBlock";

import { keyShiftCounter, keyIsPressed, keyIsDisabled } from "../../modules/KeyControls";
import KeyControls from "../../modules/KeyControls";
import HowToPlay from "./HowToPlay";

let gameLocked = false;

const Game = () => {
   const dispatch = useDispatch();
   const gameRunning = useSelector((state) => state.gameState.gameRunning);
   const currentPieceState = useSelector((state) => state.gameState.currentPieceState);
   const displayMessage = useSelector((state) => state.gameState.displayMessage);

   const [startGame, setStartGame] = useState(false);

   const gameLoop = () => {
      if (gameRunning) {
         if (currentPieceState === "FROZEN") {
            dispatch(gameStateActions.clearLines());
            dispatch(gameStateActions.checkIfGameWon());
            dispatch(gameStateActions.getNewPiece());
            dispatch(gameStateActions.getGhostCoords());
            dispatch(gameStateActions.showGhostPiece());
         } else {
            dispatch(gameStateActions.dropPiece());
            dispatch(gameStateActions.getGhostCoords());
            dispatch(gameStateActions.showGhostPiece());
         }
      }
   };
   useEffect(() => {
      const dropPieceInterval = window.setInterval(() => {
      
         gameLoop();
      }, 300);
      const handleInputInterval = window.setInterval(() => {
         keyHandler();
      }, 1);
      const shiftInputInterval = window.setInterval(() => {
         keyShiftHandler();
      }, 1);

      return () => {
         window.clearInterval(dropPieceInterval);
         window.clearInterval(handleInputInterval);
         window.clearInterval(shiftInputInterval);
      };
   });
   useEffect(() => {
      if (startGame) {
         const interval = window.setInterval(() => {
            dispatch(gameStateActions.gettingReady());
         }, 500);
         return () => {
            window.clearInterval(interval);
         };
      }
   }, [displayMessage, dispatch, startGame]);

   const keyShiftHandler = () => {
      if (!gameRunning || gameLocked) {
         return;
      }
      for (let key in keyShiftCounter) {
         if (keyShiftCounter[key]) {
            keyShiftCounter[key] += 1;
         }
      }
      if (
         keyIsPressed["ArrowDown"] &&
         keyIsDisabled["ArrowDown"] &&
         keyShiftCounter["ArrowDown"] > 40
      ) {
         dispatch(gameStateActions.dropPiece());
         keyIsDisabled["ArrowDown"] = true;
         keyShiftCounter["ArrowDown"] = 30;
      }
      if (
         keyIsPressed["ArrowRight"] &&
         keyIsDisabled["ArrowRight"] &&
         keyShiftCounter["ArrowRight"] > 40
      ) {
         dispatch(gameStateActions.shiftRight());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["ArrowRight"] = true;
         keyShiftCounter["ArrowRight"] = 20;
      }
      if (
         keyIsPressed["ArrowLeft"] &&
         keyIsDisabled["ArrowLeft"] &&
         keyShiftCounter["ArrowLeft"] > 40
      ) {
         dispatch(gameStateActions.shiftLeft());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["ArrowLeft"] = true;
         keyShiftCounter["ArrowLeft"] = 20;
      }
   };
   const keyHandler = () => {
      if (!gameRunning || gameLocked) {
         return;
      }
      if (keyIsPressed["q"] && !keyIsDisabled["q"]) {
         dispatch(gameStateActions.rotatePiece(true));
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["q"] = true;
      }
      if (keyIsPressed["w"] && !keyIsDisabled["w"]) {
         dispatch(gameStateActions.rotatePiece(false));
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["w"] = true;
      }
      if (keyIsPressed[" "] && !keyIsDisabled[" "]) {
         gameLocked = true;
         dispatch(gameStateActions.hardDrop());
         keyIsDisabled[" "] = true;
         setTimeout(() => {
            gameLocked = false;
         }, 400);
      }
      if (keyIsPressed["Tab"] && !keyIsDisabled["Tab"]) {
         dispatch(gameStateActions.holdPiece());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["Tab"] = true;
      }
      if (keyIsPressed["ArrowDown"] && !keyIsDisabled["ArrowDown"]) {
         keyShiftCounter["ArrowDown"] = 1;
         dispatch(gameStateActions.dropPiece());
         keyIsDisabled["ArrowDown"] = true;
      }
      if (keyIsPressed["ArrowRight"] && !keyIsDisabled["ArrowRight"]) {
         keyShiftCounter["ArrowRight"] = 1;
         dispatch(gameStateActions.shiftRight());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["ArrowRight"] = true;
      }
      if (keyIsPressed["ArrowLeft"] && !keyIsDisabled["ArrowLeft"]) {
         keyShiftCounter["ArrowLeft"] = 1;
         dispatch(gameStateActions.shiftLeft());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled["ArrowLeft"] = true;
      }
   };
   document.onkeydown = (keycode) => {
      if (keycode.key === "Escape") {
         setStartGame(true);
         dispatch(gameStateActions.newGame());
         dispatch(gameStateActions.getNewPiece());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
      }
   };
   return (
      <Fragment>
         <KeyControls />
         <div
            style={{
               display: "flex",
            }}
         >
            <HeldBlock />
            <Grid></Grid>
            <PieceQueue />
         </div>
         <HowToPlay></HowToPlay>
      </Fragment>
   );
};

export default Game;
