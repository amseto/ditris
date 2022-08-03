import Login from "./Login";
import styles from "./NavigationBar.module.css";

const NavigationBar = ({ setPage, setShowKeyBindings }) => {
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
         <li style={{ backgroundColor: "#333", float: "right" }}>
            <Login></Login>
         </li>
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
