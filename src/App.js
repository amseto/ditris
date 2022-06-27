import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./gameUI.module.css";

import { gameStateActions } from "./store/GameState";
import Grid from "./Components/Grid";
import PieceQueue from "./Components/PieceQueue";
import HeldBlock from "./Components/HeldBlock";
import ReadyGo from './Components/ReadyGo'

function App() {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.gameState);
  const buttonClickHander = () => {
    dispatch(gameStateActions.newGame());
    dispatch(gameStateActions.getNewPiece());
  };
  const rotateButtonHandler = () => {
    dispatch(gameStateActions.rotatePiece());
  };
  const dropPieceHandler = () => {
    dispatch(gameStateActions.dropPiece());
  };
  const shiftLeftHandler = () => {
    dispatch(gameStateActions.shiftLeft());
  };
  const shiftRightHandler = () => {
    dispatch(gameStateActions.shiftRight());
  };

  let keyState = {};

  window.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
    keyState[event.key] = true;
  });
  window.addEventListener("keyup", (event) => {
    keyState[event.key] = false;
  });

  const gameLoop = () => {
    if (gameState.gameRunning) {
      if (gameState.currentPieceState === "FROZEN") {
        dispatch(gameStateActions.clearLines());
        dispatch(gameStateActions.checkIfGameWon());
        dispatch(gameStateActions.getNewPiece());
        dispatch(gameStateActions.getGhostCoords());
        dispatch(gameStateActions.showGhostPiece());
      } else {
        dispatch(gameStateActions.dropPiece());
        dispatch(gameStateActions.getGhostCoords());
        dispatch(gameStateActions.showGhostPiece());
      }
    }
  };

  useEffect(() => {
    const dropPieceInterval = window.setInterval(() => {
      gameLoop();
    }, 300);
    const handleInputInterval = window.setInterval(() => {
      keyHandler();
    }, 10);
    return () => {
      window.clearInterval(dropPieceInterval);
      window.clearInterval(handleInputInterval);
    };
  }, [gameState, gameLoop, keyState]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch(gameStateActions.gettingReady());
    }, 500);
    return () => {
      window.clearInterval(interval);
    };
  }, [gameState.displayMessage, dispatch]);

  const keyHandler = () => {
    if (!gameState.gameRunning) {
      return;
    }
    if (keyState["q"]) {
      dispatch(gameStateActions.rotatePiece(true));
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState["w"]) {
      dispatch(gameStateActions.rotatePiece(false));
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState["ArrowDown"]) {
      dispatch(gameStateActions.dropPiece());
    }
    if (keyState["ArrowRight"]) {
      dispatch(gameStateActions.shiftRight());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState["ArrowLeft"]) {
      dispatch(gameStateActions.shiftLeft());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState[" "]) {
      dispatch(gameStateActions.hardDrop());
    }
    if (keyState["Tab"]) {
      dispatch(gameStateActions.holdPiece());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
  };
  document.onkeydown = (keycode) => {
    if (keycode.key === "Escape") {
      dispatch(gameStateActions.newGame());
      dispatch(gameStateActions.getNewPiece());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
  };
  return (
    <Fragment>
      <h1>Ditris</h1>
      <button onClick={buttonClickHander}>Start/Pause</button>
      <button onClick={rotateButtonHandler}>Rotate</button>
      <button onClick={dropPieceHandler}>Drop</button>
      <button onClick={shiftLeftHandler}>Left</button>
      <button onClick={shiftRightHandler}>Right</button>
      <div className={styles.gameUI}>
        <HeldBlock />
        <Grid>
          <div  style={{ "align-items":"center",position: "absolute", top: 300,color:"yellow"}}>
            {gameState.displayMessage}
          </div>
        </Grid>
        <PieceQueue />
      </div>
    </Fragment>
  );
}

export default App;
