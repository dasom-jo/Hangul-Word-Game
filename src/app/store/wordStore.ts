import { create } from "zustand";
import { fetchFailedWords } from "@/services/wordService";

interface Word {
    kr: string;
    en:string
    kakaoid:string
}

interface WordStore {
    failedWords : Word[];
    fetchWords : () => Promise<void>
}

export const useWordStore = create<WordStore>((set) => ({
failedWords: [],

fetchWords:async () => {
    const words = await fetchFailedWords();
    set({failedWords : words})
}
}))