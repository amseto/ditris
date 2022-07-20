import { useSelector, useDispatch } from "react-redux";

import styles from "./Grid.module.css";
import Block from "./Block";
import ReadyGo from "./ReadyGo";

const Grid = () => {
   const gameState = useSelector((state) => state.gameState);
   const player2Grid = useSelector((state) => state.userInfo.grid);
   console.log(player2Grid);
   if (player2Grid.length !== 0) {
      const grid = player2Grid.payload.slice(1).map((row, y_pos) => {
         return (
            <tr key={y_pos}>
               {row.map((color, x_pos) => {
                  return <Block color={color} key={x_pos} />;
               })}
            </tr>
         );
      });
      return (
         <table className={styles.grid}>
            <tbody>{grid}</tbody>
         </table>
      );
   }

   const grid = gameState.grid.slice(1).map((row, y_pos) => {
      return (
         <tr key={y_pos}>
            {row.map((color, x_pos) => {
               return <Block color={color} key={x_pos} />;
            })}
         </tr>
      );
   });

   return (
      <table className={styles.grid}>
         <tbody>{grid}</tbody>
         <ReadyGo></ReadyGo>
      </table>
   );
};

export default Grid;
