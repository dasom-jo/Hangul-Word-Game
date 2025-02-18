import { useCallback, useState } from "react";
// 게임 시작 버튼
const useStartBtn = () => {
  const [isRunning, setIsRunning] = useState(false);
  //타이머 시작함수
  const startTimer = useCallback(() => setIsRunning(true), []);
  //타이머 멈춤 함수
  const stopTimer = useCallback(() => setIsRunning(false), []);
    
  return { isRunning, startTimer, stopTimer };
};

export default useStartBtn;
