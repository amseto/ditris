import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameStateActions } from "./store/GameState";

const GameLogic = () => {
  const dispatch = useDispatch();
  let gameState = useSelector((state) => state.gameState);

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
  });

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
      console.log("rotateLeft");
      dispatch(gameStateActions.rotatePiece(true));
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState["w"]) {
      console.log("rotateRight");
      dispatch(gameStateActions.rotatePiece(false));
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState["ArrowDown"]) {
      console.log("down");
      dispatch(gameStateActions.dropPiece());
    }
    if (keyState["ArrowRight"]) {
      console.log("right");
      dispatch(gameStateActions.shiftRight());
      dispatch(gameStateActions.getGhostCoords());
      dispatch(gameStateActions.showGhostPiece());
    }
    if (keyState["ArrowLeft"]) {
      console.log("left");
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
};

export default GameLogic
