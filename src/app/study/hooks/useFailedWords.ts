"use client"
import { useEffect } from "react";
import { useWordStore } from "../../store/wordStore";
import { useSession } from "next-auth/react";

export const useFailedWords = () => {
    const { data: session } = useSession();
    const { failedWords, fetchWords } = useWordStore();
    const kakaoid = session?.user.name
    useEffect(() => {
        fetchWords();
    }, [fetchWords]);
    
    const userFailedWords = failedWords.filter(word => word.kakaoid === kakaoid);

    return { failedWords: userFailedWords };
};