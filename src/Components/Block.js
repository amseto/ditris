import styles from "./Block.module.css";


const Block = (props) => {
  const color = props.color
  return (
    <td
      className={`${styles.block}  ${styles[color]}`}
    ></td>
  );
};

export default Block;
