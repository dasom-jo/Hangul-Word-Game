"use client";
import { useState } from "react";
import { useFailedWords } from "../hooks/useFailedWords";
import styles from "../studyWord.module.css";

const StudyWords = () => {
    const { failedWords } = useFailedWords();
    const [playingIndex, setPlayingIndex] = useState<number | null>(null); // 현재 재생 중인 단어 인덱스

    const speakText = (text: string, index: number) => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel(); // 기존 음성이 재생 중이면 중지
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ko-KR";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // 음성이 시작될 때 실행
        utterance.onstart = () => {
            setPlayingIndex(index); // 현재 재생 중인 단어의 인덱스 설정
        };

        // 음성이 끝나면 실행
        utterance.onend = () => {
            setPlayingIndex(null); // 재생이 끝나면 원래 상태로 변경
        };

        speechSynthesis.speak(utterance);
    };

    return (
        <div className={styles.container}>
            <ul className={styles.lists}>
                {failedWords.map((word, index) => (
                    <li key={index} className={styles.liItem}>
                        <button
                            className={`${styles.speaker} ${playingIndex === index ? styles.playing : ""}`}
                            onClick={() => speakText(word.kr, index)}
                            aria-label="발음 듣기"
                        />
                        {word.kr} - {word.en}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudyWords;
