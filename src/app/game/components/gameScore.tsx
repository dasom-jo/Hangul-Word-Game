"use client";
import useWordGame from "../hooks/useWordGame";
import styles from "../score.module.css";
const GameScore = () => {
  const { words, removedWords } = useWordGame(); // wordsRef 사용
    console.log("removedWords",removedWords);
  return (
    <div className={styles.scoreDiv}>
      <div className={styles.scoreText}>
        <h1>Game Score</h1>
        <p>총 단어 수: {words.length}</p>
        <p>틀린 단어 수: {removedWords.length}</p>
      </div>
    </div>
  );
};

export default GameScore;
