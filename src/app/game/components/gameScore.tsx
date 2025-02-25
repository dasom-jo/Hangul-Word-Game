import useWordGame from "../hooks/useWordGame";

const gameScore = () => {
    const { words, setWords, wordsRef } = useWordGame(); // wordsRef 사용
    return ( <div>
        게임 스코어
    </div> );
}

export default gameScore;