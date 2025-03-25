"use client";
import { useRouter } from "next/navigation";
import styles from "./select.module.css";

const Select = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <button
        onClick={() => router.push("/game")}
        className={`${styles.btn} ${styles.startBtn}`}
      >
        게임 시작
      </button>
      <button
        onClick={() => router.push("/study")}
        className={`${styles.btn} ${styles.reviewBtn}`}
      >
        단어 복습
      </button>
    </div>
  );
};

export default Select;
