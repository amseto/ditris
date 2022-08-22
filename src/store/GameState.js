import { createSlice } from "@reduxjs/toolkit";

import { TETRIMINOS } from "../Components/GameUI/Tetrimino";
import Queue from "../modules/piece-queue";

let pieceArray = ["I", "I", "T", "T", "L", "L", "J", "J", "Z", "Z", "S", "S", "O", "O"];

const LINESAMOUNT = 40;
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
   currentShape: null,
   currentCoords: [],
   ghostCoords: [],
   pieceQueue: null,
   heldPiece: null,
   linesCleared: 0,
   linesToClear: LINESAMOUNT,
   gameSpeed: 1000,

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
   endTurn: false,
   gettingPiece: false,
};

export let pieceQueue = new Queue();

const removeLastState = (state) => {
   for (const coord of state.currentCoords) {
      state.grid[coord.y][coord.x] = "None";
   }
};

const removeLastGhostPiece = (state) => {
   for (const coord of state.ghostCoords) {
      state.grid[coord.y][coord.x] = "None";
   }
};

const placeBlocks = (state, forGhost = false) => {
   let copiedGrid = state.grid.map((nested) => nested.slice());
   if (forGhost) {
      const colorName = state.currentShape + "ghost";
      for (const coord of state.ghostCoords) {
         copiedGrid[coord.y][coord.x] = colorName;
         for (const currentCoord of state.currentCoords) {
            if (currentCoord.y === coord.y && currentCoord.x === coord.x) {
               copiedGrid[coord.y][coord.x] = state.currentShape;
            }
         }
      }
   } else {
      for (const coord of state.currentCoords) {
         copiedGrid[coord.y][coord.x] = state.currentShape;
      }
   }
   state.grid = copiedGrid;
};

