import { createContext, useContext, useState, ReactNode } from "react";
import { Word } from "../game/hooks/useWordGame"; // ✅ Word 타입 가져오기

// ✅ 맞춘 단어(`matchedWords`)와 틀린 단어(`removedWords`)를 전역 관리
interface WordContextType {
  matchedWords: string[];
  addMatchedWord: (word: string) => void;

  removedWords: Word[];
  addRemovedWords: (words: Word[]) => void;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export function WordProvider({ children }: { children: ReactNode }) {
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [removedWords, setRemovedWords] = useState<Word[]>([]);

  // ✅ 맞춘 단어 추가 함수
  const addMatchedWord = (word: string) => {
    setMatchedWords((prev) => [...prev, word]);
  };

  // ❌ 틀린 단어 추가 함수
  const addRemovedWords = (words: Word[]) => {
    setRemovedWords((prev) => [...prev, ...words]);
  };

  return (
    <WordContext.Provider
      value={{ matchedWords, addMatchedWord, removedWords, addRemovedWords }}
    >
      {children}
    </WordContext.Provider>
  );
}

export function useWordContext() {
  const context = useContext(WordContext);
  if (!context) {
    throw new Error("useWordContext must be used within a WordProvider");
  }
  return context;
}
