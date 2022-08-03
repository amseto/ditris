import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameStateActions } from "../../store/GameState";
import Grid from "./Grid";
import PieceQueue from "./PieceQueue";
import HeldBlock from "./HeldBlock";

import { keyShiftCounter, keyIsPressed, keyIsDisabled } from "../../modules/KeyControls";
import KeyControls from "../../modules/KeyControls";
import HowToPlay from "./HowToPlay";
import StopWatch from "./StopWatch";

let gameLocked = false;

const Game = () => {
   const dispatch = useDispatch();
   const gameRunning = useSelector((state) => state.gameState.gameRunning);
   const currentPieceState = useSelector((state) => state.gameState.currentPieceState);
   const displayMessage = useSelector((state) => state.gameState.displayMessage);
   const controls = useSelector((state)=>state.controls)

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
         keyIsPressed[controls.softDrop] &&
         keyIsDisabled[controls.softDrop] &&
         keyShiftCounter[controls.softDrop] > 40
      ) {
         dispatch(gameStateActions.dropPiece());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.softDrop] = true;
         keyShiftCounter[controls.softDrop] = 30;
      }
      if (
         keyIsPressed[controls.moveRight] &&
         keyIsDisabled[controls.moveRight] &&
         keyShiftCounter[controls.moveRight] > 40
      ) {
         dispatch(gameStateActions.shiftRight());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.moveRight] = true;
         keyShiftCounter[controls.moveRight] = 30;
      }
      if (
         keyIsPressed[controls.moveLeft] &&
         keyIsDisabled[controls.moveLeft] &&
         keyShiftCounter[controls.moveLeft] > 40
      ) {
         dispatch(gameStateActions.shiftLeft());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.moveLeft] = true;
         keyShiftCounter[controls.moveLeft] = 30;
      }
   };
   const keyHandler = () => {
      if (!gameRunning || gameLocked) {
         return;
      }
      if (keyIsPressed[controls.rotateLeft] && !keyIsDisabled[controls.rotateLeft]) {
         dispatch(gameStateActions.rotatePiece(true));
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.rotateLeft] = true;
      }
      if (keyIsPressed[controls.rotateRight] && !keyIsDisabled[controls.rotateRight]) {
         dispatch(gameStateActions.rotatePiece(false));
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.rotateRight] = true;
      }
      if (keyIsPressed[controls.hardDrop] && !keyIsDisabled[controls.hardDrop]) {
         gameLocked = true;
         dispatch(gameStateActions.hardDrop());
         keyIsDisabled[controls.hardDrop] = true;
         setTimeout(() => {
            gameLocked = false;
         }, 350);
      }
      if (keyIsPressed[controls.hold] && !keyIsDisabled[controls.hold]) {
         dispatch(gameStateActions.holdPiece());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.hold] = true;
      }
      if (keyIsPressed[controls.softDrop] && !keyIsDisabled[controls.softDrop]) {
         keyShiftCounter[controls.softDrop] = 1;
         dispatch(gameStateActions.dropPiece());
         keyIsDisabled[controls.softDrop] = true;
      }
      if (keyIsPressed[controls.moveRight] && !keyIsDisabled[controls.moveRight]) {
         keyShiftCounter[controls.moveRight] = 1;
         dispatch(gameStateActions.shiftRight());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.moveRight] = true;
      }
      if (keyIsPressed[controls.moveLeft] && !keyIsDisabled[controls.moveLeft]) {
         keyShiftCounter[controls.moveLeft] = 1;
         dispatch(gameStateActions.shiftLeft());
         dispatch(gameStateActions.getGhostCoords());
         dispatch(gameStateActions.showGhostPiece());
         keyIsDisabled[controls.moveLeft] = true;
      }
   };
   document.onkeydown = (keycode) => {
      if (keycode.key === controls.newGame) {
         setStartGame(true);
         dispatch(gameStateActions.newGame());
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
               flexWrap:"nowrap",
               justifyContent:"center"
            }}
         >
            <HeldBlock />
            <Grid></Grid>
            <PieceQueue />
         </div>
         <StopWatch></StopWatch>
      </Fragment>
   );
};

export default Game;
