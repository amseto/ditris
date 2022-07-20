import Block from "./Block";
import { TETRIMINOS } from "./Tetrimino";

const PieceQueuePiece = (props) => {
  const convertToPiece = (row, yPos) => {
    return (
      <tr key={yPos}>
        {row.map((color, xPos) => {
          if (color === 0) {
            return <Block key = {xPos} color={null} />;
          } else {
            return <Block color={props.color} key={xPos} />;
          }
        })}
      </tr>
    );
  };
  let grid = TETRIMINOS[props.color][0].map(convertToPiece);

  return (
    <li>
      <table>
        <tbody>{grid}</tbody>
      </table>
    </li>
  );
};

export default PieceQueuePiece;
