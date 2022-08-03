import PieceQueuePiece from "./PieceQueuePiece";
import styles from "./PieceQueue.module.css";
import { pieceQueue } from "../../../store/GameState2";
import { useSelector } from "react-redux";
import { Fragment, memo } from "react";

const PieceQueue = ({ player }) => {
   const opponentPieces = useSelector((state) => state.gameState2.opponentPieceQueue);
   const queueChanged = useSelector((state) => state.gameState2.myTurn);
   let i = 0;
   let pieces = [];
   if (player === "mine") {
      if (pieceQueue.isEmpty) {
         return <div className={styles.pieceQueue}></div>;
      }

      for (let pieceColor in pieceQueue.elements) {
         pieces.push(<PieceQueuePiece key={i++} color={pieceQueue.elements[pieceColor]} />);
      }
      return (
         <Fragment>
            <div className={styles.pieceQueue}>{pieces}</div>
         </Fragment>
      );
   } else if (player === "opponent") {
      if (!opponentPieces || opponentPieces.isEmpty) {
         return <div className={styles.pieceQueue}></div>;
      }
      for (let pieceColor in opponentPieces) {
         if (!pieceColor) {
            continue;
         }
         pieces.push(<PieceQueuePiece key={i++} color={opponentPieces[pieceColor]} />);
      }
      return (
         <Fragment>
            <div className={styles.pieceQueue}>
               {pieces}
            </div>
         </Fragment>
      );
   }
};

export default PieceQueue;
