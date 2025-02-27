"use client";
import { useEffect, useRef, useState } from "react";
import { Word } from "./useWordGame"; // Word 타입 가져오기
//화면 밖으로 사라지는 단어
export default function useWordMovement(
  setWords: React.Dispatch<React.SetStateAction<Word[]>>
) {
  const [removedWords, setRemovedWords] = useState<Word[]>([]); // 제거된 단어 상태
  const animationFrameRef = useRef<number | null>(null);
  const removedWordsRef = useRef<Word[]>([]); // 최신 제거된 단어들 저장

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
          // 기존 제거된 단어 목록에 없는 새로운 단어만 추가 (ai 중복 단어 생성됨...)
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

            // 상태 업데이트하여 UI에서도 반영 가능하도록
            setRemovedWords([...removedWordsRef.current]);

            //console.log("총 제거된 단어 목록:", removedWordsRef.current);
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
  }, [setWords]);

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

      console.log("제거된 단어 서버 저장 완료");
    } catch (error) {
      console.error("제거된 단어 저장 실패:", error);
    }
  };

  return { removedWords }; // UI에서도 제거된 단어 목록을 활용 가능
}
