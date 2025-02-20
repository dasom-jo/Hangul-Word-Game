"use client";
import { useCallback, useEffect, useState } from "react";
import useTimerStore from "../store/timerStore";

const useTimer = (duration = 5) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { isRunning, startTimer, stopTimer } = useTimerStore();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / duration;
        if (newProgress >= 100) {
          clearInterval(interval);
          stopTimer(); // 먼저 타이머 멈춤
          setProgress(100); // progress를 명시적으로 100으로 설정
          setTimeout(() => setCompleted(true), 5000); // 5초 후 completed 설정
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, stopTimer, duration]);

  const resetTimer = useCallback(() => {
    setProgress(0);
    setCompleted(false);
    stopTimer();
  }, [stopTimer]);

  return { progress, isRunning, startTimer, resetTimer, completed };
};

export default useTimer;