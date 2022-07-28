import { child } from "@firebase/database";
import { createSlice } from "@reduxjs/toolkit";
import { onlineUsersRef } from "../modules/firebase-config";

export let opponentRef = null;
const userInfoInitialState = {
   isLoggedIn: false,
   roomStatus: null, //"looking for room" "waiting" "in room"

   otherUsers: [], //other users that aren't you
   roomKey: null, //key for the room you are in
   opponentName: "", // name of your opponent, empty if not in room
   opponentID: null, // id of your oppponent, null opponent hasn't been chosen
   invitationKeys: [], // keys of rooms that you are invited to

   grid: [], // grid of game from opponent

   displayText:""
};

const userInfoSlice = createSlice({
   name: "UserInfo",
   initialState: userInfoInitialState,
   reducers: {
      reset(state) {
         state.roomStatus = "looking for room";
         state.otherUsers = [];
         state.roomKey = null;
         state.opponentName = "";
         state.opponentID = null;
         state.invitationKeys = [];
         state.grid = [];
         state.myName = ""
         opponentRef = null;

      },
      login(state) {
         state.isLoggedIn = true;
      },
      logout(state) {
         state.isLoggedIn = false;
      },
      setOtherUsers(state, users) {
         state.otherUsers = users.payload;
      },
      setRoomKey(state, key) {
         state.roomKey = key.payload;
      },
      setRoomStatus(state, newStatus) {
         state.roomStatus = newStatus.payload;
      },
      setOpponentName(state, opponentName) {

         state.opponentName = opponentName.payload;
      },
      setOpponentid(state, id) {
         if (id.payload) {
            opponentRef = child(onlineUsersRef, id.payload);
         }
         state.opponentID = id.payload;
      },
      setInvitiationKeys(state, keysList) {
         state.invitationKeys = keysList.payload;
      },
      setGrid(state, grid) {
         state.grid = grid;
      },
      setDisplayText(state,text){
         state.displayText = text.payload
      }
   },
});

export const userInfoActions = userInfoSlice.actions;

export default userInfoSlice.reducer;
