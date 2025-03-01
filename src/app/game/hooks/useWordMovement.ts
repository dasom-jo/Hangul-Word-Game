"use client";
import { useEffect, useRef, useState } from "react";
import { Word } from "./useWordGame"; // Word 타입 가져오기

export default function useWordMovement(
  setWords: React.Dispatch<React.SetStateAction<Word[]>>
) {
  const [removedWords, setRemovedWords] = useState<Word[]>([]); // 제거된 단어 상태
  const [correctWords, setCorrectWords] = useState<Word[]>([]); // 맞춘 단어 상태
  const [totalWordCount, setTotalWordCount] = useState<number>(0); // 전체 단어 수 상태

  const animationFrameRef = useRef<number | null>(null);
  const removedWordsRef = useRef<Word[]>([]); // 제거된 단어 저장
  const correctWordsRef = useRef<Word[]>([]); // 맞춘 단어 저장

  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) => {
        const updatedWords = prevWords.map((word) => ({
          ...word,
          y: word.y + word.speed,
        }));
        //단어 화면안에 있음
        const remainingWords = updatedWords.filter(
          (word) => word.y < window.innerHeight + 50
        );
        //단어 화면 밖에 있음
        const newRemovedWords = updatedWords.filter(
          (word) => word.y >= window.innerHeight + 50
        );
        //제거된 단어 중복 방지
        if (newRemovedWords.length > 0) {
          const uniqueRemovedWords = newRemovedWords.filter(
            (word) =>
              !removedWordsRef.current.some(
                (removed) => removed.korean === word.korean
              )
          );

          if (uniqueRemovedWords.length > 0) {
            removedWordsRef.current = [
              ...removedWordsRef.current,
              ...uniqueRemovedWords,
            ];
            setRemovedWords([...removedWordsRef.current]);

            // 전체 단어 수 업데이트 (제거된 단어 + 맞춘 단어)
            setTotalWordCount(removedWordsRef.current.length + correctWordsRef.current.length);

            // 서버에 제거된 단어 저장 요청
            saveFailedWordsToServer(uniqueRemovedWords);
          }
        }

        return remainingWords;
      });

      animationFrameRef.current = requestAnimationFrame(updateWords);
    };

    animationFrameRef.current = requestAnimationFrame(updateWords);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [correctWords, removedWords, setWords, totalWordCount]);

  // 맞춘 단어 추가 함수
  const addCorrectWord = (word: Word) => {
    if (!correctWordsRef.current.some((w) => w.korean === word.korean)) {
      correctWordsRef.current = [...correctWordsRef.current, word];
      setCorrectWords([...correctWordsRef.current]);

      // 전체 단어 수 업데이트 (제거된 단어 + 맞춘 단어)
      setTotalWordCount(removedWordsRef.current.length + correctWordsRef.current.length);
    }
  };

  // 제거된 단어를 서버로 전송하는 함수
  const saveFailedWordsToServer = async (words: Word[]) => {
    try {
      const response = await fetch("/api/failedWords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words }),
      });

      if (!response.ok) {
        throw new Error(`서버 요청 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("제거된 단어 저장 실패:", error);
    }
  };

  return { removedWords, correctWords, totalWordCount, addCorrectWord };
}
