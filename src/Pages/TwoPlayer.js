import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import "../modules/firebase-config";
import Login from "../Components/Multiplayer/Login";
import OtherUsers from "../Components/Multiplayer/OtherUsers";

import WaitingMessage from "../Components/Multiplayer/WaitingMessage";
import InviteNotification from "../Components/Multiplayer/InviteNotfications";
import Game from "../Components/GameUI/Game";
import GetGame from "../Components/Multiplayer/GetGame";

const TwoPlayer = () => {

   const userStatus = useSelector((state) => state.userInfo.roomStatus.payload);

   const playerNumber = useSelector((state) => state.gameState.playerNumber);

   return (
      <Fragment>
         <h1>Ditris Two-Player</h1>
         {userStatus === "looking for room" && <InviteNotification />}
         {userStatus === "looking for room" && <OtherUsers />}
         {userStatus === "waiting" && <WaitingMessage />}
         <Login></Login>
         {userStatus === "done waiting" && playerNumber === 1 && <Game></Game>}
         {userStatus === "done waiting" && playerNumber === 2 && <GetGame></GetGame>}
      </Fragment>
   );
};

export default TwoPlayer;
