"use client";

import React from "react";
import styles from "./background.module.css";

export default function Background() {
  return (
    <div className={styles.container}>
      {/* 전체 화면 배경 비디오 */}
      <video className={styles.backgroundVideo} autoPlay loop muted playsInline>
        <source src="/video.mp4" type="video/mp4" />
      </video>
      {/* 정가운데 배치할 요소 */}
      <div className={styles.centerContent}>
        <button>카카오 로그인</button>
      </div>
    </div>
  );
}
