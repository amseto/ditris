import { configureStore } from "@reduxjs/toolkit";

import gameStateReducer from "./GameState";
import userInfoReducer from "./UserInfo";

const store = configureStore({
   reducer: { gameState: gameStateReducer, userInfo: userInfoReducer },
});

export default store;
