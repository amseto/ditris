import { Fragment } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";
const Backdrop = (props) => {
   return <div className={styles.backdrop} onClick={props.onClick} ></div>;
};

const ModalOverlay = ({ children }) => {
   return <div className={styles.modal}>{children}</div>;
};


const Modal = (props) => {
    const portalElement = document.getElementById("overlays");
    return (
      <Fragment>
        {createPortal(
          <Backdrop onClick={props.onClick} />,
          portalElement
        )}
        {createPortal(
          <ModalOverlay>{props.children}</ModalOverlay>,
          portalElement
        )}
      </Fragment>
    );
  };

export default Modal;
