import styles from "./select.module.css";

const Select = () => {
  return (
    <div className={styles.container}>
      <button className={`${styles.btn} ${styles.startBtn}`}>게임 시작</button>
      <button className={`${styles.btn} ${styles.reviewBtn}`}>단어 복습</button>
    </div>
  );
};

export default Select;
