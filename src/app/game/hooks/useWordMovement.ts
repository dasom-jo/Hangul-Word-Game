import { useEffect, useRef } from "react";
import { Word } from "./useWordGame";
import { useSession } from "next-auth/react";
import useTimer from "./useTimer";
import { useWordContext } from "../../contexts/wordContext"; // ✅ Context 가져오기

export default function useWordMovement(
  setWords: React.Dispatch<React.SetStateAction<Word[]>>,
) {
  const animationFrameRef = useRef<number | null>(null);
  const removedWordsRef = useRef<Word[]>([]);
  const { data: session } = useSession();
  const kakaoid = session?.user?.name || null;
  const { isRunning } = useTimer();
  const { addRemovedWords } = useWordContext(); // ✅ 전역 상태 사용

  useEffect(() => {
    const updateWords = () => {
      setWords((prevWords) => {
        const updatedWords = prevWords.map((word) => ({
          ...word,
          y: word.y + word.speed,
        }));

        const remainingWords = updatedWords.filter(
          (word) => word.y < window.innerHeight + 50,
        );

        const newRemovedWords = updatedWords.filter(
          (word) => word.y >= window.innerHeight + 50,
        );

        if (newRemovedWords.length > 0) {
          const uniqueRemovedWords = newRemovedWords.filter(
            (word) =>
              !removedWordsRef.current.some(
                (removed) => removed.korean === word.korean,
              ),
          );

          if (uniqueRemovedWords.length > 0) {
            removedWordsRef.current = [
              ...removedWordsRef.current,
              ...uniqueRemovedWords,
            ];

            // 틀린 단어 전역 상태 업데이트
            addRemovedWords(uniqueRemovedWords);

            // 로그인된 경우에만 서버로 데이터 전송
            if (kakaoid && isRunning) {
              saveFailedWordsToServer(uniqueRemovedWords, kakaoid);
            }
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
  }, [setWords, kakaoid, isRunning, addRemovedWords]); // 의존성 배열 수정

  const saveFailedWordsToServer = async (words: Word[], kakaoid: string) => {
    if (!kakaoid) {
      console.error("❌ 유효하지 않은 kakaoid 값:", kakaoid);
      return;
    }

    try {
      console.log("🔍 서버로 보낼 데이터:", { words, kakaoid });

      const response = await fetch("/api/failedWords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words, kakaoid }),
      });

      if (!response.ok) {
        throw new Error(`서버 요청 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ 제거된 단어 저장 실패:", error);
    }
  };

  // removedWords 반환 추가
  return { removedWords: removedWordsRef.current };
}
