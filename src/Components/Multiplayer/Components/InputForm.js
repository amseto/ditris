import { child, off, onValue, set } from "@firebase/database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameStateActions2, myRoomRef } from "../../../store/GameState2";
import Card from "../../UI/Card";

const InputForm = () => {
   const dispatch = useDispatch();
   const linesToClear = useSelector((state) => state.gameState2.linesToClear);
   const [linesToClearInput, setLinesToClearInput] = useState(linesToClear);

   const setLinesToClearInputChange = (event) => {
      if (event.target.value <= 0) {
         return;
      } else {
         setLinesToClearInput(+event.target.value);
      }
   };
   const setLinesToClearHandler = () => {
      off(child(myRoomRef, "linesToClear"));
      dispatch(gameStateActions2.setLinesToClear(linesToClearInput));
      set(child(myRoomRef, "linesToClear"), linesToClearInput);
   };

   onValue(child(myRoomRef, "linesToClear"), (snapshot) => {
      if (snapshot.exists()) {
         // setLinesToClearInput(snapshot.val())
         dispatch(gameStateActions2.setLinesToClear(snapshot.val()));
      }
   });

   return (
      <Card>
         <label id="lines">Lines to Clear </label>
         <input
            id="lines"
            type="number"
            value={linesToClearInput}
            onChange={setLinesToClearInputChange}
         ></input>
         <button onClick={setLinesToClearHandler}>set</button>
         <span> Current amount is {linesToClear}</span>
      </Card>
   );
};

export default InputForm;
