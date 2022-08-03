import styles from "./HeldBlock.module.css";

import { TETRIMINOS } from "./Tetrimino";
import { useSelector } from "react-redux";
import Block from "./Block";
import { Fragment } from "react";

const HeldBlock = () => {
   const gameState = useSelector((state) => state.gameState);
   if (!gameState.heldPiece) {
      return (
         <div className={styles.heldBlockOuter}>
            <div className={styles.title}>Held Piece</div>
            <div className = {styles.gridRow}>
               <Block />
               <Block />
               <Block />
               <Block />
            </div>
            <div className = {styles.gridRow}>
               <Block />
               <Block />
               <Block />
               <Block />
            </div>
            <div className = {styles.gridRow}>
               <Block />
               <Block />
               <Block />
               <Block />
            </div>
         </div>
      );
   }

   const convertToPiece = (row, yPos) => {
      return (
         <div style={{ display: "flex" }} key={yPos}>
            {row.map((color, xPos) => {
               if (color === 0) {
                  return <Block key={xPos} color={null} />;
               } else {
                  return <Block color={gameState.heldPiece} key={xPos} />;
               }
            })}
         </div>
      );
   };

   let grid = TETRIMINOS[gameState.heldPiece][0].map(convertToPiece);
   return (
      <Fragment>
         <div className={styles.heldBlockOuter}>
            <div className={styles.title}>Held Piece</div>
            <div className={styles.grid}>{grid}</div>
         </div>
      </Fragment>
   );
};

export default HeldBlock;
