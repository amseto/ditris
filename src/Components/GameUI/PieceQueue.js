import PieceQueuePiece from "./PieceQueuePiece";
import styles from './PieceQueue.module.css'
import {pieceQueue} from '../../store/GameState'
import { useSelector } from "react-redux";

const PieceQueue= (props) =>{
    const queueChanged= useSelector(state=>state.gameState.heldPiece)
    let i = 0
    let pieces = []
    if (pieceQueue.isEmpty){
        return <div className = {styles.pieceQueue}></div>
    }

    for (let pieceColor in pieceQueue.elements){
        pieces.push(<PieceQueuePiece key = {i++} color = {pieceQueue.elements[pieceColor]}/>)
    }
    return <div className = {styles.pieceQueue}>{pieces}</div>
}

export default PieceQueue;