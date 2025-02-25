"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import useTimer from "./useTimer"; // 30초 타이머 관리 커스텀 훅

export interface Word {
  korean: string;
  english: string;
  x: number;
  y: number;
  speed: number;
}
//api 오류등 단어 출력 불가시 내보낼 기본 단어
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

export default function useWordGame() {
  const [words, setWords] = useState<Word[]>([]); //화면 단어
  const wordsRef = useRef<HTMLDivElement | null>(null); //단어 표시를 위한 dom 요소 참조
  const [removedWords, setRemovedWords] = useState<Word[]>([]); // 화면 밖으로 벗어난 단어들을 저장
  const animationFrameRef = useRef<number | null>(null); //애니메이션 조정 및 무한루프 관리
  const [isFetching, setIsFetching] = useState(false);//중복 호출 관리
  const { isRunning, startTimer, completed } = useTimer(30); // 타이머 실행,현재진행상태,종료여부 관리

  //  API에서 단어 가져오기
  const fetchNewWords = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true); //api호출이 진행중임을 표시, true면 호출 진행중

    try {
      const res = await fetch("/api/word", { cache: "no-store" }); //엔드포인트에서 단어 리스트 가져옴
      if (!res.ok) throw new Error(`API 오류: ${res.status}`);//api 오류시

      const data = await res.json();//json으로 변환
      console.log("📢 API 응답 데이터:", data);

      if (!data.word) throw new Error("데이터에 word 키가 없습니다.");

      let parsedWords;
      try {
        const cleanedData = data.word.replace(/^```json\n|```$/g, ""); // ```json 제거 후 파싱
        parsedWords = JSON.parse(cleanedData);
      } catch (error) {
        console.error("❌ JSON 파싱 오류:", error);
        parsedWords = defaultWords; // JSON 오류 시 기본 단어 사용
      }
      //배열이 아니거나 빈 단어일 경우
      if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
        parsedWords = defaultWords;
      }
      //단어를 word객체로 변환하여 랜덤한 위치(x),초기 위치 (y=-50), 랜덤속도(0.3~0.8) 설정
      const newWords = parsedWords.map(([korean, english]: [string, string]) => ({
        korean,
        english, // 영어도 저장
        x: Math.random() * (window.innerWidth - 350),
        y: -50,
        speed: Math.random() * 0.5 + 0.3,
      }));
      console.log("📢 영어 단어 목록:", newWords.map(word => word.english));
      setWords((prevWords) => [...prevWords, ...newWords]); //기존단어에 새 단어 추가
    } catch (error) {
      console.error("❌ 단어 불러오기 실패:", error);
      //api오류시 defaultWords 를 사용하여 랜덤 배치
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
      setIsFetching(false); //호출 끝날시 false로 변경하여 다음 호출 가능하게
    }
  }, [isFetching]);

  // 게임 시작 시 첫 단어 추가
  useEffect(() => {
    if (isRunning && words.length === 0) { //타이머가 시작될 경우 호출
      fetchNewWords();
    }
  }, [fetchNewWords, isRunning, words.length]);

  // 2초마다 단어 추가
  useEffect(() => {
    if (!isRunning || completed) return;

    const intervalId = setInterval(() => {
      fetchNewWords();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isRunning, completed, fetchNewWords]);

  // 단어가 내려가는 로직
  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) => {
        // 각 단어의 y 값을 speed만큼 증가
        const updatedWords = prevWords.map((word) => ({
          ...word,
          y: word.y + word.speed,
        }));

        // 화면 내에 남는 단어들
        const remainingWords = updatedWords.filter(
          (word) => word.y < window.innerHeight + 50
        );

        // 화면 밖으로 벗어난 단어들 (예: 틀린 단어, 스코어 및 복습 페이지에서 사용)
        const newRemovedWords = updatedWords.filter(
          (word) => word.y >= window.innerHeight + 50
        );

        // 누적하여 export: 기존 removedWords에 새로 벗어난 단어들을 추가
        if (newRemovedWords.length > 0) {
          setRemovedWords((prevRemoved) => [
            ...prevRemoved,
            ...newRemovedWords,
          ]);
        }
        console.log("removedWords",removedWords);
        return remainingWords;
      });

      // 다음 애니메이션 프레임에 updateWords 함수 호출
      animationFrameRef.current = requestAnimationFrame(updateWords);
    };

    animationFrameRef.current = requestAnimationFrame(updateWords);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);


  return {
    words,//현재 단어 리스트
    wordsRef, // 단어를 표시할 ref 참조
    startTimer, //타이머 시작 함수
    completed, //게임 종료 여부
    setWords,
    removedWords,   // export된(누적된) 화면 밖 단어들
  };
}
