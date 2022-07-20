import { useSelector } from "react-redux";

const ReadyGo = () => {
   const gameState = useSelector((state) => state.gameState);
   return (
      <div
         style={{
            position: "absolute",
            color: "yellow",
            marginLeft: 90,
            marginTop: 240,
            fontSize:"300%",
            width:"100%"
         }}
      >
         {gameState.displayMessage}
      </div>
   );
};

export default ReadyGo;
