import { useEffect, useState } from "react";

const KeyBinding = ({ controlName, input, setInput, currentKey }) => {
   const [bindingBeingChanged, setBindingBeingChanged] = useState(false);
   useEffect(() => {
      document.onkeydown = (keycode) => {
         if (bindingBeingChanged) {
            setInput(keycode.key);
         }
      };
   }, [bindingBeingChanged,setInput]);
   let displayWord = input;
   if (displayWord === " ") {
      displayWord = "space";
   }
   useEffect(() => {
      setInput(currentKey);
   },[currentKey,setInput]);
   return (
      <div>
         <label htmlFor={controlName}>{`${controlName} `}</label>
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
