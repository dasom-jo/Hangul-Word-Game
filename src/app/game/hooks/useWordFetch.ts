// api에서 단어를 가져오는 로직
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
  const [isFetching, setIsFetching] = useState(false); // API 중복 호출 방지

  const fetchNewWords = useCallback(async (setWords: React.Dispatch<React.SetStateAction<Word[]>>) => {
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
        const cleanedData = data.word.replace(/^```json\n|```$/g, "");
        parsedWords = JSON.parse(cleanedData);
      } catch (error) {
        console.error("❌ JSON 파싱 오류:", error);
        parsedWords = defaultWords;
      }

      if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
        parsedWords = defaultWords;
      }

      const newWords = parsedWords.map(([korean, english]: [string, string]) => ({
        korean,
        english,
        x: Math.random() * (window.innerWidth - 350),
        y: -50,
        speed: Math.random() * 0.5 + 0.3,
      }));

      console.log("📢 영어 단어 목록:", newWords.map((word) => word.english));

      setWords((prevWords) => [...prevWords, ...newWords]); // 기존 단어에 추가
    } catch (error) {
      console.error("❌ 단어 불러오기 실패:", error);

      setWords((prevWords) => [
        ...prevWords,
        ...defaultWords.map(([korean, english]) => ({
          korean,
          english,
          x: Math.random() * (window.innerWidth - 100),
          y: -50,
          speed: Math.random() * 0.5 + 0.3,
        })),
      ]);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  return { fetchNewWords };
}
