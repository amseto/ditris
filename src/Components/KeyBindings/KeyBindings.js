import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { controlsActions } from "../../store/Controls";
import Modal from "../UI/Modal";
import KeyBinding from "./KeyBinding";

const KeyBindings = ({ setShowKeyBindings }) => {
   const dispatch = useDispatch();
   const controls = useSelector((state) => state.controls);
   const [newGameInput, setNewGameInput] = useState(controls["newGame"]);
   const [rotateRightInput, setRotateRightInput] = useState(controls["rotateRight"]);
   const [rotateLeftInput, setRotateLeftInput] = useState(controls["rotateLeft"]);
   const [holdInput, setHoldInput] = useState(controls["hold"]);
   const [hardDropInput, setHardDropInput] = useState(controls["hardDrop"]);
   const [softDropInput, setSoftDropInput] = useState(controls["softDrop"]);
   const [moveLeftInput, setMoveLeftInput] = useState(controls["moveLeft"]);
   const [moveRightInput, setMoveRightInput] = useState(controls["moveRight"]);
   return (
      <Modal
         onClick={() => {
            setShowKeyBindings(false);
         }}
      >
         <button
            onClick={() => {
               setShowKeyBindings(false);
            }}
            style={{ float: "right" }}
         >
            x
         </button>
         <KeyBinding
            controlName="newGame"
            currentKey={controls["newGame"]}
            input={newGameInput}
            setInput={setNewGameInput}
         />
         <KeyBinding
            currentKey={controls["rotateRight"]}
            controlName="rotateRight"
            input={rotateRightInput}
            setInput={setRotateRightInput}
         />
         <KeyBinding
            currentKey={controls["rotateLeft"]}
            controlName="rotateLeft"
            input={rotateLeftInput}
            setInput={setRotateLeftInput}
         />
         <KeyBinding
            currentKey={controls["hold"]}
            controlName="hold"
            input={holdInput}
            setInput={setHoldInput}
         />
         <KeyBinding
            currentKey={controls["hardDrop"]}
            controlName="hardDrop"
            input={hardDropInput}
            setInput={setHardDropInput}
         />
         <KeyBinding
            currentKey={controls["softDrop"]}
            controlName="softDrop"
            input={softDropInput}
            setInput={setSoftDropInput}
         />
         <KeyBinding
            currentKey={controls["moveLeft"]}
            controlName="moveLeft"
            input={moveLeftInput}
            setInput={setMoveLeftInput}
         />
         <KeyBinding
            currentKey={controls["moveRight"]}
            controlName="moveRight"
            input={moveRightInput}
            setInput={setMoveRightInput}
         />
         <div>
            <button
               onClick={() => {
                  dispatch(controlsActions.resetDefault());
               }}
            >
               Default
            </button>
            <button
               onClick={() => {
                  dispatch(controlsActions.resetAlbert());
               }}
            >
               Albert
            </button>
            <button
               onClick={() => {
                  dispatch(
                     controlsActions.setNewControls({
                        newGame: newGameInput,
                        rotateRight: rotateRightInput,
                        rotateLeft: rotateLeftInput,
                        hardDrop:hardDropInput,
                        softDrop:softDropInput,
                        moveLeft:moveLeftInput,
                        moveRight:moveRightInput,
                        hold:holdInput
                     })
                  );
               }}
            >
               Save
            </button>
         </div>
      </Modal>
   );
};
export default KeyBindings;
