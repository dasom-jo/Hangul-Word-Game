"use client";
import { Word } from "../hooks/useWordGame";
import { SetStateAction, useState } from "react";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";
import { useWordContext } from "../../contexts/wordContext"; // 추가

export default function WordGame() {
  const { words, setWords, wordsRef } = useWordGame();
  const [wordEn, setWordEn] = useState("");
  const { addMatchedWord } = useWordContext(); // 전역 상태 사용

  const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
    setWordEn(e.target.value);
  };

  const handleCheckWord = () => {
    const matchedWord = words.find((word) => word.english.toLowerCase() === wordEn.toLowerCase());
    if (matchedWord) {
      addMatchedWord(matchedWord.english); // 맞춘 단어를 전역 상태에 추가
    }

    setWords((prevWords: Word[]) =>
      prevWords.filter((word) => word.english.toLowerCase() !== wordEn.toLowerCase())
    );
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
