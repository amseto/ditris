import  styles  from "./HowToPlay.module.css";

const HowToPlay = () => {
  return (
    <div className={styles.howToPlay}>
      <ul>
        <li>esc = start game</li>
        <li>q = rotate counter clockwise</li>
        <li>w = rotate clockwise</li>
        <li>tab = hold</li>
        <li>spacebar = hard drop</li>
        <li>use arrows to move</li>
      </ul>
    </div>
  );
};

export default HowToPlay;
