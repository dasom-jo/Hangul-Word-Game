"use client";
import styles from "../score.module.css";
import { Word } from "../hooks/useWordGame"; // Word 타입 가져오기

interface GameScoreProps {
  removedWords: Word[];
  totalWordCount: number;
}

const GameScore: React.FC<GameScoreProps> = ({ removedWords, totalWordCount }) => {
  return (
    <div className={styles.scoreDiv}>
      <div className={styles.scoreText}>
        <h1>Game Score</h1>
        <p>총 단어 수: {totalWordCount}</p>
        <p>틀린 단어 수: {removedWords.length}</p>
      </div>
    </div>
  );
};

export default GameScore;
