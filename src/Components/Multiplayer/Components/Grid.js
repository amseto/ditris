import { useSelector, useDispatch } from "react-redux";

import styles from "./Grid.module.css";
import Block from "./Block";
import ReadyGo from "./ReadyGo";

const Grid = () => {
   const gameState = useSelector((state) => state.gameState2);

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
