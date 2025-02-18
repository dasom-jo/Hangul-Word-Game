"use client";
import styles from "../timer.module.css";
import useTimer from "../hooks/useTimer";

const TimerBar = () => {
  const { progress, isRunning, startTimer, resetTimer,completed } = useTimer(5);

  return (
    <div className={styles.container}>
      {completed && (
        <button className={styles.btn} onClick={resetTimer}>
          다시하기
        </button>
      )}
      {progress !== 100 && (
        <button
          className={styles.btn}
          onClick={startTimer}
          disabled={isRunning}
        >
          시작
        </button>
      )}
      <div className={styles.grayBar}>
        <div className={styles.buleBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default TimerBar;
