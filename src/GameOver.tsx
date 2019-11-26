import React, { ReactChild } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

interface GameOverProps {
    winner: string,
    setGameOver: (over: boolean) => void,
    children?: ReactChild;
}

const GameOver: React.FC<GameOverProps> = (props) => {
    props.setGameOver(false);

    if (!props.winner)
    {
        return (<Redirect to="/"></Redirect>);
    }

    return (
        <div>
            <h3>Game Over!</h3>
            <h1>🍬🍬🍬🍬 Congratulations, {props.winner} 🍭🍭🍭🍭</h1>
            <Link to="/">New Game</Link>
        </div>
    );
};

export default GameOver;