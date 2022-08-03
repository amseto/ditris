import styles from "./Card.module.css";

const Card = (props) => {
   if (props.children) {
      return <div className={styles.card}>{props.children}</div>;
   }
};

export default Card;
