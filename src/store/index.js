import { configureStore } from "@reduxjs/toolkit";

import gameStateReducer from "./GameState";
import userInfoReducer from "./UserInfo";
import gameStateReducer2 from "./GameState2";
import controlsSliceReducer from "./Controls"

const store = configureStore({
   reducer: {
      gameState: gameStateReducer,
      userInfo: userInfoReducer,
      gameState2: gameStateReducer2,
      controls: controlsSliceReducer,
   },
});

export default store;
