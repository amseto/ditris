import Block from "./Block";
import { TETRIMINOS } from "./Tetrimino";

import styles from "./PieceQueue.module.css";

const PieceQueuePiece = (props) => {
   const convertToPiece = (row, yPos) => {
      return (
         <div className={styles.pieceRow} key={yPos}>
            {row.map((color, xPos) => {
               if (color === 0) {
                  return <Block key={xPos} color={null} />;
               } else {
                  return <Block color={props.color} key={xPos} />;
               }
            })}
         </div>
      );
   };
   let grid = TETRIMINOS[props.color][0].map(convertToPiece);

   return <div className={styles.piece}>{grid}</div>;
};

export default PieceQueuePiece;
