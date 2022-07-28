import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const KeyBinding = ({ controlName, input, setInput, currentKey }) => {
   const [bindingBeingChanged, setBindingBeingChanged] = useState(false);
   useEffect(() => {
      document.onkeydown = (keycode) => {
         if (bindingBeingChanged) {
            setInput(keycode.key);
         }
      };
   }, [bindingBeingChanged]);
   let displayWord = input;
   if (displayWord === " ") {
      displayWord = "space";
   }
   useEffect(() => {
      setInput(currentKey);
   },[currentKey]);
   return (
      <div>
         <label id={controlName}>{`${controlName} `}</label>
         <input
            onChange={(event) => {
               if (event.target.value.length === 1) {
                  event.target.blur();
               }
            }}
            onFocus={(event) => {
               setInput("");
               setBindingBeingChanged(true);
            }}
            onBlur={(event) => {
               if (event.target.value === "") {
                  setInput(currentKey);
               }
               setBindingBeingChanged(false);
            }}
            id={controlName}
            value={displayWord}
         ></input>
      </div>
   );
};
export default KeyBinding;
