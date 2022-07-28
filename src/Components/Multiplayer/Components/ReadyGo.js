import { useSelector } from "react-redux";

const ReadyGo = () => {
   const displayMessage = useSelector((state) => state.gameState2.displayMessage);
   if (displayMessage === "in game") {
      return;
   } else {
      return (
         <div
         style={{
            position: "absolute",
            color: "yellow",
            marginTop: 200,
            fontSize:"100%",
            flexDirection:"column",
         }}
      >
            {displayMessage}
         </div>
      );
   }
};

export default ReadyGo;
