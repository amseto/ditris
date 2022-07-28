import { useSelector } from "react-redux";

const ReadyGo = () => {
   const gameState = useSelector((state) => state.gameState);
   return (
      <div
         style={{
            position: "absolute",
            color: "yellow",
            marginTop: 200,
            fontSize:"300%",
            flexDirection:"column",
         }}
      >
         {gameState.displayMessage}
      </div>
   );
};

export default ReadyGo;
