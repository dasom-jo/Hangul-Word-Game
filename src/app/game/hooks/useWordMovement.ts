import { useEffect, useRef, useState } from "react";
import { Word } from "./useWordGame";
import { useSession } from "next-auth/react";

export default function useWordMovement(
  setWords: React.Dispatch<React.SetStateAction<Word[]>>
) {
  const [removedWords, setRemovedWords] = useState<Word[]>([]);
  const [correctWords, setCorrectWords] = useState<Word[]>([]);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);

  const animationFrameRef = useRef<number | null>(null);
  const removedWordsRef = useRef<Word[]>([]);
  const correctWordsRef = useRef<Word[]>([]);
  const { data: session } = useSession();
  const kakaoid = session?.user?.name || null;
  console.log("kakaoid----------------------",kakaoid);
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

            setTotalWordCount(removedWordsRef.current.length + correctWordsRef.current.length);

            // 로그인된 경우에만 서버로 데이터 전송
            if (kakaoid) {
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
  }, [correctWords, removedWords, setWords, totalWordCount, kakaoid]); // kakaoid도 의존성에 추가

  const addCorrectWord = (word: Word) => {
    if (!correctWordsRef.current.some((w) => w.korean === word.korean)) {
      correctWordsRef.current = [...correctWordsRef.current, word];
      setCorrectWords([...correctWordsRef.current]);

      setTotalWordCount(removedWordsRef.current.length + correctWordsRef.current.length);
    }
  };

  const saveFailedWordsToServer = async (words: Word[], kakaoid: string) => {
    if (!kakaoid) {
      console.error("❌ 유효하지 않은 kakaoid 값:", kakaoid);
      return;
    }

    try {
      console.log("🔍 서버로 보낼 데이터:", { words, kakaoid }); // ✅ 전송 데이터 확인

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


  return { removedWords, correctWords, totalWordCount, addCorrectWord };
}
