"use client";
import { Word } from "../hooks/useWordGame";
import { SetStateAction, useState } from "react";
import useWordGame from "../hooks/useWordGame";
import styles from "../word.module.css";

export default function WordGame() {
  const { words, setWords, wordsRef } = useWordGame(); // wordsRef 사용
  const [wordEn, setWordEn] = useState("");//입력된 영어

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) =>{
    setWordEn(e.target.value)
  }

  const handleCheckWord = () => {
    setWords((prevWords: Word[])=>
    prevWords.filter((word: { english: string; }) => word.english.toLowerCase() !== wordEn.toLowerCase())
    );
    setWordEn(""); // 입력 필드 초기화
  }

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
        <button onClick={handleCheckWord} className={styles.inputBtn}>전송</button>
      </div>
    </div>
  );
}
