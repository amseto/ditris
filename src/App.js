import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./gameUI.module.css";

import { gameStateActions } from "./store/GameState";
import Grid from "./Components/Grid";
import PieceQueue from "./Components/PieceQueue";
import HeldBlock from "./Components/HeldBlock";

import {keyShiftCounter,keyIsPressed,keyIsDisabled} from "./modules/KeyControls";
import KeyControls from "./modules/KeyControls"
import HowToPlay from "./Components/HowToPlay";

function App() {
  const dispatch = useDispatch();
  const gameRunning =  useSelector((state) => state.gameState.gameRunning);
  const currentPieceState = useSelector((state) => state.gameState.currentPieceState);
  const displayMessage = useSelector((state) => state.gameState.displayMessage);


  const gameLoop = () => {
    if (gameRunning) {
      if (currentPieceState === "FROZEN") {
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
    }, 1);
    const shiftInputInterval = window.setInterval(()=>{
      keyShiftHandler();
    },1)

    return () => {
      window.clearInterval(dropPieceInterval);
      window.clearInterval(handleInputInterval);
      window.clearInterval(shiftInputInterval);
    };
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch(gameStateActions.gettingReady());
    }, 500);
    return () => {
      window.clearInterval(interval);
    };
  }, [displayMessage, dispatch]);


  const keyShiftHandler = () =>{
    if (!gameRunning) {
      return;
    }
    for (let key in keyShiftCounter){
      if(keyShiftCounter[key]){
        keyShiftCounter[key]+=1
      }
    }
    if (keyIsPressed["ArrowDown"]&&keyIsDisabled["ArrowDown"]&&keyShiftCounter["ArrowDown"]>40) {
      console.log("down");
      dispatch(gameStateActions.dropPiece());
      keyIsDisabled["ArrowDown"] = true
      keyShiftCounter["ArrowDown"]=20
    }
    if (keyIsPressed["ArrowRight"]&&keyIsDisabled["ArrowRight"]&&keyShiftCounter["ArrowRight"]>40) {
      console.log("right");
      dispatch(gameStateActions.shiftRight());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["ArrowRight"] = true
      keyShiftCounter["ArrowRight"]=20
    }
    if (keyIsPressed["ArrowLeft"]&&keyIsDisabled["ArrowLeft"]&&keyShiftCounter["ArrowLeft"]>40) {
      console.log("left");
      dispatch(gameStateActions.shiftLeft());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["ArrowLeft"] = true
      keyShiftCounter["ArrowLeft"]=20
    }

  }
  const keyHandler = () => {
    if (!gameRunning) {
      return;
    }
    if (keyIsPressed["q"]&&!keyIsDisabled["q"]) {
      console.log("rotateLeft");
      dispatch(gameStateActions.rotatePiece(true));
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["q"] = true
    }
    if (keyIsPressed["w"]&&!keyIsDisabled["w"]) {
      console.log("rotateRight");
      dispatch(gameStateActions.rotatePiece(false));
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["w"] = true
    }
    if (keyIsPressed[" "]&&!keyIsDisabled[" "]) {
      dispatch(gameStateActions.hardDrop());
      keyIsDisabled[" "] = true
    }
    if (keyIsPressed["Tab"]&&!keyIsDisabled["Tab"]) {
      dispatch(gameStateActions.holdPiece());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["Tab"] = true
    }
    if (keyIsPressed["ArrowDown"]&&!keyIsDisabled["ArrowDown"]) {
      dispatch(gameStateActions.dropPiece());
      keyIsDisabled["ArrowDown"] = true
    }
    if (keyIsPressed["ArrowRight"]&&!keyIsDisabled["ArrowRight"]) {
      keyShiftCounter["ArrowRight"] = 1
      dispatch(gameStateActions.shiftRight());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["ArrowRight"] = true
    }
    if (keyIsPressed["ArrowLeft"]&&!keyIsDisabled["ArrowLeft"]) {
      keyShiftCounter["ArrowLeft"] = 1
      dispatch(gameStateActions.shiftLeft());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
      keyIsDisabled["ArrowLeft"] = true
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
      <KeyControls/>
      <h1>Ditris</h1>
      <div className={styles.gameUI}>
        <HeldBlock />
        <Grid></Grid>
        <PieceQueue />
      </div>
      <HowToPlay></HowToPlay>
    </Fragment>
  );
}

export default App;
