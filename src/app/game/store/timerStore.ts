import { create } from "zustand";

// Zustand 스토어 정의
interface TimerStore {
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  isRunning: false,
  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
}));

export default useTimerStore;
