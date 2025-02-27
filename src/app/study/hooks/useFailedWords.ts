"use client"
import { useEffect } from "react";
import { useWordStore } from "../../store/wordStore";

export const useFailedWords = () => {
    const { failedWords, fetchWords } = useWordStore();

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    return { failedWords };
};
