//import TimerBar from "./components/timerBar";
import WordGame from "./hooks/chatInput";

const Game = () => {
  return (
    <div>
      {/* <TimerBar/> */}
      <main className="flex flex-col items-center justify-center min-h-screen">
        <WordGame />
      </main>
    </div>
  );
};

export default Game;
