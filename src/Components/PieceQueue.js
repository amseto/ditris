import PieceQueuePiece from "./PieceQueuePiece";
import styles from './PieceQueue.module.css'
import {pieceQueue} from '../store/GameState'

const PieceQueue= (props) =>{
    let i = 0
    let pieces = []
    if (pieceQueue.isEmpty){
        return <ul className = {styles.pieceQueue}></ul>
    }

    for (let pieceColor in pieceQueue.elements){
        pieces.push(<PieceQueuePiece key = {i++} color = {pieceQueue.elements[pieceColor]}/>)
    }
    return <ul className = {styles.pieceQueue}>{pieces}</ul>
}

export default PieceQueue;