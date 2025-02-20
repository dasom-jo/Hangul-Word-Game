"use client";
import { useState, useEffect, useCallback } from "react";
import useTimer from "./useTimer";

export default function useWordGame() {
  const [word, setWord] = useState<string>("");
  const [koreanChars, setKoreanChars] = useState<string[]>([]);
  const [enChars, setEnChars] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // useTimer 훅 사용 (30초 타이머 기준)
  const { progress, isRunning, startTimer, resetTimer, completed } = useTimer(30);

  // 한글 단어만 필터링하는 함수
  const extractKoreanChars = (text: string): string[] => {
    return text.match(/[가-힣]+/g) || [];
  };

  // 영어 단어만 필터링하는 함수
  const extractEnChars = (text: string): string[] => {
    return text.match(/[a-zA-Z]+/g) || [];
  };

  // AI에서 새로운 단어 요청 (useCallback으로 최적화)
  const fetchNewWord = useCallback(async () => {
    try {
      const res = await fetch("/api/word", { cache: "no-store" });
      const data = await res.json();
      console.log("API 응답 데이터:", data);

      if (data.word) {
        setWord(data.word);
        setKoreanChars(extractKoreanChars(data.word));
        setEnChars(extractEnChars(data.word));
      } else {
        setGameOver(true);
      }
    } catch (error) {
      console.error("단어 불러오기 실패:", error);
      if (error instanceof Response && error.status === 429) {
        console.warn("API 쿼터 초과: 게임을 일시 중지합니다.");
        setGameOver(true);
      } else {
        setGameOver(true);
      }
    }
  }, [setWord, setKoreanChars, setEnChars, setGameOver]);

  // 타이머 상태에 따라 단어 요청 관리 (타이머 종료 시 중지)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && !completed && !gameOver) {
      // 타이머가 실행 중이고 완료되지 않았으며, 게임이 종료되지 않았을 때만 단어 요청 (5초 간격으로 조정)
      intervalId = setInterval(() => {
        fetchNewWord();
      }, 3000); // 1초 → 3초로 간격 늘리기 (쿼터 초과 및 렌더링 충돌 방지)
    }

    // cleanup: 타이머 종료, 게임 종료, 또는 컴포넌트 언마운트 시 인터벌 제거
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, completed, gameOver, fetchNewWord]);

  // 초기 단어 로드 및 상태 초기화 (렌더링 중 상태 변경 방지)
  useEffect(() => {
    if (progress === 0 && !isRunning && !completed) {
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
    setGameOver(false);
  }, [resetTimer]);

  return {
    word,
    koreanChars,
    score,
    gameOver,
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