"use client";
import styles from "../studyBase.module.css";
import StudyWords from "./studyWords";

const Base = () => {
  return (
    <div className={styles.container}>
      <div className={styles.bong1}></div>
      <div className={styles.page}>
        <StudyWords />
      </div>
      <div className={styles.bong2}></div>
    </div>
  );
};

export default Base;
