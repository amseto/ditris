import { child, off, onValue } from "@firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { myRoomRef } from "../../store/GameState";
import { userInfoActions } from "../../store/UserInfo";
import Grid from "../GameUI/Grid";

const GetGame = () => {
   const dispatch = useDispatch();
   // off(child(myRoomRef, "grid"))
   const gridRef = child(myRoomRef, "grid");
   onValue(gridRef, (snapshot) => {
      console.log('here')
      if (snapshot.exists()) {
         dispatch(userInfoActions.setGrid(snapshot.val()));
      }
   });

   return <Grid></Grid>;
};

export default GetGame;
