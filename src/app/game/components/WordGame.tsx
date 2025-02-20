"use client";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";

export default function WordGame() {
  const { koreanChars, completed, gameOver } = useWordGame();

  return (
    <div>
      <div className={styles.words}>
        {!gameOver && !completed &&
          koreanChars.map((word, index) => (
            <span key={index} className={styles.word}>
              {word}
              {index !== koreanChars.length - 1 && ","}
            </span>
          ))}
      </div>
    </div>
  );
}