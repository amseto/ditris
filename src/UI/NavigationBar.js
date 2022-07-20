import styles from "./NavigationBar.module.css";

const NavigationBar = ({ setPage }) => {
   return (
      <ul className={styles["nav-bar"]}>
         <li
            onClick={() => {
               setPage("singleplayer");
            }}
         >
            SinglePlayer
         </li>
         <li
            onClick={() => {
               setPage("two-player");
            }}
         >
            Two-Player
         </li>
      </ul>
   );
};

export default NavigationBar;
