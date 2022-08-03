import { useEffect } from "react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import Game from "../Components/GameUI/Game";

const SinglePlayer = () => {

   return (
      <Fragment>
         <h1>Ditris</h1>
         <Game></Game>
      </Fragment>
   );
};

export default SinglePlayer;
