"use client";
import styles from "../timer.module.css";
import useTimer from "../hooks/useTimer";
import GameScore from "./gameScore";

const TimerBar = () => {
  const { progress, isRunning, startTimer, resetTimer, completed } =
    useTimer(5);

  return (
    <div className={styles.container}>
      <div className={styles.grayBar}>
        <div
          className={styles.buleBar}
          style={{
            width: `${progress}%`,
            backgroundColor:
              progress > 66 ? "red" : progress > 33 ? "yellow" : "green",
          }}
        />
      </div>
      <div>
        {completed && (
          <>
            <button className={styles.btn} onClick={resetTimer}>
              다시하기
            </button>
            <GameScore removedWords={[]} totalWordCount={0} />
          </>
        )}
      </div>
      {progress == 0 && (
        <button
          className={styles.btn}
          onClick={startTimer}
          disabled={isRunning}
        >
          START
        </button>
      )}
    </div>
  );
};

export default TimerBar;
