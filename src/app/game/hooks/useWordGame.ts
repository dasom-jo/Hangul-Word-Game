"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import useTimer from "./useTimer";

interface Word {
  korean: string;
  x: number;
  y: number;
  speed: number;
}

const defaultWords: [string, string][] = [
  ["사과", "apple"],
  ["책", "book"],
  ["강아지", "puppy"],
  ["학교", "school"],
  ["노트북", "laptop"],
  ["연필", "pencil"],
  ["모니터", "monitor"],
  ["핸드폰", "phone"],
  ["의자", "chair"],
  ["책상", "desk"],
];

export default function useWordGame() {
  const [words, setWords] = useState<Word[]>([]);
  const wordsRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const { isRunning, startTimer, completed } = useTimer(30);

  //  **API에서 단어 가져오기**
  const fetchNewWords = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const res = await fetch("/api/word", { cache: "no-store" });
      if (!res.ok) throw new Error(`API 오류: ${res.status}`);

      const data = await res.json();
      console.log("📢 API 응답 데이터:", data);

      if (!data.word) throw new Error("데이터에 word 키가 없습니다.");

      let parsedWords;
      try {
        const cleanedData = data.word.replace(/^```json\n|```$/g, ""); // ```json 제거 후 파싱
        parsedWords = JSON.parse(cleanedData);
      } catch (error) {
        console.error("❌ JSON 파싱 오류:", error);
        parsedWords = defaultWords; // JSON 오류 시 기본 단어 사용
      }

      if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
        parsedWords = defaultWords;
      }

      const newWords = parsedWords.map(([korean]: [string, string]) => ({
        korean,
        x: Math.random() * (window.innerWidth - 100),
        y: -50,
        speed: Math.random() * 0.5 + 0.3,
      }));

      setWords((prevWords) => [...prevWords, ...newWords]);
    } catch (error) {
      console.error("❌ 단어 불러오기 실패:", error);

      setWords((prevWords) => [
        ...prevWords,
        ...defaultWords.map(([korean]) => ({
          korean,
          x: Math.random() * (window.innerWidth - 100),
          y: -50,
          speed: Math.random() * 0.5 + 0.3,
        })),
      ]);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  // **게임 시작 시 첫 단어 추가**
  useEffect(() => {
    if (isRunning && words.length === 0) {
      fetchNewWords();
    }
  }, [fetchNewWords, isRunning, words.length]);

  // **1초마다 단어 추가 (제한 없음)**
  useEffect(() => {
    if (!isRunning || completed) return;

    const intervalId = setInterval(() => {
      fetchNewWords();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isRunning, completed, fetchNewWords]);

  // **단어가 내려가는 로직 (계속 실행)**
  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) =>
        prevWords
          .map((word) => ({
            ...word,
            y: word.y + word.speed,
          }))
          .filter((word) => word.y < window.innerHeight + 50)
      );

      animationFrameRef.current = requestAnimationFrame(updateWords);
    };

    animationFrameRef.current = requestAnimationFrame(updateWords);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    words,
    wordsRef,
    startTimer,
    completed,
  };
}
