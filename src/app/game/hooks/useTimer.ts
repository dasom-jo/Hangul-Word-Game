"use client";
import { useCallback, useEffect, useState } from "react";
import useTimerStore from "../store/timerStore";

const useTimer = (duration = 30) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { isRunning, startTimer, stopTimer } = useTimerStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / duration;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            setTimeout(() => {
              stopTimer();
              setProgress(100);
              setCompleted(true);
            }, 0);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, stopTimer, duration]);

  const resetTimer = useCallback(() => {
    setProgress(0);
    setCompleted(false);
    stopTimer();
  }, [stopTimer]);

  return { progress, isRunning, startTimer, resetTimer, completed };
};

export default useTimer;