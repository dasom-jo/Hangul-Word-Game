"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import useTimer from "./useTimer";

interface Word {
  korean: string;
  x: number;
  y: number;
  speed: number;
}

export default function useWordGame() {
  const [words, setWords] = useState<Word[]>([]);
  const wordsRef = useRef<HTMLDivElement | null>(null);
  const wordWidth = 100; // 단어 너비 지정
  const minSpacing = 110; // 단어 간 최소 간격

  // 타이머 (30초)
  const { progress, isRunning, startTimer, completed } = useTimer(30);

  // AI에서 새로운 단어 요청
  const fetchNewWord = useCallback(async () => {
    try {
      const res = await fetch("/api/word", { cache: "no-store" });
      if (!res.ok) throw new Error(`API 오류: ${res.status}`);
      const data = await res.json();

      console.log("📢 API 응답 데이터:", data);

      if (!data.word) throw new Error("데이터에 word 키가 없습니다.");

      let parsedWords;
      try {
        parsedWords = JSON.parse(data.word);
      } catch (error) {
        console.error("❌ JSON 파싱 오류:", error);
        throw new Error("word 데이터를 JSON 배열로 변환할 수 없습니다.");
      }

      if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
        throw new Error("올바른 데이터 형식이 아닙니다.");
      }

      // words 컨테이너 크기를 가져와 내부에서 랜덤 배치
      const wordsContainer = wordsRef.current;
      if (!wordsContainer) return;

      const containerRect = wordsContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // 단어가 서로 겹치지 않도록 위치 조정 함수
      const getNonOverlappingX = (existingWords: Word[]): number => {
        let x: number;
        let isOverlapping;

        do {
          x = Math.random() * (containerWidth - wordWidth); // 가장자리 방지
          isOverlapping = existingWords.some(
            (word) => Math.abs(word.x - x) < minSpacing // 일정 거리 유지
          );
        } while (isOverlapping);

        return x;
      };

      // 속도를 2배 느리게 조정 + 위치 충돌 방지
      const newWords = parsedWords.map(([korean]: [string, string]) => ({
        korean,
        x: getNonOverlappingX(words), // 겹치지 않는 X 좌표 배치
        y: -50, // words 컨테이너 상단에서 시작
        speed: (Math.random() * 1 + 0.5) / 2, // 기존 속도를 절반으로 줄임 (0.25 ~ 0.75)
      }));

      setWords((prevWords) => [...prevWords, ...newWords]);
    } catch (error) {
      console.error("❌ 단어 불러오기 실패:", error);
    }
  }, [words]); // words 의존성 추가 (겹치지 않게 반영)

  // 단어 떨어지는 속도를 2배 느리게
  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) =>
        prevWords
          .map((word) => ({
            ...word,
            y: word.y + word.speed, // 느리게 이동 (속도를 절반으로 줄였음)
          }))
          .filter((word) => word.y < window.innerHeight + 50) // 화면 아래로 나가면 삭제
      );

      requestAnimationFrame(updateWords);
    };

    requestAnimationFrame(updateWords);
  }, []);

  // 타이머가 실행 중일 때 단어 추가
  useEffect(() => {
    if (!isRunning || completed) return;

    const intervalId = setInterval(() => {
      fetchNewWord();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, completed, fetchNewWord]);

  // 초기 단어 로드
  useEffect(() => {
    if (progress === 0 && isRunning && !completed) {
      setWords([]);
      fetchNewWord();
    }
  }, [progress, isRunning, completed, fetchNewWord]);

  return {
    words,
    wordsRef,
    startTimer,
    completed,
  };
}
