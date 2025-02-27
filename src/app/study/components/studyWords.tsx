"use client";
import { useFailedWords } from "../hooks/useFailedWords";
import styles from "../studyWord.module.css";

const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR"; // 한국어 설정
    utterance.rate = 1.0; // 음성 속도 (기본값: 1.0)
    utterance.pitch = 1.0; // 음성 톤 (기본값: 1.0)
    speechSynthesis.speak(utterance);
};

const StudyWords = () => {
    const { failedWords } = useFailedWords();

    return (
        <div className={styles.container}>
            <ul className={styles.lists}>
                {failedWords.map((word, index) => (
                    <li key={index} className={styles.liItem}>
                        <button
                            className={styles.speaker}
                            onClick={() => speakText(word.kr)}
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
