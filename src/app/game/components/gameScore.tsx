"use client";
import styles from "../score.module.css";
import { useWordContext } from "../../contexts/wordContext"; // ✅ Context 사용
interface GameScoreProps {
  removedWords: number;
  totalWordCount: number;
}
const GameScore: React.FC<GameScoreProps> = () => {
  const { matchedWords, removedWords } = useWordContext();

  return (
    <div className={styles.scoreDiv}>
      <div className={styles.scoreText}>
        <h1>Game Score</h1>
        <p style={{ color: "blue" }}>맞은 갯수 + {matchedWords.length}</p>
        <p style={{ color: "red" }}>틀린 갯수 - {removedWords.length}</p>
      </div>
    </div>
  );
};

export default GameScore;
