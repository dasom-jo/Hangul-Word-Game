"use client";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";

export default function WordGame() {
  const { words, wordsRef } = useWordGame(); // wordsRef 사용

  return (
    <div>
      <div ref={wordsRef} className={styles.words}>
        {words.map((word, index) => (
          <div
            key={index}
            className={styles.wordContainer}
            style={{
              position: "absolute",
              top: word.y + "px",
              left: word.x + "px",
            }}
          >
            <span className={styles.wordKorean}>{word.korean}</span>
          </div>
        ))}
      </div>
      <div className={styles.inputDiv}>
        <input
          className={styles.inputText}
          type="text"
          placeholder="영어를 입력하세요"
        />
        <button className={styles.inputBtn}>전송</button>
      </div>
    </div>
  );
}
