"use client";
import { useState, useCallback } from "react";
import { Word } from "./useWordGame"; // Word 타입 가져오기

// 기본 단어 리스트
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

export default function useWordFetch() {
  const [isFetching, setIsFetching] = useState(false); // 상태 변수

  const fetchNewWords = useCallback(
    async (setWords: React.Dispatch<React.SetStateAction<Word[]>>) => {
      if (isFetching) return; // 중복 요청 방지
      setIsFetching(true);

      let parsedWords: [string, string][] = [];

      try {
        const res = await fetch("/api/word", { cache: "no-store" });
        if (!res.ok) throw new Error(`API 오류: ${res.status}`);

        const data = await res.json();
        console.log("API 응답 데이터:", data);

        if (!data.word) throw new Error("데이터에 word 키가 없습니다.");

        try {
          const cleanedData = data.word.replace(/^```json\n|```$/g, "");
          parsedWords = JSON.parse(cleanedData);
        } catch (error) {
          console.error("JSON 파싱 오류:", error);
          parsedWords = defaultWords;
        }

        if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
          parsedWords = defaultWords;
        }
      } catch (error) {
        console.error("단어 불러오기 실패:", error);
        parsedWords = defaultWords; // API 실패 시 기본 단어 사용
      } finally {
        // 항상 실행되는 finally 블록
        setWords((prevWords) => {
          const newWords = [];
          const minDistance = 80; // 단어 간 최소 거리 설정 (px)
          const maxAttempts = 50; // 무한 루프 방지 (최대 시도 횟수)

          for (const [korean, english] of parsedWords) {
            let x: number, y: number, isOverlapping;
            let attempts = 0;

            do {
              x = Math.random() * (700 - 150);
              y = Math.random() * (window.innerHeight - 150);
              isOverlapping = prevWords.some(
                (word) =>
                  Math.abs(word.x - x) < minDistance &&
                  Math.abs(word.y - y) < minDistance,
              );
              attempts++;
            } while (isOverlapping && attempts < maxAttempts);

            newWords.push({
              korean,
              english,
              x,
              y: -50,
              speed: Math.random() * 0.5 + 0.3,
            });
          }

          return [...prevWords, ...newWords];
        });

        setIsFetching(false); // 반드시 실행되도록 finally에서 처리
      }
    },
    [isFetching],
  ); // `isFetching` 제거 (최신 상태 반영 가능하도록)

  return { fetchNewWords };
}
