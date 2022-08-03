import styles from "./Block.module.css";

const Block = (props) => {
  const color = props.color;
  return <div className={`${styles.block}  ${styles[color]}`}></div>;
};

export default Block;
