import { createSlice } from "@reduxjs/toolkit";

const userInfoInitialState = {
   isLoggedIn: false,
   roomStatus: null, //"looking for room" "waiting" "done waiting"
   otherUsers: [],
   roomKey: null,
   opponentName: "",
   oppoenentID: null,
   invitationKeys: [],
   grid : [],
};

const userInfoSlice = createSlice({
   name: "UserInfo",
   initialState: userInfoInitialState,
   reducers: {
      login(state) {
         state.isLoggedIn = true;
      },
      logout(state) {
         state.isLoggedIn = false;
      },
      setOtherUsers(state, users) {
         state.otherUsers = users;
      },
      setRoomKey(state, key) {
         state.roomKey = key;
      },
      setRoomStatus(state, newStatus) {
         state.roomStatus = newStatus;
      },
      setOpponentName(state, opponentName) {
         state.opponentName = opponentName;
      },
      setOpponentid(state, id) {
         state.opponentID = id;
      },
      setInvitiationKeys(state, keysList) {
         state.invitationKeys = keysList;
      },
      setGrid(state,grid){
         console.log(grid)
         state.grid = grid
      }
   },
});

export const userInfoActions = userInfoSlice.actions;

export default userInfoSlice.reducer;
