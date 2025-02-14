"use client";
import styles from "./title.module.css";
const Title = () => {
  return (
    <div>
      <div className={styles.bong1}></div>
      <div className={styles.page}>
        <div className={styles.text_1}>한국어</div>
        <div className={styles.text_2}>낱말 게임</div>
      </div>
      <div className={styles.bong2}></div>
    </div>
  );
};

export default Title;
