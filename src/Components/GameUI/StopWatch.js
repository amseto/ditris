import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from './StopWatch.module.css'

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
         }, 100);
      }
      return () => {
         clearInterval(incrementInterval);
      };
   }, [gameRunning]);

   if (miliseconds === 10) {
      setSeconds(seconds + 1);
      setMiliseconds(0);
   }
   if (seconds === 60) {
      setMinutes(minutes + 1);
      setSeconds(0);
   }

   if (minutes) {
      return <div className={styles.stopWatch}>{`Time ${minutes}:${seconds}:${miliseconds}`}</div>;
   } else if (seconds) {
      return <div className={styles.stopWatch}>{`Time ${seconds}:${miliseconds}`}</div>;
   } else if (miliseconds) {
      return <div className={styles.stopWatch}>{`Time 0:${miliseconds}`}</div>;
   }
};

export default StopWatch;
