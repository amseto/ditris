import styles from "./HeldBlock.module.css";

import { TETRIMINOS } from "./Tetrimino";
import { useSelector } from "react-redux";
import Block from "./Block";

const HeldBlock = () => {
  const gameState = useSelector((state) => state.gameState);
  if (!gameState.heldPiece) {
    return (
      <div className={styles.heldBlock}>
        <table>
          <tbody>
            <tr>
              <Block />
              <Block />
              <Block />
              <Block />
            </tr>
            <tr>
              <Block />
              <Block />
              <Block />
              <Block />
            </tr>
            <tr>
              <Block />
              <Block />
              <Block />
              <Block />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const convertToPiece = (row, yPos) => {
    return (
      <tr key={yPos}>
        {row.map((color, xPos) => {
          if (color === 0) {
            return <Block key={xPos} color={null} />;
          } else {
            return <Block color={gameState.heldPiece} key={xPos} />;
          }
        })}
      </tr>
    );
  };

  let grid = TETRIMINOS[gameState.heldPiece][0].map(convertToPiece);
  console.log(grid);
  return (
    <div className={styles.heldBlock}>
      <table>
        <tbody>{grid}</tbody>
      </table>
    </div>
  );
};

export default HeldBlock;
