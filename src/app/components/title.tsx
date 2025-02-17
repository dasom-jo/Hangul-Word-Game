"use client";
import styles from "./title.module.css";
const Title = () => {
  return (
    <div>
      {/* 상소문 스타일의 제목 표지 */}
      {/* 타이틀의 상단 봉 */}
      <div className={styles.bong1}></div>
      {/* 상소문의 글자 페이지 */}
      <div className={styles.page}>
        {/* 제목 */}
        <div className={styles.text_1}>한국어</div>
        <div className={styles.text_2}>낱말 게임</div>
      </div>
      {/* 상소문의 하단 봉 */}
      <div className={styles.bong2}></div>
    </div>
  );
};

export default Title;
