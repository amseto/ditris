import {configureStore } from "@reduxjs/toolkit";

import gameStateReducer from './GameState'




const store = configureStore({
    reducer:{gameState:gameStateReducer}
})

export default store
