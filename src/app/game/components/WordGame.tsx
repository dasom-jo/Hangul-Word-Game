"use client";
import { Word } from "../hooks/useWordGame";
import { SetStateAction, useState } from "react";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";
import { useWordContext } from "../../contexts/wordContext";
import CorrectAnswer from "../../components/correctAnswer"; // ✅ 추가

export default function WordGame() {
  const { words, setWords, wordsRef } = useWordGame();
  const [wordEn, setWordEn] = useState("");
  const { addMatchedWord } = useWordContext();
  const [correctWords, setCorrectWords] = useState<{ x: number; y: number }[]>(
    [],
  ); // ✅ 정답 위치 상태

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setWordEn(e.target.value);
  };

  const handleCheckWord = () => {
    const matchedWord = words.find(
      (word) => word.english.toLowerCase() === wordEn.toLowerCase(),
    );

    if (matchedWord) {
      addMatchedWord(matchedWord.english);

      //  정답 위치 저장 후 단어 제거 전에 렌더링
      setCorrectWords((prev) => [
        ...prev,
        { x: matchedWord.x, y: matchedWord.y },
      ]);

      setTimeout(() => {
        // 1초 후 정답 효과 제거
        setCorrectWords((prev) =>
          prev.filter(
            (pos) => pos.x !== matchedWord.x || pos.y !== matchedWord.y,
          ),
        );

        // 단어 제거를 1초 후 실행하여 렌더링 유지
        setWords((prevWords: Word[]) =>
          prevWords.filter(
            (word) => word.english.toLowerCase() !== wordEn.toLowerCase(),
          ),
        );
      }, 500);
    }

    setWordEn(""); // 입력 필드 초기화
  };

  return (
    <div>
      <div ref={wordsRef} className={styles.words}>
        {words.map((word, index) => (
          <div
            key={index}
            className={styles.wordContainer}
            style={{
              position: "absolute",
              top: word.y + "px",
              left: word.x + "px",
            }}
          >
            <span className={styles.wordKorean}>{word.korean}</span>
          </div>
        ))}
        {/* 정답 효과 표시 */}
        {correctWords.map((pos, index) => (
          <CorrectAnswer key={index} x={pos.x} y={pos.y} />
        ))}
      </div>

      <div className={styles.inputDiv}>
        <input
          value={wordEn}
          onChange={handleInputChange}
          className={styles.inputText}
          type="text"
          placeholder="영어를 입력하세요"
        />
        <button onClick={handleCheckWord} className={styles.inputBtn}>
          전송
        </button>
      </div>
    </div>
  );
}
