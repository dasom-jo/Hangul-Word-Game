"use client";
import { useState, useEffect, useRef } from "react";
import useTimer from "./useTimer"; // 타이머 관리 훅
import useWordFetch from "./useWordFetch"; // API 요청 훅
import useWordMovement from "./useWordMovement"; // 단어 이동 훅

export interface Word {
  korean: string;
  english: string;
  x: number;
  y: number;
  speed: number;
}

export default function useWordGame() {
  const [words, setWords] = useState<Word[]>([]); // 현재 화면에 표시되는 단어들
  const wordsRef = useRef<HTMLDivElement | null>(null); // 단어 표시 ref
  const { isRunning, startTimer, completed } = useTimer(30); // 타이머 상태 관리
  const { fetchNewWords } = useWordFetch(); // 단어 API 호출
  const { removedWords } = useWordMovement(setWords); // 단어 이동 및 제거 로직

  // 게임 시작 시 첫 단어 추가
  useEffect(() => {
    if (isRunning && words.length === 0) {
      fetchNewWords(setWords);
    }
  }, [fetchNewWords, isRunning, words.length]);

  // 2초마다 단어 추가
  useEffect(() => {
    if (!isRunning || completed) return;

    const intervalId = setInterval(() => {
      fetchNewWords(setWords);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isRunning, completed, fetchNewWords]);

  return {
    words, // 현재 단어 리스트
    wordsRef, // 단어를 표시할 ref 참조
    startTimer, // 타이머 시작 함수
    completed, // 게임 종료 여부
    setWords,
    removedWords, // 화면 밖으로 나간 단어들
  };
}
