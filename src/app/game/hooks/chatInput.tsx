"use client";

import { useState, useEffect } from "react";

export default function WordGame() {
  const [word, setWord] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // AI에서 새로운 단어 요청
  const fetchNewWord = async () => {
    try {
      const res = await fetch("/api/word");
      const data = await res.json();
      console.log(data)
      if (data.word) {
        setWord(data.word);
      } else {
        setGameOver(true); // 오류 발생 시 게임 종료
      }
    } catch (error) {
      console.error("단어 불러오기 실패:", error);
      setGameOver(true);
    }
  };

  // 게임 시작 시 첫 단어 요청
  useEffect(() => {
    fetchNewWord();
  }, []);

  // 사용자 입력 확인 (임의의 로직 추가 가능)
  const handleAnswer = () => {
    setScore((prev) => prev + 1);
    fetchNewWord(); // 다음 단어 요청
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {gameOver ? (
        <h1 className="text-2xl font-bold text-red-600">게임 종료!</h1>
      ) : (
        <>
          <h1 className="text-3xl font-bold">현재 단어: {word}</h1>
          <p className="text-lg">점수: {score}</p>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={handleAnswer}
          >
            다음 단어 가져오기
          </button>
        </>
      )}
    </div>
  );
}
