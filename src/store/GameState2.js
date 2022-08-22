import { child, off, set } from "@firebase/database";
import { createSlice } from "@reduxjs/toolkit";

import { TETRIMINOS } from "../Components/GameUI/Tetrimino";
import { auth, getUsernameFromuid } from "../modules/firebase-config";

import Queue from "../modules/piece-queue";

const LINESTOCLEAR = 15

let pieceArray = ["I", "I", "T", "T", "L", "L", "J", "J", "Z", "Z", "S", "S", "O", "O"];
const getRandomPiece = () => {
   if (pieceArray.length === 0) {
      pieceArray = ["I", "I", "T", "T", "L", "L", "J", "J", "Z", "Z", "S", "S", "O", "O"];
   }
   const value = Math.floor(pieceArray.length * Math.random());
   return pieceArray.splice(value, 1);
};

const getCoords = (type, rotatePos, xPos, yPos) =>
   TETRIMINOS[type][rotatePos].map((row, rowPos) =>
      row.map((col, colPos) => {
         if (col) {
            return { x: xPos + colPos, y: yPos + rowPos };
         }
         return null;
      })
   );
const rotatePiece = (isCounterClockwise, state) => {
   let { rotatePos } = state;
   if (isCounterClockwise) {
      if (rotatePos === 0) {
         return 3;
      } else {
         return rotatePos - 1;
      }
   } else {
      if (rotatePos === 3) {
         return 0;
      } else {
         return rotatePos + 1;
      }
   }
};

const convertMappingToCoords = (state, mapping, forGhost = false) => {
   let coordArray = [];
   for (const array of mapping) {
      for (const coord of array) {
         if (coord) {
            if (coordIsValid(state, coord, forGhost)) {
               coordArray.push(coord);
            }
         }
      }
   }
   return coordArray;
};


const gameStateInitialState = {
   playerNumber: null,

   gameRunning: false,
   myCurrentShape: null,
   myCurrentCoords: [],
   myGhostCoords: [],
   myPieceQueue: null,
   myHeldPiece: null,
   myLinesCleared: 0,

   opponentPieceQueue: [],
   opponentHeldPiece: null,
   opponentLinesCleared: 0,

   currentGameStatus: "NONE",
   rotatePos: 0,
   xPos: 3,
   yPos: 0,

   grid: [
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
   ],

   rotated: false,
   displayMessage: "",

   myTurn: null,
   linesToClear:LINESTOCLEAR,
   lineDeduction:2,
   keepTurn: 0,
   keepTurn2:false,

   turnTaken : false
};

export let myRoomRef = null;

export let pieceQueue = new Queue();

const removeLastState = (state) => {
   for (const coord of state.myCurrentCoords) {
      state.grid[coord.y][coord.x] = "None";
   }
};

const removeLastGhostPiece = (state) => {
   for (const coord of state.myGhostCoords) {
      state.grid[coord.y][coord.x] = "None";
   }
};

const placeBlocks = (state, forGhost = false) => {
   let copiedGrid = state.grid.map(nested=>nested.slice())
   if (forGhost) {
      const colorName = state.myCurrentShape + "ghost";
      for (const coord of state.myGhostCoords) {
         copiedGrid[coord.y][coord.x] = colorName;
         for (const currentCoord of state.myCurrentCoords) {
            if (currentCoord.y === coord.y && currentCoord.x === coord.x) {
               copiedGrid[coord.y][coord.x] = state.myCurrentShape;
            }
         }
      }
   } else {
      for (const coord of state.myCurrentCoords) {
         copiedGrid[coord.y][coord.x] = state.myCurrentShape;
      }
   }
   state.grid = copiedGrid
};

const coordIsValid = (state, coord, forGhost = false) => {
   if (coord) {
      if (coord.y <= 20 && coord.x >= 0 && coord.x <= 9) {
         for (let currentCoord of state.myCurrentCoords) {
            if (forGhost) {
               if (currentCoord.y === coord.y && currentCoord.x === coord.x) {
                  return true;
               }
            }
         }
         if (state.grid[coord.y][coord.x].length > 1) {
            return true;
         }
      }
   }
   return false;
};

