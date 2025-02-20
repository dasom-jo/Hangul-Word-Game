"use client";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";

export default function WordGame() {
  const { koreanChars, completed } = useWordGame();

  return (
    <div>
      <div className={styles.words}>
        {!completed &&
          koreanChars.map((word, index) => (
            <span key={index} className={styles.word}>
              {word}
              {index !== koreanChars.length - 1 }
            </span>
          ))}
      </div>
    </div>
  );
}