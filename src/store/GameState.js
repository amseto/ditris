import { createSlice } from "@reduxjs/toolkit";

import { TETRIMINOS } from "../Components/Tetrimino";

import Queue from '../modules/piece-queue'

let pieceArray = [
  "I",
  "I",
  "T",
  "T",
  "L",
  "L",
  "J",
  "J",
  "Z",
  "Z",
  "S",
  "S",
  "O",
  "O",
];
const getRandomPiece = () => {
  if(pieceArray.length===0){
    pieceArray = [
      "I",
      "I",
      "T",
      "T",
      "L",
      "L",
      "J",
      "J",
      "Z",
      "Z",
      "S",
      "S",
      "O",
      "O",
    ];
  }
  const value = Math.floor(pieceArray.length * Math.random());
  return pieceArray.splice(value,1)
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
  gameRunning: false,
  currentShape: null,
  currentCoords: [],
  ghostCoords: [],
  currentPieceState: "NONE",
  rotatePos: 0,
  xPos: 3,
  yPos: 0,
  totalLinesCleared: 0,
  grid: [
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
  ],
  // winCondition:(state) =>{return state.totalLinesCleared >= 5},
  pieceQueue: null,
  isGameWon: false,
  heldPiece: null,
  rotated: false,

};

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
  if (forGhost) {
    const colorName = state.currentShape + "ghost";
    for (const coord of state.ghostCoords) {
      state.grid[coord.y][coord.x] = colorName;
      for (const currentCoord of state.currentCoords) {
        if (currentCoord.y === coord.y && currentCoord.x === coord.x) {
          state.grid[coord.y][coord.x] = state.currentShape;
        }
      }
    }
  } else {
    for (const coord of state.currentCoords) {
      state.grid[coord.y][coord.x] = state.currentShape;
    }
  }
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

const winCondition = (state) => state.totalLinesCleared > 4;

export let pieceQueue = new Queue()

const gameStateSlice = createSlice({
  name: "gameState",
  initialState: gameStateInitialState,
  reducers: {
    newGame(state) {
      pieceArray = [
        "I",
        "I",
        "T",
        "T",
        "L",
        "L",
        "J",
        "J",
        "Z",
        "Z",
        "S",
        "S",
        "O",
        "O",
      ];
      state.grid = [
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
      ];
      state.xPos = 3;
      state.yPos = 0;
      state.rotatePos = 0;
      state.displayMessage = "READY"
      state.currentPieceState = "GETTING READY"
      pieceQueue.empty()
      state.gameRunning = false;
    },
    gettingReady(state){
      if (state.currentPieceState === "GETTING READY"){
        state.currentPieceState = "BEFORE START"
        state.displayMessage = "GO!"
      }
      else if (state.currentPieceState === "BEFORE START"){
        state.displayMessage = null;
        state.gameRunning = true;
        state.currentShape = getRandomPiece();
        for(let i = 0;i<5;i++){
          pieceQueue.enqueue(...getRandomPiece())
        }
      }
    },
    clearLines(state) {
      let newGrid = [];
      let linesCleared = 0;
      for (const row of state.grid) {
        if (row.every((blockType) => blockType !== "None")) {
          state.totalLinesCleared += 1;
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
    },
    getNewPiece(state) {
      if (!state.gameRunning) {
        return;
      }
      state.ghostCoords = [];
      state.rotated = false
      state.currentShape = pieceQueue.dequeue();
      pieceQueue.enqueue(...getRandomPiece())
      state.xPos = 3;
      state.yPos = 0;
      state.rotatePos = 0;
      state.currentCoords = convertMappingToCoords(
        state,
        getCoords(state.currentShape, state.rotatePos, state.xPos, state.yPos)
      );
      if (state.currentCoords.length < 4) {
        state.gameRunning = false;
        console.log("lost");
        return;
      }
      placeBlocks(state);
      state.currentPieceState = "FALLING";
    },
    rotatePiece(state, action) {
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
        state.currentPieceState = "FALLING";
      }
      placeBlocks(state);
    },
    dropPiece(state) {
      if (state.gameRunning) {
        if (state.currentPieceState === "LANDING") {
          state.currentPieceState = "FROZEN";
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
            getCoords(
              state.currentShape,
              state.rotatePos,
              state.xPos,
              state.yPos
            )
          );
          state.currentPieceState = "LANDING";
        } else {
          state.currentPieceState = "FALLING";
        }
        placeBlocks(state);
      } else {
      }
    },
    getGhostCoords(state) {
      if (!state.gameRunning) {
        return;
      }
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
    },
    hardDrop(state) {
      removeLastState(state);
      state.currentCoords = state.ghostCoords;
      placeBlocks(state);
      state.currentPieceState = "FROZEN";
    },
    showGhostPiece(state) {
      if (!state.gameRunning) {
        return;
      }
      placeBlocks(state, true);
    },
    shiftLeft(state) {
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
        state.currentPieceState = "FALLING";
      }
      placeBlocks(state);
    },
    shiftRight(state) {
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
        state.currentPieceState = "FALLING";
      }
      placeBlocks(state);
    },
    checkIfGameWon(state) {
      if (state.totalLinesCleared >= 4) {
        console.log("won");
        state.isGameWon = true;
        state.gameRunning = false;
      }
    },
    holdPiece(state){
      if(state.rotated === true){
        return
      }
      state.rotated = true;

      
      removeLastState(state);
      if(state.heldPiece===null){
        state.heldPiece = state.currentShape
        state.currentShape = pieceQueue.dequeue();
        pieceQueue.enqueue(...getRandomPiece())
      }
      else{
        const placeHolder = state.currentShape
        state.currentShape = state.heldPiece
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

    }

    // setWinCondition(state,condition){
    //   state.winCondition = condition;
    // }
  },
});

export const gameStateActions = gameStateSlice.actions;

export default gameStateSlice.reducer;
