import React, { ReactChild } from 'react';
import player1 from './player1.png';
import player2 from './player2.png';
import player3 from './player3.png';
import player4 from './player4.png';
import board from './board.jpg';
import DrawnCard from './Card';
import { Redirect } from 'react-router';
import { Player } from './constants_funcs';

interface GameProps {
    currentPlayer: number,
    players: Array<Player>,
    drawCard: () => void,
    playerCount: number,
    gameOver: boolean,
    winner: string,
    children?: ReactChild
}

const Game: React.FunctionComponent<GameProps> =
    (props) => {
        if (props.gameOver) {
            return (<Redirect to="/gameover"></Redirect>);
        }

        function myTurn(player: number) {
            return (props.currentPlayer === player)
                ? <span>👉</span> : <span></span>;
        }

        return (
            <div>
                <div className="board-container">
                    <img src={board} alt="" width="800" />
                    <div className="player-container">
                        <button className="drawCard" disabled={props.winner !== ''} onClick={props.drawCard}>🎴 Draw Card</button>
                        <div className="player-card">
                            <h2 className="player1color">
                                {myTurn(0)}
                                {props.players[0].name} (Square {props.players[0].position + 1})</h2>
                            <DrawnCard card={props.players[0].selectedCard}></DrawnCard>
                        </div>
                        <div className="player-card">
                            <h2 className="player2color">
                                {myTurn(1)}
                                {props.players[1].name} (Square {props.players[1].position + 1})</h2>
                            <DrawnCard card={props.players[1].selectedCard}></DrawnCard>
                        </div>
                        <div className="player-card" style={{ display: props.playerCount > 2 ? "block" : "none" }}>
                            <h2 className="player3color">
                                {myTurn(2)}
                                {props.players[2].name} (Square {props.players[2].position + 1})</h2>
                            <DrawnCard card={props.players[2].selectedCard}></DrawnCard>
                        </div>
                        <div className="player-card" style={{ display: props.playerCount > 3 ? "block" : "none" }}>
                            <h2 className="player4color">
                                {myTurn(3)}
                                {props.players[3].name} (Square {props.players[3].position + 1})</h2>
                            <DrawnCard card={props.players[3].selectedCard}></DrawnCard>
                        </div>
                    </div>
                    <img src={player1} id="player1" alt="" />
                    <img src={player2} id="player2" alt="" />
                    <img src={player3} id="player3" style={{ display: props.playerCount > 2 ? "block" : "none" }} alt="" />
                    <img src={player4} id="player4" style={{ display: props.playerCount > 3 ? "block" : "none" }} alt="" />
                </div>

            </div>
        );
    };

export default Game;