const gameStateSlice2 = createSlice({
   name: "gameState2",
   initialState: gameStateInitialState,
   reducers: {
      reset(state) {
         state.playerNumber = null;

         state.gameRunning = false;
         state.myCurrentShape = null;
         state.myCurrentCoords = [];
         state.myGhostCoords = [];
         state.myPieceQueue = null;
         state.myHeldPiece = null;
         state.myLinesCleared = 0;

         state.opponentPieceQueue = [];
         state.opponentHeldPiece = null;
         state.opponentLinesCleared = 0;

         state.currentGameStatus = "NONE";
         state.rotatePos = 0;
         state.xPos = 3;
         state.yPos = 0;

         state.grid = [
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
         ];

         state.rotated = false;
         state.displayMessage = "";

         state.keepTurn = 0
         state.keepTurn2=false;
         state.myTurn = null;
         state.linesToClear =LINESTOCLEAR;
         state.lineDeduction = Math.floor(LINESTOCLEAR/5)
         myRoomRef = null;
         pieceQueue = new Queue()

         state.turnTaken = false
      },
      setGrid(state, grid) {
         state.grid = grid.payload;
      },
      gettingReady(state) {
         state.myCurrentShape = null;
         state.myCurrentCoords = [];
         state.myGhostCoords = [];
         state.myPieceQueue = null;
         state.myHeldPiece = null;
         state.myLinesCleared = 0;
         state.currentGameStatus = "NONE";
         state.grid = [
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
         ];

      },
      newGame(state) {
         state.xPos = 3;
         state.yPos = 0;
         state.rotatePos = 0;

         pieceArray = ["I", "I", "T", "T", "L", "L", "J", "J", "Z", "Z", "S", "S", "O", "O"];
         pieceQueue = new Queue();
         for (let i = 0; i < 5; i++) {
            pieceQueue.enqueue(...getRandomPiece());
         }

      },
      setOpponentInfo(state, action) {
         state.opponentPieceQueue = action.payload.opponentPieceQueue;
         state.opponentLinesCleared = action.payload.opponentLinesCleared;
      },
      clearLines(state) {
         let newGrid = [];
         let linesCleared = 0;
         for (const row of state.grid) {
            if (row.every((blockType) => blockType !== "None")) {
               state.myLinesCleared += 1;
               linesCleared += 1;
            } else {
               newGrid.push(row);
            }
         }
         for (let i = 0; i < linesCleared; i++) {
            newGrid.unshift([
               "None",
               "None",
               "None",
               "None",
               "None",
               "None",
               "None",
               "None",
               "None",
               "None",
            ]);
         }
         state.grid = newGrid;
         set(child(myRoomRef, "grid"), state.grid);
         if (linesCleared>0){
            state.keepTurn = state.keepTurn+1
            state.keepTurn2 = true
         }
         else{
            state.keepTurn2 = false
         }
         // off(child(myRoomRef, `player${state.playerNumber}GameInfo/linesCleared`))
      },
      unfreeze(state) {
         state.currentGameStatus = "FALLING";
      },
      getNewPiece(state, opponentName) {
         state.myGhostCoords = [];
         state.myCurrentShape = pieceQueue.dequeue();
         pieceQueue.enqueue(...getRandomPiece());
         state.xPos = 3;
         state.yPos = 0;
         state.rotatePos = 0;
         state.myCurrentCoords = convertMappingToCoords(
            state,
            getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.myCurrentCoords.length < 4) {
            state.grid = [
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
            ];
            state.myCurrentShape = pieceQueue.dequeue();
            pieceQueue.enqueue(...getRandomPiece());
            off(child(myRoomRef, `player${state.playerNumber === 1 ? 2 : 1}GameInfo`));
            set(
               child(myRoomRef, `player${state.playerNumber === 1 ? 2 : 1}GameInfo/linesCleared`),
               state.opponentLinesCleared - state.lineDeduction
            );
            off(child(myRoomRef, "displayMessage"));
            state.displayMessage = `${opponentName.payload} CAUSED OVERFLOW`;
            set(child(myRoomRef, "displayMessage"), `${opponentName.payload} CAUSED OVERFLOW`);
            setTimeout(() => {
               set(child(myRoomRef, "displayMessage"), "in game");
            }, 1000);

            state.myCurrentCoords = convertMappingToCoords(
               state,
               getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
            );
         }
         placeBlocks(state);
         // set(
         //    child(myRoomRef, `player${state.playerNumber}GameInfo/gameQueue`),
         //    pieceQueue.elements
         // );

         state.currentGameStatus = "FALLING";
      },
      rotatePiece(state, action) {
         const originalRotatePos = state.rotatePos;
         state.rotatePos = rotatePiece(action.payload, {
            rotatePos: state.rotatePos,
         });
         removeLastState(state);
         state.myCurrentCoords = convertMappingToCoords(
            state,
            getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.myCurrentCoords.length < 4) {
            state.rotatePos = originalRotatePos;
            state.myCurrentCoords = convertMappingToCoords(
               state,
               getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
            );
         } else {
            state.currentGameStatus = "FALLING";
         }
         placeBlocks(state);
      },
      dropPiece(state) {
         if (state.gameRunning) {
            if (state.currentGameStatus === "LANDING") {
               state.currentGameStatus = "FROZEN";
               return;
            }
            removeLastState(state);
            state.yPos += 1;
            state.myCurrentCoords = convertMappingToCoords(
               state,
               getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
            );
            if (state.myCurrentCoords.length < 4) {
               state.yPos -= 1;
               state.myCurrentCoords = convertMappingToCoords(
                  state,
                  getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
               );
               state.currentGameStatus = "LANDING";
            } else {
               state.currentGameStatus = "FALLING";
            }
            placeBlocks(state);
         } else {
         }
      },
      getGhostCoords(state) {
         removeLastGhostPiece(state);
         state.myGhostCoords = [];
         for (let coord of state.myCurrentCoords) {
            state.myGhostCoords.push({ x: coord.x, y: coord.y });
         }
         let ghostYPos = state.yPos;
         while (state.myGhostCoords.length === 4) {
            ghostYPos += 1;
            state.myGhostCoords = convertMappingToCoords(
               state,
               getCoords(state.myCurrentShape, state.rotatePos, state.xPos, ghostYPos),
               true
            );
         }
         ghostYPos -= 1;
         state.myGhostCoords = convertMappingToCoords(
            state,
            getCoords(state.myCurrentShape, state.rotatePos, state.xPos, ghostYPos),
            true
         );
      },
      hardDrop(state) {
         removeLastState(state);
         state.myCurrentCoords = state.myGhostCoords;
         placeBlocks(state);
         state.currentGameStatus = "FROZEN";
      },
      showGhostPiece(state) {
         placeBlocks(state, true);
      },
      shiftLeft(state) {
         removeLastState(state);
         state.xPos -= 1;
         state.myCurrentCoords = convertMappingToCoords(
            state,
            getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.myCurrentCoords.length < 4) {
            state.xPos += 1;
            state.myCurrentCoords = convertMappingToCoords(
               state,
               getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
            );
         } else {
            state.currentGameStatus = "FALLING";
         }
         placeBlocks(state);
      },
      shiftRight(state) {
         removeLastState(state);
         state.xPos += 1;
         state.myCurrentCoords = convertMappingToCoords(
            state,
            getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.myCurrentCoords.length < 4) {
            state.xPos -= 1;
            state.myCurrentCoords = convertMappingToCoords(
               state,
               getCoords(state.myCurrentShape, state.rotatePos, state.xPos, state.yPos)
            );
         } else {
            state.currentGameStatus = "FALLING";
         }
         placeBlocks(state);
      },
      placeCurrentPiece(state){
         placeBlocks(state)
      },

      gameWon(state){
         state.gameRunning = false;
      },
      holdPiece(state) {
         if (state.rotated === true) {
            return;
         }
         state.rotated = true;

         removeLastState(state);
         if (state.heldPiece === null) {
            state.heldPiece = state.currentShape;
            state.currentShape = pieceQueue.dequeue();
            pieceQueue.enqueue(...getRandomPiece());
         } else {
            const placeHolder = state.currentShape;
            state.currentShape = state.heldPiece;
            state.heldPiece = placeHolder;
         }
         state.xPos = 3;
         state.yPos = 0;
         state.rotatePos = 0;
         state.currentCoords = convertMappingToCoords(
            state,
            getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
         );
         placeBlocks(state);
         state.currentPieceState = "FALLING";
      },
      setMultiplayer(state, action) {
         state.playerNumber = action.payload.playerNumber;
         myRoomRef = action.payload.roomRef;
      },
      setDisplayMessage(state, displayMessage) {
         state.displayMessage = displayMessage.payload;
         if (state.displayMessage === "in game") {
            state.gameRunning = true;
         }
         if (state.displayMessage.includes("WON")) {
            state.gameRunning = false;
         }
      },
      setMyTurn(state, bool) {
         // state.keepTurn = 0
         state.myTurn = bool.payload;
      },
      setMyLinesCleared(state, lines) {
         state.myLinesCleared = lines.payload;
      },
      setLinesToClear(state,lines){
         state.linesToClear = lines.payload
         state.lineDeduction = Math.floor(lines.payload/5)
      },
      setTurnTaken(state,bool){
         state.turnTaken = bool.payload
      },
   },
});


export const gameStateActions2 = gameStateSlice2.actions;

export default gameStateSlice2.reducer;
