import styles from "./correctAnswer.module.css";

interface CorrectAnswerProps {
  x: number;
  y: number;
}

const CorrectAnswer = ({ x, y }: CorrectAnswerProps) => {
  return (
    <div
      className={styles.container}
      style={{
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <div className={styles.wing}></div>
    </div>
  );
};

export default CorrectAnswer;
