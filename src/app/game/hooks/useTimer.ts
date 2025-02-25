"use client";
import { useEffect, useState } from "react";
import useTimerStore from "../store/timerStore";

const useTimer = (duration = 30) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { isRunning, startTimer, stopTimer } = useTimerStore(); //타이머실행여부,타이머시작함수,타이머정지함수

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / duration; //100% / 30초 => 1초마다 증가
          if (newProgress >= 100) {
            clearInterval(intervalId); //타이머 종류
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
  //다시보기 시  새로고침
  const resetTimer = () => {
    window.location.reload();
  };

  return { progress, isRunning, startTimer, resetTimer, completed };
};

export default useTimer;
