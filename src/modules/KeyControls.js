export let keyIsPressed = {};
export let keyIsShifted = {};
export let keyIsDisabled = {};
export let keyShiftCounter = {};

const KeyControls = () => {
  window.addEventListener("keydown", (event) => {
    keyIsPressed[event.key] = true
    if (event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  window.addEventListener("keyup", (event) => {
    keyShiftCounter[event.key] = 0
    keyIsPressed[event.key] = false
    keyIsDisabled[event.key] = false;
  });

  
};

export default KeyControls;
