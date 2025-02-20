"use client";
import { useState, useEffect, useCallback } from "react";
import useTimer from "./useTimer";

export default function useWordGame() {
  const [word, setWord] = useState<string>("");
  const [koreanChars, setKoreanChars] = useState<string[]>([]);
  const [enChars, setEnChars] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);

  // useTimer 훅 사용 (30초 타이머 기준)
  const { progress, isRunning, startTimer, resetTimer, completed } = useTimer(30);

  // 한글 단어만 필터링하는 함수
  const extractKoreanChars = (text: string): string[] => text.match(/[가-힣]+/g) || [];

  // 영어 단어만 필터링하는 함수
  const extractEnChars = (text: string): string[] => text.match(/[a-zA-Z]+/g) || [];

  // AI에서 새로운 단어 요청 (useCallback으로 최적화)
  const fetchNewWord = useCallback(async () => {
    try {
      const res = await fetch("/api/word", { cache: "no-store" });
      if (!res.ok) throw new Error(`API 오류: ${res.status}`);
      const data = await res.json();

      console.log("API 응답 데이터:", data);

      if (data.word) {
        setWord(data.word);
        setKoreanChars(extractKoreanChars(data.word));//한글
        setEnChars(extractEnChars(data.word));//영어
      } else {
        throw new Error("단어가 없습니다.");
      }
    } catch (error) {
      console.error("단어 불러오기 실패:", error);
    }
  }, []);

  // 타이머가 실행 중일 때 3초마다 단어 요청 (completed가 true이면 중단)
  useEffect(() => {
    if (!isRunning || completed) return; // 타이머가 멈추거나 끝나면 요청 중지

    const intervalId = setInterval(() => {
      fetchNewWord();
    }, 3000); // 3초 간격

    return () => clearInterval(intervalId); // 정리 함수
  }, [isRunning, completed, fetchNewWord]);

  // 초기 단어 로드
  useEffect(() => {
    if (progress === 0 && isRunning && !completed) {
      setWord("");
      setKoreanChars([]);
      setEnChars([]);
      fetchNewWord(); // 초기 단어 로드
    }
  }, [progress, isRunning, completed, fetchNewWord]);

  // "다시하기" 버튼 호출 시 상태 초기화
  const handleReset = useCallback(() => {
    resetTimer();
    setWord("");
    setKoreanChars([]);
    setEnChars([]);
    setScore(0);
  }, [resetTimer]);

  return {
    word,
    koreanChars,
    score,
    enChars,
    fetchNewWord,
    increaseScore: () => setScore((prev) => prev + 1),
    progress,
    isRunning,
    startTimer,
    resetTimer: handleReset,
    completed,
  };
}
