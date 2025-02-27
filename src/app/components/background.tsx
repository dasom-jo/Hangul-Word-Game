"use client";
import React from "react";
import { usePathname } from "next/navigation"; // 현재 경로 가져오기
import styles from "./background.module.css";

export default function Background() {
  const pathname = usePathname(); // 현재 URL 경로 가져오기

  return (
    <div className={styles.container}>
      {/* 전체 화면 배경 비디오 */}
      <video className={styles.backgroundVideo} autoPlay loop muted playsInline>
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* 게임일때 화면 대비를 위해 */}
      {pathname === "/" ? (
        <div className={styles.centerContent}></div>
      ) : (
        <div className={styles.centerContent2}></div>
      )}
    </div>
  );
}
