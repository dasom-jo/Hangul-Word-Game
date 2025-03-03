import { createContext, useContext, useState, ReactNode } from "react";

interface WordContextType {
  matchedWords: string[];
  addMatchedWord: (word: string) => void;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export function WordProvider({ children }: { children: ReactNode }) {
  const [matchedWords, setMatchedWords] = useState<string[]>([]);

  const addMatchedWord = (word: string) => {
    setMatchedWords((prev) => [...prev, word]);
  };

  return (
    <WordContext.Provider value={{ matchedWords, addMatchedWord }}>
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
