import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const StopWatch = () => {
   const gameRunning = useSelector((state) => state.gameState.gameRunning);
   const [miliseconds, setMiliseconds] = useState(0);
   const [seconds, setSeconds] = useState(0);
   const [minutes, setMinutes] = useState(0);

   useEffect(() => {
      let incrementInterval = null;
      if (gameRunning) {
        setMiliseconds(() => 0)
        setSeconds(() => 0)
        setMinutes(() => 0)
         incrementInterval = setInterval(() => {
            setMiliseconds((miliseconds) => miliseconds + 1);
         }, 10);
      }
      return () => {
         clearInterval(incrementInterval);
      };
   }, [gameRunning]);

   if (miliseconds === 100) {
      setSeconds(seconds + 1);
      setMiliseconds(0);
   }
   if (seconds === 60) {
      setMinutes(minutes + 1);
      setSeconds(0);
   }

   if (minutes) {
      return <div>{`Time ${minutes}:${seconds}:${miliseconds}`}</div>;
   } else if (seconds) {
      return <div>{`Time ${seconds}:${miliseconds}`}</div>;
   } else if (miliseconds) {
      return <div>{`Time 0:${miliseconds}`}</div>;
   }
   else{
      return <div>{`Time 0:00`}</div>
   }
};

export default StopWatch;
