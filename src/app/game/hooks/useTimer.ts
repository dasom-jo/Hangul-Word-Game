"use client";
import { useEffect, useState } from "react";
import useStartBtn from "../store/startBtn";

const useTimer = (duration = 30) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false); // 타이머 완료 여부
  const { isRunning, startTimer, stopTimer } = useStartBtn();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / duration;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setCompleted(true), 5000); // 5초 후 버튼 표시
          stopTimer();
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, stopTimer, duration]);

  const resetTimer = () => {
    setProgress(0);
    setCompleted(false); // 다시하기 버튼 숨김
    stopTimer();
  };

  return { progress, isRunning, startTimer, resetTimer, completed };
};

export default useTimer;
