import { Fragment, memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameStateActions2, myRoomRef, grid, pieceQueue } from "../../store/GameState2";
import { child, off, onDisconnect, onValue, set } from "@firebase/database";
import { auth, getUsernameFromuid, onlineUsersRef } from "../../modules/firebase-config";

import Grid from "./Components/Grid";
import PieceQueue from "./Components/PieceQueue";
import LineClearedCounter from "./Components/LineClearedCounter";
import WhoseTurnText from "./Components/WhoseTurnText";
import InputForm from "./Components/InputForm";
import InnerGame from "./InnerGame";
import Card from "../UI/Card";

import KeyControls, {
   keyIsDisabled,
   keyIsPressed,
   keyShiftCounter,
} from "../../modules/KeyControls";

let startButtonLocked = false;

const GameShared = () => {
   const dispatch = useDispatch();

   const controls = useSelector((state) => state.controls);

   const playerNumber = useSelector((state) => state.gameState2.playerNumber);
   const opponentName = useSelector((state) => state.userInfo.opponentName);

   const myTurn = useSelector((state) => state.gameState2.myTurn);
   const displayMessage = useSelector((state) => state.gameState2.displayMessage);
   const gameRunning = useSelector((state) => state.gameState2.gameRunning);
   const currentGameStatus = useSelector((state) => state.gameState2.currentGameStatus);
   const myLinesCleared = useSelector((state) => state.gameState2.myLinesCleared);
   const linesToClear = useSelector((state) => state.gameState2.linesToClear);
   const turnTaken = useSelector((state) => state.gameState2.turnTaken);
   const keepTurn2 = useSelector((state) => state.gameState2.keepTurn2);

   if (!displayMessage) {
      startButtonLocked = false;
   }

   if (displayMessage.includes("WON")) {
      setTimeout(() => {
         startButtonLocked = false;
      }, 1000);
   }

   if (currentGameStatus === "FROZEN") {
      dispatch(gameStateActions2.unfreeze());
      dispatch(gameStateActions2.clearLines());
      dispatch(gameStateActions2.setTurnTaken(true));
   }

   useEffect(() => {
      if (turnTaken) {
         if (myLinesCleared >= linesToClear) {
            set(child(myRoomRef, "turn"), null);
            getUsernameFromuid(auth.currentUser.uid).then((name) => {
               set(child(myRoomRef, "displayMessage"), `${name} WON`);
            });
            dispatch(gameStateActions2.gameWon());
         } else if (keepTurn2) {
            // console.log('keep turn')
         } else {
            // console.log('other turn')
            set(child(myRoomRef, "turn"), playerNumber === 1 ? 2 : 1);
         }
      }
      dispatch(gameStateActions2.setTurnTaken(false));
   }, [myLinesCleared, linesToClear, dispatch, turnTaken, keepTurn2]);

   useEffect(() => {
      if (gameRunning) {
         off(child(myRoomRef, `player${playerNumber === 1 ? 2 : 1}GameInfo`));
         dispatch(gameStateActions2.newGame());
         set(child(myRoomRef, `player${playerNumber}GameInfo`), {
            gameQueue: pieceQueue.elements,
            linesCleared: myLinesCleared,
         });

         return () => {};
      }
   }, [gameRunning]);

   useEffect(() => {
      set(child(myRoomRef, `player${playerNumber}GameInfo`), {
         gameQueue: pieceQueue.elements,
         linesCleared: myLinesCleared,
      });
   }, [myLinesCleared, pieceQueue.elements]);

   // useEffect(() => {
   //    if (gameRunning && myTurn) {
   //       off(child(myRoomRef, "grid"));
   //       dispatch(gameStateActions2.getNewPiece(opponentName));
   //       dispatch(gameStateActions2.placeCurrentPiece(opponentName));
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       const dropPieceInterval = setInterval(() => {
   //          gameLoop();
   //       }, 300);
   //       const handleInputInterval = setInterval(() => {
   //          keyHandler();
   //       }, 1);
   //       const shiftInputInterval = setInterval(() => {
   //          keyShiftHandler();
   //       }, 1);
   //       return () => {
   //          clearInterval(dropPieceInterval);
   //          clearInterval(handleInputInterval);
   //          clearInterval(shiftInputInterval);
   //       };
   //    }
   // }, [myTurn, gameRunning]);

   // const keyShiftHandler = () => {
   //    for (let key in keyShiftCounter) {
   //       if (keyShiftCounter[key]) {
   //          keyShiftCounter[key] += 1;
   //       }
   //    }
   //    if (
   //       keyIsPressed[controls["softDrop"]] &&
   //       keyIsDisabled[controls["softDrop"]] &&
   //       keyShiftCounter[controls["softDrop"]] > 40
   //    ) {
   //       console.log(dispatch(gameStateActions2.dropPiece()));
   //       keyIsDisabled[controls["softDrop"]] = true;
   //       keyShiftCounter[controls["softDrop"]] = 30;
   //    }
   //    if (
   //       keyIsPressed[controls["moveRight"]] &&
   //       keyIsDisabled[controls["moveRight"]] &&
   //       keyShiftCounter[controls["moveRight"]] > 40
   //    ) {
   //       dispatch(gameStateActions2.shiftRight());
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["moveRight"]] = true;
   //       keyShiftCounter[controls["moveRight"]] = 30;
   //    }
   //    if (
   //       keyIsPressed[controls["moveLeft"]] &&
   //       keyIsDisabled[controls["moveLeft"]] &&
   //       keyShiftCounter[controls["moveLeft"]] > 40
   //    ) {
   //       dispatch(gameStateActions2.shiftLeft());
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["moveLeft"]] = true;
   //       keyShiftCounter[controls["moveLeft"]] = 30;
   //    }
   // };
   // const keyHandler = async () => {
   //    if (!gameRunning || controlsLocked) {
   //       return;
   //    }
   //    if (keyIsPressed[controls["rotateLeft"]] && !keyIsDisabled[controls["rotateLeft"]]) {
   //       dispatch(gameStateActions2.rotatePiece(true));
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["rotateLeft"]] = true;
   //    }
   //    if (keyIsPressed[controls["rotateRight"]] && !keyIsDisabled[controls["rotateRight"]]) {
   //       dispatch(gameStateActions2.rotatePiece(false));
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["rotateRight"]] = true;
   //    }
   //    if (keyIsPressed[controls["hardDrop"]] && !keyIsDisabled[controls["hardDrop"]]) {
   //       controlsLocked = true;
   //       dispatch(gameStateActions2.hardDrop());
   //       dispatch(gameStateActions2.clearLines());
   //       dispatch(gameStateActions2.checkIfGameWon());
   //       await set(child(myRoomRef, "turn"), playerNumber === 1 ? 2 : 1);
   //       keyIsDisabled[controls["hardDrop"]] = true;
   //       setTimeout(() => {
   //          controlsLocked = false;
   //       }, 400);
   //    }
   //    if (keyIsPressed[controls["softDrop"]] && !keyIsDisabled[controls["softDrop"]]) {
   //       keyShiftCounter[controls["softDrop"]] = 1;
   //       dispatch(gameStateActions2.dropPiece());
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["softDrop"]] = true;
   //    }
   //    if (keyIsPressed[controls["moveRight"]] && !keyIsDisabled[controls["moveRight"]]) {
   //       keyShiftCounter[controls["moveRight"]] = 1;
   //       dispatch(gameStateActions2.shiftRight());
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["moveRight"]] = true;
   //    }
   //    if (keyIsPressed[controls["moveLeft"]] && !keyIsDisabled[controls["moveLeft"]]) {
   //       keyShiftCounter[controls["moveLeft"]] = 1;
   //       dispatch(gameStateActions2.shiftLeft());
   //       dispatch(gameStateActions2.getGhostCoords());
   //       dispatch(gameStateActions2.showGhostPiece());
   //       keyIsDisabled[controls["moveLeft"]] = true;
   //    }
   // };
   // const gameLoop = async () => {
   //    dispatch(gameStateActions2.dropPiece());
   //    dispatch(gameStateActions2.getGhostCoords());
   //    dispatch(gameStateActions2.showGhostPiece());
   // };

   const beginGame = async () => {
      set(child(myRoomRef, "displayMessage"), "READY");
      await new Promise((resolve) => setTimeout(resolve, 500));
      set(child(myRoomRef, "displayMessage"), "GO");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await set(child(myRoomRef, "displayMessage"), "in game");
      await set(child(myRoomRef, "grid"), [
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
         ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
      ]);
      await set(child(myRoomRef, "/turn"), playerNumber === 1 ? 2 : 1);
   };

   onDisconnect(child(onlineUsersRef, auth.currentUser.uid + "/inRoom")).set(false);
   useEffect(() => {
      onValue(child(myRoomRef, "displayMessage"), (snapshot) => {
         if (snapshot.exists()) {
            dispatch(gameStateActions2.setDisplayMessage(snapshot.val()));
            if (snapshot.val() === "READY") {
               dispatch(gameStateActions2.gettingReady());
               set(child(myRoomRef, `player${playerNumber}GameInfo`), {
                  gameQueue: pieceQueue.elements,
                  linesCleared: myLinesCleared,
               });

               startButtonLocked = true;
            }
         }
      });
   });

   //updating the game grid
   if (gameRunning && !myTurn) {
      onValue(child(myRoomRef, "grid"), (snapshot) => {
         if (snapshot.exists()) {
            dispatch(gameStateActions2.setGrid(snapshot.val()));
         }
      });
   }
   if (gameRunning && !myTurn) {
      onValue(child(myRoomRef, `player${playerNumber}GameInfo/linesCleared`), (snapshot) => {
         dispatch(gameStateActions2.setMyLinesCleared(snapshot.val()));
      });
   }

   //updating the queuePieces and linesClearedNumber
   onValue(child(myRoomRef, `player${playerNumber === 1 ? 2 : 1}GameInfo`), (snapshot) => {
      if (snapshot.exists()) {
         dispatch(
            gameStateActions2.setOpponentInfo({
               opponentPieceQueue: snapshot.val().gameQueue,
               opponentLinesCleared: snapshot.val().linesCleared,
            })
         );
      }
   });

   onValue(child(myRoomRef, "turn"), (snapshot) => {
      if (snapshot.exists()) {
         dispatch(gameStateActions2.setMyTurn(snapshot.val() === playerNumber));
      }
   });

   document.onkeydown = (keycode) => {
      if (startButtonLocked) {
         return;
      }
      if (keycode.key === controls["newGame"]) {
         startButtonLocked = true;
         beginGame();
         //    setStartGame(true);
         //    dispatch(gameStateActions.newGame());
         //    dispatch(gameStateActions.getNewPiece());
         //    dispatch(gameStateActions.getGhostCoords());
         //    dispatch(gameStateActions.showGhostPiece());
      }
   };
   return (
      <Fragment>
         <KeyControls></KeyControls>
         <InnerGame></InnerGame>
         <WhoseTurnText />
         <div
            style={{
               display: "flex",
               flexWrap: "nowrap",
               justifyContent: "center",
            }}
         >
            <LineClearedCounter player="opponent" />
            <PieceQueue player="opponent"></PieceQueue>
            <Grid></Grid>
            <PieceQueue player="mine"></PieceQueue>
            <LineClearedCounter player="mine" />
         </div>
         {!gameRunning && <InputForm />}
         <Card>
            <div style={{ color: "yellow" }}>
               <p>How To Play:</p>
               <p>Press esc to start.</p>
               <p>Game starts with other person first.</p>
               <p>After player drops piece, other player goes.</p>
               <p>Person that causes the board to overflow loses a line point.</p>
               <p>Play until a person clears an amount of lines.</p>
            </div>
         </Card>
      </Fragment>
   );
};

export default memo(GameShared);
