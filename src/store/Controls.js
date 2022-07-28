import { createSlice } from "@reduxjs/toolkit";

const initialControlsState = {
   newGame: "Escape",
   moveLeft: "ArrowLeft",
   moveRight: "ArrowRight",
   softDrop: "ArrowDown",
   hardDrop: " ",
   rotateLeft: "z",
   rotateRight: "ArrowUp",
   hold: "c",
};

const controlsSlice = createSlice({
   name: "controls",
   initialState: initialControlsState,
   reducers: {
      resetDefault(state) {
        state.newGame= "Escape";
        state.moveLeft= "ArrowLeft";
        state.moveRight= "ArrowRight";
        state.softDrop= "ArrowDown";
        state.hardDrop= " ";
        state.rotateLeft= "z";
        state.rotateRight= "ArrowUp";
        state.hold= "c";
      },
      resetAlbert(state) {
        state.newGame= "Escape";
        state.moveLeft= "ArrowLeft";
        state.moveRight= "ArrowRight";
        state.softDrop= "ArrowDown";
        state.hardDrop= " ";
        state.rotateLeft= "q";
        state.rotateRight= "w";
        state.hold= "Tab";
      },
      setNewControls(state,newControls){
        state.newGame= newControls.payload.newGame
        state.moveLeft= newControls.payload.moveLeft
        state.moveRight= newControls.payload.moveRight
        state.softDrop= newControls.payload.softDrop
        state.hardDrop= newControls.payload.hardDrop
        state.rotateLeft= newControls.payload.rotateLeft
        state.rotateRight= newControls.payload.rotateRight
        state.hold= newControls.payload.hold
      }
   },
});

export const controlsActions = controlsSlice.actions;

export default controlsSlice.reducer;