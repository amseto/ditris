import Login from "./Login";
import styles from "./NavigationBar.module.css";

const NavigationBar = ({ setPage, setShowKeyBindings }) => {
   return (
      <ul className={styles["nav-bar"]}>
         <div>Ditris</div>
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
         <Login></Login>
         <li
            onClick={() => {
               setShowKeyBindings(true);
            }}
            style={{ float: "right" }}
         >
            Set Controls
         </li>
      </ul>
   );
};

export default NavigationBar;
