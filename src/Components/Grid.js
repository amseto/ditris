import { useSelector, useDispatch } from "react-redux";

import styles from "./Grid.module.css";
import Block from "./Block";

const Grid = (props) => {

  const gameState = useSelector((state) => state.gameState);

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
      {props.children}
    </table>
  );
};

export default Grid;
