import MainBtn from "../components/mainBtn";
import AiWord from "./components/WordGame";
import TimerBar from "./components/timerBar";

const Game = () => {
  return (
    <div>
      <MainBtn />
      <TimerBar />
      <AiWord />
    </div>
  );
};

export default Game;