const coordIsValid = (state, coord, forGhost = false) => {
   if (coord) {
      if (coord.y <= 20 && coord.x >= 0 && coord.x <= 9) {
         for (let currentCoord of state.currentCoords) {
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

const gameStateSlice = createSlice({
   name: "gameState2",
   initialState: gameStateInitialState,
   reducers: {
      resetSP(state) {
         state.playerNumber = null;

         state.gameRunning = false;
         state.currentShape = null;
         state.currentCoords = [];
         state.ghostCoords = [];
         state.pieceQueue = null;
         state.heldPiece = null;
         state.linesCleared = 0;

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

         state.gettingPiece = false;
         state.endTurn = false;

         pieceQueue = new Queue();
      },
      gettingReadySP(state) {
         state.gameRunning = false;
         state.currentShape = null;
         state.currentCoords = [];
         state.ghostCoords = [];
         state.pieceQueue = null;
         state.heldPiece = null;
         state.linesCleared = 0;
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
         pieceArray = ["I", "I", "T", "T", "L", "L", "J", "J", "Z", "Z", "S", "S", "O", "O"];
         pieceQueue = new Queue();
         for (let i = 0; i < 5; i++) {
            pieceQueue.enqueue(...getRandomPiece());
         }
      },
      newGameSP(state) {
         state.xPos = 3;
         state.yPos = 0;
         state.rotatePos = 0;

         state.gettingPiece = true;
         state.gameRunning = true;
      },
      clearLinesSP(state) {
         let newGrid = [];
         let linesCleared = 0;
         for (const row of state.grid) {
            if (row.every((blockType) => blockType !== "None")) {
               state.linesCleared += 1;
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
         state.endTurn = true;
      },
      setGettingNewPieceSP(state, bool) {
         state.endTurn = false;
         state.gettingPiece = bool.payload;
      },
      getNewPieceSP(state) {
         state.ghostCoords = [];
         state.currentShape = pieceQueue.dequeue();
         pieceQueue.enqueue(...getRandomPiece());
         state.xPos = 3;
         state.yPos = 0;
         state.rotatePos = 0;
         state.currentCoords = convertMappingToCoords(
            state,
            getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.currentCoords.length < 4) {
            state.gameRunning = false;
            state.gettingPiece = false;
            state.displayMessage = "YOU LOST";
         } else {
            placeBlocks(state);
            state.currentGameStatus = "FALLING";
            state.gettingPiece = false;
         }
      },
      rotatePieceSP(state, action) {
         const originalRotatePos = state.rotatePos;
         state.rotatePos = rotatePiece(action.payload, {
            rotatePos: state.rotatePos,
         });
         removeLastState(state);
         state.currentCoords = convertMappingToCoords(
            state,
            getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.currentCoords.length < 4) {
            state.rotatePos = originalRotatePos;
            state.currentCoords = convertMappingToCoords(
               state,
               getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
            );
         } else {
            state.currentGameStatus = "FALLING";
         }
         placeBlocks(state);
      },
      dropPieceSP(state) {
         if (state.gameRunning) {
            if (state.currentGameStatus === "LANDING") {
               state.currentGameStatus = "FROZEN";
               return;
            }
            if (state.currentGameStatus === "FROZEN") {
               return;
            }
            removeLastState(state);
            state.yPos += 1;
            state.currentCoords = convertMappingToCoords(
               state,
               getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
            );
            if (state.currentCoords.length < 4) {
               state.yPos -= 1;
               state.currentCoords = convertMappingToCoords(
                  state,
                  getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
               );
               state.currentGameStatus = "LANDING";
            } else {
               state.currentGameStatus = "FALLING";
            }
            placeBlocks(state);
         } else {
         }
      },
      getGhostCoordsSP(state) {
         if (state.currentCoords.length < 4) {
         } else {
            removeLastGhostPiece(state);
            state.ghostCoords = [];
            for (let coord of state.currentCoords) {
               state.ghostCoords.push({ x: coord.x, y: coord.y });
            }
            let ghostYPos = state.yPos;
            while (state.ghostCoords.length === 4) {
               ghostYPos += 1;
               state.ghostCoords = convertMappingToCoords(
                  state,
                  getCoords(state.currentShape, state.rotatePos, state.xPos, ghostYPos),
                  true
               );
            }
            ghostYPos -= 1;
            state.ghostCoords = convertMappingToCoords(
               state,
               getCoords(state.currentShape, state.rotatePos, state.xPos, ghostYPos),
               true
            );
         }
      },
      hardDropSP(state) {
         removeLastState(state);
         state.currentCoords = state.ghostCoords;
         placeBlocks(state);
         state.currentGameStatus = "FROZEN";
      },
      showGhostPieceSP(state) {
         placeBlocks(state, true);
      },
      shiftLeftSP(state) {
         removeLastState(state);
         state.xPos -= 1;
         state.currentCoords = convertMappingToCoords(
            state,
            getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.currentCoords.length < 4) {
            state.xPos += 1;
            state.currentCoords = convertMappingToCoords(
               state,
               getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
            );
         } else {
            state.currentGameStatus = "FALLING";
         }
         placeBlocks(state);
      },
      shiftRightSP(state) {
         removeLastState(state);
         state.xPos += 1;
         state.currentCoords = convertMappingToCoords(
            state,
            getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
         );
         if (state.currentCoords.length < 4) {
            state.xPos -= 1;
            state.currentCoords = convertMappingToCoords(
               state,
               getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
            );
         } else {
            state.currentGameStatus = "FALLING";
         }
         placeBlocks(state);
      },

      gameWonSP(state) {
         state.gameRunning = false;
         state.displayMessage = "GAME WON";
      },
      resetRotationSP(state) {
         state.rotated = false;
      },
      holdPieceSP(state) {
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
         state.currentGameStatus = "FALLING";
      },
      setDisplayMessageSP(state, displayMessage) {
         state.displayMessage = displayMessage.payload;
      },
      setSettings(state, settings) {
         state.linesToClear = settings.payload.linesToClear;
         state.gameSpeed = settings.payload.gameSpeed;
      },
      setSettingsDefault(state) {
         state.linesToClear = LINESAMOUNT;
         state.gameSpeed = 1000;
      },
   },
});

export const gameStateActions = gameStateSlice.actions;

export default gameStateSlice.reducer;
