export const TETRIMINOS = {
  I: [
    //I
    [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],

  T: [
    //T
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  L: [
    //L
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
  J: [
    //J
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  Z: [
    //Z
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  S: [
    //S
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  O: [
    //O
    [
      [0, 1, 1],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [0, 1, 1],
    ],
  ],
};

export const getRandomPiece = () => {
  const value = Math.round(6 * Math.random());
  switch (value) {
    case 0:
      return "I";
    case 1:
      return "T";
    case 2:
      return "L";
    case 3:
      return "J";
    case 4:
      return "Z";
    case 5:
      return "S";
    case 6:
      return "O";
  }
};

export const getPiece = (type, rotatePos, xPos, yPos) =>
  TETRIMINOS[type][rotatePos].map((row, rowPos) =>
    row.map((col, colPos) => {
      if (col) {
        return { x: xPos + colPos, y: yPos + rowPos };
      }
      return null;
    })
  );

export const rotatePiece = (isCounterClockwise, { type, rotatePos }) => {
  return isCounterClockwise
    ? rotatePos === 0
      ? TETRIMINOS[type].length - 1
      : rotatePos - 1
    : rotatePos === TETRIMINOS[type].length - 1
    ? 0
    : rotatePos + 1;
};

export const convertMappingToCoords = (mapping) => {
  let coordArray = [];
  for (const array of mapping) {
    for (const coord of array) {
      if (coord) {
        coordArray.push(coord);
      }
    }
  }
  return coordArray;
};
