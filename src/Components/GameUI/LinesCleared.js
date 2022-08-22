import { useSelector } from "react-redux";

const LinesCleared = ()=>{
    const linesCleared = useSelector((state) => state.gameState.linesCleared);
    return <div>Lines Cleared {linesCleared}</div>
}

export default LinesCleared