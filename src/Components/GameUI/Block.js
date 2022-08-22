import { Fragment, useState } from "react";
import Modal from "../UI/Modal";
import styles from "./Block.module.css";

const Block = (props) => {
   const color = props.color;
   const [showSettings, setShowSettings] = useState(false);
   
   return (
      <Fragment>
         <div className={`${styles.block}  ${styles[color]}`}></div>
         {showSettings && <Modal>Hellos</Modal>}
      </Fragment>
   );
};

export default Block;
