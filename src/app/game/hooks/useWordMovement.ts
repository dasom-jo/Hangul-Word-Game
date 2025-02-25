//단어 이동 및 제거 로직
"use client";
import { useEffect, useRef, useState } from "react";
import { Word } from "./useWordGame"; // Word 타입 가져오기

export default function useWordMovement(setWords: React.Dispatch<React.SetStateAction<Word[]>>) {
  const [removedWords, setRemovedWords] = useState<Word[]>([]); // 제거된 단어들 저장
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) => {
        const updatedWords = prevWords.map((word) => ({
          ...word,
          y: word.y + word.speed,
        }));

        const remainingWords = updatedWords.filter(
          (word) => word.y < window.innerHeight + 50
        );

        const newRemovedWords = updatedWords.filter(
          (word) => word.y >= window.innerHeight + 50
        );

        if (newRemovedWords.length > 0) {
          setRemovedWords((prevRemoved) => [...prevRemoved, ...newRemovedWords]);
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
  }, [setWords]);

  return { removedWords };
}
