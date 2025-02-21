"use client";
import { useEffect, useRef, useState } from "react";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";

export default function WordGame() {
  const { koreanChars, completed } = useWordGame();
  const wordsRef = useRef<HTMLDivElement | null>(null);
  const [words, setWords] = useState<{ text: string; x: number; y: number; speed: number }[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (completed || !wordsRef.current) return;

    const wordsWidth = wordsRef.current.clientWidth; // ✅ `.words` 컨테이너의 실제 너비 가져오기
    const wordsLeft = wordsRef.current.getBoundingClientRect().top; // `.words`의 X 시작점

    // `.words` 영역 내에서 단어 랜덤 배치
    setWords(
      koreanChars.map((word) => ({
        text: word,
        x: Math.random() * (wordsWidth - 50) + wordsLeft, // ✅ words의 너비 범위 내에서만 X 좌표 설정
        y: Math.random() * -window.innerHeight, // 화면 위쪽에서 랜덤 시작
        speed: Math.random() * 2 + 1, // 속도 랜덤 (1~3)
      }))
    );
  }, [koreanChars, completed]);

  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) =>
        prevWords.map((word) => ({
          ...word,
          y: word.y + word.speed, // y값을 점점 증가 → 아래로 떨어짐
        }))
      );

      requestRef.current = requestAnimationFrame(updateWords);
    };

    requestRef.current = requestAnimationFrame(updateWords);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div ref={wordsRef} className={styles.words}>
      {words.map((word, index) => (
        <span
          key={index}
          className={styles.word}
          style={{
            position: "absolute",
            top: word.y + "px",
            left: word.x + "px",
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}
