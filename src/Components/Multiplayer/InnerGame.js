import { child, off, set } from "@firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { keyIsDisabled, keyIsPressed, keyShiftCounter } from "../../modules/KeyControls";
import { gameStateActions2, myRoomRef, pieceQueue } from "../../store/GameState2";

let controlsLocked = false;

const InnerGame = () => {
   const dispatch = useDispatch();

   const controls = useSelector((state) => state.controls);

   const playerNumber = useSelector((state) => state.gameState2.playerNumber);
   const opponentName = useSelector((state) => state.userInfo.opponentName);

   const myTurn = useSelector((state) => state.gameState2.myTurn);
   const displayMessage = useSelector((state) => state.gameState2.displayMessage);
   const gameRunning = useSelector((state) => state.gameState2.gameRunning);
   const currentGameStatus = useSelector((state) => state.gameState2.currentGameStatus);
   const grid = useSelector((state) => state.gameState2.grid);
   useEffect(() => {
      if (gameRunning && myTurn) {
         off(child(myRoomRef, "grid"));
         dispatch(gameStateActions2.getNewPiece(opponentName));
         set(
            child(myRoomRef, `player${playerNumber}GameInfo/gameQueue`),
            pieceQueue.elements
         );
         dispatch(gameStateActions2.placeCurrentPiece());
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         const dropPieceInterval = setInterval(() => {
            gameLoop();
         }, 300);
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
   }, [myTurn, gameRunning,dispatch]);

   const keyShiftHandler = async () => {
      for (let key in keyShiftCounter) {
         if (keyShiftCounter[key]) {
            keyShiftCounter[key] += 1;
         }
      }
      if (
         keyIsPressed[controls["softDrop"]] &&
         keyIsDisabled[controls["softDrop"]] &&
         keyShiftCounter[controls["softDrop"]] > 40
      ) {
         dispatch(gameStateActions2.dropPiece());

         keyIsDisabled[controls["softDrop"]] = true;
         keyShiftCounter[controls["softDrop"]] = 30;
      }
      if (
         keyIsPressed[controls["moveRight"]] &&
         keyIsDisabled[controls["moveRight"]] &&
         keyShiftCounter[controls["moveRight"]] > 40
      ) {
         dispatch(gameStateActions2.shiftRight());
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         keyIsDisabled[controls["moveRight"]] = true;
         keyShiftCounter[controls["moveRight"]] = 30;
      }
      if (
         keyIsPressed[controls["moveLeft"]] &&
         keyIsDisabled[controls["moveLeft"]] &&
         keyShiftCounter[controls["moveLeft"]] > 40
      ) {
         dispatch(gameStateActions2.shiftLeft());
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         keyIsDisabled[controls["moveLeft"]] = true;
         keyShiftCounter[controls["moveLeft"]] = 30;
      }
   };
   const keyHandler = async () => {
      if (!gameRunning || controlsLocked) {
         return;
      }
      if (keyIsPressed[controls["rotateLeft"]] && !keyIsDisabled[controls["rotateLeft"]]) {
         dispatch(gameStateActions2.rotatePiece(true));
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         keyIsDisabled[controls["rotateLeft"]] = true;
      }
      if (keyIsPressed[controls["rotateRight"]] && !keyIsDisabled[controls["rotateRight"]]) {
         dispatch(gameStateActions2.rotatePiece(false));
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         keyIsDisabled[controls["rotateRight"]] = true;
      }
      if (keyIsPressed[controls["hardDrop"]] && !keyIsDisabled[controls["hardDrop"]]) {
         controlsLocked = true;
         dispatch(gameStateActions2.hardDrop());
         dispatch(gameStateActions2.clearLines());
         keyIsDisabled[controls["hardDrop"]] = true;
         dispatch(gameStateActions2.setTurnTaken(true));
         setTimeout(() => {
            controlsLocked = false;
            
         }, 400);
      }
      if (keyIsPressed[controls["softDrop"]] && !keyIsDisabled[controls["softDrop"]]) {
         keyShiftCounter[controls["softDrop"]] = 1;
         dispatch(gameStateActions2.dropPiece());
         dispatch(gameStateActions2.clearLines());
         dispatch(gameStateActions2.checkIfGameWon());
         keyIsDisabled[controls["softDrop"]] = true;
      }
      if (keyIsPressed[controls["moveRight"]] && !keyIsDisabled[controls["moveRight"]]) {
         keyShiftCounter[controls["moveRight"]] = 1;
         dispatch(gameStateActions2.shiftRight());
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         keyIsDisabled[controls["moveRight"]] = true;
      }
      if (keyIsPressed[controls["moveLeft"]] && !keyIsDisabled[controls["moveLeft"]]) {
         keyShiftCounter[controls["moveLeft"]] = 1;
         dispatch(gameStateActions2.shiftLeft());
         dispatch(gameStateActions2.getGhostCoords());
         dispatch(gameStateActions2.showGhostPiece());
         keyIsDisabled[controls["moveLeft"]] = true;
      }
   };
   const gameLoop = async () => {
      dispatch(gameStateActions2.dropPiece());
      dispatch(gameStateActions2.getGhostCoords());
      dispatch(gameStateActions2.showGhostPiece());
   };
   useEffect(() => {
      if (myTurn) {
         set(child(myRoomRef, "grid"), grid);
      }
   }, [grid,myTurn]);

   return;
};
export default InnerGame;
